# test-all.ps1 - Run all tests for the project (Windows)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Custom Form Builder - Test Suite" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Backend Tests
Write-Host "Running Backend Tests..." -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

Set-Location backend

# Check if Go is installed
if (-not (Get-Command go -ErrorAction SilentlyContinue)) {
    Write-Host "Go is not installed" -ForegroundColor Red
    exit 1
}

# Run tests with race detection and coverage
$testOutput = & go test -v -race -coverprofile=coverage.out ./... 2>&1
$testExitCode = $LASTEXITCODE

if ($testExitCode -eq 0) {
    Write-Host "✓ Backend tests passed" -ForegroundColor Green
    
    # Show coverage
    Write-Host ""
    Write-Host "Coverage Report:" -ForegroundColor Cyan
    & go tool cover -func=coverage.out | Select-Object -Last 5
    Write-Host ""
} else {
    Write-Host "✗ Backend tests failed" -ForegroundColor Red
    Write-Host $testOutput
    Set-Location ..
    exit 1
}

Set-Location ..

# Frontend Tests Check
Write-Host ""
Write-Host "Frontend Tests Check..." -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

Set-Location frontend

$packageJsonPath = "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    if ($packageJson.devDependencies -and $packageJson.devDependencies.jest) {
        Write-Host "Found Jest configuration" -ForegroundColor Green
        Write-Host "To run frontend tests:" -ForegroundColor Cyan
        Write-Host "  cd frontend && npm test"
        Write-Host ""
    } else {
        Write-Host "Jest not configured for frontend" -ForegroundColor Yellow
        Write-Host "To set up testing:" -ForegroundColor Cyan
        Write-Host "  npm install --save-dev jest @testing-library/react"
        Write-Host ""
    }
} else {
    Write-Host "package.json not found" -ForegroundColor Yellow
}

Set-Location ..

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Test Summary" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "✓ Backend: All tests passed with race detection" -ForegroundColor Green
Write-Host "• Frontend: Ready for testing (run: npm test in frontend/)" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed coverage report:" -ForegroundColor Cyan
Write-Host "  cd backend && go tool cover -html=coverage.out" -ForegroundColor White
Write-Host ""

# Generate coverage report if possible
$htmlPath = "backend\coverage.html"
if (Test-Path "backend\coverage.out") {
    Write-Host "Generating HTML coverage report..." -ForegroundColor Yellow
    Set-Location backend
    & go tool cover -html=coverage.out -o "..\coverage.html"
    Set-Location ..
    Write-Host "Coverage report: $htmlPath" -ForegroundColor Green
}
