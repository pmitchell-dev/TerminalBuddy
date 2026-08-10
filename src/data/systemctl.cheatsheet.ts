import { CheatSheet } from './cheatsheet.model'

export const SYSTEMCTL_CHEATSHEET: CheatSheet = {
  id: 'systemctl',
  title: 'Systemctl',
  triggers: ['systemctl', 'journalctl'],
  sections: [
    {
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
      title: 'Enable / Disable',
      keys: [
        { key: 'systemctl enable unit', description: 'Enable service to start at boot' },
        { key: 'systemctl disable unit', description: 'Disable service from starting at boot' },
        { key: 'systemctl is-enabled unit', description: 'Check if service starts at boot' },
        { key: 'systemctl is-active unit', description: 'Check if service is currently running' },
      ],
    },
    {
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
      title: 'Journalctl (Logs)',
      keys: [
        { key: 'journalctl -u unit', description: 'Show logs for a specific service' },
        { key: 'journalctl -u unit -f', description: 'Follow service logs in real-time (live)' },
        { key: 'journalctl -n 50', description: 'Show last 50 log lines' },
        { key: 'journalctl -p err', description: 'Show only error-level logs and above' },
      ],
    },
  ],
}
