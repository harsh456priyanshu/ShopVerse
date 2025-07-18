const express = require('express');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const router = express.Router();

// @desc    Process payment (mock payment)
// @route   POST /api/payment/process
// @access  Private
router.post('/process', protect, async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    // Check if order is already paid
    if (order.paymentInfo.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is already paid' 
      });
    }

    // Mock payment processing
    // In a real app, you would integrate with a payment gateway like Stripe, PayPal, etc.
    let paymentSuccessful = true;
    let transactionId = 'mock_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
    
    // Simulate payment failure for testing (randomly fail ~10% of payments)
    if (Math.random() < 0.1) {
      paymentSuccessful = false;
    }

    if (paymentSuccessful) {
      // Update order payment status
      order.paymentInfo.status = 'completed';
      order.paymentInfo.method = paymentMethod;
      order.paymentInfo.transactionId = transactionId;
      order.paymentInfo.paidAt = new Date();
      
      // Add to status history
      order.statusHistory.push({
        status: 'payment_completed',
        timestamp: new Date(),
        note: `Payment completed via ${paymentMethod}`
      });

      await order.save();

      res.json({
        success: true,
        message: 'Payment processed successfully',
        transactionId,
        order
      });
    } else {
      // Payment failed
      order.paymentInfo.status = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment processing failed. Please try again.'
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @desc    Verify payment status
// @route   GET /api/payment/status/:orderId
// @access  Private
router.get('/status/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      paymentStatus: order.paymentInfo.status,
      transactionId: order.paymentInfo.transactionId,
      paidAt: order.paymentInfo.paidAt
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
