# TerminalBuddy Windows PowerShell Integration Script
# ====================================================

function __tb_prompt {
    $cwd = $ExecutionContext.SessionState.Path.CurrentLocation.Path
    $dashPathProgramData = Join-Path $env:ProgramData "TerminalBuddy\dashboard.txt"
    $dashPathUserProfile = Join-Path $env:USERPROFILE "dashboard\dashboard.txt"
    $dashB64 = ""

    $targetDashPath = $null
    if (Test-Path $dashPathProgramData) {
        $targetDashPath = $dashPathProgramData
    } elseif (Test-Path $dashPathUserProfile) {
        $targetDashPath = $dashPathUserProfile
    }

    if ($targetDashPath) {
        $raw = Get-Content $targetDashPath -Raw -ErrorAction SilentlyContinue
        if ($raw) {
            # Strip ANSI escape codes
            $esc = [char]27
            $clean = $raw -replace "$esc\[[0-9;]*[a-zA-Z]", ""
            $dashB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($clean))
        }
    }

    # Emit TerminalBuddy OSC sequence (OSC 7701) directly to stdout
    $e = [char]27
    $a = [char]7
    $seq = "$e]7701;prompt;cwd=$cwd;dashboard=$dashB64$a"
    [Console]::Out.Write($seq)
    [Console]::Out.Flush()
}

if (!(Test-Path variable:__tb_prompt_hooked)) {
    $global:__tb_prompt_hooked = $true
    if (Test-Path Function:\prompt) {
        $oldPrompt = $function:prompt
        function global:prompt {
            __tb_prompt
            & $oldPrompt
        }
    } else {
        function global:prompt {
            __tb_prompt
            "PS $($ExecutionContext.SessionState.Path.CurrentLocation.Path)> "
        }
    }
}
