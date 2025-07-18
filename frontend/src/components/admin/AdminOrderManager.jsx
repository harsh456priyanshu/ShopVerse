import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon,
  TruckIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { ordersAPI } from '../../api/admin';

const orderStatuses = [
  { value: 'pending', label: 'Pending', icon: ClockIcon, color: 'text-yellow-500 bg-yellow-100' },
  { value: 'processing', label: 'Processing', icon: ShoppingBagIcon, color: 'text-blue-500 bg-blue-100' },
  { value: 'shipped', label: 'Shipped', icon: TruckIcon, color: 'text-purple-500 bg-purple-100' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircleIcon, color: 'text-green-500 bg-green-100' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircleIcon, color: 'text-red-500 bg-red-100' }
];

const AdminOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    setStatusUpdating(true);
    try {
      await ordersAPI.updateStatus(orderId, status);
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
      
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      
      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      return false;
    } finally {
      setStatusUpdating(false);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      await ordersAPI.delete(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Close order details
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Get filtered and sorted orders
  const getFilteredOrders = () => {
    // Filter by status
    let filtered = filterStatus === 'all' 
      ? orders 
      : orders.filter(order => order.status === filterStatus);
    
    // Sort orders
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else if (sortOrder === 'oldest') {
        return dateA - dateB;
      } else if (sortOrder === 'highest') {
        return b.totalPrice - a.totalPrice;
      } else { // lowest
        return a.totalPrice - b.totalPrice;
      }
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusInfo = orderStatuses.find(s => s.value === status) || orderStatuses[0];
    const Icon = statusInfo.icon;
    
    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${statusInfo.color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs font-medium">{statusInfo.label}</span>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Calculate total items
  const calculateTotalItems = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Filter by status */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Status:</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="all">All Orders</option>
                {orderStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort orders */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort:</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-sm border-gray-300 rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto">
        {filteredOrders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber || order._id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateTotalItems(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete order"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center">
            <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500">
              {filterStatus === 'all' 
                ? 'There are no orders in the system yet.' 
                : `No orders with "${orderStatuses.find(s => s.value === filterStatus)?.label}" status.`}
            </p>
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Details <span className="text-gray-500">#{selectedOrder.orderNumber || selectedOrder._id.substring(0, 8)}</span>
              </h3>
              <button
                onClick={closeOrderDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Order Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Order Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Order Date</p>
                        <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-medium">{selectedOrder.paymentMethod || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Status</p>
                        <p className="font-medium">{selectedOrder.isPaid ? 'Paid' : 'Not Paid'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Delivery Status</p>
                        <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Customer Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Customer Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.address}</p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.country}</p>
                    <p className="text-sm text-gray-600 mt-2">Phone: {selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img 
                              src={item.product?.images?.[0] || '/placeholder.jpg'} 
                              alt={item.product?.name} 
                              className="h-10 w-10 rounded object-cover mr-3" 
                            />
                            <div>
                              <div className="font-medium text-gray-900">{item.product?.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                {item.selectedSize && item.selectedColor && ' | '}
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Order Summary */}
              <div className="flex justify-between mb-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Order Summary</h4>
                <div className="text-right">
                  <div className="flex justify-between space-x-24">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="text-sm font-medium">{formatCurrency(selectedOrder.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between space-x-24">
                    <span className="text-sm text-gray-600">Shipping:</span>
                    <span className="text-sm font-medium">{formatCurrency(selectedOrder.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between space-x-24">
                    <span className="text-sm text-gray-600">Tax:</span>
                    <span className="text-sm font-medium">{formatCurrency(selectedOrder.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between space-x-24 border-t border-gray-200 mt-2 pt-2">
                    <span className="text-base font-semibold">Total:</span>
                    <span className="text-base font-semibold">{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              {/* Status Update */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {orderStatuses.map((status) => {
                    const Icon = status.icon;
                    return (
                      <motion.button
                        key={status.value}
                        disabled={statusUpdating || selectedOrder.status === status.value}
                        onClick={async () => {
                          const success = await updateOrderStatus(selectedOrder._id, status.value);
                          if (success) {
                            // Show success message (could use toast or alert)
                          }
                        }}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
                          selectedOrder.status === status.value
                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            : `bg-gray-100 hover:bg-gray-200 text-gray-800 ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`
                        }`}
                        whileHover={{ scale: selectedOrder.status !== status.value && !statusUpdating ? 1.05 : 1 }}
                        whileTap={{ scale: selectedOrder.status !== status.value && !statusUpdating ? 0.95 : 1 }}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{status.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="border-t border-gray-200 mt-6 pt-6 flex justify-end space-x-3">
                <button
                  onClick={closeOrderDetails}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                
                <button
                  onClick={() => {
                    // Simulate email notification
                    alert(`Order update notification sent to customer: ${selectedOrder.user?.email || 'customer'}`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Update to Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManager;
