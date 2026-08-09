import { Injectable, NgZone } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AppService } from 'tabby-core'
import { CheatsheetService } from './cheatsheet.service'

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
  private tabContexts = new WeakMap<any, BuddyContext>()
  private tabOscContexts = new WeakMap<any, BuddyContext>()
  private lastActiveTab: any = null
  private lastOscContext: BuddyContext = { type: 'idle' }

  constructor (
    private app: AppService,
    private zone: NgZone,
    private cheatsheetService: CheatsheetService,
  ) {
    this.app.activeTabChange$.subscribe(() => this.onTabChange())
    this.onTabChange()
  }

  private onTabChange (): void {
    let tab = this.app.activeTab
    console.log('TerminalBuddy Debug - onTabChange called. activeTab:', tab ? tab.constructor.name : 'none')
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

    if (tab !== this.lastActiveTab) {
      // Perform cleanup of any previous subscriptions
      if (this.currentCleanup) {
        try { this.currentCleanup() } catch {}
        this.currentCleanup = null
      }

      this.lastActiveTab = tab

      // Restore the context of the newly active tab
      const restoredContext = tab ? (this.tabContexts.get(tab) ?? { type: 'idle' as const }) : { type: 'idle' as const }
      this.lastOscContext = tab ? (this.tabOscContexts.get(tab) ?? { type: 'idle' as const }) : { type: 'idle' as const }
      this.zone.run(() => this.context$.next(restoredContext))
    }

    if (!tab) {
      const origCleanup = this.currentCleanup
      this.currentCleanup = () => {
        if (origCleanup) { try { origCleanup() } catch {} }
        for (const cleanup of cleanups) cleanup()
      }
      return
    }

    // Check if the resolved leaf tab is a terminal tab
    const isTerminalTab = 'frontendReady$' in tab || 'sessionChanged$' in tab
    if (!isTerminalTab) {
      const origCleanup = this.currentCleanup
      this.currentCleanup = () => {
        if (origCleanup) { try { origCleanup() } catch {} }
        for (const cleanup of cleanups) cleanup()
      }
      return
    }

    // Try to bind to the xterm instance
    const xterm = (tab as any)?.frontend?.xterm
    if (xterm) {
      this.bindToTerminal(xterm, tab)
      const origCleanup = this.currentCleanup
      this.currentCleanup = () => {
        if (origCleanup) { try { origCleanup() } catch {} }
        for (const cleanup of cleanups) cleanup()
      }
    } else if (typeof (tab as any).frontendReady$?.subscribe === 'function') {
      const sub = (tab as any).frontendReady$.subscribe(() => {
        const freshXterm = (tab as any)?.frontend?.xterm
        if (freshXterm) {
          this.bindToTerminal(freshXterm, tab)
          const origCleanup = this.currentCleanup
          this.currentCleanup = () => {
            if (origCleanup) { try { origCleanup() } catch {} }
            for (const cleanup of cleanups) cleanup()
          }
        }
      })
      const origCleanup = this.currentCleanup
      this.currentCleanup = () => {
        if (origCleanup) { try { origCleanup() } catch {} }
        sub.unsubscribe()
        for (const cleanup of cleanups) cleanup()
      }
    } else {
      const origCleanup = this.currentCleanup
      this.currentCleanup = () => {
        if (origCleanup) { try { origCleanup() } catch {} }
        for (const cleanup of cleanups) cleanup()
      }
    }
  }

  private bindToTerminal (xterm: any, tab: any): void {
    console.log('TerminalBuddy Debug - bindToTerminal called. tab type:', tab ? tab.constructor.name : 'none', 'has xterm:', !!xterm)
    if (this.currentCleanup) {
      try { this.currentCleanup() } catch {}
      this.currentCleanup = null
    }

    const cleanups: (() => void)[] = []

    // ── Strategy 1: xterm.js native OSC handler ────────────────────────────
    let oscHooked = false
    if (typeof xterm.parser?.registerOscHandler === 'function') {
      const disposable = xterm.parser.registerOscHandler(OSC_ID, (data: string) => {
        this.handlePayload(tab, data)
        return false
      })
      cleanups.push(() => {
        try { disposable?.dispose?.() } catch {}
      })
      oscHooked = true
    }

    // ── Hook xterm.write to handle OSC fallback and check active line ──────
    const origWrite = xterm.write.bind(xterm)
    xterm.write = (data: string | Uint8Array, callback?: () => void) => {
      try {
        const str = typeof data === 'string'
          ? data
          : data instanceof Uint8Array
            ? new TextDecoder().decode(data)
            : null
        
        if (str && !oscHooked) {
          this.parseOscSequences(tab, str)
        }

        // Check active line on screen updates
        setTimeout(() => this.checkCurrentLine(xterm, tab), 20)
      } catch {}
      return origWrite(data, callback)
    }
    cleanups.push(() => { xterm.write = origWrite })

    // ── Listen to keyboard inputs for immediate response ───────────────────
    if (typeof xterm.onData === 'function') {
      const disposable = xterm.onData(() => {
        setTimeout(() => this.checkCurrentLine(xterm, tab), 20)
      })
      cleanups.push(() => {
        try { disposable?.dispose?.() } catch {}
      })
    }

    this.currentCleanup = () => {
      for (const cleanup of cleanups) {
        try { cleanup() } catch {}
      }
    }
  }

  private parseOscSequences (tab: any, data: string): void {
    OSC_REGEX.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = OSC_REGEX.exec(data)) !== null) {
      this.handlePayload(tab, match[1])
    }
  }

  private handlePayload (tab: any, payload: string): void {
    let newContext: BuddyContext | null = null

    if (payload.startsWith('cmd=')) {
      const cmd = payload.slice(4).trim()
      newContext = { type: 'cheatsheet', cmd }
    } else if (payload.startsWith('prompt')) {
      const parts = this.parseKV(payload)
      const cwd = parts['cwd'] ?? ''
      const b64 = parts['dashboard'] ?? ''
      const content = b64 ? this.decodeBase64(b64) : ''
      newContext = { type: 'dashboard', cwd, content }
    }

    if (newContext) {
      this.tabOscContexts.set(tab, newContext)
      this.tabContexts.set(tab, newContext)
      if (this.lastActiveTab === tab) {
        this.lastOscContext = newContext
        this.zone.run(() => this.context$.next(newContext!))
      }
    }
  }

  private checkCurrentLine (xterm: any, tab: any): void {
    console.log('TerminalBuddy Debug - checkCurrentLine entered. lastOscContext:', JSON.stringify(this.lastOscContext))
    if (this.lastOscContext?.type !== 'dashboard') {
      return
    }

    try {
      const buffer = xterm.buffer?.active
      if (!buffer) return

      const absoluteY = buffer.baseY + buffer.cursorY
      const line = buffer.getLine(absoluteY)
      if (!line) return

      const lineText = line.translateToString(true)
      console.log('TerminalBuddy Debug - lineText:', JSON.stringify(lineText))

      // Split the line on common prompt symbols to find the input command
      const parts = lineText.split(/[$#>%\]]\s*/)
      console.log('TerminalBuddy Debug - parts:', JSON.stringify(parts))
      const commandLine = parts[parts.length - 1] || ''
      console.log('TerminalBuddy Debug - commandLine:', JSON.stringify(commandLine))
      const firstWord = commandLine.trim().split(/\s+/)[0].toLowerCase()
      console.log('TerminalBuddy Debug - firstWord:', JSON.stringify(firstWord))

      if (firstWord) {
        const sheet = this.cheatsheetService.getSheet(firstWord)
        console.log('TerminalBuddy Debug - sheet found:', sheet ? sheet.id : 'none')
        if (sheet) {
          const newContext: BuddyContext = { type: 'cheatsheet', cmd: firstWord }
          this.tabContexts.set(tab, newContext)
          if (this.lastActiveTab === tab) {
            this.zone.run(() => this.context$.next(newContext))
          }
          return
        }
      }

      // If no matching command, revert to the base OSC dashboard context
      this.tabContexts.set(tab, this.lastOscContext)
      if (this.lastActiveTab === tab) {
        this.zone.run(() => this.context$.next(this.lastOscContext))
      }
    } catch (e) {
      console.error('TerminalBuddy Debug - error:', e)
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
