import React, { useState, useEffect } from 'react';
import EcoCoinBalanceAnimation from './EcoCoinBalanceAnimation';
import EcoCoinService from '../../services/EcoCoinService';

/**
 * Provider component that listens for EcoCoin balance animation events
 * and renders the animation component when needed
 */
const EcoCoinAnimationProvider = () => {
  const [animationData, setAnimationData] = useState(null);
  
  useEffect(() => {
    // Handler for the animation event
    const handleAnimationEvent = (event) => {
      console.log('Animation event received:', event.detail);
      setAnimationData(event.detail);
    };
    
    // Add event listener
    window.addEventListener('ecobalanceanimation', handleAnimationEvent);
    
    // Check if there's already animation data (e.g., from a recent transaction)
    const existingData = EcoCoinService.getLastAnimationData();
    if (existingData) {
      setAnimationData(existingData);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('ecobalanceanimation', handleAnimationEvent);
    };
  }, []);
  
  // Handle animation complete
  const handleAnimationComplete = () => {
    setAnimationData(null);
  };
  
  return (
    <>
      {animationData && (
        <EcoCoinBalanceAnimation
          previousBalance={animationData.previousBalance}
          newBalance={animationData.newBalance}
          transactionAmount={animationData.transactionAmount}
          transactionType={animationData.transactionType}
          description={animationData.description}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </>
  );
};

export default EcoCoinAnimationProvider; 