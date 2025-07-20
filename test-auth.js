const axios = require('axios');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

// Test authentication endpoints
const testAuth = async () => {
  try {
    console.log(' Starting authentication tests...\n');
    
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', registerData);
      console.log('Registration successful:', registerResponse.data.message);
      console.log('   User ID:', registerResponse.data.user.id);
      console.log('   User Role:', registerResponse.data.user.role);
    } catch (error) {
      console.log(' Registration failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n');
    
    // Test 2: Login with admin credentials
    console.log('2. Testing admin login...');
    const adminLoginData = {
      email: 'admin@shopverse.com',
      password: 'admin123'
    };
    
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', adminLoginData);
      console.log(' Admin login successful:', loginResponse.data.message);
      console.log('   User ID:', loginResponse.data.user.id);
      console.log('   User Role:', loginResponse.data.user.role);
      console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log('Admin login failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n');
    
    // Test 3: Login with test user
    console.log('3. Testing user login...');
    const userLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', userLoginData);
      console.log(' User login successful:', loginResponse.data.message);
      console.log('   User ID:', loginResponse.data.user.id);
      console.log('   User Role:', loginResponse.data.user.role);
    } catch (error) {
      console.log(' User login failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n  Tests completed!');
    
  } catch (error) {
    console.error(' Test error:', error.message);
  }
  
  process.exit(0);
};

// Check if server is running first
const checkServer = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/health');
    console.log(' Server is running:', response.data.message);
    testAuth();
  } catch (error) {
    console.log(' Server is not running. Please start the backend server first.');
    console.log('   Run: cd backend && npm start');
    process.exit(1);
  }
};

checkServer();
