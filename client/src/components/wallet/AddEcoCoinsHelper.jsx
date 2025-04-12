import React, { useState } from 'react';
import EcoCoinService from '../../services/EcoCoinService';
import { useAuth } from '../../context/AuthContext';

const AddEcoCoinsHelper = () => {
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();
  
  const handleAddCoins = async () => {
    try {
      // Use the current user's ID if available, otherwise fallback to 'user1'
      const userId = currentUser?.id || 'user1';
      
      // Award the coins using the service
      const result = await EcoCoinService.awardEcoCoins(
        userId,
        amount,
        {
          type: 'development_bonus',
          description: 'Development bonus coins'
        },
        'development_bonus'
      );
      
      if (result.success) {
        setMessage(`Successfully added ${amount} EcoCoins to your wallet!`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding coins:', error);
      setMessage('An unexpected error occurred');
    }
  };
  
  return (
    <div className="fixed top-20 right-4 bg-white p-4 rounded-lg shadow-lg z-50 border border-primary-100">
      <h3 className="text-lg font-bold text-primary-600 mb-2">EcoCoin Helper</h3>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}
      <button 
        className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
        onClick={handleAddCoins}
      >
        Add {amount} EcoCoins
      </button>
    </div>
  );
};

export default AddEcoCoinsHelper; 