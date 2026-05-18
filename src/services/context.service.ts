import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AppService, BaseTerminalTabComponent } from 'tabby-core'

export type BuddyContext =
  | { type: 'dashboard'; cwd: string; content: string }
  | { type: 'cheatsheet'; cmd: string }
  | { type: 'idle' }

// Custom OSC identifier we use in our shell integration script
const OSC_ID = '7701'
// Matches our OSC sequences embedded in terminal output
const OSC_REGEX = new RegExp(`\x1b\\]${OSC_ID};([^\x07]*)\x07`, 'g')

/**
 * ContextService
 *
 * Subscribes to the active Tabby terminal session's output stream and
 * parses our custom OSC escape sequences emitted by the shell integration
 * script on the remote machine.
 *
 * Emits a BuddyContext object that the panel component reacts to.
 */
@Injectable({ providedIn: 'root' })
export class ContextService {
  /** Current context for the active session */
  readonly context$ = new BehaviorSubject<BuddyContext>({ type: 'idle' })

  constructor (private app: AppService) {
    this.app.activeTabChange$.subscribe(() => this.onTabChange())
    this.onTabChange()
  }

  private onTabChange (): void {
    const tab = this.app.activeTab
    if (!tab || !(tab instanceof BaseTerminalTabComponent)) {
      this.context$.next({ type: 'idle' })
      return
    }

    const terminal = (tab as any).terminal
    if (!terminal) return

    // Subscribe to raw terminal output bytes
    terminal.onData((data: string) => {
      this.parseOscSequences(data)
    })
  }

  private parseOscSequences (data: string): void {
    // Reset regex state for each call
    OSC_REGEX.lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = OSC_REGEX.exec(data)) !== null) {
      const payload = match[1]
      this.handlePayload(payload)
    }
  }

  private handlePayload (payload: string): void {
    // payload formats:
    //   "cmd=vi"                         → cheatsheet context
    //   "prompt;cwd=/home/pi;dashboard=BASE64" → dashboard context

    if (payload.startsWith('cmd=')) {
      const cmd = payload.slice(4).trim()
      this.context$.next({ type: 'cheatsheet', cmd })
      return
    }

    if (payload.startsWith('prompt')) {
      const parts = this.parseKeyValuePairs(payload)
      const cwd = parts['cwd'] ?? ''
      const b64 = parts['dashboard'] ?? ''
      const content = b64 ? this.decodeBase64(b64) : ''
      this.context$.next({ type: 'dashboard', cwd, content })
      return
    }
  }

  /** Parse a string like "prompt;cwd=/home/pi;dashboard=abc" into a map */
  private parseKeyValuePairs (payload: string): Record<string, string> {
    const result: Record<string, string> = {}
    const parts = payload.split(';')
    for (const part of parts) {
      const eq = part.indexOf('=')
      if (eq !== -1) {
        result[part.slice(0, eq)] = part.slice(eq + 1)
      }
    }
    return result
  }

  /** Decode base64 string and strip ANSI escape codes */
  private decodeBase64 (b64: string): string {
    try {
      const decoded = Buffer.from(b64, 'base64').toString('utf8')
      return this.stripAnsi(decoded)
    } catch {
      return ''
    }
  }

  /** Strip ANSI color/formatting escape codes from text */
  private stripAnsi (text: string): string {
    // Matches ESC[ ... m sequences and OSC sequences
    return text.replace(/\x1b\[[0-9;]*[mGKHF]/g, '')
               .replace(/\x1b\][^\x07]*\x07/g, '')
               .replace(/\x1b[()][AB012]/g, '')
  }
}
