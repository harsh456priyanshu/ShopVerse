import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FunnelIcon } from '@heroicons/react/24/solid'
import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/outline'
import useProductStore from '../store/productStore'
import ProductGridView from '../components/ProductGridView'
import ProductListView from '../components/ProductListView'

function Products() {
  const { 
    filteredProducts, 
    searchQuery, 
    selectedCategory, 
    filterByCategory, 
    searchProducts 
  } = useProductStore()
  
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

const categories = ['all', 'electronics', 'clothing', 'sports', 'home', 'beauty'];
const [view, setView] = useState('grid'); // 'grid' or 'list'

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

// Initialize products on component mount
  useEffect(() => {
    // Initialize products if they haven't been filtered yet
    if (filteredProducts.length === 0) {
      useProductStore.getState().initializeProducts();
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">
            {searchQuery 
              ? `Search results for "${searchQuery}" (${filteredProducts.length} products)`
              : `Discover our amazing collection (${filteredProducts.length} products)`
            }
          </p>
        </motion.div>

{/* Filters, Sort, and View Toggle */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => filterByCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">View:</label>
              <button 
                onClick={() => setView('grid')} 
                className={`p-2 rounded-md border transition-all ${view === 'grid' ? 'bg-gray-100 shadow-inner' : 'shadow-sm'}`}
                aria-label="Grid view"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setView('list')} 
                className={`p-2 rounded-md border transition-all ${view === 'list' ? 'bg-gray-100 shadow-inner' : 'shadow-sm'}`}
                aria-label="List view"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Listings */}
        {filteredProducts.length > 0 ? (
          <>
            {view === 'grid' ? (
              <ProductGridView products={sortedProducts} />
            ) : (
              <ProductListView products={sortedProducts} />
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <FunnelIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? `No products match your search for "${searchQuery}"`
                : 'No products found in this category'
              }
            </p>
            <button
              onClick={() => {
                filterByCategory('all')
                searchProducts('')
              }}
              className="btn-primary"
            >
              View All Products
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Products

