# MediSense 1-Click PowerShell Runner
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Starting MediSense Healthcare Intelligence Platform  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "1. Starting Backend API Gateway (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\server'; Write-Host 'MediSense Backend' -ForegroundColor Green; npm start"

Write-Host "2. Starting AI Microservice (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\ai-service'; Write-Host 'MediSense AI Microservice' -ForegroundColor Green; python -m uvicorn main:app --port 8000"

Write-Host "3. Starting Frontend Web Client (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\client'; Write-Host 'MediSense Frontend' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "All services started! Opening http://localhost:5173 in 3 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
