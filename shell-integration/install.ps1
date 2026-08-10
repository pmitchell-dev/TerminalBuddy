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

$localPsScript = if (![string]::IsNullOrEmpty($PSScriptRoot)) { Join-Path $PSScriptRoot "terminalbuddy.ps1" } else { $null }
if ($localPsScript -and (Test-Path $localPsScript)) {
    Copy-Item -Path $localPsScript -Destination $psScriptPath -Force
} else {
    Invoke-WebRequest -Uri $psSourceUrl -OutFile $psScriptPath -UseBasicParsing
}

# Add source line to all PowerShell Profiles (Windows PowerShell 5.1 & PowerShell Core 7+)
$docsDir = Join-Path $env:USERPROFILE "Documents"
$possibleProfiles = @(
    $PROFILE,
    (Join-Path $docsDir "WindowsPowerShell\Microsoft.PowerShell_profile.ps1"),
    (Join-Path $docsDir "PowerShell\Microsoft.PowerShell_profile.ps1")
) | Select-Object -Unique

$sourceLine = "`$tbScript = Join-Path `$env:USERPROFILE '.config\terminalbuddy\terminalbuddy.ps1'; if (Test-Path `$tbScript) { . `$tbScript }"

foreach ($pPath in $possibleProfiles) {
    if ($pPath) {
        $pDir = Split-Path $pPath
        if (!(Test-Path $pDir)) {
            New-Item -ItemType Directory -Path $pDir -Force | Out-Null
        }
        if (!(Test-Path $pPath)) {
            New-Item -ItemType File -Path $pPath -Force | Out-Null
        }

        $pContent = [string](Get-Content $pPath -Raw -ErrorAction SilentlyContinue)
        if ($pContent -notlike "*terminalbuddy.ps1*") {
            Add-Content -Path $pPath -Value "`n# TerminalBuddy Integration`n$sourceLine"
        }
    }
}

# 3. Setup CMD / Clink Lua Script for Tabby Command Prompt
$luaSourceUrl = "https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/terminalbuddy.lua"
$localLuaScript = if (![string]::IsNullOrEmpty($PSScriptRoot)) { Join-Path $PSScriptRoot "terminalbuddy.lua" } else { $null }

$clinkDirs = @(
    (Join-Path $env:LOCALAPPDATA "clink"),
    (Join-Path $env:USERPROFILE ".config\clink")
)

foreach ($cdir in $clinkDirs) {
    if (!(Test-Path $cdir)) {
        New-Item -ItemType Directory -Path $cdir -Force | Out-Null
    }
    $destLua = Join-Path $cdir "terminalbuddy.lua"
    if ($localLuaScript -and (Test-Path $localLuaScript)) {
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
