import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaHandHoldingHeart, FaLeaf } from 'react-icons/fa';

const ContributionForm = ({ 
  selectedCause, 
  balance, 
  contributionAmount, 
  setContributionAmount, 
  isLoading, 
  onContribute,
  minAmount = 50
}) => {
  const [rangeValue, setRangeValue] = useState(contributionAmount);
  const [impactPoints, setImpactPoints] = useState(contributionAmount * 2);
  const rangeRef = useRef(null);
  const progressRef = useRef(null);
  
  // Effect to sync range value with contribution amount
  useEffect(() => {
    setRangeValue(contributionAmount);
    setImpactPoints(contributionAmount * 2);
  }, [contributionAmount]);
  
  // Effect to update the range slider progress fill
  useEffect(() => {
    if (rangeRef.current && progressRef.current) {
      const percentage = ((rangeValue - minAmount) / (balance - minAmount)) * 100;
      progressRef.current.style.width = `${Math.max(0, Math.min(percentage, 100))}%`;
    }
  }, [rangeValue, balance, minAmount]);
  
  // Handle slider change
  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setRangeValue(value);
    setContributionAmount(value);
    setImpactPoints(value * 2);
  };
  
  // Handle manual input change
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10) || minAmount;
    const boundedValue = Math.max(minAmount, Math.min(value, balance));
    setRangeValue(boundedValue);
    setContributionAmount(boundedValue);
    setImpactPoints(boundedValue * 2);
  };
  
  // Quick select buttons
  const quickSelectAmounts = [
    minAmount,
    Math.min(Math.floor(balance * 0.25), minAmount * 5),
    Math.min(Math.floor(balance * 0.5), minAmount * 10),
    Math.min(Math.floor(balance * 0.75), minAmount * 15),
    balance
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
  if (!selectedCause) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-transparent bg-clip-text">
              Contribute to {selectedCause.name}
            </span>
          </h2>
          
          {/* Balance display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <div className="flex items-baseline">
                <FaCoins className="text-amber-500 mr-1" />
                <span className="text-xl font-bold text-gray-800">{balance}</span>
                <span className="text-gray-600 ml-1">EcoCoins</span>
              </div>
            </div>
            
            <div className="bg-emerald-50 px-3 py-1 rounded-full flex items-center">
              <FaLeaf className="text-emerald-500 mr-1" />
              <span className="text-sm text-emerald-700">+2× Rating Points</span>
            </div>
          </div>
          
          {/* Contribution slider */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              Contribution Amount
            </label>
            
            <div className="relative mb-6">
              <div className="h-2 bg-gray-200 rounded-full mb-4">
                <div 
                  ref={progressRef}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                ></div>
              </div>
              
              <input
                ref={rangeRef}
                type="range"
                min={minAmount}
                max={balance}
                value={rangeValue}
                onChange={handleRangeChange}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{minAmount}</span>
                <span>{balance}</span>
              </div>
            </div>
            
            {/* Manual input and impact display */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <input
                    type="number"
                    min={minAmount}
                    max={balance}
                    value={rangeValue}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <FaCoins className="text-amber-500" />
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 bg-emerald-50 p-3 rounded-lg">
                <p className="text-sm text-emerald-800 mb-1">Your Impact</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-emerald-700">{impactPoints}</span>
                  <span className="ml-1 text-emerald-600">rating points</span>
                </div>
              </div>
            </div>
            
            {/* Quick select buttons */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Quick Select:</p>
              <div className="flex flex-wrap gap-2">
                {quickSelectAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setRangeValue(amount);
                      setContributionAmount(amount);
                      setImpactPoints(amount * 2);
                    }}
                    className={`px-3 py-1 text-sm rounded-full transition-colors
                      ${rangeValue === amount 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                    }
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contribution impact message */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm text-blue-800">
            <div className="flex items-start">
              <FaLeaf className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Your contribution will help:</p>
                <p>{selectedCause.impactDescription}</p>
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContribute}
              disabled={isLoading || contributionAmount > balance || contributionAmount < minAmount}
              className={`
                px-6 py-3 rounded-lg font-medium flex items-center 
                ${isLoading || contributionAmount > balance || contributionAmount < minAmount
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                }
                transition-all duration-300
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaHandHoldingHeart className="mr-2" />
                  Contribute {contributionAmount} EcoCoins
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContributionForm; 