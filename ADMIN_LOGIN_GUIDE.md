# Admin Login Guide

## Admin Credentials

The admin user has been successfully created with the following credentials:

### 🔐 **Login Details:**
- **Email:** `admin@shopverse.com`
- **Password:** `admin123`
- **Role:** Admin

## How to Login as Admin

### Method 1: Direct Admin Login Page
1. **Visit the Admin Login Page:** 
   - Go to: http://localhost:5174/adminlogin
   - OR click on the admin login link if available in the navbar

2. **Enter Credentials:**
   - **Email:** admin@shopverse.com
   - **Password:** admin123

3. **Click "Access Admin Panel"**

### Method 2: Regular Login (if needed)
1. Go to: http://localhost:5174/login
2. Use the same credentials:
   - **Email:** admin@shopverse.com
   - **Password:** admin123

## Admin Dashboard Features

Once logged in, you'll be redirected to `/admin` where you can:

### 📊 **Dashboard Overview:**
- View inventory statistics (Total Products, In Stock, Low Stock, Out of Stock)
- See inventory status charts (Pie chart and Bar chart)
- Monitor product categories

### 🛍️ **Product Management:**
- **View All Products:** See complete product inventory in table format
- **Add New Products:** Create new products with details like name, description, price, category, brand, stock count, and images
- **Edit Products:** Update existing product information
- **Delete Products:** Remove products from inventory
- **Manage Inventory:** Adjust stock levels and inventory settings

### 📦 **Order Management:**
- View all customer orders
- Update order status (pending, processing, shipped, delivered, cancelled)
- Monitor order details and customer information

### 👥 **User Management:**
- View all registered users
- See user roles (Admin/Customer)
- Monitor user information

## Admin Panel Navigation

The admin dashboard has three main tabs:
1. **Products** - Product inventory management
2. **Orders** - Order processing and management  
3. **Users** - User account management

## Quick Actions Available:
- ➕ **Add Product** - Quick access to add new products
- 🚚 **Manage Orders** - Jump to order management
- 👥 **View Users** - Access user management

## Security Features:
- ✅ Role-based access control
- ✅ Admin-only routes protection
- ✅ Automatic redirect after login
- ✅ Session management

## Current Status:
- ✅ Admin user created successfully
- ✅ Backend server running (port 5000)
- ✅ Frontend server running (port 5174)
- ✅ Database populated with sample products
- ✅ Admin authentication working

## Demo Data Available:
- 10 sample products across different categories
- Featured products are marked in the database
- Product images from Unsplash
- Various stock levels for testing inventory management

## Troubleshooting:
If you encounter any issues:
1. Ensure both backend (port 5000) and frontend (port 5174) servers are running
2. Check that the database is connected and seeded
3. Clear browser cache if needed
4. Verify the admin user exists in the database

## Next Steps:
1. Login with the provided credentials
2. Explore the admin dashboard
3. Test product management features
4. Review order management (when orders are available)
5. Customize the admin interface as needed

The admin system is now fully functional and ready for use!
