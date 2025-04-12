import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaCalendarAlt, FaEdit, 
  FaLeaf, FaSignOutAlt, FaSave, FaTimes, 
  FaCamera, FaCheck, FaClipboardList, FaCaretDown,
  FaChartLine, FaMedal
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, logout, updateProfile, uploadProfileImage } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const fileInputRef = useRef(null);
  
  // Populate form with user data
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);
  
  // Format joined date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess(false);
    
    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setUpdateSuccess(true);
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        setUpdateError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setUpdateError('An unexpected error occurred');
      console.error('Profile update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle cancel edit
  const handleCancel = () => {
    // Reset form data
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || ''
      });
    }
    
    setIsEditing(false);
    setUpdateError('');
  };
  
  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUpdateError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUpdateError('Image must be less than 5MB');
      return;
    }
    
    setIsUpdating(true);
    setUpdateError('');
    
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const result = await uploadProfileImage(formData);
      
      if (!result.success) {
        setUpdateError(result.message || 'Failed to upload image');
      }
    } catch (error) {
      setUpdateError('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle file input click
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Example trip data - would come from API in a real application
  const exampleTrips = [
    {
      id: 1,
      name: 'Summer Wilderness Camping',
      date: '2023-07-15',
      carbonScore: 125,
      ecoPoints: 350
    },
    {
      id: 2,
      name: 'City Weekend Getaway',
      date: '2023-09-03',
      carbonScore: 210,
      ecoPoints: 175
    },
    {
      id: 3,
      name: 'Mountain Hiking Trip',
      date: '2023-10-22',
      carbonScore: 85,
      ecoPoints: 420
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6">
      <div className="absolute inset-0 bg-leaf-pattern opacity-5 pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800">Your Profile</h1>
          <p className="text-gray-600">Manage your account and access your eco-travel journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile Header */}
              <div className="bg-primary-600 p-6 relative">
                <div className="absolute inset-0 bg-leaf-pattern opacity-10"></div>
                
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div 
                      className="h-32 w-32 rounded-full bg-white border-4 border-white overflow-hidden flex items-center justify-center relative"
                      onClick={handleImageClick}
                    >
                      {currentUser?.profileImage ? (
                        <img 
                          src={currentUser.profileImage}
                          alt={currentUser.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-gray-400 text-5xl" />
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 cursor-pointer">
                        <FaCamera className="text-white opacity-0 hover:opacity-100" />
                      </div>
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {isUpdating && (
                      <div className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <div className="animate-spin h-5 w-5 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="p-6">
                {updateSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 bg-green-50 p-3 rounded-lg text-green-700 flex items-center text-sm"
                  >
                    <FaCheck className="mr-2" />
                    Profile updated successfully!
                  </motion.div>
                )}
                
                {updateError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 bg-red-50 p-3 rounded-lg text-red-700 text-sm"
                  >
                    {updateError}
                  </motion.div>
                )}
                
                {isEditing ? (
                  // Edit Form
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <motion.button
                          type="submit"
                          disabled={isUpdating}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-70"
                          whileTap={{ scale: 0.98 }}
                        >
                          {isUpdating ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave className="mr-2" />
                              Save
                            </>
                          )}
                        </motion.button>
                        
                        <motion.button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaTimes className="mr-2" />
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </form>
                ) : (
                  // Display Info
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUser className="text-primary-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium">{currentUser?.fullName || 'Not set'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaEnvelope className="text-primary-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{currentUser?.email || 'Not set'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-primary-600 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Joined</div>
                        <div className="font-medium">{formatDate(currentUser?.createdAt)}</div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <motion.button
                        onClick={() => setIsEditing(true)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaEdit className="mr-2" />
                        Edit Profile
                      </motion.button>
                    </div>
                    
                    <div>
                      <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaSignOutAlt className="mr-2" />
                        Sign Out
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Trips and Stats */}
          <div className="md:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <FaClipboardList className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Trips</div>
                    <div className="text-2xl font-bold">{exampleTrips.length}</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <FaChartLine className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Avg. Carbon Score</div>
                    <div className="text-2xl font-bold">
                      {exampleTrips.length > 0 
                        ? Math.round(exampleTrips.reduce((acc, trip) => acc + trip.carbonScore, 0) / exampleTrips.length) 
                        : 0}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full mr-4">
                    <FaMedal className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Eco Points</div>
                    <div className="text-2xl font-bold">
                      {exampleTrips.reduce((acc, trip) => acc + trip.ecoPoints, 0)}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Trips Section */}
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaLeaf className="text-primary-600 mr-2" />
                  Your Eco Trips
                </h2>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="text-sm flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none"
                  >
                    <span>Sort by</span>
                    <FaCaretDown className="ml-2" />
                  </button>
                  
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Date (Newest)</button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Date (Oldest)</button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Carbon Score (Low to High)</button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Carbon Score (High to Low)</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {exampleTrips.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carbon Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eco Points</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exampleTrips.map((trip) => (
                        <tr key={trip.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{trip.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(trip.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span 
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  trip.carbonScore < 100 ? 'bg-green-500' : 
                                  trip.carbonScore < 200 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              ></span>
                              <span className="text-sm text-gray-900">{trip.carbonScore} kg CO₂e</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-primary-600 font-medium">{trip.ecoPoints} points</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-primary-600 hover:text-primary-800 mr-3">View</button>
                            <button className="text-gray-600 hover:text-gray-800">Share</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <FaClipboardList className="mx-auto text-4xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No trips yet</h3>
                  <p className="text-gray-600 mb-4">Start planning your eco-friendly journey today</p>
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg focus:outline-none">
                    Calculate a Trip
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 