import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaLeaf, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoginComponent from '../components/auth/Login';

const LoginPage = () => {
  return (
    <div className="pt-16">
      <LoginComponent />
      
      {/* Testing helper for development environments */}
      {window.location.hostname === 'localhost' && (
        <div className="fixed bottom-4 right-4 bg-amber-100 border border-amber-300 p-3 rounded-lg z-50 text-sm">
          <p className="font-medium text-amber-800 mb-2">Development Helper</p>
          <button
            onClick={() => {
              localStorage.setItem('ecoTravelToken', 'mock-jwt-token-for-testing');
              localStorage.setItem('ecoTravelUser', JSON.stringify({
                id: 'user1',
                name: 'Test User',
                email: 'user@example.com'
              }));
              window.location.href = '/profile';
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs"
          >
            Quick Login (Test User)
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage; 