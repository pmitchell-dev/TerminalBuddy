# ⚡ TerminalBuddy

A **Tabby Terminal plugin** that adds a live, context-aware companion panel to your SSH sessions.

The panel automatically switches between:
- 📋 **VI / Vim cheat sheet** — when you enter `vi` or `vim`
- 📋 **Nano cheat sheet** — when you enter `nano`
- 🖥️ **Your custom dashboard** — when you're at the shell prompt (reads `~/dashboard/dashboard.txt` from the remote machine)
- ➕ **Custom cheat sheets** — add your own for any program via Settings

---

## Screenshots

| 🖥️ Companion Dashboard | 📋 VI/Vim Cheat Sheet | ⚙️ Custom Cheat Sheets |
|:---:|:---:|:---:|
| ![Companion Dashboard](https://raw.githubusercontent.com/pmitchell-dev/ScreenShotPub/main/screenshots/screenshot_2026-05-20_08-50-11_AM_32ac6c.png) | ![Vim Cheat Sheet](https://raw.githubusercontent.com/pmitchell-dev/ScreenShotPub/main/screenshots/screenshot_2026-05-20_08-51-15_AM_7703f6.png) | ![Settings](https://raw.githubusercontent.com/pmitchell-dev/ScreenShotPub/main/screenshots/screenshot_2026-05-20_08-51-39_AM_dceccc.png) |


---

## Installation

### Part 1 — Install the Tabby Plugin (Windows)

**From GitHub (manual install):**

1. Download the latest `tabby-terminal-buddy-x.x.x.tgz` from [Releases](https://github.com/pmitchell-dev/TerminalBuddy/releases)
2. Open Tabby → **Settings → Plugins**
3. Click **Install from file** and select the `.tgz`
4. Restart Tabby

**From source (developers):**

```bash
git clone https://github.com/pmitchell-dev/TerminalBuddy.git
cd TerminalBuddy
npm install
npm run build
npm pack
# Then install the resulting .tgz in Tabby as above
```

---

### Part 2 — Install Shell Integration on Remote Machines (Linux)

Run this **one-liner on each remote Linux machine** over SSH:

```bash
curl -sSL https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/install.sh | bash
```

Then reload your shell:

```bash
source ~/.bashrc
```

That's it. The next time you SSH in via Tabby, the panel activates automatically.

---

### Part 3 — Set Up Your Dashboard (Optional)

Create a plain text file on your remote machine at:

```
~/dashboard/dashboard.txt
```

TerminalBuddy will display this file in the panel whenever you're at the shell prompt. You can use any text — system stats, server info, custom commands, etc.

> **Note:** ANSI color codes in `dashboard.txt` are automatically stripped for clean display.

---

## Custom Cheat Sheets

Add cheat sheets for any terminal program via **Tabby Settings → TerminalBuddy**.

- Set the **trigger command** (e.g. `htop`, `python3`, `docker`)
- Add **sections** with **keybind → description** rows
- Custom sheets override built-ins if the trigger matches

---

## How It Works

TerminalBuddy uses a small Bash/Zsh hook script on the remote machine that emits custom **OSC escape sequences** into the terminal output stream — the same technique used by iTerm2 Shell Integration and Warp Terminal.

When you run a command, the hook sends: `\e]7701;cmd=vi\a`  
When you return to the prompt, it sends: `\e]7701;prompt;cwd=/home/pi;dashboard=<base64>\a`

The Tabby plugin listens for these sequences and updates the panel instantly — no polling, no extra network connections, no ports.

---

## Supported Programs (Built-in Cheat Sheets)

| Program | Triggers |
|---|---|
| VI / Vim | `vi`, `vim`, `nvim` |
| Nano | `nano` |
| *(more coming)* | — |

---

## Development

```bash
npm install          # Install dependencies
npm run build:dev    # Development build (with source maps)
npm run watch        # Watch mode — auto-rebuilds on file changes
npm run build        # Production build
npm pack             # Package as .tgz for distribution
```

**Tabby plugin directory** (for dev symlink testing):  
`%APPDATA%\tabby\plugins\`

---

## Project Structure

```
terminalbuddy-tabby-plugin/
├── src/
│   ├── index.ts                    # Plugin entry point
│   ├── module.ts                   # Angular module
│   ├── components/                 # UI components
│   │   ├── buddy-panel.*           # Main panel (routes between states)
│   │   ├── cheatsheet.*            # Cheat sheet renderer
│   │   ├── dashboard.*             # Dashboard stub
│   │   └── settings.*              # Custom cheat sheet settings UI
│   ├── services/
│   │   ├── context.service.ts      # OSC sequence parser + state
│   │   └── cheatsheet.service.ts   # Cheat sheet resolver (built-in + custom)
│   ├── providers/                  # Tabby extension point registrations
│   └── data/                       # Built-in cheat sheet data
│       ├── vi.cheatsheet.ts
│       └── nano.cheatsheet.ts
└── shell-integration/
    ├── terminalbuddy.sh            # Bash/Zsh hook script
    └── install.sh                  # Remote one-liner installer
```

---

## License

MIT — see [LICENSE](LICENSE)
