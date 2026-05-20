$host.UI.RawUI.WindowTitle = '[NODE 4] Port 8004 - Validator'
Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  MEDICAL BLOCKCHAIN VALIDATOR NODE 4'      -ForegroundColor Cyan
Write-Host '  Port  : 8004'                         -ForegroundColor Green
Write-Host '  Peers : 8001 8002 8003'                         -ForegroundColor Gray
Write-Host '============================================' -ForegroundColor Cyan
Write-Host 'Commands: add <file>, status, height, peers, sync, verify, exit' -ForegroundColor Yellow
Write-Host ''
Set-Location 'C:\Users\debar\Documents\GitHub\Final_Project\demo_instances\node4'
.\node_app.exe 8004 8001 8002 8003
Write-Host ''
Write-Host 'Node exited. Press any key to close.' -ForegroundColor Red
$null = $host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
