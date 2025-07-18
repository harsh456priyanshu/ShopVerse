const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for product seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const sampleProducts = [
  {
    name: 'Apple iPhone 13',
    description: 'The latest iPhone with A15 Bionic chip, Super Retina XDR display, and dual camera system.',
    price: 799.99,
    originalPrice: 899.99,
    discount: 11,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3'
    ],
    colors: ['Black', 'White', 'Blue', 'Red'],
    countInStock: 25,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: 'Display', value: '6.1-inch Super Retina XDR' },
      { name: 'Processor', value: 'A15 Bionic' },
      { name: 'Storage', value: '128GB' },
      { name: 'Camera', value: 'Dual 12MP' }
    ],
    tags: ['smartphone', 'ios', 'apple', 'iphone'],
    weight: 0.173,
    dimensions: {
      length: 146.7,
      width: 71.5,
      height: 7.65
    },
    sku: 'IPHONE13-128-BLACK'
  },
  {
    name: 'Samsung Galaxy S22',
    description: 'Latest Samsung flagship with Snapdragon processor, 120Hz display, and advanced camera system.',
    price: 749.99,
    originalPrice: 849.99,
    discount: 12,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1644501635052-ceed446e9c5d?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1643166853920-0ee31c4e1811?ixlib=rb-4.0.3'
    ],
    colors: ['Phantom Black', 'Phantom White', 'Green', 'Pink Gold'],
    countInStock: 30,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: 'Display', value: '6.1-inch Dynamic AMOLED 2X' },
      { name: 'Processor', value: 'Snapdragon 8 Gen 1' },
      { name: 'Storage', value: '128GB' },
      { name: 'Camera', value: 'Triple 50MP+12MP+10MP' }
    ],
    tags: ['smartphone', 'android', 'samsung', 'galaxy'],
    weight: 0.167,
    dimensions: {
      length: 146,
      width: 70.6,
      height: 7.6
    },
    sku: 'GALAXYS22-128-BLACK'
  },
  {
    name: 'Nike Air Max 270',
    description: 'Iconic Nike sneakers with large Air unit in heel for maximum comfort.',
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    category: 'clothing',
    subcategory: 'footwear',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1608666634759-4376010f863d?ixlib=rb-4.0.3'
    ],
    colors: ['Black/White', 'White/Red', 'Blue/Gray'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    countInStock: 45,
    lowStockThreshold: 8,
    isActive: true,
    isFeatured: false,
    specifications: [
      { name: 'Upper', value: 'Engineered mesh' },
      { name: 'Midsole', value: 'Air Max cushioning' },
      { name: 'Outsole', value: 'Rubber' }
    ],
    tags: ['shoes', 'sneakers', 'running', 'athletic'],
    weight: 0.311,
    dimensions: {
      length: 30,
      width: 20,
      height: 15
    },
    sku: 'NIKEAM270-BW-10'
  },
  {
    name: 'Sony WH-1000XM4 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with premium sound quality.',
    price: 299.99,
    originalPrice: 349.99,
    discount: 14,
    category: 'electronics',
    subcategory: 'audio',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3'
    ],
    colors: ['Black', 'Silver', 'Blue'],
    countInStock: 20,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: 'Battery Life', value: 'Up to 30 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.0' },
      { name: 'Noise Cancellation', value: 'Yes, Adaptive' },
      { name: 'Microphones', value: '5 built-in' }
    ],
    tags: ['headphones', 'wireless', 'noise-canceling', 'audio'],
    weight: 0.254,
    dimensions: {
      length: 18.7,
      width: 7.3,
      height: 19.5
    },
    sku: 'SONYWH1000XM4-BLK'
  },
  {
    name: 'Kindle Paperwhite',
    description: 'Waterproof e-reader with glare-free display, now with adjustable warm light.',
    price: 139.99,
    originalPrice: 159.99,
    discount: 13,
    category: 'electronics',
    subcategory: 'e-readers',
    brand: 'Amazon',
    images: [
      'https://images.unsplash.com/photo-1574225329743-803fbcf66365?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1544631006-71e0ac6fb131?ixlib=rb-4.0.3'
    ],
    colors: ['Black', 'Sage'],
    countInStock: 35,
    lowStockThreshold: 7,
    isActive: true,
    isFeatured: false,
    specifications: [
      { name: 'Display', value: '6.8" Paperwhite display' },
      { name: 'Storage', value: '8GB' },
      { name: 'Battery Life', value: 'Up to 10 weeks' },
      { name: 'Waterproof', value: 'IPX8 rated' }
    ],
    tags: ['e-reader', 'books', 'kindle', 'reading'],
    weight: 0.205,
    dimensions: {
      length: 174,
      width: 125,
      height: 8.1
    },
    sku: 'KINDLE-PW-8GB-BLK'
  },
  {
    name: 'Levi\'s 501 Original Fit Jeans',
    description: 'The original button fly jeans from Levi\'s that started it all.',
    price: 59.99,
    originalPrice: 69.99,
    discount: 14,
    category: 'clothing',
    subcategory: 'jeans',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?ixlib=rb-4.0.3'
    ],
    colors: ['Dark Blue', 'Light Blue', 'Black', 'Gray'],
    sizes: ['30x30', '32x32', '34x34', '36x32', '38x34'],
    countInStock: 50,
    lowStockThreshold: 10,
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: 'Material', value: '100% Cotton' },
      { name: 'Fit', value: 'Original' },
      { name: 'Closure', value: 'Button fly' },
      { name: 'Care', value: 'Machine wash' }
    ],
    tags: ['jeans', 'denim', 'pants', 'casual'],
    weight: 0.7,
    dimensions: {
      length: 40,
      width: 30,
      height: 5
    },
    sku: 'LEVIS-501-DARK-3232'
  },
  {
    name: 'Dyson V11 Cordless Vacuum',
    description: 'Powerful cordless vacuum with intelligent suction and advanced filtration.',
    price: 599.99,
    originalPrice: 699.99,
    discount: 14,
    category: 'home',
    subcategory: 'appliances',
    brand: 'Dyson',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1603796003048-a3a384dd2bb5?ixlib=rb-4.0.3'
    ],
    colors: ['Blue/Nickel', 'Copper/Nickel'],
    countInStock: 15,
    lowStockThreshold: 3,
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: 'Runtime', value: 'Up to 60 minutes' },
      { name: 'Suction Power', value: '185 AW' },
      { name: 'Bin Volume', value: '0.76L' },
      { name: 'Weight', value: '6.68 lbs' }
    ],
    tags: ['vacuum', 'cordless', 'cleaning', 'home'],
    weight: 3.03,
    dimensions: {
      length: 126,
      width: 26,
      height: 25
    },
    sku: 'DYSON-V11-BLUE'
  },
  {
    name: 'The Art of Computer Programming',
    description: 'Comprehensive monograph written by Donald Knuth, covering fundamental algorithms and techniques.',
    price: 199.99,
    originalPrice: 239.99,
    discount: 17,
    category: 'books',
    subcategory: 'programming',
    brand: 'Addison-Wesley',
    images: [
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3'
    ],
    countInStock: 10,
    lowStockThreshold: 3,
    isActive: true,
    isFeatured: false,
    specifications: [
      { name: 'Format', value: 'Hardcover' },
      { name: 'Pages', value: '3168' },
      { name: 'Language', value: 'English' },
      { name: 'ISBN', value: '978-0321751041' }
    ],
    tags: ['books', 'programming', 'computer science', 'algorithms'],
    weight: 4.2,
    dimensions: {
      length: 24,
      width: 18,
      height: 12
    },
    sku: 'BOOK-TACP-BOXSET'
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Running shoes designed for maximum comfort and energy return.',
    price: 179.99,
    originalPrice: 189.99,
    discount: 5,
    category: 'clothing',
    subcategory: 'footwear',
    brand: 'Adidas',
    images: [
      'https://images.unsplash.com/photo-1608379743051-23cb833563f8?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?ixlib=rb-4.0.3'
    ],
    colors: ['Core Black', 'Cloud White', 'Grey'],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    countInStock: 30,
    lowStockThreshold: 6,
    isActive: true,
    isFeatured: false,
    specifications: [
      { name: 'Upper', value: 'Primeknit+' },
      { name: 'Midsole', value: 'Boost' },
      { name: 'Outsole', value: 'Continental Rubber' },
      { name: 'Weight', value: '12.0 oz' }
    ],
    tags: ['shoes', 'running', 'athletic', 'boost'],
    weight: 0.34,
    dimensions: {
      length: 30,
      width: 20,
      height: 15
    },
    sku: 'ADIDAS-UB22-BLK-10'
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Enhanced gaming console with 7-inch OLED screen and enhanced audio.',
    price: 349.99,
    originalPrice: 349.99,
    discount: 0,
    category: 'electronics',
    subcategory: 'gaming',
    brand: 'Nintendo',
    images: [
      'https://images.unsplash.com/photo-1640955014216-75201056c829?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1632765857308-76193e51ae94?ixlib=rb-4.0.3'
    ],
    colors: ['White', 'Neon Red/Blue'],
    countInStock: 12,
    lowStockThreshold: 4,
    isActive: true,
    isFeatured: true,
    specifications: [
      { name: 'Screen', value: '7-inch OLED' },
      { name: 'Storage', value: '64GB' },
      { name: 'Battery Life', value: '4.5-9 hours' },
      { name: 'Connectivity', value: 'Wi-Fi, Bluetooth, Wired LAN' }
    ],
    tags: ['gaming', 'console', 'nintendo', 'switch'],
    weight: 0.32,
    dimensions: {
      length: 24.2,
      width: 10.2,
      height: 1.4
    },
    sku: 'NINTENDO-SWITCH-OLED-WHITE'
  }
];

// Function to seed products
const seedProducts = async () => {
  try {
    // First clear any existing products
    await Product.deleteMany({});
    console.log('Existing products deleted');
    
    // Insert the sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length} products created!`);
    
    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding products: ${error.message}`);
    process.exit(1);
  }
};

// Execute the seeding
seedProducts();
