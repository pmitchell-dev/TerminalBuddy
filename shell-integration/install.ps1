# TerminalBuddy Windows PowerShell Integration Installer
# =======================================================

$ErrorActionPreference = "Stop"

Write-Host "⚡ Installing TerminalBuddy PowerShell Integration..." -ForegroundColor Magenta

# 1. Create Machine-Wide ProgramData Directory for Shared Dashboard
$programDataDir = Join-Path $env:ProgramData "TerminalBuddy"
if (!(Test-Path $programDataDir)) {
    New-Item -ItemType Directory -Path $programDataDir -Force | Out-Null
}

$dashboardFile = Join-Path $programDataDir "dashboard.txt"
if (!(Test-Path $dashboardFile)) {
    $sampleText = @"
===================================================
⚡ TerminalBuddy Dashboard
Machine: $env:COMPUTERNAME
OS: $(Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Caption)
===================================================
Shared dashboard text file location:
C:\ProgramData\TerminalBuddy\dashboard.txt
"@
    Set-Content -Path $dashboardFile -Value $sampleText -Encoding UTF8
}

# 2. Save terminalbuddy.ps1 to user config directory
$tbDir = Join-Path $env:USERPROFILE ".config\terminalbuddy"
if (!(Test-Path $tbDir)) {
    New-Item -ItemType Directory -Path $tbDir -Force | Out-Null
}

$scriptPath = Join-Path $tbDir "terminalbuddy.ps1"
$scriptContent = @'
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
            $clean = $raw -replace "\x1B\[[0-9;]*[a-zA-Z]", ""
            $dashB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($clean))
        }
    }

    $e = [char]27
    $a = [char]7
    Write-Host -NoNewline "$e]7701;prompt;cwd=$cwd;dashboard=$dashB64$a"
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
'@

Set-Content -Path $scriptPath -Value $scriptContent -Encoding UTF8

# 3. Add source line to PowerShell Profile ($PROFILE)
$profilePath = $PROFILE
if (!(Test-Path $profilePath)) {
    $profileDir = Split-Path $profilePath
    if (!(Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }
    New-Item -ItemType File -Path $profilePath -Force | Out-Null
}

$sourceLine = "`$tbScript = Join-Path `$env:USERPROFILE '.config\terminalbuddy\terminalbuddy.ps1'; if (Test-Path `$tbScript) { . `$tbScript }"
$profileContent = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue

if ($profileContent -notlike "*terminalbuddy.ps1*") {
    Add-Content -Path $profilePath -Value "`n# TerminalBuddy Integration`n$sourceLine"
}

Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host "📌 Profile updated: $PROFILE" -ForegroundColor Cyan
Write-Host "📌 Shared Dashboard file: C:\ProgramData\TerminalBuddy\dashboard.txt" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️ IMPORTANT REMINDER:" -ForegroundColor Magenta
Write-Host "Please set up a scheduled script or task to periodically update the information in:" -ForegroundColor Yellow
Write-Host "   C:\ProgramData\TerminalBuddy\dashboard.txt" -ForegroundColor Cyan
Write-Host ""
Write-Host "Reload your PowerShell session (or run: . `$PROFILE) to activate TerminalBuddy." -ForegroundColor White
