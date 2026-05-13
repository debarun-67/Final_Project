param (
    [Parameter(Mandatory=$true)]
    [int]$NodeIndex
)

$ProjectRoot = Resolve-Path "$PSScriptRoot/.."
$NodeDir = "$ProjectRoot/demo_instances/node$NodeIndex"
$NodePort = 8000 + $NodeIndex
$MaxNodes = 4

if (-not (Test-Path $NodeDir)) {
    Write-Error "Node $NodeIndex directory not found. Please run demo_launcher.ps1 first."
    exit
}

Set-Location $NodeDir

# Build peer list (all other nodes up to MaxNodes)
$Peers = @()
for ($i = 1; $i -le $MaxNodes; $i++) {
    $P = 8000 + $i
    if ($P -ne $NodePort) { $Peers += $P }
}

Write-Host "Restarting Node $NodeIndex on Port $NodePort..." -ForegroundColor Cyan
Write-Host "Connecting to peers: $($Peers -join ' ')" -ForegroundColor Gray

.\node_app.exe $NodePort $($Peers -join " ")
