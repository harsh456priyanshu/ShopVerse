# E-Commerce Website

A modern, full-stack e-commerce website built with React (Vite), Node.js, Express, MongoDB, and Tailwind CSS. This project features a responsive design optimized for PC, tablet, and mobile devices with all essential e-commerce functionality.

Deployement Status :- Pending (Not deployed due to some issue )

## 🚀 Features

### Frontend Features
- **Responsive Design**: Optimized for all devices (PC, tablet, mobile)
- **Modern UI/UX**: Clean, intuitive design with smooth animations
- **Product Catalog**: Browse products with filtering and search functionality
- **Shopping Cart**: Add, remove, and update cart items
- **User Authentication**: Login, register, and profile management
- **Order Management**: Place orders and track order status
- **Wishlist**: Save favorite products
- **Product Reviews**: Rate and review products
- **Search & Filter**: Advanced product search and filtering options

### Backend Features
- **RESTful API**: Well-structured API endpoints
- **User Management**: Authentication and authorization
- **Product Management**: CRUD operations for products
- **Order Processing**: Complete order management system
- **Cart Management**: Persistent shopping cart
- **Security**: JWT authentication and password hashing
- **Database**: MongoDB with Mongoose ODM

### Admin Features
- **Admin Dashboard**: Manage products, orders, and users
- **Product Management**: Add, edit, delete products
- **Order Management**: Update order status and tracking
- **User Management**: View and manage user accounts
- **Analytics**: Basic sales and user analytics

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.0
- Vite (Build tool)
- Tailwind CSS (Styling - configured with Vite)
- React Router DOM (Navigation)
- Axios (API calls)
- Zustand (State management)
- React Query (Data fetching)
- React Hot Toast (Notifications)
- Heroicons (Icons)
- Headless UI (Accessible components)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (Authentication)
- bcryptjs (Password hashing)
- CORS (Cross-origin requests)
- Multer (File uploads)
- Express Validator (Input validation)

## 📁 Project Structure

```
ecommerce-website/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── index.css       # Tailwind CSS
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # File uploads
│   ├── server.js           # Main server file
│   └── package.json
└── README.md
```

## 🚀 Quick Start (Local Setup)

**🎯 Want to run this project locally? We've made it super easy!**

### 🚀 Automated Setup

**Windows Users:**
```bash
git clone https://github.com/harsh456priyanshu/ShopVerse.git
cd ShopVerse
setup-local.bat
```

**Mac/Linux Users:**
```bash
git clone https://github.com/harsh456priyanshu/ShopVerse.git
cd ShopVerse
./setup-local.sh
```

### 📖 Detailed Setup Guide

For step-by-step instructions, troubleshooting, and more details:
**👉 [Read the Complete LOCAL_SETUP.md Guide](LOCAL_SETUP.md)**

### ⚡ Quick Manual Setup

1. **Prerequisites**: Node.js, MongoDB, Git
2. **Clone & Install**:
   ```bash
   git clone https://github.com/harsh456priyanshu/ShopVerse.git
   cd ShopVerse
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Setup Environment**: Copy `.env.example` to `.env` in both folders
4. **Run**:
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`
5. **Access**: http://localhost:5173

### 🔐 Default Admin Credentials
- **Email**: admin@shopverse.com
- **Password**: admin123

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

## 🎨 Design Features

- **Modern UI**: Clean, professional design
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Skeleton loading and spinners
- **Toast Notifications**: Success and error messages
- **Mobile-First**: Responsive design approach
- **Accessibility**: ARIA labels and keyboard navigation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Express validator for API input validation
- **CORS**: Cross-origin resource sharing configuration
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred database
2. Update environment variables
3. Deploy to Heroku, Vercel, or your preferred platform

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred platform

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🐛 Known Issues

- File upload functionality needs to be implemented
- Payment integration needs to be added
- Email verification system needs to be implemented

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Note**: This is a college project demonstrating modern web development practices and e-commerce functionality. For production use, additional security measures, testing, and optimization would be required.
