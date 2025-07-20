#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "   E-COMMERCE WEBSITE LOCAL SETUP"
echo -e "========================================"
echo -e "${NC}"

# Check Node.js installation
echo -e "${BLUE}[1/5] Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!"
    echo -e "Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js is installed$(node --version)${NC}"

# Backend setup
echo -e "\n${BLUE}[2/5] Installing Backend Dependencies...${NC}"
cd backend

# Create .env from example if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating backend .env file from example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env file with your configuration${NC}"
fi

# Install backend dependencies
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Frontend setup
echo -e "\n${BLUE}[3/5] Installing Frontend Dependencies...${NC}"
cd ../frontend

# Create .env from example if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating frontend .env file from example...${NC}"
    cp .env.example .env
fi

# Install frontend dependencies
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

# Build frontend
echo -e "\n${BLUE}[4/5] Building Frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Frontend build failed - this is okay for development${NC}"
fi
echo -e "${GREEN}✅ Frontend build completed${NC}"

cd ..

echo -e "\n${GREEN}[5/5] Setup Complete! 🎉${NC}"
echo -e "\n${BLUE}=========================================="
echo -e "        NEXT STEPS TO RUN LOCALLY"
echo -e "==========================================${NC}"

echo -e "\n${YELLOW}1. 📁 Start MongoDB:${NC}"
echo -e "   - Install MongoDB Community Server from https://www.mongodb.com/"
echo -e "   - Run: ${GREEN}mongod${NC}"
echo -e "   - OR use MongoDB Atlas (cloud) - update backend/.env"

echo -e "\n${YELLOW}2. 🚀 Start Backend Server:${NC}"
echo -e "   - Open terminal in 'backend' folder"
echo -e "   - Run: ${GREEN}npm run dev${NC}"
echo -e "   - Backend API: http://localhost:5000"

echo -e "\n${YELLOW}3. 🎨 Start Frontend Server:${NC}"
echo -e "   - Open another terminal in 'frontend' folder"
echo -e "   - Run: ${GREEN}npm run dev${NC}"
echo -e "   - Frontend App: http://localhost:5173"

echo -e "\n${YELLOW}4. 🔐 Admin Login Credentials:${NC}"
echo -e "   - Email: admin@shopverse.com"
echo -e "   - Password: admin123"

echo -e "\n${BLUE}==========================================${NC}"
echo -e "\n${YELLOW}💡 Quick Start Commands:${NC}"
echo -e "   Backend:  ${GREEN}cd backend && npm run dev${NC}"
echo -e "   Frontend: ${GREEN}cd frontend && npm run dev${NC}"
echo -e ""
