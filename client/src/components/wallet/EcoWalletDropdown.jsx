import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCoins, 
  FaLeaf, 
  FaChartLine, 
  FaHandHoldingHeart, 
  FaQuestionCircle, 
  FaTimes,
  FaExternalLinkAlt,
  FaInfoCircle
} from 'react-icons/fa';
import EcoCoinService from '../../services/EcoCoinService';

// Function to map rating tier to its corresponding icon and colors
const getTierConfig = (tier) => {
  const configs = {
    'Seedling': {
      icon: <FaLeaf className="text-green-500" />,
      bgClass: 'bg-green-100',
      textClass: 'text-green-700',
      borderClass: 'border-green-200'
    },
    'Sapling': {
      icon: <FaLeaf className="text-teal-500" />,
      bgClass: 'bg-teal-100',
      textClass: 'text-teal-700',
      borderClass: 'border-teal-200'
    },
    'Treehugger': {
      icon: <FaLeaf className="text-blue-500" />,
      bgClass: 'bg-blue-100',
      textClass: 'text-blue-700',
      borderClass: 'border-blue-200'
    },
    'EcoHero': {
      icon: <FaLeaf className="text-purple-500" />,
      bgClass: 'bg-purple-100',
      textClass: 'text-purple-700',
      borderClass: 'border-purple-200'
    }
  };
  
  return configs[tier] || configs['Seedling'];
};

const EcoWalletDropdown = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  
  // Fetch wallet data when component mounts or when userId changes
  useEffect(() => {
    const fetchWalletData = async () => {
      setIsLoading(true);
      try {
        // Get balance
        const balanceResult = await EcoCoinService.getBalance(userId);
        console.log('Wallet dropdown - fetched balance:', balanceResult);
        
        // Get eco rating
        const ratingResult = await EcoCoinService.getEcoRating(userId);
        
        // Get total carbon saved
        const carbonResult = await EcoCoinService.getTotalCarbonSaved(userId);
        
        if (balanceResult.success && ratingResult.success && carbonResult.success) {
          setWalletData({
            balance: balanceResult.balance,
            rating: ratingResult,
            carbonSaved: carbonResult.totalCarbonSaved
          });
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
    
    // Listen for balance change events
    const handleBalanceChange = (event) => {
      console.log('Wallet dropdown - balance change event received:', event.detail);
      if (event.detail.userId === userId) {
        // Refresh the wallet data to get updated rating and other stats
        fetchWalletData();
      }
    };
    
    // Add event listener
    window.addEventListener('ecobalancechange', handleBalanceChange);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('ecobalancechange', handleBalanceChange);
    };
  }, [userId]);
  
  // Close dropdown when clicking outside
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
  
  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Get tier configuration based on current tier
  const getTierStyle = () => {
    if (!walletData?.rating?.currentTier?.name) return getTierConfig('Seedling');
    return getTierConfig(walletData.rating.currentTier.name);
  };
  
  const tierConfig = getTierStyle();
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* EcoWallet Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors duration-300"
        aria-label="Open EcoWallet"
      >
        <FaCoins className="text-amber-500" />
        <span className="font-medium">
          {isLoading ? '...' : walletData?.balance || 0}
        </span>
      </button>
      
      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 to-teal-700 p-4 text-white">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-white/80 hover:text-white"
                aria-label="Close dropdown"
              >
                <FaTimes />
              </button>
              
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  <FaCoins className="text-amber-300 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">EcoWallet</h3>
                  <p className="text-xs text-white/80">Rewards for eco-friendly choices</p>
                </div>
              </div>
            </div>
            
            {/* Wallet Content */}
            <div className="p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-pulse bg-gray-200 w-28 h-6 rounded-md mb-3"></div>
                  <div className="animate-pulse bg-gray-200 w-40 h-4 rounded-md"></div>
                </div>
              ) : (
                <>
                  {/* Balance */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-500 text-sm">Current Balance</p>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-amber-600 mr-1">{walletData?.balance || 0}</span>
                        <span className="text-gray-500 text-sm">EcoCoins</span>
                      </div>
                    </div>
                    <div className="bg-amber-100 rounded-full p-3">
                      <FaCoins className="text-amber-500 text-xl" />
                    </div>
                  </div>
                  
                  {/* EcoRating */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <p className="text-gray-500 text-sm">Your EcoRating</p>
                      <div className="flex items-center text-xs font-medium">
                        <span className={tierConfig.textClass}>{walletData?.rating?.points || 0} pts</span>
                      </div>
                    </div>
                    
                    <div className={`flex items-center p-3 rounded-lg ${tierConfig.bgClass} ${tierConfig.borderClass} border`}>
                      <div className="mr-3">
                        {tierConfig.icon}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <p className={`font-medium ${tierConfig.textClass}`}>
                            {walletData?.rating?.currentTier?.name || 'Seedling'}
                          </p>
                          {walletData?.rating?.nextTier && (
                            <span className="text-xs text-gray-500">
                              {walletData.rating.nextTier.pointsNeeded} pts to {walletData.rating.nextTier.name}
                            </span>
                          )}
                        </div>
                        
                        <div className="bg-gray-200 h-1.5 rounded-full w-full">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-700" 
                            style={{ width: `${walletData?.rating?.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Impact Summary */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <FaChartLine className="text-blue-500 mr-2" />
                      <p className="text-sm font-medium">Your Impact</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-white rounded-md">
                        <p className="text-xs text-gray-500">Carbon Saved</p>
                        <p className="font-bold text-green-600">{walletData?.carbonSaved || 0} kg</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded-md">
                        <p className="text-xs text-gray-500">Equivalent To</p>
                        <p className="font-bold text-blue-600">{Math.floor((walletData?.carbonSaved || 0) / 10)} trees</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2">
                <Link
                  to="/profile/eco-impact"
                  className="flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FaExternalLinkAlt className="mr-2" />
                  View Eco Impact Dashboard
                </Link>
                
                <Link
                  to="/contribute"
                  className="flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FaHandHoldingHeart className="mr-2" />
                  Contribute EcoCoins
                </Link>
                
                <button
                  onClick={() => {
                    // Show a modal with info about earning EcoCoins
                    alert('Earn EcoCoins by booking eco-friendly travel options, completing challenges, and referring friends!');
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-300"
                >
                  <FaQuestionCircle className="mr-2" />
                  How to Earn More?
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="text-xs p-3 bg-gray-50 text-gray-500 flex items-center">
              <FaInfoCircle className="mr-1" />
              EcoCoins are earned when you make eco-friendly choices!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcoWalletDropdown; 