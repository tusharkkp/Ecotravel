import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt, FaCheckCircle, FaClock, FaStar, FaCalendarAlt, FaTicketAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EcoCoinService from '../../services/EcoCoinService';

const BookingModal = ({ bookingType, bookingOption, onClose }) => {
  const { currentUser } = useAuth();
  const [bookingState, setBookingState] = useState('initial'); // initial, redirecting, completed, confirming
  const [confirmDetails, setConfirmDetails] = useState({
    reference: '',
    date: new Date().toISOString().split('T')[0], // Current date as default
  });
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Calculate potential reward based on eco-rating
  useEffect(() => {
    if (bookingOption) {
      const baseReward = bookingType === 'transport' ? 60 
                        : bookingType === 'accommodation' ? 40 
                        : 20;
      
      // Apply multiplier based on eco rating (1-5 scale)
      const multiplier = (bookingOption.ecoRating / 5) * 2; // Scale up to 2x for best rating
      setEarnedCoins(Math.round(baseReward * multiplier));
    }
  }, [bookingOption, bookingType]);
  
  // Handle modal click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Don't close if in the middle of a process
      if (bookingState !== 'redirecting' && bookingState !== 'processing') {
        onClose();
      }
    }
  };
  
  // Handle booking redirection
  const handleBookNow = () => {
    setBookingState('redirecting');
    
    // Store booking intent in local storage for return from external site
    localStorage.setItem('pendingBooking', JSON.stringify({
      type: bookingType,
      optionId: bookingOption.id,
      timestamp: new Date().getTime(),
      userId: currentUser.id
    }));
    
    // Redirect after a short delay
    setTimeout(() => {
      window.open(bookingOption.bookingUrl, '_blank');
      setBookingState('confirming');
    }, 1500);
  };
  
  // Handle confirm booking
  const handleConfirmBooking = async () => {
    if (!confirmDetails.reference) {
      setErrorMessage('Please enter your booking reference');
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      // Make sure we have the right user ID
      const userId = currentUser?.id || 'user1';
      console.log('Awarding EcoCoins to user:', userId, 'Amount:', earnedCoins);
      
      // Process the reward
      const result = await EcoCoinService.awardEcoCoins(
        userId, 
        earnedCoins, 
        {
          bookingType,
          bookingReference: confirmDetails.reference,
          optionId: bookingOption.id,
          optionName: bookingOption.name,
          bookingDate: confirmDetails.date,
          carbonFootprint: bookingOption.carbonFootprint,
          ecoRating: bookingOption.ecoRating
        }
      );
      
      console.log('EcoCoin award result:', result);
      
      if (result.success) {
        // Update booking state
        setBookingState('completed');
        // Clear pending booking from storage
        localStorage.removeItem('pendingBooking');
        
        // Event dispatch is now handled by EcoCoinService
      } else {
        setErrorMessage(result.error || 'Failed to process reward. Please try again.');
        console.error('Failed to award EcoCoins:', result.error);
      }
    } catch (error) {
      console.error('Error processing reward:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get type label
  const getTypeLabel = () => {
    switch(bookingType) {
      case 'transport': return 'Transportation';
      case 'accommodation': return 'Accommodation';
      case 'activity': return 'Activity';
      default: return 'Option';
    }
  };
  
  // Modal backdrop and content animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } }
  };
  
  // Confetti component for celebration effect
  const Confetti = () => {
    const confettiElements = Array.from({ length: 50 }).map((_, i) => {
      const size = Math.random() * 10 + 5;
      const x = Math.random() * 100; // Random starting X position (0-100%)
      const delay = Math.random() * 0.5; // Random delay for each piece
      const duration = Math.random() * 1 + 1.5; // Random duration between 1.5-2.5s
      const colors = ['#34D399', '#60A5FA', '#F59E0B', '#8B5CF6', '#EC4899']; // Green, blue, amber, purple, pink
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return (
        <motion.div
          key={i}
          initial={{ 
            y: -20, 
            x: `${x}%`, 
            opacity: 0, 
            scale: 0 
          }}
          animate={{ 
            y: ['0%', '100%'], 
            x: [`${x}%`, `${x + (Math.random() * 40 - 20)}%`], 
            opacity: [0, 1, 1, 0],
            rotate: [0, Math.random() * 360 - 180],
            scale: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: duration, 
            delay: delay,
            ease: [0.1, 0.25, 0.1, 1],
            times: [0, 0.2, 0.8, 1]
          }}
          className="absolute"
          style={{
            width: size,
            height: size,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            backgroundColor: color,
          }}
        />
      );
    });

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiElements}
      </div>
    );
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={handleBackdropClick}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 relative">
          <h2 className="text-2xl font-bold text-gray-900">
            Book {getTypeLabel()}
          </h2>
          
          {bookingState !== 'redirecting' && (
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        {/* Modal Content */}
        <div className="p-5">
          {bookingState === 'initial' && (
            <>
              <div className="mb-5">
                <div className="flex items-center bg-primary-50 p-4 rounded-lg">
                  <div 
                    className={`p-3 rounded-full mr-4 text-white ${
                      bookingType === 'transport' ? 'bg-blue-600' : 
                      bookingType === 'accommodation' ? 'bg-purple-600' : 'bg-green-600'
                    }`}
                  >
                    {bookingOption.icon}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{bookingOption.name}</h3>
                    <p className="text-gray-600">{bookingOption.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-lg font-bold text-gray-900">${bookingOption.price}</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">EcoCoins Reward</p>
                  <p className="text-lg font-bold text-green-600">+{earnedCoins} coins</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-800 mb-2">Booking Process</h4>
                <ol className="text-blue-700 space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2 flex-shrink-0">1</span>
                    <span>You'll be redirected to the booking partner website</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2 flex-shrink-0">2</span>
                    <span>Complete your booking on their platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2 flex-shrink-0">3</span>
                    <span>Return here and confirm your booking to earn EcoCoins</span>
                  </li>
                </ol>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleBookNow}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <span>Continue to Booking</span>
                  <FaExternalLinkAlt className="ml-2" />
                </button>
              </div>
            </>
          )}
          
          {bookingState === 'redirecting' && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Booking Partner</h3>
              <p className="text-gray-600 text-center">
                You'll be redirected to complete your booking in a new window.
              </p>
            </div>
          )}
          
          {bookingState === 'confirming' && (
            <>
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="p-2 bg-yellow-100 rounded-full mr-3 flex-shrink-0">
                    <FaClock className="text-yellow-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Booking in Progress</h4>
                    <p className="text-yellow-700 text-sm">
                      Complete your booking on the partner website, then return here to confirm and earn your reward.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Booking Reference Number
                </label>
                <input
                  type="text"
                  value={confirmDetails.reference}
                  onChange={(e) => setConfirmDetails({...confirmDetails, reference: e.target.value})}
                  placeholder="Enter your booking reference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={confirmDetails.date}
                  onChange={(e) => setConfirmDetails({...confirmDetails, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              {errorMessage && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm">
                  {errorMessage}
                </div>
              )}
              
              <div className="bg-primary-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">You'll earn</p>
                    <p className="text-xl font-bold text-primary-700">{earnedCoins} EcoCoins</p>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-full">
                    <span className="font-bold text-primary-700">E</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmBooking}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg transition-all flex items-center disabled:opacity-70 shadow-sm"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </motion.button>
              </div>
            </>
          )}
          
          {bookingState === 'completed' && (
            <>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <Confetti />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <svg className="w-full h-full max-w-[300px] max-h-[300px]" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M34 50 L45 65 L70 33"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    />
                  </svg>
                </motion.div>
              </AnimatePresence>
              
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring", delay: 0.8 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 shadow-md z-10"
                >
                  <FaCheckCircle className="text-green-600 text-4xl" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="relative z-10"
                >
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="text-2xl font-semibold text-gray-900 mb-2"
                  >
                    Booking Confirmed!
                  </motion.h3>
                  
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.4, type: "spring" }}
                    className="flex items-center justify-center gap-3 mb-3"
                  >
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className="flex items-center px-3 py-1 bg-green-100 rounded-full text-green-700 text-sm"
                    >
                      <FaCheckCircle className="mr-1 text-green-600" /> Confirmed
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className="flex items-center px-3 py-1 bg-blue-100 rounded-full text-blue-700 text-sm"
                    >
                      <FaTicketAlt className="mr-1 text-blue-600" /> #{Math.floor(1000 + Math.random() * 9000)}
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className="flex items-center px-3 py-1 bg-amber-100 rounded-full text-amber-700 text-sm"
                    >
                      <FaCalendarAlt className="mr-1 text-amber-600" /> Today
                    </motion.div>
                  </motion.div>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-gray-600 mb-6 max-w-md"
                  >
                    Your {getTypeLabel().toLowerCase()} booking has been confirmed and you've earned {earnedCoins} EcoCoins for choosing eco-friendly options!
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl mb-6 w-full shadow-sm border border-primary-200 relative overflow-hidden"
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      delay: 1.9,
                      duration: 1.5, 
                      ease: "easeInOut",
                      repeat: 3,
                      repeatType: "mirror"
                    }}
                  />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">EcoCoins Earned</p>
                      <motion.p 
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ delay: 1.9, duration: 0.5, repeat: 2, repeatDelay: 1.5 }}
                        className="text-3xl font-bold text-primary-700"
                      >
                        +{earnedCoins}
                      </motion.p>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="flex items-center bg-primary-200 px-4 py-2 rounded-full shadow-sm"
                    >
                      <span className="font-bold text-primary-800 mr-1">E</span>
                      <span className="text-sm font-medium text-primary-700">EcoCoins</span>
                    </motion.div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-primary-200">
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.0 }}
                      className="text-sm text-primary-700 flex items-center"
                    >
                      <motion.span 
                        animate={{ rotate: [0, 360] }}
                        transition={{ delay: 2.2, duration: 1, repeat: 1 }}
                      >
                        <FaStar className="mr-2 text-yellow-500" /> 
                      </motion.span>
                      Added to your EcoCoin balance and transaction history!
                    </motion.p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 2.1 }}
                  className="w-full max-w-sm mb-6 bg-green-50 p-4 rounded-lg border border-green-200"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <FaMapMarkerAlt className="text-green-600 text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-800">Your booking details have been sent to</p>
                      <p className="text-xs text-green-600">{currentUser?.email || 'your registered email'}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg transition-colors shadow-md"
                >
                  Continue Exploring
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal; 