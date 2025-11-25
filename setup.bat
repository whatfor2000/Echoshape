@echo off
title Echoishape Launcher - Cornosoft

echo -----------------------------------------
echo   Starting Echoishape Multi-Service Stack
echo -----------------------------------------
echo.

REM === 1. Start AI Service (Python) ===
echo [AI SERVICE] Launching Python server...

start "AI Service" cmd /k "cd AIservice && (IF NOT EXIST venv (echo No virtual environment found. Creating venv... && python -m venv venv) ELSE (echo Virtual environment found. Activating...)) && call venv\Scripts\activate && python -m pip install --upgrade pip && python -m pip install -r requirements.txt && python app.py"

timeout /t 2 >nul

REM === 2. Start Backend (NestJS) ===
echo [BACKEND] Launching NestJS server...
start "Backend" cmd /k "cd backend && npm i && npm run start:dev"
timeout /t 2 >nul

REM === 3. Start Frontend (Next.js) ===
echo [FRONTEND] Launching Next.js app...
start "Frontend" cmd /k "cd frontend && npm i && npm run dev"
timeout /t 2 >nul

echo -----------------------------------------
echo   All Echoishape services are running.
echo   - AI Service
echo   - Backend (NestJS)
echo   - Frontend (Next.js)
echo -----------------------------------------
pause
