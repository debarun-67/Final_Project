$host.UI.RawUI.WindowTitle = '[NODE 2] Port 8002 - Validator'
Write-Host '============================================' -ForegroundColor Cyan
Write-Host '  MEDICAL BLOCKCHAIN VALIDATOR NODE 2'      -ForegroundColor Cyan
Write-Host '  Port  : 8002'                         -ForegroundColor Green
Write-Host '  Peers : 8001 8003 8004'                         -ForegroundColor Gray
Write-Host '============================================' -ForegroundColor Cyan
Write-Host 'Commands: add <file>, status, height, peers, sync, verify, exit' -ForegroundColor Yellow
Write-Host ''
Set-Location 'C:\Users\debar\Documents\GitHub\Final_Project\demo_instances\node2'
.\node_app.exe 8002 8001 8003 8004
Write-Host ''
Write-Host 'Node exited. Press any key to close.' -ForegroundColor Red
$null = $host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
