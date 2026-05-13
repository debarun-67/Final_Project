# Medical Blockchain Multi-Node Demo Launcher
$ProjectRoot = Resolve-Path "$PSScriptRoot/.."
$NodeCount = 4
$BaseDir = "$ProjectRoot/demo_instances"
$CoreBinDir = "$ProjectRoot/backend/core/bin"

Write-Host "--- Medical Blockchain Multi-Node Setup ---" -ForegroundColor Cyan

# 1. Cleanup and Setup
Write-Host "Performing total blockchain reset for testing..." -ForegroundColor Magenta

# Clear demo instances
if (Test-Path $BaseDir) {
    Remove-Item -Recurse -Force $BaseDir
}
New-Item -ItemType Directory -Path $BaseDir | Out-Null

# Clear central blockchain data (so website doesn't show old data)
$CentralData = "$ProjectRoot/backend/core/data"
if (Test-Path $CentralData) {
    Write-Host "Clearing central ledger at $CentralData..." -ForegroundColor Gray
    Remove-Item -Recurse -Force "$CentralData/*" -ErrorAction SilentlyContinue
}

Write-Host "Cleaning up stale network listeners (8001-8010)..." -ForegroundColor Gray
for ($p = 8001; $p -le 8010; $p++) {
    Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue | ForEach-Object {
        try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
}

# 2. Prepare each node
for ($i = 1; $i -le $NodeCount; $i++) {
    $NodePort = 8000 + $i
    $NodeDir = "$BaseDir/node$i"
    Write-Host "Preparing Node $i environment..."
    New-Item -ItemType Directory -Path $NodeDir | Out-Null
    New-Item -ItemType Directory -Path "$NodeDir/keys" | Out-Null
    New-Item -ItemType Directory -Path "$NodeDir/data" | Out-Null
    New-Item -ItemType Directory -Path "$NodeDir/offchain/records" -Force | Out-Null
    
    # Copy assets
    if (Test-Path "$CoreBinDir/blockchain.exe") {
        Copy-Item "$CoreBinDir/blockchain.exe" "$NodeDir/"
    }
    if (Test-Path "$CoreBinDir/node_app.exe") {
        Copy-Item "$CoreBinDir/node_app.exe" "$NodeDir/"
    }
    Copy-Item "$ProjectRoot/backend/core/keys/*" "$NodeDir/keys/"
    Copy-Item "$ProjectRoot/backend/core/offchain/records/*" "$NodeDir/offchain/records/"
}

Write-Host "Setup complete." -ForegroundColor Green

# 3. Launch Nodes
# blockchain.exe now has its own built-in heartbeat listener on its port.
# No separate background process needed.
for ($i = 1; $i -le $NodeCount; $i++) {
    $NodePort = 8000 + $i
    $NodeDir = "$BaseDir/node$i"
    Write-Host "Launching Node $i (Port $NodePort)..." -ForegroundColor Yellow

    # Prepare peer list (all other ports)
    $PeerPorts = @()
    for ($j = 1; $j -le $NodeCount; $j++) {
        $P = 8000 + $j
        if ($P -ne $NodePort) { $PeerPorts += $P }
    }
    $PeerArgs = $PeerPorts -join " "

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "
        `$host.UI.RawUI.WindowTitle = 'MedChain Node $i :: Port $NodePort';
        Set-Location '$NodeDir';
        Write-Host '============================================' -ForegroundColor Cyan;
        Write-Host '  DISTRIBUTED BLOCKCHAIN NODE $i (PORT $NodePort)' -ForegroundColor Cyan;
        Write-Host '============================================' -ForegroundColor Cyan;
        Write-Host 'Connected to peers: $PeerArgs' -ForegroundColor Gray;
        Write-Host 'Commands: add, status, peers, sync, verify, exit' -ForegroundColor Yellow;
        .\node_app.exe $NodePort $PeerArgs
    "
}

Write-Host ""
Write-Host "All $NodeCount nodes launched!" -ForegroundColor Green
Write-Host "Each terminal is an independent blockchain node." -ForegroundColor Gray
Write-Host "The website dashboard will show them as ONLINE while their terminals are open." -ForegroundColor Gray
