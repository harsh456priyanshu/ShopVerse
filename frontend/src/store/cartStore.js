import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = 'http://localhost:5000/api'

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      // Fetch cart from server
      fetchCart: async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`${API_URL}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch cart')
          }

          const data = await response.json()
          set({ cart: data.cart, loading: false })
        } catch (error) {
          set({ error: error.message, loading: false })
          console.error('Error fetching cart:', error)
        }
      },

      // Add item to cart
      addToCart: async (productId, quantity = 1, selectedColor = '', selectedSize = '') => {
        const token = localStorage.getItem('token')
        if (!token) {
          set({ error: 'Please login to add items to cart' })
          return false
        }

        // Fetch cart first if not already loaded
        const { cart } = get()
        if (!cart) {
          await get().fetchCart()
        }

        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              productId,
              quantity,
              selectedColor,
              selectedSize
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to add item to cart')
          }

          const data = await response.json()
          set({ cart: data.cart, loading: false })
          return true
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to add item to cart'
          set({ error: errorMessage, loading: false })
          console.error('Error adding to cart:', error)
          return false
        }
      },

      // Update item quantity
      updateQuantity: async (itemId, quantity) => {
        const token = localStorage.getItem('token')
        if (!token) return

        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`${API_URL}/cart/update`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId, quantity })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to update cart')
          }

          const data = await response.json()
          set({ cart: data.cart, loading: false })
        } catch (error) {
          set({ error: error.message, loading: false })
          console.error('Error updating cart:', error)
        }
      },

      // Remove item from cart
      removeFromCart: async (itemId) => {
        const token = localStorage.getItem('token')
        if (!token) return

        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to remove item')
          }

          const data = await response.json()
          set({ cart: data.cart, loading: false })
        } catch (error) {
          set({ error: error.message, loading: false })
          console.error('Error removing from cart:', error)
        }
      },

      // Clear cart
      clearCart: async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        set({ loading: true, error: null })
        
        try {
          const response = await fetch(`${API_URL}/cart/clear`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to clear cart')
          }

          const data = await response.json()
          set({ cart: data.cart, loading: false })
        } catch (error) {
          set({ error: error.message, loading: false })
          console.error('Error clearing cart:', error)
        }
      },

      // Get cart totals
      getCartTotals: () => {
        const { cart } = get()
        if (!cart || !cart.items) return { totalItems: 0, totalPrice: 0 }
        
        return {
          totalItems: cart.totalItems || 0,
          totalPrice: cart.totalPrice || 0
        }
      },

      // Check if item is in cart
      isItemInCart: (productId) => {
        const { cart } = get()
        if (!cart || !cart.items) return false
        
        return cart.items.some(item => 
          item.product._id === productId || item.product === productId
        )
      },

      // Get item quantity in cart
      getItemQuantity: (productId) => {
        const { cart } = get()
        if (!cart || !cart.items) return 0
        
        const item = cart.items.find(item => 
          item.product._id === productId || item.product === productId
        )
        return item ? item.quantity : 0
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Clear cart state (for logout)
      clearCartState: () => set({ cart: null, loading: false, error: null })
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart })
    }
  )
)

export default useCartStore
