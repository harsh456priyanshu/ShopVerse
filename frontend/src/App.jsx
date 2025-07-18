import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'

// Components
import Navbar from './components/Navbar'
// import DebugEnv from './components/DebugEnv'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Footer from './components/Footer'

// Stores
import useProductStore from './store/productStore'
import useAuthStore from './store/authStore'
import useCartStore from './store/cartStore'

// Create a client
const queryClient = new QueryClient()

function App() {
  const initializeProducts = useProductStore(state => state.initializeProducts)
  const checkAuth = useAuthStore(state => state.checkAuth)
  const { fetchCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Initialize data when app loads
    initializeProducts()
    checkAuth()
  }, [])

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* <DebugEnv /> */}
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  )
}

export default App
