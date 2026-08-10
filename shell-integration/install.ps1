# TerminalBuddy Windows Shell Integration Installer
# ===================================================

$ErrorActionPreference = "Stop"

Write-Host "[+] Installing TerminalBuddy Windows Shell Integration..." -ForegroundColor Magenta

# 1. Create Machine-Wide ProgramData Directory for Shared Dashboard
$programDataDir = Join-Path $env:ProgramData "TerminalBuddy"
if (!(Test-Path $programDataDir)) {
    New-Item -ItemType Directory -Path $programDataDir -Force | Out-Null
}

$dashboardFile = Join-Path $programDataDir "dashboard.txt"
if (!(Test-Path $dashboardFile)) {
    $osName = $(Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Caption)
    $sampleText = "===================================================`nTerminalBuddy Dashboard`nMachine: $env:COMPUTERNAME`nOS: $osName`n===================================================`nShared dashboard text file location:`nC:\ProgramData\TerminalBuddy\dashboard.txt"
    Set-Content -Path $dashboardFile -Value $sampleText -Encoding UTF8
}

# 2. Setup PowerShell Integration
$tbDir = Join-Path $env:USERPROFILE ".config\terminalbuddy"
if (!(Test-Path $tbDir)) {
    New-Item -ItemType Directory -Path $tbDir -Force | Out-Null
}

$psScriptPath = Join-Path $tbDir "terminalbuddy.ps1"
$psSourceUrl = "https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/terminalbuddy.ps1"

$localPsScript = Join-Path $PSScriptRoot "terminalbuddy.ps1"
if (Test-Path $localPsScript) {
    Copy-Item -Path $localPsScript -Destination $psScriptPath -Force
} else {
    Invoke-WebRequest -Uri $psSourceUrl -OutFile $psScriptPath -UseBasicParsing
}

# Add source line to PowerShell Profile ($PROFILE)
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

# 3. Setup CMD / Clink Lua Script for Tabby Command Prompt
$luaSourceUrl = "https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/terminalbuddy.lua"
$localLuaScript = Join-Path $PSScriptRoot "terminalbuddy.lua"

$clinkDirs = @(
    (Join-Path $env:LOCALAPPDATA "clink"),
    (Join-Path $env:USERPROFILE ".config\clink")
)

foreach ($cdir in $clinkDirs) {
    if (!(Test-Path $cdir)) {
        New-Item -ItemType Directory -Path $cdir -Force | Out-Null
    }
    $destLua = Join-Path $cdir "terminalbuddy.lua"
    if (Test-Path $localLuaScript) {
        Copy-Item -Path $localLuaScript -Destination $destLua -Force
    } else {
        Invoke-WebRequest -Uri $luaSourceUrl -OutFile $destLua -UseBasicParsing
    }
}

Write-Host "[+] Installation complete for both PowerShell and CMD (Clink)!" -ForegroundColor Green
Write-Host "[*] PowerShell Profile updated: $PROFILE" -ForegroundColor Cyan
Write-Host "[*] CMD Clink script installed: $env:LOCALAPPDATA\clink\terminalbuddy.lua" -ForegroundColor Cyan
Write-Host "[*] Shared Dashboard file: C:\ProgramData\TerminalBuddy\dashboard.txt" -ForegroundColor Yellow
Write-Host ""
Write-Host "[!] IMPORTANT REMINDER:" -ForegroundColor Magenta
Write-Host "Please set up a scheduled script or task to periodically update the information in:" -ForegroundColor Yellow
Write-Host "   C:\ProgramData\TerminalBuddy\dashboard.txt" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open a new PowerShell or CMD tab in Tabby to start using TerminalBuddy locally." -ForegroundColor White
