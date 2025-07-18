@echo off
echo Setting up E-commerce Website...
echo.

echo Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo Configuration:
echo - Frontend: React + Vite + Tailwind CSS v4
echo - Backend: Node.js + Express + MongoDB
echo - Database: MongoDB
echo.
echo To start the application:
echo 1. Start MongoDB (mongod)
echo 2. Backend: cd backend && npm run dev
echo 3. Frontend: cd frontend && npm run dev
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:5000
echo.
pause
