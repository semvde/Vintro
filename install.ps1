Write-Host "VINTRO setup wordt gestart..." -ForegroundColor Green

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

# Backend setup
Write-Host "Backend setup..." -ForegroundColor Cyan
Set-Location $BackendPath

if (!(Test-Path ".env")) {
@"
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync

CACHE_STORE=file

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

HF_TOKEN=
HF_MODEL=Qwen/Qwen3.6-35B-A3B

JWT_SECRET=
JWT_ALGO=HS256

ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
"@ | Out-File -FilePath ".env" -Encoding UTF8

    Write-Host "Backend .env aangemaakt." -ForegroundColor Yellow
    Write-Host "Let op: vul HF_TOKEN, ELEVENLABS_API_KEY of andere API keys zelf aan indien nodig." -ForegroundColor Yellow
}

if (!(Test-Path "database\database.sqlite")) {
    New-Item -ItemType File -Path "database\database.sqlite" | Out-Null
    Write-Host "SQLite database aangemaakt" -ForegroundColor Yellow
}

composer install

php artisan key:generate --force

php artisan jwt:secret --force

php artisan migrate --force

# Frontend setup
Write-Host "Frontend setup..." -ForegroundColor Cyan
Set-Location $FrontendPath

if (!(Test-Path ".env")) {
@"
VITE_BASE_URL=http://localhost:5173
VITE_API_URL=http://localhost:8000/api
"@ | Out-File -FilePath ".env" -Encoding UTF8

    Write-Host "Frontend .env aangemaakt" -ForegroundColor Yellow
}

npm install

Set-Location $RootPath

Write-Host "Installatie klaar." -ForegroundColor Green
Write-Host "Start de applicatie met:" -ForegroundColor Cyan
Write-Host ".\start.ps1" -ForegroundColor Yellow