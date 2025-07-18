import { create } from 'zustand'

const API_URL = 'http://localhost:5000/api'

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Create new order
  createOrder: async (orderData) => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ error: 'Please login to place an order' })
      return null
    }

    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create order')
      }

      const data = await response.json()
      set({ currentOrder: data.order, loading: false })
      return data.order
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Error creating order:', error)
      return null
    }
  },

  // Get user's orders
  fetchMyOrders: async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_URL}/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      set({ orders: data.orders, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Error fetching orders:', error)
    }
  },

  // Get single order by ID
  fetchOrderById: async (orderId) => {
    const token = localStorage.getItem('token')
    if (!token) return null

    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch order')
      }

      const data = await response.json()
      set({ currentOrder: data.order, loading: false })
      return data.order
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Error fetching order:', error)
      return null
    }
  },

  // Update order payment status
  updateOrderPayment: async (orderId, paymentData) => {
    const token = localStorage.getItem('token')
    if (!token) return false

    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update payment')
      }

      const data = await response.json()
      set({ currentOrder: data.order, loading: false })
      
      // Update the order in the orders list if it exists
      const { orders } = get()
      const updatedOrders = orders.map(order => 
        order._id === orderId ? data.order : order
      )
      set({ orders: updatedOrders })
      
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Error updating payment:', error)
      return false
    }
  },

  // Get all orders (admin only)
  fetchAllOrders: async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch all orders')
      }

      const data = await response.json()
      set({ orders: data.orders, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Error fetching all orders:', error)
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status, note = '') => {
    const token = localStorage.getItem('token')
    if (!token) return false

    set({ loading: true, error: null })
    
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, note })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update order status')
      }

      const data = await response.json()
      set({ loading: false })
      
      // Update the order in the orders list
      const { orders } = get()
      const updatedOrders = orders.map(order => 
        order._id === orderId ? data.order : order
      )
      set({ orders: updatedOrders })
      
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Error updating order status:', error)
      return false
    }
  },

  // Calculate order totals
  calculateOrderTotals: (cartItems) => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99
    const total = subtotal + tax + shipping
    
    return {
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: total
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current order
  clearCurrentOrder: () => set({ currentOrder: null }),

  // Clear all data (for logout)
  clearOrderData: () => set({ 
    orders: [], 
    currentOrder: null, 
    loading: false, 
    error: null 
  })
}))

export default useOrderStore
