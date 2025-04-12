import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaCog, FaLeaf } from 'react-icons/fa';
import ProfileDashboard from '../components/profile/ProfileDashboard';
import ProfileSettings from '../components/profile/ProfileSettings';
import EcoImpactDashboard from '../components/profile/EcoImpactDashboard';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const currentPath = location.pathname;
  const isSettingsPage = currentPath.includes('/settings');
  const isEcoImpactPage = currentPath.includes('/eco-impact');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 pt-24 pb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>
          
          <div className="flex flex-wrap space-x-2">
            <Link 
              to="/profile" 
              className={`px-5 py-2.5 rounded-t-lg transition-colors flex items-center mb-2 ${
                !isSettingsPage && !isEcoImpactPage ? 'bg-white text-emerald-700' : 'bg-emerald-700 bg-opacity-30 text-white hover:bg-opacity-40'
              }`}
            >
              <FaUser className="mr-2" />
              Dashboard
            </Link>
            
            <Link 
              to="/profile/eco-impact" 
              className={`px-5 py-2.5 rounded-t-lg transition-colors flex items-center mb-2 ${
                isEcoImpactPage ? 'bg-white text-emerald-700' : 'bg-emerald-700 bg-opacity-30 text-white hover:bg-opacity-40'
              }`}
            >
              <FaLeaf className="mr-2" />
              Eco Impact
            </Link>
            
            <Link 
              to="/profile/settings" 
              className={`px-5 py-2.5 rounded-t-lg transition-colors flex items-center mb-2 ${
                isSettingsPage ? 'bg-white text-emerald-700' : 'bg-emerald-700 bg-opacity-30 text-white hover:bg-opacity-40'
              }`}
            >
              <FaCog className="mr-2" />
              Settings
            </Link>
          </div>
        </div>
      </div>
      
      <Routes>
        <Route index element={<ProfileDashboard />} />
        <Route path="eco-impact" element={<EcoImpactDashboard />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Routes>
    </div>
  );
};

export default ProfilePage; 