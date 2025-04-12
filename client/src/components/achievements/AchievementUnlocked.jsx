import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  FaTrophy, 
  FaLeaf, 
  FaCoins, 
  FaCertificate, 
  FaTimesCircle,
  FaCheck,
  FaMedal,
  FaAward
} from 'react-icons/fa';

// Achievement icon mapping
const achievementIcons = {
  'carbon-reducer': <FaLeaf className="w-full h-full text-emerald-500" />,
  'challenge-master': <FaTrophy className="w-full h-full text-amber-500" />,
  'eco-booker': <FaCertificate className="w-full h-full text-blue-500" />,
  'ecocoin-collector': <FaCoins className="w-full h-full text-yellow-500" />,
  'default': <FaAward className="w-full h-full text-indigo-500" />
};

// Confetti launcher function
const launchConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const colors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];
  
  const randomInRange = (min, max) => Math.random() * (max - min) + min;
  
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    disableForReducedMotion: true
  });
  
  // Continuous bursts
  (function frame() {
    const timeLeft = animationEnd - Date.now();
    
    if (timeLeft <= 0) return;
    
    const particleCount = 50 * (timeLeft / duration);
    
    confetti({
      particleCount,
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      origin: { y: 0.6 },
      colors,
      disableForReducedMotion: true
    });
    
    requestAnimationFrame(frame);
  }());
};

// Badges that show achievement level
const LevelBadge = ({ level }) => {
  let bgColor, content;
  
  switch(level) {
    case 3:
      bgColor = "bg-gradient-to-r from-yellow-400 to-yellow-600";
      content = (
        <>
          <FaMedal className="mr-1" /> Level 3
        </>
      );
      break;
    case 2:
      bgColor = "bg-gradient-to-r from-gray-300 to-gray-500";
      content = (
        <>
          <FaMedal className="mr-1" /> Level 2
        </>
      );
      break;
    default:
      bgColor = "bg-gradient-to-r from-amber-700 to-amber-900";
      content = (
        <>
          <FaMedal className="mr-1" /> Level 1
        </>
      );
      break;
  }
  
  return (
    <div className={`${bgColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center`}>
      {content}
    </div>
  );
};

// Main achievement unlocked component
const AchievementUnlocked = ({ 
  achievement, 
  onClose, 
  autoCloseDelay = 8000,
  showConfetti = true 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  // Icon based on achievement type
  const icon = achievement?.id ? 
    achievementIcons[achievement.id] || achievementIcons.default : 
    achievementIcons.default;
  
  // Launch confetti when the achievement is shown
  useEffect(() => {
    if (showConfetti && achievement) {
      setTimeout(launchConfetti, 200);
    }
    
    // Auto-close after delay if specified
    if (autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, showConfetti, autoCloseDelay]);
  
  // Handle closing the achievement notification
  const handleClose = () => {
    setIsVisible(false);
    // Give time for exit animation before calling parent onClose
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };
  
  // Toggle showing more details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  if (!achievement) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Top decorative pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-90" />
              
              {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-32 h-32 -ml-16 -mt-16 bg-white opacity-10 rounded-full" />
              <div className="absolute bottom-0 right-0 w-40 h-40 -mr-20 -mb-20 bg-white opacity-10 rounded-full" />
              
              {/* Achievement icon */}
              <div className="relative py-10 flex flex-col items-center">
                <motion.div
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-white"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div className="w-16 h-16">
                    {icon}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-white"
                >
                  <h2 className="text-2xl font-bold mb-1">Achievement Unlocked!</h2>
                  {achievement.level && (
                    <div className="flex justify-center mb-2">
                      <LevelBadge level={achievement.level} />
                    </div>
                  )}
                  <p className="text-xl font-semibold">{achievement.name}</p>
                </motion.div>
              </div>
            </div>
            
            <div className="bg-white p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-gray-700 text-center mb-4">{achievement.description}</p>
                
                {/* Reward badge */}
                {achievement.reward && (
                  <div className="bg-green-50 rounded-lg p-4 text-center mb-4">
                    <p className="font-medium text-green-800 mb-1">Reward Earned:</p>
                    <p className="text-green-700 font-bold">{achievement.reward}</p>
                  </div>
                )}
                
                {/* Toggle button to show/hide details */}
                <button
                  className="w-full py-2 px-4 mb-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center"
                  onClick={toggleDetails}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                  {showDetails ? 
                    <FaTimesCircle className="ml-2" /> : 
                    <FaCheck className="ml-2" />
                  }
                </button>
                
                {/* Expanded details */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {achievement.criteria && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4">
                          <p className="font-medium mb-1">How you earned it:</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {achievement.criteria.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Close button */}
                <button
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                  onClick={handleClose}
                >
                  Continue
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementUnlocked; 