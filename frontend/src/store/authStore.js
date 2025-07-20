import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Set default axios config
axios.defaults.timeout = 10000
axios.defaults.headers.common['Content-Type'] = 'application/json'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  // Login function
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.trim().toLowerCase(),
        password
      })
      
      const { user, token } = response.data
      
      if (!user || !token) {
        throw new Error('Invalid response from server')
      }
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      set({ isLoading: false })
      
      let message = 'Login failed'
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        message = 'Cannot connect to server. Please make sure the backend is running.'
      } else if (error.message) {
        message = error.message
      }
      
      toast.error(message)
      return { success: false, message }
    }
  },
  // Register function
  register: async (name, email, password) => {
    set({ isLoading: true })
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      })
      
      const { user, token } = response.data
      
      if (!user || !token) {
        throw new Error('Invalid response from server')
      }
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      })
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      set({ isLoading: false })
      
      let message = 'Registration failed'
      if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        message = 'Cannot connect to server. Please make sure the backend is running.'
      } else if (error.message) {
        message = error.message
      }
      
      toast.error(message)
      return { success: false, message }
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    set({
      user: null,
      token: null,
      isAuthenticated: false
    })
    toast.success('Logged out successfully!')
  },

  // Check if user is authenticated
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const response = await axios.get(`${API_URL}/auth/me`)
      set({
        user: response.data.user,
        isAuthenticated: true
      })
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      set({
        user: null,
        token: null,
        isAuthenticated: false
      })
    }
  }
}))

export default useAuthStore
