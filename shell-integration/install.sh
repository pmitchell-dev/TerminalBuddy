#!/usr/bin/env bash
# TerminalBuddy Remote Install Script
# =====================================
# One-liner: curl -sSL https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/install.sh | bash

set -e

INSTALL_DIR="${HOME}/.config/terminalbuddy"
SCRIPT_URL="https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/terminalbuddy.sh"
BASHRC="${HOME}/.bashrc"
ZSHRC="${HOME}/.zshrc"
SOURCE_LINE='[ -f ~/.config/terminalbuddy/terminalbuddy.sh ] && source ~/.config/terminalbuddy/terminalbuddy.sh'

echo "⚡ TerminalBuddy Shell Integration Installer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create install directory
mkdir -p "$INSTALL_DIR"

# Download script
echo "→ Downloading terminalbuddy.sh..."
if command -v curl &>/dev/null; then
    curl -sSL "$SCRIPT_URL" -o "${INSTALL_DIR}/terminalbuddy.sh"
elif command -v wget &>/dev/null; then
    wget -qO "${INSTALL_DIR}/terminalbuddy.sh" "$SCRIPT_URL"
else
    echo "✗ Error: curl or wget is required. Please install one and retry."
    exit 1
fi
chmod +x "${INSTALL_DIR}/terminalbuddy.sh"
echo "  ✓ Downloaded to ${INSTALL_DIR}/terminalbuddy.sh"

# Add to .bashrc if not already present
if [[ -f "$BASHRC" ]] && ! grep -qF 'terminalbuddy.sh' "$BASHRC"; then
    echo "" >> "$BASHRC"
    echo "# TerminalBuddy shell integration" >> "$BASHRC"
    echo "$SOURCE_LINE" >> "$BASHRC"
    echo "  ✓ Added to ${BASHRC}"
fi

# Add to .zshrc if zsh is installed
if command -v zsh &>/dev/null && [[ -f "$ZSHRC" ]] && ! grep -qF 'terminalbuddy.sh' "$ZSHRC"; then
    echo "" >> "$ZSHRC"
    echo "# TerminalBuddy shell integration" >> "$ZSHRC"
    echo "$SOURCE_LINE" >> "$ZSHRC"
    echo "  ✓ Added to ${ZSHRC}"
fi

echo ""
echo "✓ Installation complete!"
echo ""
echo "  Reload your shell or run: source ~/.bashrc"
echo "  Then open a new SSH session in Tabby — TerminalBuddy will activate automatically."
echo ""
