import { Injectable } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { CheatSheet } from '../data/cheatsheet.model'
import { VI_CHEATSHEET } from '../data/vi.cheatsheet'
import { NANO_CHEATSHEET } from '../data/nano.cheatsheet'

const BUILT_IN_SHEETS: CheatSheet[] = [
  VI_CHEATSHEET,
  NANO_CHEATSHEET,
]

/**
 * CheatsheetService
 *
 * Resolves the correct cheat sheet for a given command name.
 * Merges built-in sheets with user-defined custom sheets stored
 * in Tabby's config system. Custom sheets override built-ins
 * if they share the same trigger.
 */
@Injectable({ providedIn: 'root' })
export class CheatsheetService {
  constructor (private config: ConfigService) {}

  /** Returns the matching cheat sheet for a command, or null if none found */
  getSheet (cmd: string): CheatSheet | null {
    const normalized = cmd.trim().split(' ')[0].toLowerCase()

    // Check custom sheets first (they take priority)
    const custom = this.getCustomSheets()
    for (const sheet of custom) {
      if (sheet.triggers.some(t => t.toLowerCase() === normalized)) {
        return sheet
      }
    }

    // Fall back to built-in sheets
    for (const sheet of BUILT_IN_SHEETS) {
      if (sheet.triggers.some(t => t.toLowerCase() === normalized)) {
        return sheet
      }
    }

    return null
  }

  getAllSheets (): CheatSheet[] {
    return [...BUILT_IN_SHEETS, ...this.getCustomSheets()]
  }

  getCustomSheets (): CheatSheet[] {
    return (this.config.store?.terminalBuddy?.customSheets ?? []) as CheatSheet[]
  }

  saveCustomSheets (sheets: CheatSheet[]): void {
    if (!this.config.store.terminalBuddy) {
      this.config.store.terminalBuddy = {}
    }
    this.config.store.terminalBuddy.customSheets = sheets
    this.config.save()
  }
}
