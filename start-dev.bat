@echo off
echo Starting ecommerce backend server...
cd backend
echo Killing any existing node processes...
taskkill /f /im node.exe >nul 2>&1
echo Starting server...
start "Backend Server" cmd /k "npm start"
echo Backend server started!
echo.
echo You can now start the frontend with: cd frontend && npm run dev
echo.
pause
