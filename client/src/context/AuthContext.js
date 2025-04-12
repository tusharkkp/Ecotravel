import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/auth';

// Create auth context
const AuthContext = createContext(null);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Check for token on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('ecoTravelToken');
      const userData = localStorage.getItem('ecoTravelUser');
      
      if (token && userData) {
        try {
          // Validate token with backend
          const response = await authService.validateToken();
          if (response.valid) {
            setCurrentUser(JSON.parse(userData));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('ecoTravelToken');
            localStorage.removeItem('ecoTravelUser');
          }
        } catch (err) {
          // Error validating token, assume invalid
          localStorage.removeItem('ecoTravelToken');
          localStorage.removeItem('ecoTravelUser');
          console.error('Error validating token:', err);
        }
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setAuthError('');
      
      const response = await authService.register(userData);
      
      if (response && response.token) {
        // Set token in storage
        localStorage.setItem('ecoTravelToken', response.token);
        localStorage.setItem('ecoTravelUser', JSON.stringify(response.user));
        
        // Update state
        setCurrentUser(response.user);
        
        return { success: true };
      } else {
        setAuthError('Registration failed. Please try again.');
        return { success: false, message: 'Registration failed' };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError('');
      
      const response = await authService.login(email, password);
      
      if (response && response.token) {
        // Set token in storage
        localStorage.setItem('ecoTravelToken', response.token);
        localStorage.setItem('ecoTravelUser', JSON.stringify(response.user));
        
        // Update state
        setCurrentUser(response.user);
        
        return { success: true };
      } else {
        setAuthError('Login failed. Please check your credentials.');
        return { success: false, message: 'Login failed' };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('ecoTravelToken');
    localStorage.removeItem('ecoTravelUser');
    setCurrentUser(null);
    window.location.href = '/'; // Redirect to home page
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setAuthError('');
      
      const response = await authService.updateProfile(userData);
      
      if (response && response.user) {
        // Update stored user data
        const updatedUser = response.user;
        localStorage.setItem('ecoTravelUser', JSON.stringify(updatedUser));
        
        // Update state
        setCurrentUser(updatedUser);
        
        return { success: true };
      } else {
        setAuthError('Profile update failed');
        return { success: false, message: 'Profile update failed' };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (formData) => {
    try {
      setLoading(true);
      setAuthError('');
      
      const response = await authService.uploadProfileImage(formData);
      
      if (response && response.user) {
        // Update stored user data with new image URL
        const updatedUser = { ...currentUser, profileImage: response.user.profileImage };
        localStorage.setItem('ecoTravelUser', JSON.stringify(updatedUser));
        
        // Update state
        setCurrentUser(updatedUser);
        
        return { success: true, imageUrl: response.user.profileImage };
      } else {
        setAuthError('Image upload failed');
        return { success: false, message: 'Image upload failed' };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Image upload failed';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error message
  const clearError = () => {
    setAuthError('');
  };

  // Context value
  const value = {
    currentUser,
    loading,
    authError,
    register,
    login,
    logout,
    updateProfile,
    uploadProfileImage,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 