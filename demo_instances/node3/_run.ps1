$host.UI.RawUI.WindowTitle = '[NODE 3] Port 8003 - Validator'
Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  MEDICAL BLOCKCHAIN VALIDATOR NODE 3'      -ForegroundColor Cyan
Write-Host '  Port  : 8003'                         -ForegroundColor Green
Write-Host '  Peers : 8001 8002 8004'                         -ForegroundColor Gray
Write-Host '============================================' -ForegroundColor Cyan
Write-Host 'Commands: add <file>, status, height, peers, sync, verify, exit' -ForegroundColor Yellow
Write-Host ''
Set-Location 'C:\Users\debar\Documents\GitHub\Final_Project\demo_instances\node3'
.\node_app.exe 8003 8001 8002 8004
Write-Host ''
Write-Host 'Node exited. Press any key to close.' -ForegroundColor Red
$null = $host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
