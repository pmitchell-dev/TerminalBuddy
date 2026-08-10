import { CheatSheet, CheatSection } from './cheatsheet.model'

export const SYSTEMCTL_SECTIONS: CheatSection[] = [
  {
    id: 'sec_systemctl_service',
    title: 'Service Control',
    keys: [
      { key: 'systemctl start unit', description: 'Start a service immediately' },
      { key: 'systemctl stop unit', description: 'Stop a service immediately' },
      { key: 'systemctl restart unit', description: 'Restart a service' },
      { key: 'systemctl reload unit', description: 'Reload service configuration without stopping' },
      { key: 'systemctl status unit', description: 'Show runtime status of service' },
    ],
  },
  {
    id: 'sec_systemctl_enable',
    title: 'Enable / Disable',
    keys: [
      { key: 'systemctl enable unit', description: 'Enable service to start at boot' },
      { key: 'systemctl disable unit', description: 'Disable service from starting at boot' },
      { key: 'systemctl is-enabled unit', description: 'Check if service starts at boot' },
      { key: 'systemctl is-active unit', description: 'Check if service is currently running' },
    ],
  },
  {
    id: 'sec_systemctl_system',
    title: 'System Commands',
    keys: [
      { key: 'systemctl daemon-reload', description: 'Reload systemd manager configuration' },
      { key: 'systemctl list-units --type=service', description: 'List all active service units' },
      { key: 'systemctl list-unit-files', description: 'List all installed unit files' },
      { key: 'systemctl reboot', description: 'Reboot the system' },
      { key: 'systemctl poweroff', description: 'Shut down the system' },
    ],
  },
  {
    id: 'sec_systemctl_journal',
    title: 'Journalctl (Logs)',
    keys: [
      { key: 'journalctl -u unit', description: 'Show logs for a specific service' },
      { key: 'journalctl -u unit -f', description: 'Follow service logs in real-time (live)' },
      { key: 'journalctl -n 50', description: 'Show last 50 log lines' },
      { key: 'journalctl -p err', description: 'Show only error-level logs and above' },
    ],
  },
]

export const SYSTEMCTL_CHEATSHEET: CheatSheet = {
  id: 'systemctl',
  title: 'Systemctl',
  triggers: ['systemctl', 'journalctl'],
  sectionIds: ['sec_systemctl_service', 'sec_systemctl_enable', 'sec_systemctl_system', 'sec_systemctl_journal'],
}
