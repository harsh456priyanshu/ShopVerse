import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const ProductGridView = ({ products }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Image animation
  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div
          key={product._id || product.id}
          variants={itemVariants}
          whileHover="hover"
          className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
        >
          <Link to={`/product/${product._id || product.id}`} className="block relative overflow-hidden group">
            <motion.div
              className="h-48 w-full overflow-hidden"
              variants={imageVariants}
              whileHover="hover"
            >
              <motion.img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {product.originalPrice > product.price && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </div>
            )}
            
            {product.countInStock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </Link>
          
          <div className="p-4">
            <Link to={`/product/${product._id || product.id}`}>
              <h3 className="font-semibold text-gray-900 mb-1 hover:text-primary-600 transition-colors truncate">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
            
            {renderStars(product.rating)}
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => handleAddToCart(product)}
              disabled={product.countInStock === 0 || isItemInCart(product._id || product.id)}
              className={`w-full mt-3 py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
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
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGridView;
