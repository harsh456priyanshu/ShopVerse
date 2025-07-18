import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  
  const { login, isLoading, isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin')
    } else if (isAuthenticated && user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.')
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    
    if (result.success) {
      // Check if user is admin after successful login
      const authUser = useAuthStore.getState().user
      if (authUser?.role === 'admin') {
        toast.success('Admin login successful!')
        navigate('/admin')
      } else {
        toast.error('Access denied. Admin privileges required.')
        useAuthStore.getState().logout()
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4"
          >
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-gray-900"
          >
            Admin Access
          </motion.h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your admin credentials
          </p>
        </div>
        
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-6" 
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="Enter admin email"
              />
            </div>
            
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-10"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="loading-spinner h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Access Admin Panel
                </>
              )}
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Not an admin?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                User Login
              </Link>
            </p>
          </div>
        </motion.form>

        {/* Demo Admin Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg border"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Admin Credentials:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><span className="font-medium">Email:</span> admin@shopverse.com</p>
            <p><span className="font-medium">Password:</span> admin123</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
