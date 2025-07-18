import React, { useState, useEffect, useRef } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import useProductStore from '../store/productStore'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const navigate = useNavigate()
  
  const { products, searchProducts } = useProductStore()

  // Filter products based on search query
  const filteredSuggestions = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.brand.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      searchProducts(searchQuery)
      navigate('/products')
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`)
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search products, brands..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.length > 0)
          }}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsOpen(query.length > 0)}
          className="w-full md:w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1.5 px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {isOpen && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
          >
            {filteredSuggestions.length > 0 ? (
              <div className="py-2">
                {filteredSuggestions.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    onClick={() => handleSuggestionClick(product)}
                    className="flex items-center px-4 py-2 cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary-600">
                      ${product.price}
                    </span>
                  </motion.div>
                ))}
                <div className="border-t border-gray-100 px-4 py-2">
                  <button
                    onClick={() => handleSearch()}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <MagnifyingGlassIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No products found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
