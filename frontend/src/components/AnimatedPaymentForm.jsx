import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const AnimatedPaymentForm = ({ onSuccess, onBack }) => {
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format with spaces after every 4 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i += 4) {
      formatted += cleaned.slice(i, i + 4) + ' ';
    }
    
    // Trim the trailing space and limit to 19 chars (16 digits + 3 spaces)
    return formatted.trim().slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Add slash after first 2 digits (MM/YY)
    if (cleaned.length > 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentInfo(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleExpiryDateChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setPaymentInfo(prev => ({ ...prev, expiryDate: formattedValue }));
  };

  const validateForm = () => {
    if (paymentInfo.method === 'credit_card') {
      if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      
      if (!paymentInfo.cardName) {
        setError('Please enter the name on the card');
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      
      if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
        setError('Please enter a valid CVV code');
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      
      // For demo purposes, always succeed
      toast.success('Payment processed successfully!');
      onSuccess(paymentInfo);
    }, 2000);
  };

  // Detect card type based on the first few digits
  const getCardType = () => {
    const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
    
    if (!cardNumber) return null;
    
    if (cardNumber.startsWith('4')) {
      return 'visa';
    } else if (/^5[1-5]/.test(cardNumber)) {
      return 'mastercard';
    } else if (/^3[47]/.test(cardNumber)) {
      return 'amex';
    } else if (/^6(?:011|5)/.test(cardNumber)) {
      return 'discover';
    }
    
    return null;
  };

  // Card animation variants
  const cardVariants = {
    front: {
      rotateY: 0,
      transition: {
        duration: 0.5
      }
    },
    back: {
      rotateY: 180,
      transition: {
        duration: 0.5
      }
    }
  };

  // Form container animation
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  // Form item animations
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const cardType = getCardType();
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-xl font-semibold text-gray-800 mb-6"
        variants={itemVariants}
      >
        <CreditCardIcon className="h-6 w-6 inline-block mr-2 text-primary-600" />
        Payment Details
      </motion.h2>
      
      {/* Credit Card Visualization */}
      <motion.div 
        className="mb-8 relative"
        variants={itemVariants}
      >
        <div className="perspective-1000">
          <motion.div
            className="w-full h-48 rounded-xl relative preserve-3d"
            animate={cardFlipped ? 'back' : 'front'}
            variants={cardVariants}
          >
            {/* Front of card */}
            <div className={`absolute inset-0 backface-hidden rounded-xl shadow-md p-6 bg-gradient-to-r ${
              cardType === 'visa' ? 'from-blue-600 to-blue-800' :
              cardType === 'mastercard' ? 'from-red-600 to-orange-600' :
              cardType === 'amex' ? 'from-blue-400 to-blue-600' :
              cardType === 'discover' ? 'from-orange-400 to-red-500' :
              'from-gray-700 to-gray-900'
            }`}>
              <div className="flex justify-between items-start h-full flex-col">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-white opacity-80 text-lg font-bold">
                      {cardType ? cardType.toUpperCase() : 'CREDIT CARD'}
                    </div>
                    <div>
                      <svg className="h-10 w-10 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z" />
                        <path d="M7 15h2v2H7z" />
                        <path d="M11 15h6v2h-6z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-white font-mono text-xl mb-6 tracking-wider">
                    {paymentInfo.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between">
                    <div className="text-white opacity-80 text-sm">
                      <div className="uppercase text-xs mb-1">Card Holder</div>
                      <div>{paymentInfo.cardName || 'YOUR NAME'}</div>
                    </div>
                    <div className="text-white opacity-80 text-sm">
                      <div className="uppercase text-xs mb-1">Expires</div>
                      <div>{paymentInfo.expiryDate || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Back of card */}
            <div className="absolute inset-0 backface-hidden rounded-xl shadow-md bg-gradient-to-r from-gray-700 to-gray-900 rotateY-180">
              <div className="h-12 bg-black opacity-80 mt-5"></div>
              <div className="px-6 mt-5">
                <div className="h-10 bg-white opacity-80 flex items-center justify-end pr-3">
                  <span className="text-gray-800 font-mono">
                    {paymentInfo.cvv || '•••'}
                  </span>
                </div>
                <div className="mt-6 text-white opacity-70 text-xs text-center">
                  This is a virtual representation of your card for this demo.
                  No actual card data is stored or processed.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        <motion.div className="space-y-4 mb-6" variants={itemVariants}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <input
                id="credit_card"
                name="method"
                type="radio"
                value="credit_card"
                checked={paymentInfo.method === 'credit_card'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="credit_card" className="ml-3 flex items-center text-gray-700">
                <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                Credit or Debit Card
              </label>
            </div>
          </div>
          
          {/* Card Details */}
          {paymentInfo.method === 'credit_card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  maxLength={19}
                  onFocus={() => setCardFlipped(false)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentInfo.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  onFocus={() => setCardFlipped(false)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    maxLength={5}
                    onFocus={() => setCardFlipped(false)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    maxLength={4}
                    onFocus={() => setCardFlipped(true)}
                    onBlur={() => setCardFlipped(false)}
                  />
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="saveCard"
                    name="saveCard"
                    type="checkbox"
                    checked={paymentInfo.saveCard}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="saveCard" className="text-gray-600">Save card for future purchases</label>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Security Notice */}
        <motion.div 
          className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start"
          variants={itemVariants}
        >
          <LockClosedIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Secure Checkout</p>
            <p className="text-xs text-blue-600 mt-1">
              Your payment information is encrypted and secure. We do not store your credit card details.
            </p>
          </div>
        </motion.div>
        
        {/* Error Message */}
        {error && (
          <motion.div 
            className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ExclamationCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-red-800">{error}</div>
          </motion.div>
        )}
        
        {/* Buttons */}
        <motion.div className="flex justify-between mt-8" variants={itemVariants}>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            disabled={processing}
          >
            <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          <motion.button
            type="submit"
            className="btn-primary flex items-center"
            disabled={processing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {processing ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              <>
                Complete Payment
                <CheckCircleIcon className="h-5 w-5 ml-2" />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AnimatedPaymentForm;
