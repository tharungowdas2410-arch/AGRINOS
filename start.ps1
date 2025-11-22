# Plant Disease Spotter - Startup Script
Write-Host "🌿 Plant Disease Spotter - Starting Services..." -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if .env exists
Write-Host ""
Write-Host "Checking environment files..." -ForegroundColor Yellow
$backendEnv = "backend\.env"
if (-not (Test-Path $backendEnv)) {
    Write-Host "⚠ .env file not found in backend/" -ForegroundColor Yellow
    Write-Host "  Copying from env.example..." -ForegroundColor Yellow
    Copy-Item "backend\env.example" $backendEnv
    Write-Host "✓ Created backend\.env - PLEASE EDIT IT WITH YOUR API KEYS!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Required: GEMINI_API_KEY (for cure descriptions)" -ForegroundColor Cyan
    Write-Host "  Optional: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (for OAuth)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue after editing .env file..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Check for model files
Write-Host ""
Write-Host "Checking model files..." -ForegroundColor Yellow
$modelPath = "backend\models\plant_disease_model.keras"
if (Test-Path $modelPath) {
    Write-Host "✓ Model file found" -ForegroundColor Green
} else {
    Write-Host "⚠ Model file not found - using fallback predictions" -ForegroundColor Yellow
    Write-Host "  Place your model at: backend\models\plant_disease_model.keras" -ForegroundColor Cyan
}

# Start services
Write-Host ""
Write-Host "Starting Docker services..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes on first run..." -ForegroundColor Cyan
Write-Host ""

Set-Location backend
docker-compose up --build

