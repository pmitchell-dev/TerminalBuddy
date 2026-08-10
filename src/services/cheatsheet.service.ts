import { Injectable } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { CheatSheet } from '../data/cheatsheet.model'
import { VI_CHEATSHEET } from '../data/vi.cheatsheet'
import { NANO_CHEATSHEET } from '../data/nano.cheatsheet'
import { TAR_CHEATSHEET } from '../data/tar.cheatsheet'
import { FIND_CHEATSHEET } from '../data/find.cheatsheet'
import { GREP_CHEATSHEET } from '../data/grep.cheatsheet'
import { SYSTEMCTL_CHEATSHEET } from '../data/systemctl.cheatsheet'
import { CHMOD_CHEATSHEET } from '../data/chmod.cheatsheet'

export const BUILT_IN_SHEETS: CheatSheet[] = [
  VI_CHEATSHEET,
  NANO_CHEATSHEET,
  TAR_CHEATSHEET,
  FIND_CHEATSHEET,
  GREP_CHEATSHEET,
  SYSTEMCTL_CHEATSHEET,
  CHMOD_CHEATSHEET,
]

/**
 * CheatsheetService
 *
 * Resolves the matching cheat sheet for a given command.
 * Default command sheets (Vi, Nano, Tar, etc.) are seeded into the
 * custom sheets list as initial entries so users can edit or delete them.
 */
@Injectable({ providedIn: 'root' })
export class CheatsheetService {
  constructor (private config: ConfigService) {}

  /** Returns matching cheat sheet for a command, or null if none found */
  getSheet (cmd: string): CheatSheet | null {
    const normalized = cmd.trim().split(' ')[0].toLowerCase()

    const sheets = this.getCustomSheets()
    for (const sheet of sheets) {
      if (sheet.triggers.some(t => t.toLowerCase() === normalized)) {
        return sheet
      }
    }

    return null
  }

  getAllSheets (): CheatSheet[] {
    return this.getCustomSheets()
  }

  getCustomSheets (): CheatSheet[] {
    if (!this.config.store.terminalBuddy) {
      this.config.store.terminalBuddy = {}
    }

    if (this.config.store.terminalBuddy.customSheets === undefined) {
      const defaults: CheatSheet[] = BUILT_IN_SHEETS.map(s => ({
        ...JSON.parse(JSON.stringify(s)),
        isCustom: true,
      }))
      this.saveCustomSheets(defaults)
      return defaults
    }

    return (this.config.store.terminalBuddy.customSheets ?? []) as CheatSheet[]
  }

  saveCustomSheets (sheets: CheatSheet[]): void {
    if (!this.config.store.terminalBuddy) {
      this.config.store.terminalBuddy = {}
    }
    this.config.store.terminalBuddy.customSheets = sheets
    this.config.save()
  }

  resetToDefaults (): CheatSheet[] {
    const defaults: CheatSheet[] = BUILT_IN_SHEETS.map(s => ({
      ...JSON.parse(JSON.stringify(s)),
      isCustom: true,
    }))
    this.saveCustomSheets(defaults)
    return defaults
  }
}
