@echo off
title TaskFlow AI Dual Server Launcher
echo ========================================================
echo       Starting TaskFlow AI (Frontend + Backend)
echo ========================================================
echo.
echo 1. Launching Backend Server on port 5000...
start "TaskFlow Backend (Port 5000)" cmd /k "cd /d "%~dp0server" && npm run dev"

echo 2. Launching Frontend Server on port 5173...
start "TaskFlow Frontend (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================================
echo  Both servers are starting!
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo ========================================================
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173/login
