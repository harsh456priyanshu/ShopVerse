# 🏠 LOCAL SETUP GUIDE

This guide will help you set up and run the E-commerce Website locally on your computer.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your computer:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB** (Choose one option):
   - **Option A**: Local MongoDB Community Server
     - Download from: https://www.mongodb.com/download-center/community
     - Follow installation instructions for your OS
   - **Option B**: MongoDB Atlas (Cloud database)
     - Sign up at: https://www.mongodb.com/atlas
     - Create a free cluster and get connection string

3. **Git** (to clone the repository)
   - Download from: https://git-scm.com/

## 🚀 Quick Setup (Automated)

### For Windows Users:
1. Clone the repository:
   ```bash
   git clone https://github.com/harsh456priyanshu/ShopVerse.git
   cd ShopVerse
   ```

2. Run the setup script:
   ```bash
   setup-local.bat
   ```

### For Mac/Linux Users:
1. Clone the repository:
   ```bash
   git clone https://github.com/harsh456priyanshu/ShopVerse.git
   cd ShopVerse
   ```

2. Run the setup script:
   ```bash
   ./setup-local.sh
   ```

## 🛠️ Manual Setup (Step-by-step)

If you prefer to set up manually or the automated script doesn't work:

### Step 1: Clone the Repository
```bash
git clone https://github.com/harsh456priyanshu/ShopVerse.git
cd ShopVerse
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
```

**Edit `backend/.env` file with your configuration:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce-website
JWT_SECRET=your-very-secure-jwt-secret-key-for-local-development
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install

# Create environment file
cp .env.example .env
```

**The `frontend/.env` file should contain:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Database Setup

**Option A - Local MongoDB:**
1. Start MongoDB service:
   - Windows: Run `mongod` in command prompt
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Option B - MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/atlas
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

## 🏃 Running the Application

You need to run both backend and frontend servers:

### Terminal 1 - Backend Server:
```bash
cd backend
npm run dev
```
✅ Backend will run on: http://localhost:5000

### Terminal 2 - Frontend Server:
```bash
cd frontend
npm run dev
```
✅ Frontend will run on: http://localhost:5173

## 🔐 Admin Access

Once the application is running:

- **Frontend URL**: http://localhost:5173
- **Admin Email**: `admin@shopverse.com`
- **Admin Password**: `admin123`

## 📁 Project Structure

```
ecommerce-website/
├── backend/                # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── .env.example       # Environment template
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── .env.example       # Environment template
│   └── package.json       # Dependencies
├── setup-local.bat        # Windows setup script
├── setup-local.sh         # Mac/Linux setup script
└── LOCAL_SETUP.md         # This file
```

## 🔧 Available Scripts

### Backend Scripts:
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data (if available)

### Frontend Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚨 Troubleshooting

### Common Issues:

1. **Port already in use**
   - Change PORT in `backend/.env` to a different number (e.g., 5001)
   - Update VITE_API_URL in `frontend/.env` accordingly

2. **MongoDB connection error**
   - Ensure MongoDB service is running: `mongod`
   - Check MONGODB_URI in `backend/.env`
   - For Atlas: Whitelist your IP address

3. **CORS errors**
   - Verify FRONTEND_URL in `backend/.env` matches frontend URL
   - Check that both servers are running

4. **Module not found errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

5. **Build errors**
   - Try `npm run build` in frontend directory
   - Check for any TypeScript or linting errors

### Database Issues:
- **MongoDB not starting**: Check if MongoDB service is installed and running
- **Connection timeout**: Verify MongoDB URI and network connection
- **Permission denied**: Run MongoDB with proper permissions

## 🌟 Features to Test

Once set up, test these features:

1. **User Registration/Login**
2. **Product Browsing**
3. **Shopping Cart functionality**
4. **Admin Panel** (login with admin credentials)
5. **Product Management** (admin only)
6. **Order Management**

## 📞 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure both frontend and backend servers are running
4. Check browser console for errors
5. Open an issue on the GitHub repository

## 🎯 Next Steps

After successful setup:
- Explore the codebase
- Add new features
- Customize the design
- Deploy to your own hosting service

---

**Happy Coding! 🚀**
