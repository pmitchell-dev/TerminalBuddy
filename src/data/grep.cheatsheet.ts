import { CheatSheet } from './cheatsheet.model'

export const GREP_CHEATSHEET: CheatSheet = {
  id: 'grep',
  title: 'Grep',
  triggers: ['grep', 'egrep', 'fgrep'],
  sections: [
    {
      title: 'Basic Search',
      keys: [
        { key: 'grep "pattern" file', description: 'Search for pattern in file' },
        { key: 'grep -i "pattern" file', description: 'Case-insensitive search' },
        { key: 'grep -w "pattern" file', description: 'Search for whole words only' },
        { key: 'grep -v "pattern" file', description: 'Invert match (show non-matching lines)' },
      ],
    },
    {
      title: 'Recursive & Multi-file',
      keys: [
        { key: 'grep -r "pattern" dir/', description: 'Recursive search in directory' },
        { key: 'grep -rl "pattern" dir/', description: 'Show only names of matching files' },
        { key: 'grep -rn "pattern" dir/', description: 'Recursive search showing line numbers' },
        { key: 'grep --include="*.js" -r "pat"', description: 'Search only within JS files' },
      ],
    },
    {
      title: 'Context & Formatting',
      keys: [
        { key: 'grep -n "pattern" file', description: 'Show line numbers with matches' },
        { key: 'grep -c "pattern" file', description: 'Show count of matching lines' },
        { key: 'grep -A 3 "pattern" file', description: 'Show match and 3 lines after' },
        { key: 'grep -B 3 "pattern" file', description: 'Show match and 3 lines before' },
        { key: 'grep -C 3 "pattern" file', description: 'Show match and 3 lines of context' },
      ],
    },
    {
      title: 'Regex & Advanced',
      keys: [
        { key: 'grep -E "pat1|pat2"', description: 'Extended regex (matches pat1 OR pat2)' },
        { key: 'grep -P "\\d{3}-\\d{4}" file', description: 'Perl-compatible regex (PCRE)' },
      ],
    },
  ],
}
