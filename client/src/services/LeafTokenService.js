import axios from 'axios';

// Base API URL from environment variables or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Mock implementation of EcoCoin service
 * In production, this would call an actual backend API
 */
class EcoCoinService {
  // Local storage keys
  static ECOCOINS_KEY = 'ecocoins_balance';
  static ECOCOINS_HISTORY_KEY = 'ecocoins_transactions';
  static REWARD_TYPES = {
    BOOKING: 'booking_reward',
    REFERRAL: 'referral_reward',
    SIGNUP: 'signup_bonus',
    CHALLENGE: 'challenge_completed',
    REDEMPTION: 'reward_redemption'
  };

  // Initialize user's EcoCoin wallet
  static async initializeWallet(userId) {
    try {
      // In a real implementation, this would check the server
      // For now, we'll just initialize local storage if needed
      if (!localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`)) {
        localStorage.setItem(`${userId}_${this.ECOCOINS_KEY}`, '100'); // Starting bonus
        
        // Add initial transaction
        const initialTransaction = {
          id: this._generateTransactionId(),
          type: this.REWARD_TYPES.SIGNUP,
          amount: 100,
          balance: 100,
          timestamp: new Date().toISOString(),
          details: { description: 'Welcome bonus for new users' }
        };
        
        localStorage.setItem(
          `${userId}_${this.ECOCOINS_HISTORY_KEY}`, 
          JSON.stringify([initialTransaction])
        );
        
        return { 
          success: true, 
          balance: 100, 
          message: 'Wallet initialized with welcome bonus'
        };
      }
      
      return { 
        success: true, 
        balance: Number(localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`)),
        message: 'Wallet already initialized'
      };
    } catch (error) {
      console.error('Error initializing wallet:', error);
      return { 
        success: false, 
        balance: 0, 
        message: 'Failed to initialize wallet'
      };
    }
  }

  // Get user's EcoCoin balance
  static async getBalance(userId) {
    try {
      // Check if the wallet exists
      if (!localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`)) {
        await this.initializeWallet(userId);
      }
      
      const balance = Number(localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`));
      return { success: true, balance };
    } catch (error) {
      console.error('Error getting balance:', error);
      return { success: false, balance: 0, message: 'Failed to retrieve balance' };
    }
  }

  // Award EcoCoins to user for eco-friendly booking
  static async awardEcoCoins(userId, amount, bookingDetails) {
    try {
      // Check if the wallet exists
      if (!localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`)) {
        await this.initializeWallet(userId);
      }
      
      // Add to current balance
      const currentBalance = Number(localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`));
      const newBalance = currentBalance + amount;
      localStorage.setItem(`${userId}_${this.ECOCOINS_KEY}`, newBalance.toString());
      
      // Add transaction to history
      const transaction = {
        id: this._generateTransactionId(),
        type: this.REWARD_TYPES.BOOKING,
        amount: amount,
        balance: newBalance,
        timestamp: new Date().toISOString(),
        details: bookingDetails
      };
      
      this._addTransaction(userId, transaction);
      
      return { 
        success: true, 
        balance: newBalance, 
        transaction,
        message: `Successfully added ${amount} EcoCoins to your wallet`
      };
    } catch (error) {
      console.error('Error awarding EcoCoins:', error);
      return { 
        success: false, 
        message: 'Failed to award EcoCoins'
      };
    }
  }

  // Redeem EcoCoins for a reward
  static async redeemEcoCoins(userId, amount, rewardDetails) {
    try {
      // Check if the wallet exists
      if (!localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`)) {
        await this.initializeWallet(userId);
      }
      
      // Check if user has enough balance
      const currentBalance = Number(localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`));
      if (currentBalance < amount) {
        return { 
          success: false, 
          message: 'Insufficient EcoCoins balance',
          balance: currentBalance
        };
      }
      
      // Subtract from current balance
      const newBalance = currentBalance - amount;
      localStorage.setItem(`${userId}_${this.ECOCOINS_KEY}`, newBalance.toString());
      
      // Add transaction to history
      const transaction = {
        id: this._generateTransactionId(),
        type: this.REWARD_TYPES.REDEMPTION,
        amount: -amount, // Negative amount for redemption
        balance: newBalance,
        timestamp: new Date().toISOString(),
        details: rewardDetails
      };
      
      this._addTransaction(userId, transaction);
      
      return { 
        success: true, 
        balance: newBalance,
        transaction,
        message: `Successfully redeemed ${amount} EcoCoins for ${rewardDetails.rewardName}`
      };
    } catch (error) {
      console.error('Error redeeming EcoCoins:', error);
      return { 
        success: false, 
        message: 'Failed to redeem EcoCoins'
      };
    }
  }

  // Get transaction history
  static async getTransactionHistory(userId) {
    try {
      // Check if the wallet exists
      if (!localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`)) {
        await this.initializeWallet(userId);
      }
      
      const historyString = localStorage.getItem(`${userId}_${this.ECOCOINS_HISTORY_KEY}`);
      const history = historyString ? JSON.parse(historyString) : [];
      
      return { 
        success: true, 
        transactions: history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return { 
        success: false, 
        transactions: [],
        message: 'Failed to retrieve transaction history'
      };
    }
  }

  // Get available rewards
  static async getAvailableRewards() {
    // In a real implementation, this would fetch from the server
    // For demo purposes, we'll return a static list
    const rewards = [
      {
        id: 'discount-10',
        name: 'Travel Discount 10%',
        description: 'Get a 10% discount on your next eco-friendly booking',
        cost: 200,
        category: 'discount',
        image: 'https://source.unsplash.com/random/300x200/?nature,discount',
      },
      {
        id: 'carbon-offset-50',
        name: 'Carbon Offset 50kg',
        description: 'Offset 50kg of CO2 emissions through verified projects',
        cost: 150,
        category: 'offset',
        image: 'https://source.unsplash.com/random/300x200/?forest,carbon',
      },
      {
        id: 'tree-planting',
        name: 'Plant 5 Trees',
        description: 'Plant 5 trees in areas affected by deforestation',
        cost: 100,
        category: 'planting',
        image: 'https://source.unsplash.com/random/300x200/?trees,planting',
      },
      {
        id: 'eco-hotel-upgrade',
        name: 'Eco-Hotel Upgrade',
        description: 'Room upgrade at participating eco-friendly hotels',
        cost: 250,
        category: 'upgrade',
        image: 'https://source.unsplash.com/random/300x200/?hotel,eco',
      },
      {
        id: 'sustainable-product',
        name: 'Sustainable Travel Kit',
        description: 'Receive a kit with sustainable travel essentials',
        cost: 350,
        category: 'product',
        image: 'https://source.unsplash.com/random/300x200/?kit,sustainable',
      }
    ];
    
    return { success: true, rewards };
  }

  // Award bonus EcoCoins (for completing challenges, etc.)
  static async awardBonusEcoCoins(userId, amount, challengeDetails) {
    try {
      // Check if the wallet exists
      if (!localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`)) {
        await this.initializeWallet(userId);
      }
      
      // Add to current balance
      const currentBalance = Number(localStorage.getItem(`${userId}_${this.ECOCOINS_KEY}`));
      const newBalance = currentBalance + amount;
      localStorage.setItem(`${userId}_${this.ECOCOINS_KEY}`, newBalance.toString());
      
      // Add transaction to history
      const transaction = {
        id: this._generateTransactionId(),
        type: this.REWARD_TYPES.CHALLENGE,
        amount: amount,
        balance: newBalance,
        timestamp: new Date().toISOString(),
        details: challengeDetails
      };
      
      this._addTransaction(userId, transaction);
      
      return { 
        success: true, 
        balance: newBalance,
        transaction,
        message: `Earned ${amount} EcoCoins for completing ${challengeDetails.challengeName}`
      };
    } catch (error) {
      console.error('Error awarding bonus EcoCoins:', error);
      return { 
        success: false, 
        message: 'Failed to award bonus EcoCoins'
      };
    }
  }

  // Generate a unique transaction ID
  static _generateTransactionId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  // Add transaction to history
  static _addTransaction(userId, transaction) {
    try {
      const historyString = localStorage.getItem(`${userId}_${this.ECOCOINS_HISTORY_KEY}`);
      const history = historyString ? JSON.parse(historyString) : [];
      
      history.push(transaction);
      localStorage.setItem(`${userId}_${this.ECOCOINS_HISTORY_KEY}`, JSON.stringify(history));
      
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return false;
    }
  }
}

export default EcoCoinService; 