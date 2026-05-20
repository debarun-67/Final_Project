# =============================================================
#  Medical Blockchain - Rogue / Malicious Node Launcher
#  Run AFTER demo_launcher.ps1 has the honest nodes running.
# =============================================================

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$RogueDir    = "$ProjectRoot\demo_instances\rogue_node"
$CoreBinDir  = "$ProjectRoot\backend\core\bin"
$CoreRecords = "$ProjectRoot\backend\core\offchain\records"

Write-Host ""
Write-Host "##############################################" -ForegroundColor Red
Write-Host "##   !! ROGUE NODE LAUNCHER !!             ##" -ForegroundColor Red
Write-Host "##   Malicious Attacker - Port 8099        ##" -ForegroundColor Red
Write-Host "##############################################" -ForegroundColor Red
Write-Host ""

# ------------------------------------------------------------------
# Check honest nodes are likely running
# ------------------------------------------------------------------
$HonestRunning = $false
foreach ($p in @(8001,8002,8003,8004)) {
    if (Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue) {
        $HonestRunning = $true
        break
    }
}

if (-not $HonestRunning) {
    Write-Host "[WARNING] No honest nodes detected on ports 8001-8004." -ForegroundColor Yellow
    Write-Host "          Run .\scripts\demo_launcher.ps1 first."       -ForegroundColor Yellow
    Write-Host ""
    $confirm = Read-Host "Launch rogue node anyway? (y/n)"
    if ($confirm -ne "y") { exit }
}

# ------------------------------------------------------------------
# Ensure rogue binary exists
# ------------------------------------------------------------------
if (-not (Test-Path "$CoreBinDir\rogue_node.exe")) {
    Write-Host "[ERROR] rogue_node.exe not found." -ForegroundColor Red
    Write-Host "        Run 'mingw32-make all' inside backend\core first." -ForegroundColor Red
    exit 1
}

# ------------------------------------------------------------------
# Setup rogue node dir if needed
# ------------------------------------------------------------------
if (-not (Test-Path "$RogueDir\rogue_node.exe")) {
    Write-Host "[SETUP] Creating rogue environment..." -ForegroundColor Magenta
    New-Item -ItemType Directory -Path "$RogueDir\data"             -Force | Out-Null
    New-Item -ItemType Directory -Path "$RogueDir\keys"             -Force | Out-Null
    New-Item -ItemType Directory -Path "$RogueDir\offchain\records" -Force | Out-Null
    Copy-Item "$CoreBinDir\rogue_node.exe"  "$RogueDir\" -Force
    Copy-Item "$CoreRecords\*.txt" "$RogueDir\offchain\records\" -ErrorAction SilentlyContinue
    Write-Host "[SETUP] Done." -ForegroundColor Green
} else {
    # Refresh binary in case it was recompiled
    Copy-Item "$CoreBinDir\rogue_node.exe" "$RogueDir\" -Force
}

# ------------------------------------------------------------------
# Kill any stale process on 8099
# ------------------------------------------------------------------
Get-NetTCPConnection -LocalPort 8099 -ErrorAction SilentlyContinue | ForEach-Object {
    try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
}
Start-Sleep -Milliseconds 300

# ------------------------------------------------------------------
# Write runner script and launch in red window
# ------------------------------------------------------------------
$RunnerPath = "$RogueDir\_rogue_run.ps1"
$RunnerContent = @'
$host.UI.RawUI.WindowTitle = '[ROGUE] Port 8099 - ATTACKER NODE'
$host.UI.RawUI.BackgroundColor = 'Black'
$host.UI.RawUI.ForegroundColor = 'Red'
Clear-Host
Write-Host '##############################################' -ForegroundColor Red
Write-Host '##   !! ROGUE / MALICIOUS NODE !!          ##' -ForegroundColor Red
Write-Host '##   Port 8099  |  NOT Authorized          ##' -ForegroundColor Red
Write-Host '##############################################' -ForegroundColor Red
Write-Host ''
Write-Host 'ATTACK COMMANDS:'                                                                  -ForegroundColor Red
Write-Host '  1 <file>  - DUPLICATE ATTACK  (re-add a record already committed)'              -ForegroundColor Red
Write-Host '  2 <file>  - FAKE SIG ATTACK   (forge a validator identity + signature)'         -ForegroundColor Red
Write-Host '  3 <file>  - TAMPER ATTACK     (modify file contents then try to commit)'        -ForegroundColor Red
Write-Host ''
Write-Host 'Example: 1 record1.txt'                                                           -ForegroundColor DarkRed
Write-Host 'Then WATCH honest node terminals print: [3PC] Validation Failed. Block Rejected.' -ForegroundColor DarkRed
Write-Host ''
'@
$RunnerContent += "`nSet-Location '$RogueDir'`n"
$RunnerContent += ".\rogue_node.exe 8001 8002 8003 8004`n"
$RunnerContent += "Write-Host '' `nWrite-Host 'Rogue session ended.' -ForegroundColor Yellow`n"

Set-Content -Path $RunnerPath -Value $RunnerContent -Encoding UTF8

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $RunnerPath

Write-Host ""
Write-Host "============================================" -ForegroundColor Red
Write-Host "  Rogue node is LIVE on port 8099."          -ForegroundColor Red
Write-Host ""
Write-Host "  TRY THESE ATTACKS:"                        -ForegroundColor Yellow
Write-Host "  1 record1.txt  -> Duplicate Attack"        -ForegroundColor White
Write-Host "  2 record2.txt  -> Forged Signature Attack" -ForegroundColor White
Write-Host "  3 record1.txt  -> Data Tamper Attack"      -ForegroundColor White
Write-Host ""
Write-Host "  Watch honest nodes reject every attempt!"  -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Red
Write-Host ""
