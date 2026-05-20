import { Injectable, NgZone } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AppService } from 'tabby-core'

export type BuddyContext =
  | { type: 'dashboard'; cwd: string; content: string }
  | { type: 'cheatsheet'; cmd: string }
  | { type: 'idle' }

const OSC_ID = 7701
const OSC_REGEX = /\x1b\]7701;([^\x07\x1b]*?)(?:\x07|\x1b\\)/g

/**
 * ContextService
 *
 * Intercepts OSC 7701 sequences emitted by the remote shell integration script
 * and translates them into BuddyContext updates for the panel.
 *
 * Handles layout nesting within SplitTabComponent by recursively resolving the
 * focused leaf tab, and subscribing to focusChanged$ to handle pane switches.
 */
@Injectable({ providedIn: 'root' })
export class ContextService {
  readonly context$ = new BehaviorSubject<BuddyContext>({ type: 'idle' })
  private currentCleanup: (() => void) | null = null

  constructor (private app: AppService, private zone: NgZone) {
    this.app.activeTabChange$.subscribe(() => this.onTabChange())
    this.onTabChange()
  }

  private onTabChange (): void {
    // Perform cleanup of any previous subscriptions
    if (this.currentCleanup) {
      try { this.currentCleanup() } catch {}
      this.currentCleanup = null
    }

    let tab = this.app.activeTab
    if (!tab) {
      this.zone.run(() => this.context$.next({ type: 'idle' }))
      return
    }

    const cleanups: (() => void)[] = []

    // Recursively resolve the active sub-tab if we are inside a SplitTabComponent.
    // We subscribe to focusChanged$ on every level of SplitTabComponent so we catch pane switches.
    while (tab && (tab.constructor.name === 'SplitTabComponent' || 'focusChanged$' in tab)) {
      const splitTab = tab as any
      if (typeof splitTab.focusChanged$?.subscribe === 'function') {
        const sub = splitTab.focusChanged$.subscribe(() => this.onTabChange())
        cleanups.push(() => sub.unsubscribe())
      }
      tab = splitTab.focusedTab
    }

    if (!tab) {
      this.currentCleanup = () => {
        for (const cleanup of cleanups) cleanup()
      }
      this.zone.run(() => this.context$.next({ type: 'idle' }))
      return
    }

    // Check if the resolved leaf tab is a terminal tab
    const isTerminalTab = 'frontendReady$' in tab || 'sessionChanged$' in tab
    if (!isTerminalTab) {
      this.currentCleanup = () => {
        for (const cleanup of cleanups) cleanup()
      }
      this.zone.run(() => this.context$.next({ type: 'idle' }))
      return
    }

    // Try to bind to the xterm instance
    const xterm = (tab as any)?.frontend?.xterm
    if (xterm) {
      this.bindToTerminal(xterm)
      const origCleanup = this.currentCleanup
      this.currentCleanup = () => {
        if (origCleanup) { try { origCleanup() } catch {} }
        for (const cleanup of cleanups) cleanup()
      }
    } else if (typeof (tab as any).frontendReady$?.subscribe === 'function') {
      const sub = (tab as any).frontendReady$.subscribe(() => {
        const freshXterm = (tab as any)?.frontend?.xterm
        if (freshXterm) {
          this.bindToTerminal(freshXterm)
          const origCleanup = this.currentCleanup
          this.currentCleanup = () => {
            if (origCleanup) { try { origCleanup() } catch {} }
            for (const cleanup of cleanups) cleanup()
          }
        }
      })
      this.currentCleanup = () => {
        sub.unsubscribe()
        for (const cleanup of cleanups) cleanup()
      }
    } else {
      this.currentCleanup = () => {
        for (const cleanup of cleanups) cleanup()
      }
      this.zone.run(() => this.context$.next({ type: 'idle' }))
    }
  }

  private bindToTerminal (xterm: any): void {
    if (this.currentCleanup) {
      try { this.currentCleanup() } catch {}
      this.currentCleanup = null
    }

    // ── Strategy 1: xterm.js native OSC handler ────────────────────────────
    if (typeof xterm.parser?.registerOscHandler === 'function') {
      const disposable = xterm.parser.registerOscHandler(OSC_ID, (data: string) => {
        this.handlePayload(data)
        return false
      })
      this.currentCleanup = () => {
        try { disposable?.dispose?.() } catch {}
      }
      return
    }

    // ── Strategy 2: Hook xterm.write() ─────────────────────────────────
    const origWrite = xterm.write.bind(xterm)
    xterm.write = (data: string | Uint8Array, callback?: () => void) => {
      try {
        const str = typeof data === 'string'
          ? data
          : data instanceof Uint8Array
            ? new TextDecoder().decode(data)
            : null
        if (str) this.parseOscSequences(str)
      } catch {}
      return origWrite(data, callback)
    }
    this.currentCleanup = () => { xterm.write = origWrite }
  }

  private parseOscSequences (data: string): void {
    OSC_REGEX.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = OSC_REGEX.exec(data)) !== null) {
      this.handlePayload(match[1])
    }
  }

  private handlePayload (payload: string): void {
    if (payload.startsWith('cmd=')) {
      const cmd = payload.slice(4).trim()
      this.zone.run(() => this.context$.next({ type: 'cheatsheet', cmd }))
      return
    }

    if (payload.startsWith('prompt')) {
      const parts = this.parseKV(payload)
      const cwd = parts['cwd'] ?? ''
      const b64 = parts['dashboard'] ?? ''
      const content = b64 ? this.decodeBase64(b64) : ''
      this.zone.run(() => this.context$.next({ type: 'dashboard', cwd, content }))
      return
    }
  }

  private parseKV (payload: string): Record<string, string> {
    const result: Record<string, string> = {}
    for (const part of payload.split(';')) {
      const eq = part.indexOf('=')
      if (eq !== -1) result[part.slice(0, eq)] = part.slice(eq + 1)
    }
    return result
  }

  private decodeBase64 (b64: string): string {
    try {
      return Buffer.from(b64, 'base64').toString('utf8')
    } catch {
      return ''
    }
  }
}
