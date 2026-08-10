import { CheatSheet } from './cheatsheet.model'

export const CHMOD_CHEATSHEET: CheatSheet = {
  id: 'chmod',
  title: 'Chmod & Chown',
  triggers: ['chmod', 'chown'],
  sections: [
    {
      title: 'Permissions Overview',
      keys: [
        { key: 'r = read (4)', description: 'View file contents or list directory' },
        { key: 'w = write (2)', description: 'Modify file or create/delete files in directory' },
        { key: 'x = execute (1)', description: 'Run script/binary or enter directory' },
        { key: 'u / g / o / a', description: 'User (owner) / Group / Others / All users' },
      ],
    },
    {
      title: 'Symbolic Mode',
      keys: [
        { key: 'chmod u+x file', description: 'Add execute permission for owner' },
        { key: 'chmod g-w file', description: 'Remove write permission from group' },
        { key: 'chmod o=r file', description: 'Set others permissions to read-only' },
        { key: 'chmod a+rw file', description: 'Add read & write permissions to everyone' },
      ],
    },
    {
      title: 'Numeric Mode',
      keys: [
        { key: 'chmod 755 file', description: 'User: rwx (7), Group: r-x (5), Others: r-x (5)' },
        { key: 'chmod 644 file', description: 'User: rw- (6), Group: r-- (4), Others: r-- (4)' },
        { key: 'chmod 600 file', description: 'User: rw- (6), Group: --- (0), Others: --- (0)' },
        { key: 'chmod 777 file', description: 'Give everyone full read, write, & execute' },
      ],
    },
    {
      title: 'Ownership & Recursive',
      keys: [
        { key: 'chmod -R 755 dir/', description: 'Recursively set permissions on directory' },
        { key: 'chown user file', description: 'Change owner of file to user' },
        { key: 'chown user:group file', description: 'Change owner to user, group to group' },
        { key: 'chown -R user:grp dir/', description: 'Recursively change owner & group' },
      ],
    },
  ],
}
