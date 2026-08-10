import { CheatSheet, CheatSection } from './cheatsheet.model'

export const TAR_SECTIONS: CheatSection[] = [
  {
    id: 'sec_tar_create',
    title: 'Create Archives',
    keys: [
      { key: 'tar -czvf arch.tar.gz dir/', description: 'Create gzip compressed archive' },
      { key: 'tar -cjvf arch.tar.bz2 dir/', description: 'Create bzip2 compressed archive' },
      { key: 'tar -cJvf arch.tar.xz dir/', description: 'Create xz compressed archive (best)' },
      { key: 'tar -cvf arch.tar dir/', description: 'Create uncompressed tar archive' },
    ],
  },
  {
    id: 'sec_tar_extract',
    title: 'Extract Archives',
    keys: [
      { key: 'tar -xzvf arch.tar.gz', description: 'Extract gzip compressed archive' },
      { key: 'tar -xjvf arch.tar.bz2', description: 'Extract bzip2 compressed archive' },
      { key: 'tar -xJvf arch.tar.xz', description: 'Extract xz compressed archive' },
      { key: 'tar -xvf arch.tar', description: 'Extract uncompressed tar archive' },
      { key: 'tar -xvf arch.tar -C dir', description: 'Extract to a specific directory' },
    ],
  },
  {
    id: 'sec_tar_list',
    title: 'List & Info',
    keys: [
      { key: 'tar -tvf arch.tar', description: 'List contents of an archive' },
      { key: 'tar -tzvf arch.tar.gz', description: 'List contents of a compressed archive' },
    ],
  },
  {
    id: 'sec_tar_options',
    title: 'Common Options',
    keys: [
      { key: '-c', description: 'Create a new archive' },
      { key: '-x', description: 'Extract files from an archive' },
      { key: '-t', description: 'List the contents of an archive' },
      { key: '-v', description: 'Verbose output (list files processed)' },
      { key: '-f', description: 'Use archive file specified' },
      { key: '-z / -j / -J', description: 'Gzip / Bzip2 / Xz compression' },
    ],
  },
]

export const TAR_CHEATSHEET: CheatSheet = {
  id: 'tar',
  title: 'Tar',
  triggers: ['tar'],
  sectionIds: ['sec_tar_create', 'sec_tar_extract', 'sec_tar_list', 'sec_tar_options'],
}
