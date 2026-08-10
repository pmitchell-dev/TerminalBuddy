import { Component, OnInit } from '@angular/core'
import { CheatsheetService } from '../services/cheatsheet.service'
import { CheatSheet, CheatSection } from '../data/cheatsheet.model'

@Component({
  selector: 'terminal-buddy-settings',
  template: require('./settings.component.html'),
  styles: [require('./settings.component.scss')],
})
export class SettingsComponent implements OnInit {
  activeTab: 'sheets' | 'sections' = 'sheets'

  sections: CheatSection[] = []
  customSheets: CheatSheet[] = []

  editingSheet: CheatSheet | null = null
  editingSection: CheatSection | null = null
  isNewSheet = false
  isNewSection = false

  newTriggerInput = ''
  newKeyInput = ''
  newDescInput = ''

  constructor (private cheatsheetService: CheatsheetService) {}

  ngOnInit (): void {
    this.loadData()
  }

  loadData (): void {
    this.sections = JSON.parse(JSON.stringify(this.cheatsheetService.getSections()))
    this.customSheets = JSON.parse(JSON.stringify(this.cheatsheetService.getCustomSheets()))
  }

  // ── Sheet Management ────────────────────────────────────

  addSheet (): void {
    this.editingSheet = {
      id: `custom_${Date.now()}`,
      title: 'New Cheat Sheet',
      triggers: [],
      sectionIds: [],
      content: '',
      isCustom: true,
    }
    this.isNewSheet = true
  }

  editSheet (sheet: CheatSheet): void {
    this.editingSheet = JSON.parse(JSON.stringify(sheet))
    if (!this.editingSheet!.sectionIds) {
      this.editingSheet!.sectionIds = []
    }
    if (this.editingSheet!.content === undefined) {
      this.editingSheet!.content = ''
    }
    this.isNewSheet = false
  }

  deleteSheet (index: number): void {
    this.customSheets.splice(index, 1)
    this.saveSheets()
  }

  toggleSectionAssignment (sectionId: string): void {
    if (!this.editingSheet) return
    if (!this.editingSheet.sectionIds) {
      this.editingSheet.sectionIds = []
    }
    const idx = this.editingSheet.sectionIds.indexOf(sectionId)
    if (idx >= 0) {
      this.editingSheet.sectionIds.splice(idx, 1)
    } else {
      this.editingSheet.sectionIds.push(sectionId)
    }
  }

  isSectionAssigned (sectionId: string): boolean {
    return this.editingSheet?.sectionIds?.includes(sectionId) ?? false
  }

  saveSheet (): void {
    if (!this.editingSheet) return
    const idx = this.customSheets.findIndex(s => s.id === this.editingSheet!.id)
    if (idx >= 0) {
      this.customSheets[idx] = this.editingSheet
    } else {
      this.customSheets.push(this.editingSheet)
    }
    this.editingSheet = null
    this.saveSheets()
  }

  cancelSheetEdit (): void {
    this.editingSheet = null
    this.isNewSheet = false
  }

  addTrigger (): void {
    if (!this.editingSheet || !this.newTriggerInput.trim()) return
    const val = this.newTriggerInput.trim().toLowerCase()
    if (!this.editingSheet.triggers.includes(val)) {
      this.editingSheet.triggers.push(val)
    }
    this.newTriggerInput = ''
  }

  removeTrigger (index: number): void {
    this.editingSheet?.triggers.splice(index, 1)
  }

  // ── Section Management ──────────────────────────────────

  addSection (andAssignToSheet = false): void {
    const newSec: CheatSection = {
      id: `sec_${Date.now()}`,
      title: 'New Section',
      keys: [],
    }
    this.editingSection = newSec
    this.isNewSection = true
    if (andAssignToSheet && this.editingSheet) {
      if (!this.editingSheet.sectionIds) {
        this.editingSheet.sectionIds = []
      }
      this.editingSheet.sectionIds.push(newSec.id)
    }
  }

  editSection (section: CheatSection): void {
    this.editingSection = JSON.parse(JSON.stringify(section))
    this.isNewSection = false
  }

  deleteSection (index: number): void {
    const deletedId = this.sections[index]?.id
    this.sections.splice(index, 1)
    if (deletedId) {
      for (const sheet of this.customSheets) {
        if (sheet.sectionIds) {
          sheet.sectionIds = sheet.sectionIds.filter(id => id !== deletedId)
        }
      }
      this.saveSheets()
    }
    this.saveSections()
  }

  saveSection (): void {
    if (!this.editingSection) return
    const idx = this.sections.findIndex(s => s.id === this.editingSection!.id)
    if (idx >= 0) {
      this.sections[idx] = this.editingSection
    } else {
      this.sections.push(this.editingSection)
    }
    this.editingSection = null
    this.saveSections()
  }

  cancelSectionEdit (): void {
    this.editingSection = null
    this.isNewSection = false
  }

  addKey (): void {
    if (!this.editingSection || !this.newKeyInput.trim()) return
    this.editingSection.keys.push({ key: this.newKeyInput.trim(), description: this.newDescInput.trim() })
    this.newKeyInput = ''
    this.newDescInput = ''
  }

  removeKey (keyIdx: number): void {
    this.editingSection?.keys.splice(keyIdx, 1)
  }

  // ── Shared Helpers ─────────────────────────────────────

  getSectionTitle (sectionId: string): string {
    const sec = this.sections.find(s => s.id === sectionId)
    return sec ? sec.title : sectionId
  }

  getSectionKeyCount (sectionId: string): number {
    const sec = this.sections.find(s => s.id === sectionId)
    return sec ? sec.keys.length : 0
  }

  resetDefaults (): void {
    if (confirm('Reset custom cheat sheets and sections to default examples? Your changes will be overwritten.')) {
      const res = this.cheatsheetService.resetToDefaults()
      this.customSheets = JSON.parse(JSON.stringify(res.sheets))
      this.sections = JSON.parse(JSON.stringify(res.sections))
      this.editingSheet = null
      this.editingSection = null
    }
  }

  private saveSheets (): void {
    this.cheatsheetService.saveCustomSheets(this.customSheets)
  }

  private saveSections (): void {
    this.cheatsheetService.saveSections(this.sections)
  }
}
