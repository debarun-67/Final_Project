# =============================================================
#  Medical Blockchain - Full Demo Launcher
#  Launches all 4 honest validator nodes from demo_instances/
#  Run scripts\rogue_launcher.ps1 separately for attacker demo
# =============================================================

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$NodeCount   = 4
$BaseDir     = "$ProjectRoot\demo_instances"
$CoreBinDir  = "$ProjectRoot\backend\core\bin"
$CoreKeys    = "$ProjectRoot\backend\core\keys"
$CoreRecords = "$ProjectRoot\backend\core\offchain\records"

Write-Host ""
Write-Host "============================================"  -ForegroundColor Cyan
Write-Host "   MEDICAL BLOCKCHAIN DEMO LAUNCHER"          -ForegroundColor Cyan
Write-Host "   Nodes: $NodeCount  |  Ports: 8001-800$NodeCount"  -ForegroundColor Cyan
Write-Host "============================================"  -ForegroundColor Cyan
Write-Host ""

# ------------------------------------------------------------------
# STEP 1: Kill stale processes on ports 8001-8010 and 8099
# ------------------------------------------------------------------
Write-Host "[1/4] Cleaning stale processes on ports 8001-8010 & 8099..." -ForegroundColor Magenta
foreach ($p in @(8001,8002,8003,8004,8005,8006,8007,8008,8009,8010,8099)) {
    Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue | ForEach-Object {
        try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
}
Start-Sleep -Milliseconds 500

# ------------------------------------------------------------------
# STEP 2: Wipe and recreate node directories
# ------------------------------------------------------------------
Write-Host "[2/4] Resetting node directories..." -ForegroundColor Magenta

for ($i = 1; $i -le $NodeCount; $i++) {
    $dir = "$BaseDir\node$i"
    if (Test-Path $dir) { Remove-Item -Recurse -Force $dir }
}

$RogueDir = "$BaseDir\rogue_node"
if (Test-Path $RogueDir) { Remove-Item -Recurse -Force $RogueDir }

# Check binary exists before going further
if (-not (Test-Path "$CoreBinDir\node_app.exe")) {
    Write-Host "[ERROR] node_app.exe not found. Run 'mingw32-make all' in backend\core first." -ForegroundColor Red
    exit 1
}

for ($i = 1; $i -le $NodeCount; $i++) {
    $NodePort = 8000 + $i
    $NodeDir  = "$BaseDir\node$i"
    Write-Host "   Preparing Node $i (Port $NodePort)..." -ForegroundColor Gray

    New-Item -ItemType Directory -Path "$NodeDir\data"             -Force | Out-Null
    New-Item -ItemType Directory -Path "$NodeDir\keys"             -Force | Out-Null
    New-Item -ItemType Directory -Path "$NodeDir\offchain\records" -Force | Out-Null

    Copy-Item "$CoreBinDir\node_app.exe" "$NodeDir\" -Force
    if (Test-Path "$CoreBinDir\viewer.exe") {
        Copy-Item "$CoreBinDir\viewer.exe" "$NodeDir\" -Force
    }
    Copy-Item "$CoreKeys\*"    "$NodeDir\keys\"             -ErrorAction SilentlyContinue
    Copy-Item "$CoreRecords\*" "$NodeDir\offchain\records\" -ErrorAction SilentlyContinue
}

# Rogue node dir (no keys - it is not an authorized validator)
Write-Host "   Preparing Rogue Node (Port 8099)..." -ForegroundColor Gray
New-Item -ItemType Directory -Path "$RogueDir\data"             -Force | Out-Null
New-Item -ItemType Directory -Path "$RogueDir\keys"             -Force | Out-Null
New-Item -ItemType Directory -Path "$RogueDir\offchain\records" -Force | Out-Null
if (Test-Path "$CoreBinDir\rogue_node.exe") {
    Copy-Item "$CoreBinDir\rogue_node.exe" "$RogueDir\" -Force
}
Copy-Item "$CoreRecords\*.txt" "$RogueDir\offchain\records\" -ErrorAction SilentlyContinue

Write-Host "[3/4] All environments ready." -ForegroundColor Green

# ------------------------------------------------------------------
# STEP 3: Write per-node runner scripts and launch each in its own window
# ------------------------------------------------------------------
Write-Host "[4/4] Launching validator nodes..." -ForegroundColor Magenta
Write-Host ""

for ($i = 1; $i -le $NodeCount; $i++) {
    $NodePort = 8000 + $i
    $NodeDir  = "$BaseDir\node$i"

    $PeerPorts = @()
    for ($j = 1; $j -le $NodeCount; $j++) {
        $P = 8000 + $j
        if ($P -ne $NodePort) { $PeerPorts += $P }
    }
    $PeerArgs = $PeerPorts -join " "

    # Write a tiny runner script inside the node dir
    $RunnerPath = "$NodeDir\_run.ps1"
    $RunnerContent = @"
`$host.UI.RawUI.WindowTitle = '[NODE $i] Port $NodePort - Validator'
Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  MEDICAL BLOCKCHAIN VALIDATOR NODE $i'      -ForegroundColor Cyan
Write-Host '  Port  : $NodePort'                         -ForegroundColor Green
Write-Host '  Peers : $PeerArgs'                         -ForegroundColor Gray
Write-Host '============================================' -ForegroundColor Cyan
Write-Host 'Commands: add <file>, status, height, peers, sync, verify, exit' -ForegroundColor Yellow
Write-Host ''
Set-Location '$NodeDir'
.\node_app.exe $NodePort $PeerArgs
Write-Host ''
Write-Host 'Node exited. Press any key to close.' -ForegroundColor Red
`$null = `$host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
"@
    Set-Content -Path $RunnerPath -Value $RunnerContent -Encoding UTF8

    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $RunnerPath
    Write-Host "   Node $i launched (Port $NodePort)." -ForegroundColor Green
    Start-Sleep -Milliseconds 400
}

# ------------------------------------------------------------------
# DONE
# ------------------------------------------------------------------
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  All $NodeCount validator nodes are LIVE!" -ForegroundColor Green
Write-Host ""
Write-Host "  HOW TO USE:"                                              -ForegroundColor Yellow
Write-Host "  In any node terminal type: add record1.txt"              -ForegroundColor White
Write-Host "  Watch 3-Phase Commit consensus across ALL windows."      -ForegroundColor White
Write-Host ""
Write-Host "  TO LAUNCH MALICIOUS ATTACKER NODE:"                      -ForegroundColor Red
Write-Host "  Run: .\scripts\rogue_launcher.ps1"                       -ForegroundColor White
Write-Host "============================================"               -ForegroundColor Green
Write-Host ""
