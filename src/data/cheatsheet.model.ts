export interface CheatKey {
  key: string          // e.g. ":wq"
  description: string  // e.g. "Save and quit"
}

export interface CheatSection {
  title: string        // e.g. "Save & Quit"
  keys: CheatKey[]
}

export interface CheatSheet {
  id: string           // unique id, e.g. "vi"
  title: string        // display name, e.g. "VI / Vim"
  triggers: string[]   // command names that activate this sheet, e.g. ["vi", "vim"]
  sections: CheatSection[]
  isCustom?: boolean   // true for user-defined sheets
  content?: string     // freeform text, notes, or documentation
}
