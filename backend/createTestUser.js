const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123', // This will be hashed automatically
      role: 'user'
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Email: test@example.com');
    console.log('Password: test123');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser();
