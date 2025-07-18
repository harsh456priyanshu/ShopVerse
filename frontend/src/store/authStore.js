import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:5000/api'

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
        email,
        password
      })
      
      const { user, token } = response.data
      
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
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  },

  // Register function
  register: async (name, email, password) => {
    set({ isLoading: true })
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      })
      
      const { user, token } = response.data
      
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
      const message = error.response?.data?.message || 'Registration failed'
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
