import { CheatSheet, CheatSection } from './cheatsheet.model'

export const NANO_SECTIONS: CheatSection[] = [
  {
    id: 'sec_nano_file',
    title: 'File Operations',
    keys: [
      { key: '^O', description: 'Save file (Write Out)' },
      { key: '^X', description: 'Exit nano' },
      { key: '^R', description: 'Read/insert a file' },
      { key: '^S', description: 'Save without prompting' },
    ],
  },
  {
    id: 'sec_nano_nav',
    title: 'Navigation',
    keys: [
      { key: '^A / ^E', description: 'Start / end of line' },
      { key: '^Y / ^V', description: 'Page up / page down' },
      { key: '^_ (^G)', description: 'Go to line number' },
      { key: '^P / ^N', description: 'Previous / next line' },
      { key: '^B / ^F', description: 'Back / forward one char' },
      { key: 'M-\\ / M-/', description: 'First / last line of file' },
    ],
  },
  {
    id: 'sec_nano_search',
    title: 'Search & Replace',
    keys: [
      { key: '^W', description: 'Search forward' },
      { key: '^Q', description: 'Search backward' },
      { key: '^\\', description: 'Search and replace' },
      { key: 'M-W', description: 'Repeat last search' },
      { key: 'M-R', description: 'Toggle regex in search' },
    ],
  },
  {
    id: 'sec_nano_copy',
    title: 'Copy & Paste',
    keys: [
      { key: '^K', description: 'Cut current line' },
      { key: '^U', description: 'Paste (uncut)' },
      { key: 'M-6 (M-^)', description: 'Copy selected text' },
      { key: '^^ (M-A)', description: 'Set mark (start selection)' },
      { key: 'M-^', description: 'Copy current line' },
    ],
  },
  {
    id: 'sec_nano_misc',
    title: 'Misc',
    keys: [
      { key: '^C', description: 'Show cursor position' },
      { key: '^G', description: 'Open help' },
      { key: 'M-U', description: 'Undo' },
      { key: 'M-E', description: 'Redo' },
      { key: 'M-I', description: 'Toggle auto-indent' },
      { key: 'M-L', description: 'Toggle line numbers' },
    ],
  },
]

export const NANO_CHEATSHEET: CheatSheet = {
  id: 'nano',
  title: 'Nano',
  triggers: ['nano'],
  sectionIds: ['sec_nano_file', 'sec_nano_nav', 'sec_nano_search', 'sec_nano_copy', 'sec_nano_misc'],
}
