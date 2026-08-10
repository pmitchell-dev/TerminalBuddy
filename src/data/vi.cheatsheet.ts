import { CheatSheet } from './cheatsheet.model'

export const VI_CHEATSHEET: CheatSheet = {
  id: 'vi',
  title: 'VI / Vim',
  triggers: ['vi', 'vim', 'nvim'],
  sections: [
    {
      title: 'Modes',
      keys: [
        { key: 'i', description: 'Insert mode (before cursor)' },
        { key: 'a', description: 'Insert mode (after cursor)' },
        { key: 'o', description: 'New line below, insert mode' },
        { key: 'O', description: 'New line above, insert mode' },
        { key: 'v', description: 'Visual mode (character)' },
        { key: 'V', description: 'Visual mode (line)' },
        { key: 'Esc', description: 'Return to Normal mode' },
        { key: ':', description: 'Command mode' },
      ],
    },
    {
      title: 'Navigation',
      keys: [
        { key: 'h / j / k / l', description: 'Left / Down / Up / Right' },
        { key: 'w / b', description: 'Next word / previous word' },
        { key: '0 / $', description: 'Start / end of line' },
        { key: 'gg / G', description: 'Top / bottom of file' },
        { key: ':{n}', description: 'Go to line number n' },
        { key: 'Ctrl+F / Ctrl+B', description: 'Page down / page up' },
        { key: '%', description: 'Jump to matching bracket' },
      ],
    },
    {
      title: 'Editing',
      keys: [
        { key: 'x', description: 'Delete character under cursor' },
        { key: 'dd', description: 'Delete (cut) entire line' },
        { key: 'D', description: 'Delete to end of line' },
        { key: 'yy', description: 'Yank (copy) line' },
        { key: 'p / P', description: 'Paste after / before cursor' },
        { key: 'u', description: 'Undo' },
        { key: 'Ctrl+R', description: 'Redo' },
        { key: '.', description: 'Repeat last change' },
        { key: 'r{c}', description: 'Replace char with c' },
        { key: 'cw', description: 'Change word' },
      ],
    },
    {
      title: 'Search',
      keys: [
        { key: '/{pattern}', description: 'Search forward' },
        { key: '?{pattern}', description: 'Search backward' },
        { key: 'n / N', description: 'Next / previous match' },
        { key: '*', description: 'Search word under cursor' },
        { key: ':%s/old/new/g', description: 'Replace all in file' },
        { key: ':s/old/new/g', description: 'Replace all in line' },
      ],
    },
    {
      title: 'Save & Quit',
      keys: [
        { key: ':w', description: 'Save file' },
        { key: ':w {file}', description: 'Save as filename' },
        { key: ':q', description: 'Quit (if no changes)' },
        { key: ':wq', description: 'Save and quit' },
        { key: ':x', description: 'Save and quit (if changed)' },
        { key: ':q!', description: 'Quit without saving' },
        { key: ':e {file}', description: 'Open file' },
        { key: 'ZZ', description: 'Save and quit (shortcut)' },
      ],
    },
  ],
}
