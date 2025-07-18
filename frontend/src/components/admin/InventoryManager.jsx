import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  MinusIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { productsAPI } from '../../api/admin';

const InventoryManager = ({ product, onUpdate }) => {
  const [quantity, setQuantity] = useState(product.countInStock);
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle direct stock quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    }
  };

  // Handle adjustment amount change
  const handleAdjustAmountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setAdjustAmount(value);
    }
  };

  // Increase stock
  const increaseStock = async () => {
    const newQuantity = quantity + adjustAmount;
    await updateStock(newQuantity);
  };

  // Decrease stock
  const decreaseStock = async () => {
    if (quantity - adjustAmount < 0) {
      setError('Stock cannot be negative');
      setTimeout(() => setError(null), 3000);
      return;
    }
    const newQuantity = quantity - adjustAmount;
    await updateStock(newQuantity);
  };

  // Set stock to specific value
  const setStock = async () => {
    await updateStock(quantity);
  };

  // Update stock API call
  const updateStock = async (newQuantity) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const productData = {
        ...product,
        countInStock: newQuantity
      };
      
      await productsAPI.update(product.id || product._id, productData);
      
      setSuccessMessage(`Stock updated to ${newQuantity}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Call the parent component's update function
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Management</h3>
      
      {/* Stock status indicator */}
      <div className="mb-4">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${
            product.countInStock > 10 
              ? 'bg-green-500' 
              : product.countInStock > 0 
              ? 'bg-yellow-500' 
              : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium">
            {product.countInStock > 10 
              ? 'In Stock' 
              : product.countInStock > 0 
              ? 'Low Stock' 
              : 'Out of Stock'}
          </span>
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Current stock: {product.countInStock} units
        </div>
      </div>
      
      {/* Quick adjust buttons */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adjustment Amount
        </label>
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            value={adjustAmount}
            onChange={handleAdjustAmountChange}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md mr-2"
          />
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={decreaseStock}
              disabled={isUpdating}
              className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
            >
              <MinusIcon className="h-4 w-4 mr-1" />
              Remove
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={increaseStock}
              disabled={isUpdating}
              className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Set exact stock */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Set Exact Stock
        </label>
        <div className="flex items-center">
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mr-2"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={setStock}
            disabled={isUpdating}
            className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Update
          </motion.button>
        </div>
      </div>
      
      {/* Loading indicator */}
      {isUpdating && (
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          Updating inventory...
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex items-center text-sm text-red-600"
        >
          <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
          {error}
        </motion.div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex items-center text-sm text-green-600"
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          {successMessage}
        </motion.div>
      )}
    </div>
  );
};

export default InventoryManager;
