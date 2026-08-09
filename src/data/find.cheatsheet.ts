import { CheatSheet } from './cheatsheet.model'

export const FIND_CHEATSHEET: CheatSheet = {
  id: 'find',
  title: 'Find',
  triggers: ['find'],
  sections: [
    {
      title: 'By Name & Path',
      keys: [
        { key: 'find . -name "file.txt"', description: 'Find file by name (case-sensitive)' },
        { key: 'find . -iname "file.txt"', description: 'Find file by name (case-insensitive)' },
        { key: 'find . -name "*.log"', description: 'Find files matching wildcard pattern' },
        { key: 'find /path -not -path "*/dir/*"', description: 'Exclude a path from search' },
      ],
    },
    {
      title: 'By Type & Size',
      keys: [
        { key: 'find . -type f', description: 'Find files only' },
        { key: 'find . -type d', description: 'Find directories only' },
        { key: 'find . -size +50M', description: 'Find files larger than 50MB' },
        { key: 'find . -size -10k', description: 'Find files smaller than 10KB' },
        { key: 'find . -empty', description: 'Find empty files or directories' },
      ],
    },
    {
      title: 'By Time',
      keys: [
        { key: 'find . -mtime -1', description: 'Modified in the last 24 hours (1 day)' },
        { key: 'find . -mtime +30', description: 'Modified more than 30 days ago' },
        { key: 'find . -mmin -60', description: 'Modified in the last 60 minutes' },
      ],
    },
    {
      title: 'Actions',
      keys: [
        { key: 'find . -type f -delete', description: 'Delete all found files (Caution!)' },
        { key: 'find . -type f -exec chmod 644 {} +', description: 'Run command on all found files' },
        { key: 'find . -type f -name "*.txt" -print', description: 'Print matching filenames' },
      ],
    },
  ],
}
