const axios = require('axios');

const API_URL = 'https://shopverse-ol0l.onrender.com/api';

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    const response = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    });
    
    console.log('User created successfully:', response.data);
    return response.data;
    
  } catch (error) {
    if (error.response?.data?.message === 'User already exists') {
      console.log('Test user already exists, trying to login...');
      return await loginTestUser();
    }
    console.error('Error creating user:', error.response?.data || error.message);
    return null;
  }
}

async function loginTestUser() {
  try {
    console.log('Logging in test user...');
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    
    console.log('Login successful:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    return null;
  }
}

// Run the test
createTestUser();
