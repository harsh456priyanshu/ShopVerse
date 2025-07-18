import { create } from 'zustand'

const API_URL = 'http://localhost:5000/api'

const useProductStore = create((set, get) => ({
  products: [],
  mockProducts: [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 199.99,
      originalPrice: 249.99,
      category: "electronics",
      brand: "TechSound",
      rating: 4.8,
      numReviews: 156,
      countInStock: 25,
      description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"
      ],
      colors: ["Black", "White", "Silver"],
      sizes: [],
      isFeatured: true
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 399.99,
      originalPrice: 499.99,
      category: "electronics",
      brand: "SmartTech",
      rating: 4.6,
      numReviews: 89,
      countInStock: 15,
      description: "Advanced smartwatch with health monitoring, GPS, and long battery life.",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500",
        "https://images.unsplash.com/photo-1579586337278-3f436f25d4d7?w=500"
      ],
      colors: ["Black", "Rose Gold", "Silver"],
      sizes: ["42mm", "46mm"],
      isFeatured: true
    },
    {
      id: 3,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      category: "clothing",
      brand: "EcoWear",
      rating: 4.4,
      numReviews: 234,
      countInStock: 0,
      description: "Comfortable organic cotton t-shirt, perfect for everyday wear.",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500",
        "https://images.unsplash.com/photo-1583743814966-8936f37f4eb6?w=500"
      ],
      colors: ["White", "Black", "Navy", "Gray"],
      sizes: ["XS", "S", "M", "L", "XL"],
      isFeatured: false
    },
    {
      id: 4,
      name: "Running Shoes",
      price: 129.99,
      originalPrice: 159.99,
      category: "sports",
      brand: "RunFast",
      rating: 4.7,
      numReviews: 312,
      countInStock: 42,
      description: "Lightweight running shoes with advanced cushioning and breathable material.",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"
      ],
      colors: ["Black", "White", "Blue", "Red"],
      sizes: ["7", "8", "9", "10", "11", "12"],
      isFeatured: true
    },
    {
      id: 5,
      name: "Coffee Maker Pro",
      price: 249.99,
      originalPrice: 299.99,
      category: "home",
      brand: "BrewMaster",
      rating: 4.5,
      numReviews: 178,
      countInStock: 18,
      description: "Professional-grade coffee maker with multiple brewing options and programmable settings.",
      images: [
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500"
      ],
      colors: ["Black", "Stainless Steel"],
      sizes: [],
      isFeatured: false
    },
    {
      id: 6,
      name: "Gaming Laptop",
      price: 1299.99,
      originalPrice: 1499.99,
      category: "electronics",
      brand: "GameTech",
      rating: 4.9,
      numReviews: 67,
      countInStock: 8,
      description: "High-performance gaming laptop with latest graphics card and fast processor.",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"
      ],
      colors: ["Black", "Silver"],
      sizes: [],
      isFeatured: true
    },
    {
      id: 7,
      name: "Skincare Set",
      price: 89.99,
      originalPrice: 119.99,
      category: "beauty",
      brand: "GlowUp",
      rating: 4.3,
      numReviews: 445,
      countInStock: 0,
      description: "Complete skincare routine set with cleanser, toner, serum, and moisturizer.",
      images: [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
        "https://images.unsplash.com/photo-1594736797933-d0e501ba2fe1?w=500"
      ],
      colors: [],
      sizes: [],
      isFeatured: false
    },
    {
      id: 8,
      name: "Bluetooth Speaker",
      price: 79.99,
      originalPrice: 99.99,
      category: "electronics",
      brand: "SoundWave",
      rating: 4.2,
      numReviews: 289,
      countInStock: 33,
      description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
        "https://images.unsplash.com/photo-1604277388647-cab3c5ca9ed8?w=500",
        "https://images.unsplash.com/photo-1569924995012-f28524b0e50d?w=500"
      ],
      colors: ["Black", "Blue", "Red", "Green"],
      sizes: [],
      isFeatured: false
    }
  ],
  searchQuery: '',
  selectedCategory: 'all',
  filteredProducts: [],
  loading: false,
  error: null,

  // Fetch products from backend
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const products = await response.json()
      set({ products, loading: false })
      get().filterProducts()
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to mock data if backend fails
      set({ products: get().mockProducts, loading: false, error: error.message })
      get().filterProducts()
    }
  },

  // Initialize filtered products
  initializeProducts: () => {
    get().fetchProducts()
  },

  // Search products
  searchProducts: (query) => {
    set({ searchQuery: query })
    get().filterProducts()
  },

  // Filter by category
  filterByCategory: (category) => {
    set({ selectedCategory: category })
    get().filterProducts()
  },

  // Apply filters
  filterProducts: () => {
    const { products, searchQuery, selectedCategory } = get()
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    set({ filteredProducts: filtered })
  },

  // Get product by ID
  getProductById: (id) => {
    return get().products.find(product => product._id === id || product.id === parseInt(id))
  },

  // Get featured products
  getFeaturedProducts: () => {
    return get().products.filter(product => product.isFeatured)
  },

  // Get inventory stats for admin
  getInventoryStats: () => {
    const products = get().products
    const inStock = products.filter(p => p.countInStock > 0).length
    const outOfStock = products.filter(p => p.countInStock === 0).length
    const lowStock = products.filter(p => p.countInStock > 0 && p.countInStock <= 10).length
    
    return {
      total: products.length,
      inStock,
      outOfStock,
      lowStock
    }
  },

  // Admin functions - Create, Update, Delete products
  createProduct: (productData) => {
    const products = get().products
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...productData,
      rating: 0,
      numReviews: 0,
      soldCount: 0,
      isFeatured: false
    }
    
    set({ products: [...products, newProduct] })
    get().filterProducts()
    return newProduct
  },

  updateProduct: (productId, updates) => {
    const products = get().products
    const updatedProducts = products.map(product => 
      product.id === productId ? { ...product, ...updates } : product
    )
    
    set({ products: updatedProducts })
    get().filterProducts()
  },

  deleteProduct: (productId) => {
    const products = get().products
    const filteredProducts = products.filter(product => product.id !== productId)
    
    set({ products: filteredProducts })
    get().filterProducts()
  },

  // Upload product image (simulate file upload)
  uploadProductImage: (file) => {
    return new Promise((resolve) => {
      // Simulate upload delay
      setTimeout(() => {
        // In a real app, this would upload to a server
        // For now, we'll create a URL for the uploaded file
        const imageUrl = URL.createObjectURL(file)
        resolve(imageUrl)
      }, 1000)
    })
  }
}))

export default useProductStore
