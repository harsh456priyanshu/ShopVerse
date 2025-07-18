import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShoppingCartIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

function Cart() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    cart, 
    loading, 
    error, 
    fetchCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotals
  } = useCartStore()

  const [isUpdating, setIsUpdating] = useState({})

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user, fetchCart])

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    setIsUpdating(prev => ({ ...prev, [itemId]: true }))
    await updateQuantity(itemId, newQuantity)
    setIsUpdating(prev => ({ ...prev, [itemId]: false }))
  }

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setIsUpdating(prev => ({ ...prev, [itemId]: true }))
      await removeFromCart(itemId)
      setIsUpdating(prev => ({ ...prev, [itemId]: false }))
      toast.success('Item removed from cart')
    }
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
      toast.success('Cart cleared')
    }
  }

  const calculateTax = (subtotal) => {
    return subtotal * 0.1 // 10% tax
  }

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 5.99
  }

  if (!user) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your cart</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p>Error: {error}</p>
          </div>
          <button 
            onClick={() => fetchCart()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0
  const { totalItems, totalPrice } = getCartTotals()
  const tax = calculateTax(totalPrice)
  const shipping = calculateShipping(totalPrice)
  const finalTotal = totalPrice + tax + shipping

  if (isEmpty) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some items to get started</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || '/placeholder.jpg'}
                          alt={item.product.name}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product.brand}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {item.selectedColor && (
                            <span>Color: {item.selectedColor}</span>
                          )}
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating[item._id]}
                          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {isUpdating[item._id] ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.countInStock || isUpdating[item._id]}
                          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={isUpdating[item._id]}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {totalPrice > 50 && (
                    <div className="text-sm text-green-600">
                      🎉 You qualify for free shipping!
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/checkout')}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </motion.button>
                  
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full btn-outline"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
