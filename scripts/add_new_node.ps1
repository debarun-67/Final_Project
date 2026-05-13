param (
    [Parameter(Mandatory=$true)]
    [int]$NodeIndex
)

$ProjectRoot = Resolve-Path "$PSScriptRoot/.."
$BaseDir = "$ProjectRoot/demo_instances"
$CoreBinDir = "$ProjectRoot/backend/core/bin"
$NodeDir = "$BaseDir/node$NodeIndex"
$NodePort = 8000 + $NodeIndex

Write-Host "--- Dynamically Adding Node $NodeIndex (Port $NodePort) ---" -ForegroundColor Cyan

# 1. Setup Environment
if (Test-Path $NodeDir) {
    Write-Warning "Node $NodeIndex already exists. Use run_node.ps1 to just restart it."
    exit
}

New-Item -ItemType Directory -Path $NodeDir | Out-Null
New-Item -ItemType Directory -Path "$NodeDir/keys" | Out-Null
New-Item -ItemType Directory -Path "$NodeDir/data" | Out-Null
New-Item -ItemType Directory -Path "$NodeDir/offchain/records" -Force | Out-Null

# 2. Copy Assets
Copy-Item "$CoreBinDir/node_app.exe" "$NodeDir/"
Copy-Item "$ProjectRoot/backend/core/keys/$NodePort`_*" "$NodeDir/keys/"
Copy-Item "$ProjectRoot/backend/core/offchain/records/*" "$NodeDir/offchain/records/"

# 3. Build Peer List from existing demo_instances
$ExistingNodes = Get-ChildItem $BaseDir -Directory | Where-Object { $_.Name -like "node*" }
$Peers = @()
foreach ($Node in $ExistingNodes) {
    $Idx = $Node.Name.Replace("node", "")
    $P = 8000 + [int]$Idx
    if ($P -ne $NodePort) { $Peers += $P }
}

# 4. Launch
Start-Process powershell -ArgumentList "-NoExit", "-Command", "
    `$host.UI.RawUI.WindowTitle = 'MedChain NEW Node $NodeIndex :: Port $NodePort';
    Set-Location '$NodeDir';
    Write-Host '============================================' -ForegroundColor Green;
    Write-Host '   NEW DYNAMIC NODE $NodeIndex (PORT $NodePort)' -ForegroundColor Green;
    Write-Host '============================================' -ForegroundColor Green;
    Write-Host 'Connecting to existing mesh: $($Peers -join ' ')' -ForegroundColor Gray;
    .\node_app.exe $NodePort $($Peers -join ' ')
"

Write-Host "Node $NodeIndex launched and joining the network!" -ForegroundColor Green
