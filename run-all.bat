@echo off
title MediSense Platform Launcher
echo ========================================================
echo   Starting MediSense Healthcare Intelligence Platform
echo ========================================================
echo.
echo 1. Starting Backend API Gateway (Port 5000)...
start "MediSense Backend (Port 5000)" cmd /k "cd /d "%~dp0server" && npm start"

echo 2. Starting AI Microservice (Port 8000)...
start "MediSense AI Service (Port 8000)" cmd /k "cd /d "%~dp0ai-service" && python -m uvicorn main:app --port 8000"

echo 3. Starting Frontend Web Client (Port 5173)...
start "MediSense Frontend (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================================
echo   All 3 MediSense services are running!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:5000
echo   AI Docs  : http://localhost:8000/docs
echo ========================================================
echo.
timeout /t 5 >nul
start http://localhost:5173
