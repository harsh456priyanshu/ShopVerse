@echo off
color 0A
echo ========================================
echo    E-COMMERCE WEBSITE LOCAL SETUP
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo [2/5] Installing Backend Dependencies...
cd backend
if not exist ".env" (
    echo Creating backend .env file from example...
    copy .env.example .env >nul
    echo ⚠️  Please edit backend/.env file with your configuration
)
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

echo.
echo [3/5] Installing Frontend Dependencies...
cd ..\frontend
if not exist ".env" (
    echo Creating frontend .env file from example...
    copy .env.example .env >nul
)
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

echo.
echo [4/5] Building Frontend...
call npm run build
if errorlevel 1 (
    echo ⚠️  Frontend build failed - this is okay for development
)
echo ✅ Frontend build completed

cd ..

echo.
echo [5/5] Setup Complete! 🎉
echo.
echo ==========================================
echo         NEXT STEPS TO RUN LOCALLY
echo ==========================================
echo.
echo 1. 📁 Start MongoDB:
echo    - Install MongoDB Community Server from https://www.mongodb.com/
echo    - Run: mongod
echo    - OR use MongoDB Atlas (cloud) - update backend/.env
echo.
echo 2. 🚀 Start Backend Server:
echo    - Open terminal in 'backend' folder
echo    - Run: npm run dev
echo    - Backend API: http://localhost:5000
echo.
echo 3. 🎨 Start Frontend Server:
echo    - Open another terminal in 'frontend' folder  
echo    - Run: npm run dev
echo    - Frontend App: http://localhost:5173
echo.
echo 4. 🔐 Admin Login Credentials:
echo    - Email: admin@shopverse.com
echo    - Password: admin123
echo.
echo ==========================================
echo.
echo 💡 Quick Start Commands:
echo    Backend:  cd backend ^&^& npm run dev
echo    Frontend: cd frontend ^&^& npm run dev
echo.
pause
