# ⚡ TerminalBuddy — System Context
**Last Updated:** 2026-05-27
**Type:** Tabby Terminal Plugin (TypeScript / Angular)

---

## Purpose
A Tabby Terminal plugin that adds a live, context-aware companion panel to SSH sessions. The panel auto-switches between VI/Vim cheat sheets, Nano cheat sheets, your custom dashboard, or user-defined cheat sheets for any program — triggered by OSC escape sequences from a shell hook on the remote machine.

---

## Tech Stack
- **Plugin:** TypeScript + Angular (Tabby plugin system)
- **Build:** webpack
- **Shell integration:** Bash/Zsh hook script (OSC 7701 sequences)
- **Distribution:** `.tgz` file installed via Tabby Settings → Plugins

---

## Key Files
```
src/
├── index.ts                   # Plugin entry point
├── module.ts                  # Angular module
├── components/
│   ├── buddy-panel.*          # Main panel (routes between states)
│   ├── cheatsheet.*           # Cheat sheet renderer
│   ├── dashboard.*            # Dashboard display
│   └── settings.*             # Custom cheat sheet settings UI
├── services/
│   ├── context.service.ts     # OSC sequence parser + state machine
│   └── cheatsheet.service.ts  # Cheat sheet resolver (built-in + custom)
└── data/
    ├── vi.cheatsheet.ts
    └── nano.cheatsheet.ts
shell-integration/
├── terminalbuddy.sh           # Bash/Zsh hook (OSC emitter)
└── install.sh                 # One-liner remote installer
```

---

## How It Works
Shell hook emits OSC sequences:
- On command run: `\e]7701;cmd=vi\a`
- On prompt return: `\e]7701;prompt;cwd=/home/pi;dashboard=<base64>\a`

Plugin parses these and switches the panel state accordingly. Dashboard content is read from `~/dashboard/dashboard.txt` on the remote machine.

---

## Build & Install
```bash
npm install
npm run build        # production build
npm pack             # creates tabby-terminal-buddy-x.x.x.tgz
# Install .tgz via Tabby Settings → Plugins → Install from file
```

Remote shell integration (one-liner on each Linux machine):
```bash
curl -sSL https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/install.sh | bash
```

---

## Notes
- The shell integration script is embedded in `install.sh` and `pi_rebuild.sh` — no internet required on the Pi during rebuild
- Dashboard content auto-strips ANSI color codes for clean display
- Custom cheat sheets configurable via Tabby Settings → TerminalBuddy
- Plugin directory for dev: `%APPDATA%\tabby\plugins\`
