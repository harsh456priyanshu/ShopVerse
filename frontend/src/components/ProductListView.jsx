import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductListView = ({ products }) => {
  const { addToCart, isItemInCart } = useCartStore();

  const handleAddToCart = async (product) => {
    if (product.countInStock === 0) return;
    
    const productId = product._id || product.id;
    const success = await addToCart(productId, 1);
    if (success) {
      toast.success(`${product.name} added to cart!`);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={star} className="h-4 w-4 text-gray-300" />
          )
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.01,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div
          key={product._id || product.id}
          variants={itemVariants}
          whileHover="hover"
          className="bg-white rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col md:flex-row gap-4"
        >
          {/* Product Image */}
          <Link to={`/product/${product._id || product.id}`} className="block w-full md:w-48 h-48 relative overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
            {product.originalPrice > product.price && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </div>
            )}
            
            {product.countInStock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </Link>
          
          {/* Product Details */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <Link to={`/product/${product._id || product.id}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              
              {renderStars(product.rating)}
              
              <p className="mt-2 text-gray-700 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center mt-2">
                {product.colors.length > 0 && (
                  <div className="flex items-center mr-4">
                    <span className="text-sm text-gray-600 mr-2">Colors:</span>
                    <div className="flex space-x-1">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <span key={index} className="text-xs text-gray-600">{color}{index < Math.min(product.colors.length, 3) - 1 ? ', ' : ''}</span>
                      ))}
                      {product.colors.length > 3 && <span className="text-xs text-gray-600">+{product.colors.length - 3} more</span>}
                    </div>
                  </div>
                )}
                
                {product.sizes.length > 0 && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Sizes:</span>
                    <div className="flex space-x-1">
                      {product.sizes.slice(0, 3).map((size, index) => (
                        <span key={index} className="text-xs text-gray-600">{size}{index < Math.min(product.sizes.length, 3) - 1 ? ', ' : ''}</span>
                      ))}
                      {product.sizes.length > 3 && <span className="text-xs text-gray-600">+{product.sizes.length - 3} more</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              <button 
                onClick={() => handleAddToCart(product)}
                disabled={product.countInStock === 0 || isItemInCart(product._id || product.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center ${
                  product.countInStock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isItemInCart(product._id || product.id)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-[1.03] active:scale-[0.97]'
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                {product.countInStock === 0 
                  ? 'Out of Stock' 
                  : isItemInCart(product._id || product.id) 
                  ? 'In Cart' 
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductListView;
