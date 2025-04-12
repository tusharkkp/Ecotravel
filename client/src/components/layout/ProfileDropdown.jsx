import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaCoins, 
  FaCog, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaChevronUp,
  FaLeaf,
  FaChartLine,
  FaHandHoldingHeart,
  FaTrophy,
  FaMedal
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EcoCoinService from '../../services/EcoCoinService';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ecoBalance, setEcoBalance] = useState(0);
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);
  
  // Fetch EcoCoin balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (currentUser) {
        try {
          console.log('Fetching balance for user:', currentUser.id);
          const result = await EcoCoinService.getBalance(currentUser.id);
          if (result.success) {
            console.log('Balance fetched:', result.balance);
            setEcoBalance(result.balance);
          }
        } catch (error) {
          console.error('Error fetching EcoCoin balance:', error);
        }
      }
    };
    
    fetchBalance();
    
    // Listen for balance change events
    const handleBalanceChange = (event) => {
      console.log('Balance change event received:', event.detail);
      if (currentUser && event.detail.userId === currentUser.id) {
        setEcoBalance(event.detail.newBalance);
      }
    };
    
    // Add event listener
    window.addEventListener('ecobalancechange', handleBalanceChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('ecobalancechange', handleBalanceChange);
    };
  }, [currentUser]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };
  
  if (!currentUser) {
    return (
      <div className="flex space-x-2">
        <Link 
          to="/login"
          className="px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          Log in
        </Link>
        <Link 
          to="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100">
          {currentUser.profileImage ? (
            <img 
              src={currentUser.profileImage} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white">
              {currentUser.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {currentUser.name?.split(' ')[0] || 'User'}
        </span>
        {isOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-700">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center text-amber-600 bg-amber-50 py-1 px-2 rounded-full">
                  <FaCoins className="text-amber-500 mr-1" />
                  <span className="text-xs font-semibold">{ecoBalance} EcoCoins</span>
                </div>
                
                <div className="flex items-center text-emerald-600 bg-emerald-50 py-1 px-2 rounded-full">
                  <FaLeaf className="text-emerald-500 mr-1" />
                  <span className="text-xs font-semibold">Eco Rating</span>
                </div>
              </div>
            </div>
            
            {/* Menu items */}
            <div className="py-1">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaUser className="mr-3 text-gray-500" />
                My Profile
              </Link>
              
              <Link
                to="/profile/eco-impact"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaLeaf className="mr-3 text-emerald-500" />
                Eco Impact Dashboard
              </Link>
              
              <Link
                to="/wallet"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaCoins className="mr-3 text-amber-500" />
                EcoCoin Wallet
              </Link>
              
              <Link
                to="/contribute"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaHandHoldingHeart className="mr-3 text-red-500" />
                Contribute to Causes
              </Link>
              
              <Link
                to="/profile/achievements"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaMedal className="mr-3 text-amber-500" />
                Achievements
              </Link>
              
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaCog className="mr-3 text-gray-500" />
                Settings
              </Link>
            </div>
            
            {/* Logout */}
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <FaSignOutAlt className="mr-3" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown; 