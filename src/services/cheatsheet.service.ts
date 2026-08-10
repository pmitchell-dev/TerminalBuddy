import { Injectable } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { CheatSheet, CheatSection } from '../data/cheatsheet.model'
import { VI_CHEATSHEET, VI_SECTIONS } from '../data/vi.cheatsheet'
import { NANO_CHEATSHEET, NANO_SECTIONS } from '../data/nano.cheatsheet'
import { TAR_CHEATSHEET, TAR_SECTIONS } from '../data/tar.cheatsheet'
import { FIND_CHEATSHEET, FIND_SECTIONS } from '../data/find.cheatsheet'
import { GREP_CHEATSHEET, GREP_SECTIONS } from '../data/grep.cheatsheet'
import { SYSTEMCTL_CHEATSHEET, SYSTEMCTL_SECTIONS } from '../data/systemctl.cheatsheet'
import { CHMOD_CHEATSHEET, CHMOD_SECTIONS } from '../data/chmod.cheatsheet'

export const BUILT_IN_SECTIONS: CheatSection[] = [
  ...VI_SECTIONS,
  ...NANO_SECTIONS,
  ...TAR_SECTIONS,
  ...FIND_SECTIONS,
  ...GREP_SECTIONS,
  ...SYSTEMCTL_SECTIONS,
  ...CHMOD_SECTIONS,
]

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
 * Manages standalone Section Library and Cheat Sheets.
 * Cheat sheets reference reusable sections by sectionId.
 */
@Injectable({ providedIn: 'root' })
export class CheatsheetService {
  constructor (private config: ConfigService) {}

  /** Returns matching cheat sheet for a command with hydrated sections, or null if none found */
  getSheet (cmd: string): CheatSheet | null {
    const normalized = cmd.trim().split(' ')[0].toLowerCase()

    const sheets = this.getCustomSheets()
    const found = sheets.find(s => s.triggers.some(t => t.toLowerCase() === normalized))
    if (!found) return null

    return this.hydrateSheet(found)
  }

  hydrateSheet (sheet: CheatSheet): CheatSheet {
    const sectionMap = this.getSectionMap()
    const hydratedSections: CheatSection[] = []

    if (sheet.sectionIds && sheet.sectionIds.length > 0) {
      for (const id of sheet.sectionIds) {
        const sec = sectionMap.get(id)
        if (sec) {
          hydratedSections.push(sec)
        }
      }
    }

    // Fallback to inline sections if present
    if (hydratedSections.length === 0 && sheet.sections) {
      hydratedSections.push(...sheet.sections)
    }

    return {
      ...sheet,
      sections: hydratedSections,
    }
  }

  getSections (): CheatSection[] {
    if (!this.config.store.terminalBuddy) {
      this.config.store.terminalBuddy = {}
    }

    if (this.config.store.terminalBuddy.sections === undefined) {
      const defaults: CheatSection[] = JSON.parse(JSON.stringify(BUILT_IN_SECTIONS))
      this.saveSections(defaults)
      return defaults
    }

    return (this.config.store.terminalBuddy.sections ?? []) as CheatSection[]
  }

  getSectionMap (): Map<string, CheatSection> {
    const map = new Map<string, CheatSection>()
    for (const sec of this.getSections()) {
      map.set(sec.id, sec)
    }
    return map
  }

  saveSections (sections: CheatSection[]): void {
    if (!this.config.store.terminalBuddy) {
      this.config.store.terminalBuddy = {}
    }
    this.config.store.terminalBuddy.sections = sections
    this.config.save()
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

  resetToDefaults (): { sheets: CheatSheet[]; sections: CheatSection[] } {
    const defaultSections: CheatSection[] = JSON.parse(JSON.stringify(BUILT_IN_SECTIONS))
    const defaultSheets: CheatSheet[] = BUILT_IN_SHEETS.map(s => ({
      ...JSON.parse(JSON.stringify(s)),
      isCustom: true,
    }))
    this.saveSections(defaultSections)
    this.saveCustomSheets(defaultSheets)
    return { sheets: defaultSheets, sections: defaultSections }
  }
}
