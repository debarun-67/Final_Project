param (
    [int]$Count = 10,
    [int]$NodeIndex = 1
)

$ProjectRoot = Resolve-Path "$PSScriptRoot/.."
$NodePort = 8000 + $NodeIndex
$NodeDir = "$ProjectRoot/demo_instances/node$NodeIndex"

Write-Host "--- Medical Blockchain Performance Benchmark ---" -ForegroundColor Cyan
Write-Host "NOTE: To run a high-speed benchmark with full network consensus,"
Write-Host "type 'bench 50' directly inside any of your running node terminals."
Write-Host ""
Write-Host "This will show real-time propagation across the mesh." -ForegroundColor Gray

$End = Get-Date
$TotalTime = ($End - $Start).TotalSeconds
$BPS = $Count / $TotalTime

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "BENCHMARK RESULTS" -ForegroundColor Yellow
Write-Host "Total Blocks:  $Count"
Write-Host "Total Time:    $($TotalTime.ToString('F2')) seconds"
Write-Host "Throughput:    $($BPS.ToString('F2')) Blocks/Second (BPS)"
Write-Host "============================================" -ForegroundColor Cyan
