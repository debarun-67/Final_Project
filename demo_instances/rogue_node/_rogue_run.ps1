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
Set-Location 'C:\Users\debar\Documents\GitHub\Final_Project\demo_instances\rogue_node'
.\rogue_node.exe 8001 8002 8003 8004
Write-Host '' 
Write-Host 'Rogue session ended.' -ForegroundColor Yellow

