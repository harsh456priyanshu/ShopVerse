import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  CreditCardIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import useCartStore from '../store/cartStore'
import useOrderStore from '../store/orderStore'
import useAuthStore from '../store/authStore'

function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { cart, getCartTotals, clearCart } = useCartStore()
  const { createOrder, error: orderError, clearError } = useOrderStore()

  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Review, 4: Confirmation
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderData, setOrderData] = useState(null)

  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  })

  // Payment information state
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  // Calculate totals
  const { totalItems, totalPrice } = getCartTotals()
  const tax = totalPrice * 0.1 // 10% tax
  const shipping = totalPrice > 50 ? 0 : 5.99
  const total = totalPrice + tax + shipping

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login')
      return
    }

    // If cart is empty, redirect to cart
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart')
      return
    }

    // Pre-fill shipping info if user has an address saved
    if (user.address) {
      setShippingInfo(prev => ({
        ...prev,
        address: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || '',
        phone: user.phone || ''
      }))
    }
  }, [user, cart, navigate])

  // Clear any order errors when changing steps
  useEffect(() => {
    if (orderError) {
      clearError()
    }
  }, [step, orderError, clearError])

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    setStep(3)
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePlaceOrder = async () => {
    setLoading(true)

    try {
      // Create order data
      const orderData = {
        shippingAddress: {
          fullName: shippingInfo.fullName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          phone: shippingInfo.phone
        },
        paymentMethod: paymentInfo.method,
        itemsPrice: totalPrice,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      }

      // Create order
      const createdOrder = await createOrder(orderData)

      if (createdOrder) {
        setOrderData(createdOrder)
        // Process payment
        await processPayment(createdOrder._id)
      } else {
        toast.error('Failed to create order. Please try again.')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const processPayment = async (orderId) => {
    setPaymentProcessing(true)

    try {
      // Get auth token
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Authentication required')

      // Create payment details object
      const paymentDetails = {
        cardNumber: paymentInfo.cardNumber.replace(/\s/g, '').slice(-4), // Only send last 4 digits for mock payment
        cardName: paymentInfo.cardName
      }

      // Call payment API
      const response = await fetch('http://localhost:5000/api/payment/process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: paymentInfo.method,
          paymentDetails
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Payment successful
        setOrderComplete(true)
        setStep(4)
        
        // Clear the cart
        await clearCart()
        
        toast.success('Payment successful! Your order has been placed.')
      } else {
        // Payment failed
        toast.error(data.message || 'Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment processing error. Please try again.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  // Helper to mask credit card number
  const maskCreditCard = (cardNumber) => {
    const visibleDigits = cardNumber.slice(-4)
    return `•••• •••• •••• ${visibleDigits}`
  }

  // Render based on current step
  const renderStep = () => {
    switch (step) {
      case 1: // Shipping
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Cart
                </button>
                
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  Continue to Payment
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </form>
          </div>
        )
      
      case 2: // Payment
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="credit_card"
                    name="method"
                    type="radio"
                    value="credit_card"
                    checked={paymentInfo.method === 'credit_card'}
                    onChange={handlePaymentChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="credit_card" className="ml-3 flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700">Credit or Debit Card</span>
                  </label>
                </div>
                
                {paymentInfo.method === 'credit_card' && (
                  <div className="ml-7 space-y-4 border-l-2 border-gray-100 pl-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Add more payment options if needed */}
                <div className="flex items-center mt-2">
                  <input
                    id="paypal"
                    name="method"
                    type="radio"
                    value="paypal"
                    checked={paymentInfo.method === 'paypal'}
                    onChange={handlePaymentChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="paypal" className="ml-3 text-gray-700">PayPal</label>
                </div>
                
                <div className="flex items-center mt-2">
                  <input
                    id="cod"
                    name="method"
                    type="radio"
                    value="cod"
                    checked={paymentInfo.method === 'cod'}
                    onChange={handlePaymentChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="cod" className="ml-3 text-gray-700">Cash on Delivery</label>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Shipping
                </button>
                
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  Review Order
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </form>
          </div>
        )
      
      case 3: // Review
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Review Your Order</h2>
            
            <div className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                  <TruckIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Shipping Information
                </h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">{shippingInfo.fullName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                  <p className="mt-1">Phone: {shippingInfo.phone}</p>
                </div>
              </div>
              
              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Payment Method
                </h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  {paymentInfo.method === 'credit_card' ? (
                    <div>
                      <p>Credit Card</p>
                      <p>{maskCreditCard(paymentInfo.cardNumber)}</p>
                      <p>Expiry: {paymentInfo.expiryDate}</p>
                    </div>
                  ) : paymentInfo.method === 'paypal' ? (
                    <p>PayPal</p>
                  ) : (
                    <p>Cash on Delivery</p>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Order Items</h3>
                <div className="bg-gray-50 p-3 rounded-md space-y-3 divide-y divide-gray-200">
                  {cart?.items?.map(item => (
                    <div key={item._id} className="flex items-center pt-3 first:pt-0">
                      <img 
                        src={item.product.images?.[0]} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <div className="flex justify-between mt-1">
                          <div className="text-sm text-gray-500">
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
              
              {/* Order Summary */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax (10%)</p>
                    <p>${tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</p>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                    <p>Total</p>
                    <p>${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  disabled={loading}
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Payment
                </button>
                
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="btn-primary flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <CheckCircleIcon className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
              
              {/* Order Error */}
              {orderError && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                  <p>{orderError}</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 4: // Confirmation
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Thank You for Your Order!</h2>
              <p className="mt-2 text-gray-600">
                Your order has been placed successfully. We'll send you a confirmation email shortly.
              </p>
            </div>
            
            {orderData && (
              <div className="mb-6 text-left bg-gray-50 p-4 rounded-md">
                <p className="font-medium">Order Number: <span className="text-blue-600">{orderData.orderNumber || orderData._id}</span></p>
                <p className="mt-2">We'll notify you when your order ships.</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                onClick={() => navigate('/orders')}
                className="btn-primary"
              >
                View Your Orders
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="btn-outline"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  // Render checkout progress bar
  const renderCheckoutProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between">
        <div className="text-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <p className="text-xs mt-1">Shipping</p>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className="text-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <p className="text-xs mt-1">Payment</p>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className="text-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
          <p className="text-xs mt-1">Review</p>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${step >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        </div>
        
        <div className="text-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mx-auto ${step >= 4 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            4
          </div>
          <p className="text-xs mt-1">Complete</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {step === 4 ? 'Order Confirmation' : 'Checkout'}
          </h1>
          
          {step < 4 && renderCheckoutProgress()}
          
          {renderStep()}
          
          {step < 4 && (
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start">
              <ShieldCheckIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Secure Checkout</p>
                <p className="text-xs text-blue-600 mt-1">
                  This is a demo site. No real payments will be processed and no personal information will be stored or shared.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout
