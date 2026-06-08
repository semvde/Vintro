Write-Host "VINTRO wordt gestart..." -ForegroundColor Green

$RootPath = Get-Location
$BackendPath = Join-Path $RootPath "back-end"
$FrontendPath = Join-Path $RootPath "front-end"

if (!(Test-Path $BackendPath)) {
    Write-Host "Map back-end niet gevonden." -ForegroundColor Red
    exit 1
}

if (!(Test-Path $FrontendPath)) {
    Write-Host "Map front-end niet gevonden." -ForegroundColor Red
    exit 1
}

if (Get-Command wt -ErrorAction SilentlyContinue) {
    wt `
    new-tab --title "VINTRO Backend" powershell -NoExit -Command "cd '$BackendPath'; php artisan serve" `
    `; new-tab --title "VINTRO Frontend" powershell -NoExit -Command "cd '$FrontendPath'; npm run dev"
} else {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; php artisan serve"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; npm run dev"
}

Write-Host "Backend en frontend worden gestart." -ForegroundColor Green