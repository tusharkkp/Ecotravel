import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock user for testing
const MOCK_USER = {
  id: 'user1',
  name: 'Test User',
  email: 'user@example.com',
  profileImage: null
};

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecoTravelToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Mock implementation for testing without backend
    if (window.location.hostname === 'localhost') {
      console.warn('Using mock implementation due to API error:', error.message);
      return Promise.resolve({ data: { success: true } });
    }
    
    // Handle 401 Unauthorized errors by logging out
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ecoTravelToken');
      localStorage.removeItem('ecoTravelUser');
      
      // Redirect to login if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication service
const authService = {
  // Register
  register: async (userData) => {
    try {
      // Mock implementation for testing without backend
      if (window.location.hostname === 'localhost') {
        console.log('Mock register with:', userData);
        const mockToken = 'mock-jwt-token-for-testing';
        const mockUser = { ...MOCK_USER, ...userData };
        return { token: mockToken, user: mockUser };
      }
      
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (window.location.hostname === 'localhost') {
        // Return mock data for local development
        console.warn('Using mock register response due to API error');
        const mockToken = 'mock-jwt-token-for-testing';
        const mockUser = { ...MOCK_USER, ...userData };
        return { token: mockToken, user: mockUser };
      }
      throw error;
    }
  },
  
  // Login
  login: async (email, password) => {
    try {
      // Mock implementation for testing without backend
      if (window.location.hostname === 'localhost') {
        console.log('Mock login with:', email, password);
        const mockToken = 'mock-jwt-token-for-testing';
        return { token: mockToken, user: MOCK_USER };
      }
      
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (window.location.hostname === 'localhost') {
        // Return mock data for local development
        console.warn('Using mock login response due to API error');
        const mockToken = 'mock-jwt-token-for-testing';
        return { token: mockToken, user: MOCK_USER };
      }
      throw error;
    }
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    try {
      // Mock implementation for testing without backend
      if (window.location.hostname === 'localhost') {
        console.log('Mock getCurrentUser');
        return { user: MOCK_USER };
      }
      
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      if (window.location.hostname === 'localhost') {
        // Return mock data for local development
        console.warn('Using mock user profile response due to API error');
        return { user: MOCK_USER };
      }
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      // Mock implementation for testing without backend
      if (window.location.hostname === 'localhost') {
        console.log('Mock updateProfile with:', userData);
        return { user: { ...MOCK_USER, ...userData } };
      }
      
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      if (window.location.hostname === 'localhost') {
        // Return mock data for local development
        console.warn('Using mock update response due to API error');
        return { success: true, user: { ...MOCK_USER, ...userData } };
      }
      throw error;
    }
  },
  
  // Upload profile image
  uploadProfileImage: async (formData) => {
    try {
      // Mock implementation for testing without backend
      if (window.location.hostname === 'localhost') {
        console.log('Mock uploadProfileImage');
        return { user: { ...MOCK_USER, profileImage: 'https://via.placeholder.com/150' } };
      }
      
      const response = await api.post('/users/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      if (window.location.hostname === 'localhost') {
        // Return mock data for local development
        console.warn('Using mock image upload response due to API error');
        return { 
          success: true, 
          user: { ...MOCK_USER, profileImage: 'https://via.placeholder.com/150' } 
        };
      }
      throw error;
    }
  },
  
  // Check if token is valid
  validateToken: async () => {
    try {
      // Mock implementation for testing without backend
      if (window.location.hostname === 'localhost') {
        console.log('Mock validateToken');
        return { valid: true };
      }
      
      const response = await api.get('/auth/validate-token');
      return response.data;
    } catch (error) {
      if (window.location.hostname === 'localhost') {
        // Return mock data for local development
        console.warn('Using mock token validation response due to API error');
        return { valid: true };
      }
      throw error;
    }
  }
};

export default authService; 