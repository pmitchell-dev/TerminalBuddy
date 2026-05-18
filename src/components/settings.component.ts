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
  newKeyInput = ''
  newDescInput = ''
  newTriggerInput = ''
  activeSection = 0

  constructor (private cheatsheetService: CheatsheetService) {}

  ngOnInit (): void {
    this.customSheets = JSON.parse(JSON.stringify(this.cheatsheetService.getCustomSheets()))
  }

  addSheet (): void {
    const newSheet: CheatSheet = {
      id: `custom_${Date.now()}`,
      title: 'New Cheat Sheet',
      triggers: [],
      sections: [{ title: 'Commands', keys: [] }],
      isCustom: true,
    }
    this.customSheets.push(newSheet)
    this.editSheet(newSheet)
  }

  editSheet (sheet: CheatSheet): void {
    this.editingSheet = JSON.parse(JSON.stringify(sheet))
    this.activeSection = 0
  }

  deleteSheet (index: number): void {
    this.customSheets.splice(index, 1)
    this.save()
  }

  addTrigger (): void {
    if (!this.editingSheet || !this.newTriggerInput.trim()) return
    this.editingSheet.triggers.push(this.newTriggerInput.trim().toLowerCase())
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
  }

  private save (): void {
    this.cheatsheetService.saveCustomSheets(this.customSheets)
  }
}
