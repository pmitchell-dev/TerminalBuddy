export interface CheatKey {
  key: string          // e.g. ":wq"
  description: string  // e.g. "Save and quit"
}

export interface CheatSection {
  id: string           // unique section id, e.g. "sec_vi_modes"
  title: string        // section title, e.g. "Modes"
  keys: CheatKey[]
}

export interface CheatSheet {
  id: string           // unique id, e.g. "vi"
  title: string        // display name, e.g. "VI / Vim"
  triggers: string[]   // command names that activate this sheet, e.g. ["vi", "vim"]
  sectionIds: string[] // IDs of assigned sections from Section Library
  sections?: CheatSection[] // Hydrated sections resolved at runtime
  isCustom?: boolean   // true for user-defined sheets
  content?: string     // freeform text, notes, or documentation
}
