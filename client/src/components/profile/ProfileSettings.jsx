import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEnvelope, 
  FaSave, 
  FaArrowLeft, 
  FaCamera, 
  FaExclamationCircle,
  FaCheck,
  FaPhone,
  FaGlobe,
  FaKey
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings = () => {
  const { currentUser, updateUserProfile, uploadProfileImage, authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    preferences: {
      notifications: true,
      emailUpdates: true,
      darkMode: false
    }
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  
  // Initialize form data when currentUser is available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || '',
        location: currentUser.location || '',
        bio: currentUser.bio || '',
        preferences: {
          notifications: currentUser.preferences?.notifications ?? true,
          emailUpdates: currentUser.preferences?.emailUpdates ?? true,
          darkMode: currentUser.preferences?.darkMode ?? false
        }
      });
    } else {
      navigate('/login');
    }
    
    // Clear any previous errors
    clearError();
  }, [currentUser, navigate, clearError]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Clear success message when form is modified
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFormErrors({ ...formErrors, image: 'Image size should be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setFormErrors({ ...formErrors, image: 'Please select a valid image file' });
        return;
      }
      
      setSelectedImage(file);
      setFormErrors({ ...formErrors, image: '' });
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle preference change
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setSuccessMessage('');
    setMessage({ text: '', type: '' });
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Update profile
        const updateResult = await updateUserProfile(formData);
        
        // Upload image if selected
        if (selectedImage && updateResult.success) {
          const formData = new FormData();
          formData.append('profileImage', selectedImage);
          
          await uploadProfileImage(formData);
        }
        
        setMessage({ 
          text: 'Profile updated successfully!', 
          type: 'success' 
        });
      } catch (error) {
        setMessage({ 
          text: error.message || 'Failed to update profile. Please try again.', 
          type: 'error' 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (!currentUser) {
    return null; // Will redirect to login via useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/profile" className="inline-flex items-center text-emerald-600 mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Profile
        </Link>
        
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <p className="text-emerald-100">Update your personal information</p>
          </div>
          
          <div className="p-8">
            {authError && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
                <FaExclamationCircle className="mr-2 mt-1 flex-shrink-0" />
                <p>{authError}</p>
              </div>
            )}
            
            {message.text && (
              <div className={`bg-${message.type === 'success' ? 'green' : 'red'}-50 text-${message.type === 'success' ? 'green' : 'red'}-700 p-4 rounded-lg mb-6 flex items-start`}>
                <FaCheck className="mr-2 mt-1 flex-shrink-0" />
                <p>{message.text}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Profile picture */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : currentUser.profileImage ? (
                      <img 
                        src={currentUser.profileImage} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white text-4xl font-bold">
                        {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  
                  <label 
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white cursor-pointer shadow-md hover:bg-emerald-700 transition-colors"
                  >
                    <FaCamera />
                    <input 
                      type="file" 
                      id="profileImage" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              
              {formErrors.image && (
                <div className="text-center text-red-600 mb-6 text-sm">
                  {formErrors.image}
                </div>
              )}
              
              <div className="space-y-6">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder="Your full name"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Phone field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder="Your phone number"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
                
                {/* Location field */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGlobe className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        formErrors.location ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder="Your location"
                    />
                  </div>
                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                  )}
                </div>
              </div>
              
              {/* Bio field */}
              <div className="mb-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    formErrors.bio ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                  placeholder="Tell us about yourself and your eco-interests"
                ></textarea>
                {formErrors.bio && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.bio}</p>
                )}
              </div>
              
              {/* Preferences */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={formData.preferences.notifications}
                      onChange={handlePreferenceChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="notifications" className="ml-2 text-gray-700">
                      Enable push notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailUpdates"
                      name="emailUpdates"
                      checked={formData.preferences.emailUpdates}
                      onChange={handlePreferenceChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="emailUpdates" className="ml-2 text-gray-700">
                      Receive email updates about eco-friendly travel opportunities
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="darkMode"
                      name="darkMode"
                      checked={formData.preferences.darkMode}
                      onChange={handlePreferenceChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="darkMode" className="ml-2 text-gray-700">
                      Enable dark mode
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Submit button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-emerald-600 hover:text-emerald-800 transition-colors"
                  onClick={() => {/* Password change functionality */}}
                >
                  <FaKey className="mr-2" />
                  Change Password
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings; 