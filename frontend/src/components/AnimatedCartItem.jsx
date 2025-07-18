import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  HeartIcon
} from '@heroicons/react/24/outline';

const AnimatedCartItem = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  onSaveForLater,
  updating = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      opacity: 0, 
      x: -300,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  // Scale animation for buttons
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };
  
  // Image hover animation
  const imageVariants = {
    hover: { scale: 1.05 },
    initial: { scale: 1 }
  };

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  // Item price and subtotal
  const unitPrice = item.price;
  const subtotal = unitPrice * item.quantity;

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Product Image */}
        <Link to={`/product/${item.product.id}`} className="block relative w-full sm:w-24 h-24">
          <motion.div
            className="w-full h-full overflow-hidden rounded-md"
            variants={imageVariants}
            animate={isHovered ? "hover" : "initial"}
            transition={{ duration: 0.3 }}
          >
            <img
              src={item.product.images?.[0] || '/placeholder.jpg'}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Discount badge */}
          {item.product.originalPrice > item.product.price && (
            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-md rounded-tl-md">
              {Math.round((1 - item.product.price / item.product.originalPrice) * 100)}% OFF
            </div>
          )}
        </Link>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between w-full">
            <div>
              <Link to={`/product/${item.product.id}`}>
                <h3 className="font-medium text-gray-900 hover:text-primary-600 transition-colors">
                  {item.product.name}
                </h3>
              </Link>
              
              <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
              
              {/* Product Attributes */}
              <div className="flex flex-wrap gap-2 mt-1">
                {item.selectedColor && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    Color: {item.selectedColor}
                  </span>
                )}
                
                {item.selectedSize && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    Size: {item.selectedSize}
                  </span>
                )}
              </div>
            </div>
            
            {/* Price on mobile */}
            <div className="mt-2 sm:hidden">
              <p className="font-medium text-gray-900">${formatPrice(subtotal)}</p>
              <p className="text-sm text-gray-500">${formatPrice(unitPrice)} each</p>
            </div>
          </div>
          
          {/* Bottom row with controls and price */}
          <div className="flex items-center justify-between mt-4 w-full">
            <div className="flex items-center gap-2">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1 || updating}
                  className="p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MinusIcon className="h-4 w-4" />
                </motion.button>
                
                <span className="w-8 text-center font-medium text-gray-800">
                  {updating ? (
                    <div className="flex justify-center items-center h-4">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    item.quantity
                  )}
                </span>
                
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.countInStock || updating}
                  className="p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon className="h-4 w-4" />
                </motion.button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1">
                {/* Save for Later Button */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => onSaveForLater(item._id)}
                  disabled={updating}
                  className="p-1.5 text-gray-500 hover:text-pink-500 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  title="Save for later"
                >
                  <HeartIcon className="h-4 w-4" />
                </motion.button>
                
                {/* Remove Button */}
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => onRemove(item._id)}
                  disabled={updating}
                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full disabled:opacity-50"
                  title="Remove item"
                >
                  <TrashIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
            
            {/* Price on desktop */}
            <div className="hidden sm:block text-right">
              <p className="font-medium text-gray-900">${formatPrice(subtotal)}</p>
              <p className="text-sm text-gray-500">${formatPrice(unitPrice)} each</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stock warning */}
      {item.product.countInStock <= 5 && item.product.countInStock > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-3 text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded border border-amber-200"
        >
          <span className="font-medium">Only {item.product.countInStock} left in stock!</span>
        </motion.div>
      )}
      
      {/* Suggestions (optional) */}
      <AnimatePresence>
        {isHovered && item.product.relatedProducts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-gray-100"
          >
            <p className="text-xs text-gray-500 mb-2">Frequently bought together:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {item.product.relatedProducts.slice(0, 3).map((product, index) => (
                <Link 
                  key={index} 
                  to={`/product/${product.id}`}
                  className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border border-gray-200 hover:border-primary-500 transition-colors"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedCartItem;
