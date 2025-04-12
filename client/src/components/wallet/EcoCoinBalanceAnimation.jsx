import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaCoins, FaArrowUp, FaArrowDown, FaLeaf } from 'react-icons/fa';

// AnimatedNumber component to animate counting up/down to a value
const AnimatedNumber = ({ value, duration = 2.5, className }) => {
  const nodeRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    
    // Don't animate if we're going from 0 to 0
    if (start === end) return;
    
    // Calculate increment and timing
    const increment = end > start ? 1 : -1;
    const range = Math.abs(end - start);
    const stepTime = Math.abs(Math.floor(duration * 1000 / range));
    
    // Constrain animation speed for faster UX with large numbers
    const minStepTime = 5; // minimum ms per step
    const actualStepTime = Math.max(minStepTime, stepTime);
    const actualIncrement = Math.ceil(range / (duration * 1000 / actualStepTime)) * increment;
    
    // Perform the animation
    const timer = setInterval(() => {
      start += actualIncrement;
      setDisplayValue(start);
      
      // Check if we've reached or passed the target
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayValue(end); // ensure we end exactly on the target
        clearInterval(timer);
      }
    }, actualStepTime);
    
    return () => {
      clearInterval(timer);
    };
  }, [value, duration]);
  
  return <span className={className}>{displayValue}</span>;
};

// TransactionParticle component
const TransactionParticle = ({ x, y, isPositive }) => {
  const controls = useAnimation();
  const particleVariants = {
    initial: { x, y, scale: 0, opacity: 0 },
    animate: {
      y: y - 100 * (Math.random() + 0.5),
      x: x + (Math.random() - 0.5) * 100,
      scale: Math.random() * 0.5 + 0.5,
      opacity: 1,
      transition: {
        duration: 0.8 + Math.random() * 0.7,
        ease: "easeOut"
      }
    },
    exit: {
      y: y - 150,
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };
  
  useEffect(() => {
    controls.start("animate");
  }, [controls]);
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial="initial"
      animate={controls}
      exit="exit"
      variants={particleVariants}
    >
      {isPositive ? (
        <FaCoins className="text-amber-500" size={Math.random() * 8 + 8} />
      ) : (
        <FaCoins className="text-gray-400" size={Math.random() * 8 + 8} />
      )}
    </motion.div>
  );
};

// Main component to display EcoCoin balance changes
const EcoCoinBalanceAnimation = ({ 
  previousBalance = 0, 
  newBalance, 
  transactionAmount = 0, 
  transactionType, 
  description = '',
  onAnimationComplete 
}) => {
  const [particles, setParticles] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef(null);
  const isPositive = transactionAmount > 0;
  
  // Generate particles when transaction amount changes
  useEffect(() => {
    if (transactionAmount === 0) return;
    
    const numParticles = Math.min(Math.abs(Math.round(transactionAmount / 5)), 30);
    const newParticles = Array.from({ length: numParticles }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 20
    }));
    
    setParticles(newParticles);
    
    // Auto-trigger animation completion after duration
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onAnimationComplete) onAnimationComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [transactionAmount, onAnimationComplete]);
  
  // Animation variants for the container
  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 } 
    }
  };
  
  // Animation variants for the balance change
  const balanceChangeVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const getTransactionTypeIcon = () => {
    switch(transactionType) {
      case 'eco_booking':
        return <FaLeaf className="text-green-500" />;
      case 'reward_redemption':
        return <FaArrowDown className="text-red-500" />;
      default:
        return isPositive ? 
          <FaArrowUp className="text-green-500" /> : 
          <FaArrowDown className="text-red-500" />;
    }
  };
  
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          ref={containerRef}
          className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-md border-2"
          style={{ 
            borderColor: isPositive ? '#10b981' : '#ef4444',
            zIndex: 50
          }}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Title Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaCoins className="text-amber-500" />
              <h3 className="font-bold text-gray-800">
                {isPositive ? 'EcoCoins Earned!' : 'EcoCoins Spent'}
              </h3>
            </div>
            <motion.button
              className="text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsAnimating(false);
                if (onAnimationComplete) onAnimationComplete();
              }}
            >
              &times;
            </motion.button>
          </div>
          
          {/* Transaction Amount */}
          <motion.div 
            className="flex justify-center items-center my-4"
            variants={balanceChangeVariants}
          >
            <div className={`text-3xl font-bold flex items-center ${
              isPositive ? 'text-green-500' : 'text-red-500'
            }`}>
              {isPositive ? '+' : ''}
              <AnimatedNumber 
                value={transactionAmount} 
                className="mx-1"
              />
              <FaCoins className="text-amber-500 ml-1" size={24} />
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p 
            className="text-center text-gray-600 mb-3"
            variants={balanceChangeVariants}
          >
            {description}
          </motion.p>
          
          {/* Balance Display */}
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <div className="text-gray-500 text-sm">Previous Balance:</div>
            <div className="font-medium flex items-center">
              {previousBalance}
              <FaCoins className="text-amber-500 ml-1 text-xs" />
            </div>
          </div>
          
          <div className="flex justify-between pt-1">
            <div className="text-gray-500 text-sm">New Balance:</div>
            <div className="font-bold flex items-center">
              <AnimatedNumber 
                value={newBalance} 
                duration={2}
              />
              <FaCoins className="text-amber-500 ml-1 text-xs" />
            </div>
          </div>
          
          {/* Transaction Type */}
          <div className="flex justify-center mt-4">
            <div className="bg-gray-100 text-xs rounded-full px-3 py-1 inline-flex items-center">
              {getTransactionTypeIcon()}
              <span className="ml-1">{
                transactionType === 'eco_booking' ? 'Eco-friendly Booking' :
                transactionType === 'reward_redemption' ? 'Reward Redemption' :
                transactionType === 'eco_challenge' ? 'Eco Challenge Completed' :
                transactionType === 'welcome_bonus' ? 'Welcome Bonus' :
                transactionType
              }</span>
            </div>
          </div>
          
          {/* Particles effect */}
          {particles.map(particle => (
            <TransactionParticle
              key={particle.id}
              x={particle.x}
              y={particle.y}
              isPositive={isPositive}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EcoCoinBalanceAnimation; 