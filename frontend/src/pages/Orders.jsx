import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
  EyeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import useOrderStore from '../store/orderStore'
import useAuthStore from '../store/authStore'

function Orders() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { orders, loading, error, fetchMyOrders } = useOrderStore()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchMyOrders()
  }, [user, navigate, fetchMyOrders])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status indicator based on order status
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            Delivered
          </span>
        )
      case 'shipped':
        return (
          <span className="flex items-center text-blue-600">
            <TruckIcon className="h-5 w-5 mr-1" />
            Shipped
          </span>
        )
      case 'processing':
        return (
          <span className="flex items-center text-yellow-600">
            <ClockIcon className="h-5 w-5 mr-1" />
            Processing
          </span>
        )
      case 'cancelled':
        return (
          <span className="flex items-center text-red-600">
            <XCircleIcon className="h-5 w-5 mr-1" />
            Cancelled
          </span>
        )
      default:
        return (
          <span className="flex items-center text-gray-600">
            <ClockIcon className="h-5 w-5 mr-1" />
            Pending
          </span>
        )
    }
  }

  // Order details modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{selectedOrder.orderNumber || selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Placed</p>
                  <p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  {getStatusIndicator(selectedOrder.orderStatus)}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Items</h3>
              <div className="space-y-4">
                {selectedOrder.orderItems.map((item) => (
                  <div key={item._id} className="flex items-start border-b border-gray-100 pb-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-600">
                          <p>Qty: {item.quantity}</p>
                          {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                          {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p>Method: {selectedOrder.paymentInfo.method.replace('_', ' ').toUpperCase()}</p>
                  <p>Status: {selectedOrder.paymentInfo.status.toUpperCase()}</p>
                  {selectedOrder.paymentInfo.transactionId && (
                    <p>Transaction ID: {selectedOrder.paymentInfo.transactionId}</p>
                  )}
                  {selectedOrder.paymentInfo.paidAt && (
                    <p>Paid on: {formatDate(selectedOrder.paymentInfo.paidAt)}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p>${selectedOrder.itemsPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax</p>
                  <p>${selectedOrder.taxPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p>${selectedOrder.shippingPrice.toFixed(2)}</p>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p>Discount</p>
                    <p>-${selectedOrder.discount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg border-t mt-2 pt-2">
                  <p>Total</p>
                  <p>${selectedOrder.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Order Timeline</h3>
                <div className="space-y-3">
                  {selectedOrder.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">{status.status.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{formatDate(status.timestamp)}</p>
                        {status.note && <p className="text-sm mt-1">{status.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowOrderDetails(false)}
                className="btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return null // User will be redirected to login
  }

  if (loading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Order History</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Order History</h1>
        <div className="bg-red-50 p-4 rounded-md text-red-600 max-w-xl mx-auto">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            <p>{error}</p>
          </div>
          <button 
            onClick={() => fetchMyOrders()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto text-center">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to place your first order!</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {orders.map((order) => (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">ORDER PLACED</p>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                      
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">TOTAL</p>
                        <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                      </div>
                      
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">ORDER #</p>
                        <p className="font-medium">{order.orderNumber || order._id.slice(-8)}</p>
                      </div>
                      
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-600">STATUS</p>
                        {getStatusIndicator(order.orderStatus)}
                      </div>
                      
                      <div>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="h-5 w-5 mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">{order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {order.orderItems.slice(0, 3).map((item) => (
                          <img 
                            key={item._id} 
                            src={item.image} 
                            alt={item.name} 
                            className="h-16 w-16 object-cover rounded-md border border-gray-200"
                          />
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-600">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {showOrderDetails && <OrderDetailsModal />}
    </div>
  )
}

export default Orders

