#!/usr/bin/env bash
# TerminalBuddy Shell Integration Script
# =======================================
# Install: add the following line to your ~/.bashrc on each remote Linux machine:
#
#   [ -f ~/.config/terminalbuddy/terminalbuddy.sh ] && source ~/.config/terminalbuddy/terminalbuddy.sh
#
# Or run the one-liner installer:
#   curl -sSL https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/install.sh | bash

# Only activate inside a terminal that supports OSC sequences (i.e., not a dumb terminal)
[[ "$TERM" == "dumb" ]] && return

# ── OSC Sequence Emitters ──────────────────────────────────────────────────────

# Emit a raw OSC sequence to the terminal
# Usage: __tb_osc <payload>
__tb_osc() {
    printf '\e]7701;%s\a' "$1"
}

# Strip ANSI escape codes from a string
# Usage: __tb_strip_ansi <string>
__tb_strip_ansi() {
    # Remove color codes, cursor movements, and other ANSI sequences
    echo "$1" | sed 's/\x1b\[[0-9;]*[mGKHF]//g; s/\x1b\][^\x07]*\x07//g; s/\x1b[()][ -~]//g'
}

# ── preexec: fires just before a command runs ──────────────────────────────────
# Sends the command name so TerminalBuddy can switch to the right cheat sheet

__tb_preexec() {
    local full_cmd="$1"
    # Extract just the base command name (first word, no path)
    local cmd
    cmd=$(echo "$full_cmd" | awk '{print $1}' | xargs basename 2>/dev/null || echo "$full_cmd")
    __tb_osc "cmd=${cmd}"
}

# ── precmd: fires just before the prompt is shown ─────────────────────────────
# Sends the current directory + dashboard.txt content (base64 encoded)

__tb_precmd() {
    local cwd="$PWD"
    local dashboard_b64=""

    if [[ -f "${HOME}/dashboard/dashboard.txt" ]]; then
        # Read the file, strip ANSI codes, then base64 encode
        local raw
        raw=$(cat "${HOME}/dashboard/dashboard.txt")
        local stripped
        stripped=$(__tb_strip_ansi "$raw")
        # Use base64 with line-wrap disabled (-w 0 on GNU, without flag on BSD/macOS)
        dashboard_b64=$(echo "$stripped" | base64 -w 0 2>/dev/null || echo "$stripped" | base64)
    fi

    __tb_osc "prompt;cwd=${cwd};dashboard=${dashboard_b64}"
}

# ── Bash Hook Registration ─────────────────────────────────────────────────────

if [[ -n "$BASH_VERSION" ]]; then
    # preexec: use DEBUG trap but only fire on actual user commands
    # Guard: don't override existing DEBUG traps (be friendly with other tools)
    __tb_prev_debug_trap=$(trap -p DEBUG | sed "s/trap -- '\(.*\)' DEBUG/\1/")
    if [[ -z "$__tb_prev_debug_trap" ]]; then
        trap '__tb_preexec "$BASH_COMMAND"' DEBUG
    else
        # Chain with existing trap
        trap "${__tb_prev_debug_trap}; __tb_preexec \"\$BASH_COMMAND\"" DEBUG
    fi

    # precmd: append to PROMPT_COMMAND
    if [[ -z "$PROMPT_COMMAND" ]]; then
        PROMPT_COMMAND='__tb_precmd'
    else
        PROMPT_COMMAND="${PROMPT_COMMAND}; __tb_precmd"
    fi
fi

# ── Zsh Support (bonus — works if running zsh) ─────────────────────────────────
if [[ -n "$ZSH_VERSION" ]]; then
    autoload -Uz add-zsh-hook
    add-zsh-hook preexec __tb_preexec
    add-zsh-hook precmd __tb_precmd
fi
