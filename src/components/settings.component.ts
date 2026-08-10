import { Component, OnInit } from '@angular/core'
import { CheatsheetService } from '../services/cheatsheet.service'
import { CheatSheet, CheatSection, CheatKey } from '../data/cheatsheet.model'

@Component({
  selector: 'terminal-buddy-settings',
  template: require('./settings.component.html'),
  styles: [require('./settings.component.scss')],
})
export class SettingsComponent implements OnInit {
  customSheets: CheatSheet[] = []
  editingSheet: CheatSheet | null = null
  isNewSheet = false
  newKeyInput = ''
  newDescInput = ''
  newTriggerInput = ''
  activeSection = 0

  constructor (private cheatsheetService: CheatsheetService) {}

  ngOnInit (): void {
    this.loadSheets()
  }

  loadSheets (): void {
    this.customSheets = JSON.parse(JSON.stringify(this.cheatsheetService.getCustomSheets()))
  }

  addSheet (): void {
    this.editingSheet = {
      id: `custom_${Date.now()}`,
      title: 'New Cheat Sheet',
      triggers: [],
      sections: [{ title: 'Commands', keys: [] }],
      content: '',
      isCustom: true,
    }
    this.isNewSheet = true
    this.activeSection = 0
  }

  editSheet (sheet: CheatSheet): void {
    this.editingSheet = JSON.parse(JSON.stringify(sheet))
    if (!this.editingSheet!.sections) {
      this.editingSheet!.sections = []
    }
    if (this.editingSheet!.content === undefined) {
      this.editingSheet!.content = ''
    }
    this.isNewSheet = false
    this.activeSection = 0
  }

  deleteSheet (index: number): void {
    this.customSheets.splice(index, 1)
    this.save()
  }

  resetDefaults (): void {
    if (confirm('Reset custom cheat sheets to default example sheets? Your changes will be overwritten.')) {
      this.customSheets = JSON.parse(JSON.stringify(this.cheatsheetService.resetToDefaults()))
      this.editingSheet = null
    }
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

  addSection (): void {
    if (!this.editingSheet) return
    this.editingSheet.sections.push({ title: 'New Section', keys: [] })
    this.activeSection = this.editingSheet.sections.length - 1
  }

  removeSection (index: number): void {
    this.editingSheet?.sections.splice(index, 1)
    if (this.activeSection >= (this.editingSheet?.sections.length ?? 0)) {
      this.activeSection = Math.max(0, (this.editingSheet?.sections.length ?? 1) - 1)
    }
  }

  addKey (): void {
    if (!this.editingSheet || !this.newKeyInput.trim()) return
    const section = this.editingSheet.sections[this.activeSection]
    if (!section) return
    section.keys.push({ key: this.newKeyInput.trim(), description: this.newDescInput.trim() })
    this.newKeyInput = ''
    this.newDescInput = ''
  }

  removeKey (sectionIdx: number, keyIdx: number): void {
    this.editingSheet?.sections[sectionIdx]?.keys.splice(keyIdx, 1)
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
    this.save()
  }

  cancelEdit (): void {
    this.editingSheet = null
    this.isNewSheet = false
  }

  private save (): void {
    this.cheatsheetService.saveCustomSheets(this.customSheets)
  }
}
