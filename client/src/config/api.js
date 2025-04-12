/**
 * API configuration for Eco-Travel Planner
 * This file manages API URLs based on the environment
 */

// Get the API URL from environment variable or use default for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Determine environment
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

// Configuration object
const config = {
  apiUrl: API_URL,
  isDevelopment,
  
  // API endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      validateToken: '/auth/validate-token',
    },
    users: {
      profile: '/users/profile',
      uploadImage: '/users/upload-image',
    },
    calculator: {
      calculate: '/calculator/calculate',
      factors: '/calculator/factors',
      history: '/calculator/history',
    },
    certifications: {
      all: '/certifications',
      details: (id) => `/certifications/${id}`,
    },
    rewards: {
      all: '/rewards',
      redeem: '/rewards/redeem',
    },
    reviews: {
      all: '/reviews',
      add: '/reviews/add',
      byUser: (userId) => `/reviews/user/${userId}`,
    },
  },

  // Mock settings for local development/testing
  mockEnabled: isDevelopment,
  
  // Headers
  headers: {
    json: { 'Content-Type': 'application/json' },
    multipart: { 'Content-Type': 'multipart/form-data' },
  },
  
  // Helper function to get auth header
  getAuthHeader: () => {
    const token = localStorage.getItem('ecoTravelToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default config; 