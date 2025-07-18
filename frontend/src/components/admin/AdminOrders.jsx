import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

function AdminOrders({ orders, loading, error, fetchAllOrders, updateOrderStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (!orders || orders.length === 0) {
      fetchAllOrders();
    }
  }, [orders, fetchAllOrders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setProcessingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus, statusNote);
      setStatusNote('');
      // If we're updating the currently selected order, refresh it
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = orders.find(o => o._id === orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time helper
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Get status indicator based on order status
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center text-blue-600">
            <TruckIcon className="h-5 w-5 mr-1" />
            Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center text-yellow-600">
            <ClockIcon className="h-5 w-5 mr-1" />
            Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center text-red-600">
            <XCircleIcon className="h-5 w-5 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-600">
            <ClockIcon className="h-5 w-5 mr-1" />
            Pending
          </span>
        );
    }
  };

  // Filter orders
  const filteredOrders = orders ? orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  }) : [];

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'total') {
      comparison = a.totalPrice - b.totalPrice;
    } else if (sortBy === 'status') {
      comparison = a.orderStatus.localeCompare(b.orderStatus);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Order details modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{selectedOrder.orderNumber || selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Placed</p>
                  <p className="font-semibold">{formatDate(selectedOrder.createdAt)} at {formatTime(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedOrder.user.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  {getStatusIndicator(selectedOrder.orderStatus)}
                </div>
              </div>
            </div>

            {/* Update Status Section */}
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Update Order Status</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Note (Optional)</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status change"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'processing')}
                    disabled={processingOrderId === selectedOrder._id || selectedOrder.orderStatus === 'processing'}
                    className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 disabled:opacity-50 flex items-center"
                  >
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Processing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'shipped')}
                    disabled={processingOrderId === selectedOrder._id || selectedOrder.orderStatus === 'shipped'}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 flex items-center"
                  >
                    <TruckIcon className="h-4 w-4 mr-1" />
                    Shipped
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'delivered')}
                    disabled={processingOrderId === selectedOrder._id || selectedOrder.orderStatus === 'delivered'}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Delivered
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                    disabled={processingOrderId === selectedOrder._id || selectedOrder.orderStatus === 'cancelled'}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 flex items-center"
                  >
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Cancelled
                  </button>
                </div>
              </div>
              {processingOrderId === selectedOrder._id && (
                <div className="mt-2 flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span>Updating status...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                  <p><span className="font-medium">User ID:</span> {selectedOrder.user._id}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p><span className="font-medium">Method:</span> {selectedOrder.paymentInfo.method.replace('_', ' ').toUpperCase()}</p>
                  <p><span className="font-medium">Status:</span> {selectedOrder.paymentInfo.status.toUpperCase()}</p>
                  {selectedOrder.paymentInfo.transactionId && (
                    <p><span className="font-medium">Transaction ID:</span> {selectedOrder.paymentInfo.transactionId}</p>
                  )}
                  {selectedOrder.paymentInfo.paidAt && (
                    <p><span className="font-medium">Paid on:</span> {formatDate(selectedOrder.paymentInfo.paidAt)}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><span className="font-medium">Recipient:</span> {selectedOrder.shippingAddress.fullName}</p>
                <p><span className="font-medium">Address:</span> {selectedOrder.shippingAddress.address}</p>
                <p><span className="font-medium">City:</span> {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                <p><span className="font-medium">Country:</span> {selectedOrder.shippingAddress.country}</p>
                <p><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Order Items</h3>
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.orderItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-10 w-10 rounded-md object-cover mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                {item.selectedColor && item.selectedSize && ' | '}
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <div className="space-y-3 mt-4">
                  {selectedOrder.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium">{status.status.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{formatDate(status.timestamp)} at {formatTime(status.timestamp)}</p>
                        {status.note && <p className="text-sm mt-1 text-gray-700">{status.note}</p>}
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
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600 my-6">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-6 w-6 mr-2" />
          <p>{error}</p>
        </div>
        <button 
          onClick={() => fetchAllOrders()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Orders Management</h2>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Date</option>
              <option value="total">Total</option>
              <option value="status">Status</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? (
                <><ChevronUpIcon className="h-4 w-4 mr-1" /> Ascending</>
              ) : (
                <><ChevronDownIcon className="h-4 w-4 mr-1" /> Descending</>
              )}
            </button>
          </div>
          
          <button
            onClick={() => fetchAllOrders()}
            className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>

      {orders && orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
          <p className="text-gray-600 mb-4">There are no orders matching your filter criteria.</p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <FunnelIcon className="h-4 w-4 inline mr-1" />
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber || order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user ? order.user.name : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusIndicator(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showOrderDetails && <OrderDetailsModal />}
    </div>
  );
}

export default AdminOrders;
