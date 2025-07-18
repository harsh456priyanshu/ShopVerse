const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token')
}

// API headers with auth token
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
})

// API headers for form data (file uploads)
const getFormDataHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`
})

// Products API
export const productsAPI = {
  // Get all products
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`)
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  // Get single product
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  },

  // Create new product
  create: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json()
  },

  // Update product
  update: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })
    if (!response.ok) throw new Error('Failed to update product')
    return response.json()
  },

  // Delete product
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete product')
    return response.json()
  },

  // Upload product image
  uploadImage: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/products/upload`, {
      method: 'POST',
      headers: getFormDataHeaders(),
      body: formData
    })
    if (!response.ok) throw new Error('Failed to upload image')
    return response.json()
  }
}

// Orders API
export const ordersAPI = {
  // Get all orders (admin only)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch orders')
    const data = await response.json()
    return data.success ? data.orders : []
  },

  // Get single order
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch order')
    return response.json()
  },

  // Update order status
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    })
    if (!response.ok) throw new Error('Failed to update order status')
    return response.json()
  },

  // Delete order
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete order')
    return response.json()
  }
}

// Users API
export const usersAPI = {
  // Get all users (admin only)
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  },

  // Get single user
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  },

  // Update user
  update: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Failed to update user')
    return response.json()
  },

  // Delete user
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete user')
    return response.json()
  }
}

// Stats API
export const statsAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch stats')
    return response.json()
  }
}
