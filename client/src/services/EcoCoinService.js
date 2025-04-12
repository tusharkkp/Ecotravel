import axios from 'axios';

// Base API URL - replace with your actual API URL in production
const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with headers
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

class EcoCoinService {
  // Local storage keys
  static ECOCOIN_BALANCE_KEY = 'ecocoin_balance';
  static TRANSACTION_HISTORY_KEY = 'ecocoin_transactions';
  
  // Reward types
  static REWARD_TYPES = {
    BOOKING: 'eco_booking',
    CHALLENGE: 'eco_challenge',
    REFERRAL: 'referral_reward',
    CONTRIBUTION: 'eco_contribution',
    TREE_PLANTING: 'tree_planting',
    EVENT: 'event_participation',
    ACHIEVEMENT: 'achievement_reward'
  };
  
  // EcoRating tiers
  static RATING_TIERS = {
    SEEDLING: { name: 'Seedling', minPoints: 0, maxPoints: 199 },
    SAPLING: { name: 'Sapling', minPoints: 200, maxPoints: 499 },
    TREEHUGGER: { name: 'Treehugger', minPoints: 500, maxPoints: 999 },
    ECOHERO: { name: 'EcoHero', minPoints: 1000, maxPoints: Infinity }
  };

  // Store for transaction animation data
  static transactionAnimationData = null;

  /**
   * Initialize a user's wallet if it doesn't exist
   */
  static initializeWallet(userId = 'user1') {
    // Use user-specific keys for localStorage
    const balanceKey = `${userId}_${this.ECOCOIN_BALANCE_KEY}`;
    const transactionKey = `${userId}_${this.TRANSACTION_HISTORY_KEY}`;
    
    // In a production app, this would be an API call
    // For now, we'll use localStorage
    const balance = localStorage.getItem(balanceKey);
    const transactions = localStorage.getItem(transactionKey);
    
    if (!balance) {
      // Start with a welcome bonus of 50 EcoCoins
      localStorage.setItem(balanceKey, '50');
      
      // Log the welcome transaction
      const initialTransaction = {
        id: this.generateTransactionId(),
        userId,
        amount: 50,
        type: 'welcome_bonus',
        description: 'Welcome bonus for joining LeafRoutes!',
        timestamp: new Date().toISOString(),
        carbonSaved: 0
      };
      
      localStorage.setItem(
        transactionKey, 
        JSON.stringify([initialTransaction])
      );
      
      return { success: true, balance: 50 };
    }
    
    return { 
      success: true, 
      balance: parseInt(balance, 10),
      transactions: transactions ? JSON.parse(transactions) : []
    };
  }

  /**
   * Get user's EcoCoin balance
   */
  static async getBalance(userId = 'user1') {
    try {
      console.log('EcoCoinService: Getting balance for user', userId);
      
      // Initialize wallet if it doesn't exist
      this.initializeWallet(userId);
      
      // Use user-specific key for balance
      const balanceKey = `${userId}_${this.ECOCOIN_BALANCE_KEY}`;
      
      // In a real app, this would be an API call
      // For now, we'll use localStorage
      const balance = localStorage.getItem(balanceKey);
      const numericBalance = parseInt(balance, 10) || 0;
      
      console.log('EcoCoinService: Current balance for user', userId, 'is', numericBalance);
      
      return {
        success: true,
        balance: numericBalance
      };
    } catch (error) {
      console.error('Error getting EcoCoin balance:', error);
      return {
        success: false,
        error: 'Failed to get balance'
      };
    }
  }

  /**
   * Show animated balance notification
   */
  static showBalanceAnimation(previousBalance, newBalance, amount, type, description) {
    // Store animation data in the static variable
    this.transactionAnimationData = {
      previousBalance,
      newBalance,
      transactionAmount: amount,
      transactionType: type,
      description
    };
    
    // Dispatch an event to notify components to show the animation
    const animationEvent = new CustomEvent('ecobalanceanimation', {
      detail: this.transactionAnimationData
    });
    
    window.dispatchEvent(animationEvent);
    
    return this.transactionAnimationData;
  }
  
  /**
   * Get last transaction animation data
   */
  static getLastAnimationData() {
    return this.transactionAnimationData;
  }

  /**
   * Award EcoCoins for eco-friendly bookings
   */
  static async awardEcoCoins(userId = 'user1', carbonSaved, bookingDetails, type = this.REWARD_TYPES.BOOKING) {
    try {
      console.log('EcoCoinService: Awarding EcoCoins', { userId, carbonSaved, type });
      
      // Use user-specific keys
      const balanceKey = `${userId}_${this.ECOCOIN_BALANCE_KEY}`;
      const transactionKey = `${userId}_${this.TRANSACTION_HISTORY_KEY}`;
      
      // Award 1 EcoCoin per kg of CO2 saved
      const coinsEarned = Math.round(carbonSaved);
      
      // Get current balance
      const { balance } = await this.getBalance(userId);
      
      // Update balance
      const newBalance = balance + coinsEarned;
      console.log('EcoCoinService: Updating balance for user', userId, 'from', balance, 'to', newBalance);
      
      localStorage.setItem(balanceKey, newBalance.toString());
      
      // Log transaction
      const transaction = {
        id: this.generateTransactionId(),
        userId,
        amount: coinsEarned,
        type,
        description: `Earned for saving ${carbonSaved}kg of CO2 emissions`,
        timestamp: new Date().toISOString(),
        carbonSaved,
        details: bookingDetails
      };
      
      // Update transaction history
      const history = await this.getTransactionHistory(userId);
      history.transactions.unshift(transaction);
      localStorage.setItem(
        transactionKey,
        JSON.stringify(history.transactions)
      );
      
      // Dispatch event for real-time updates
      const ecoBalanceEvent = new CustomEvent('ecobalancechange', { 
        detail: { 
          newBalance,
          userId
        } 
      });
      window.dispatchEvent(ecoBalanceEvent);
      
      // Trigger animation for the transaction
      this.showBalanceAnimation(
        balance, 
        newBalance, 
        coinsEarned, 
        type,
        `Earned for saving ${carbonSaved}kg of CO2 emissions`
      );
      
      console.log('EcoCoinService: Successfully awarded', coinsEarned, 'EcoCoins to user', userId, 'New balance:', newBalance);
      
      return {
        success: true,
        coinsEarned,
        newBalance,
        transaction
      };
    } catch (error) {
      console.error('Error awarding EcoCoins:', error);
      return {
        success: false,
        error: 'Failed to award EcoCoins'
      };
    }
  }

  /**
   * Redeem EcoCoins for rewards
   */
  static async redeemEcoCoins(userId = 'user1', amount, rewardDetails) {
    try {
      // Use user-specific keys
      const balanceKey = `${userId}_${this.ECOCOIN_BALANCE_KEY}`;
      const transactionKey = `${userId}_${this.TRANSACTION_HISTORY_KEY}`;
      
      // Check if user has enough coins
      const { balance } = await this.getBalance(userId);
      
      if (balance < amount) {
        return {
          success: false,
          error: 'Insufficient EcoCoins'
        };
      }
      
      // Update balance
      const newBalance = balance - amount;
      localStorage.setItem(balanceKey, newBalance.toString());
      
      // Log transaction
      const transaction = {
        id: this.generateTransactionId(),
        userId,
        amount: -amount,
        type: 'reward_redemption',
        description: `Redeemed for ${rewardDetails.name}`,
        timestamp: new Date().toISOString(),
        details: rewardDetails
      };
      
      // Update transaction history
      const history = await this.getTransactionHistory(userId);
      history.transactions.unshift(transaction);
      localStorage.setItem(
        transactionKey,
        JSON.stringify(history.transactions)
      );
      
      // Dispatch event for real-time updates
      const ecoBalanceEvent = new CustomEvent('ecobalancechange', { 
        detail: { 
          newBalance,
          userId
        } 
      });
      window.dispatchEvent(ecoBalanceEvent);
      
      // Trigger animation for the transaction
      this.showBalanceAnimation(
        balance, 
        newBalance, 
        -amount, 
        'reward_redemption',
        `Redeemed for ${rewardDetails.name}`
      );
      
      return {
        success: true,
        amountSpent: amount,
        newBalance,
        transaction
      };
    } catch (error) {
      console.error('Error redeeming EcoCoins:', error);
      return {
        success: false,
        error: 'Failed to redeem EcoCoins'
      };
    }
  }

  /**
   * Get transaction history
   */
  static async getTransactionHistory(userId = 'user1') {
    try {
      // Use user-specific key
      const transactionKey = `${userId}_${this.TRANSACTION_HISTORY_KEY}`;
      
      // Initialize wallet if it doesn't exist
      this.initializeWallet(userId);
      
      // In a real app, this would be an API call
      // For now, we'll use localStorage
      const transactionsJson = localStorage.getItem(transactionKey);
      const transactions = transactionsJson ? JSON.parse(transactionsJson) : [];
      
      // Sort by timestamp (newest first)
      transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return {
        success: true,
        transactions
      };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return {
        success: false,
        error: 'Failed to get transaction history'
      };
    }
  }

  /**
   * Get available rewards
   */
  static async getAvailableRewards() {
    // In a real app, this would fetch from an API
    const rewards = [
      {
        id: '1',
        name: 'Plant a Tree',
        description: 'We\'ll plant a tree on your behalf',
        cost: 100,
        category: 'contribution',
        image: 'tree.jpg'
      },
      {
        id: '2',
        name: '5% Off Eco-Hotel Booking',
        description: 'Get 5% off your next eco-friendly hotel booking',
        cost: 200,
        category: 'discount',
        image: 'hotel.jpg'
      },
      {
        id: '3',
        name: 'Carbon Offset Certificate',
        description: 'Official certificate for offsetting 100kg of CO2',
        cost: 150,
        category: 'certificate',
        image: 'certificate.jpg'
      },
      {
        id: '4',
        name: 'Eco Explorer Badge',
        description: 'Digital badge for your profile',
        cost: 50,
        category: 'badge',
        image: 'badge.jpg'
      },
      {
        id: '5',
        name: 'Donate to Ocean Cleanup',
        description: 'Support ocean cleanup initiatives',
        cost: 100,
        category: 'contribution',
        image: 'ocean.jpg'
      }
    ];
    
    return {
      success: true,
      rewards
    };
  }

  /**
   * Contribute EcoCoins to environmental causes
   */
  static async contributeEcoCoins(userId = 'user1', amount, causeDetails) {
    try {
      // Use user-specific keys
      const balanceKey = `${userId}_${this.ECOCOIN_BALANCE_KEY}`;
      const transactionKey = `${userId}_${this.TRANSACTION_HISTORY_KEY}`;
      
      // Check if user has enough coins
      const { balance } = await this.getBalance(userId);
      
      if (balance < amount) {
        return {
          success: false,
          error: 'Insufficient EcoCoins'
        };
      }
      
      // Update balance
      const newBalance = balance - amount;
      localStorage.setItem(balanceKey, newBalance.toString());
      
      // Calculate rating points - contributing gives 2x the points
      const ratingPoints = amount * 2;
      
      // Log transaction
      const transaction = {
        id: this.generateTransactionId(),
        userId,
        amount: -amount,
        type: this.REWARD_TYPES.CONTRIBUTION,
        description: `Contributed to ${causeDetails.name}`,
        timestamp: new Date().toISOString(),
        details: causeDetails,
        ratingPoints
      };
      
      // Update transaction history
      const history = await this.getTransactionHistory(userId);
      history.transactions.unshift(transaction);
      localStorage.setItem(
        transactionKey,
        JSON.stringify(history.transactions)
      );
      
      // Dispatch event for real-time updates
      const ecoBalanceEvent = new CustomEvent('ecobalancechange', { 
        detail: { 
          newBalance,
          userId
        } 
      });
      window.dispatchEvent(ecoBalanceEvent);
      
      // Trigger animation for the transaction
      this.showBalanceAnimation(
        balance, 
        newBalance, 
        -amount, 
        this.REWARD_TYPES.CONTRIBUTION,
        `Contributed to ${causeDetails.name}`
      );
      
      return {
        success: true,
        amountContributed: amount,
        ratingPoints,
        newBalance,
        transaction
      };
    } catch (error) {
      console.error('Error contributing EcoCoins:', error);
      return {
        success: false,
        error: 'Failed to contribute EcoCoins'
      };
    }
  }

  /**
   * Get user's EcoRating
   */
  static async getEcoRating(userId = 'user1') {
    try {
      // Calculate total rating points from transaction history
      const { transactions } = await this.getTransactionHistory(userId);
      
      let totalPoints = 0;
      
      transactions.forEach(transaction => {
        // Points from eco-friendly bookings - 1 point per coin
        if (transaction.amount > 0) {
          totalPoints += transaction.amount;
        }
        
        // Points from contributions - already included in transaction
        if (transaction.ratingPoints) {
          totalPoints += transaction.ratingPoints;
        }
      });
      
      // Determine tier
      let currentTier = this.RATING_TIERS.SEEDLING;
      
      if (totalPoints >= this.RATING_TIERS.ECOHERO.minPoints) {
        currentTier = this.RATING_TIERS.ECOHERO;
      } else if (totalPoints >= this.RATING_TIERS.TREEHUGGER.minPoints) {
        currentTier = this.RATING_TIERS.TREEHUGGER;
      } else if (totalPoints >= this.RATING_TIERS.SAPLING.minPoints) {
        currentTier = this.RATING_TIERS.SAPLING;
      }
      
      // Calculate progress to next tier
      let progress = 0;
      let nextTier = null;
      
      if (currentTier !== this.RATING_TIERS.ECOHERO) {
        const nextTiers = Object.values(this.RATING_TIERS).sort((a, b) => a.minPoints - b.minPoints);
        nextTier = nextTiers.find(tier => tier.minPoints > totalPoints);
        
        if (nextTier) {
          const rangeSize = nextTier.minPoints - currentTier.minPoints;
          const pointsIntoRange = totalPoints - currentTier.minPoints;
          progress = Math.min(100, Math.round((pointsIntoRange / rangeSize) * 100));
        }
      } else {
        // For EcoHero, just show 100% progress
        progress = 100;
      }
      
      return {
        success: true,
        points: totalPoints,
        currentTier: {
          ...currentTier,
          name: currentTier.name
        },
        nextTier: nextTier ? {
          ...nextTier,
          name: nextTier.name,
          pointsNeeded: nextTier.minPoints - totalPoints
        } : null,
        progress
      };
    } catch (error) {
      console.error('Error getting EcoRating:', error);
      return {
        success: false,
        error: 'Failed to get EcoRating'
      };
    }
  }

  /**
   * Award bonus EcoCoins for achievements
   */
  static async awardAchievementBonus(userId = 'user1', amount, achievementDetails) {
    try {
      // Use user-specific keys
      const balanceKey = `${userId}_${this.ECOCOIN_BALANCE_KEY}`;
      const transactionKey = `${userId}_${this.TRANSACTION_HISTORY_KEY}`;
      
      // Get current balance
      const { balance } = await this.getBalance(userId);
      
      // Update balance
      const newBalance = balance + amount;
      localStorage.setItem(balanceKey, newBalance.toString());
      
      // Log transaction
      const transaction = {
        id: this.generateTransactionId(),
        userId,
        amount,
        type: this.REWARD_TYPES.ACHIEVEMENT,
        description: `Achievement reward: ${achievementDetails.name}`,
        timestamp: new Date().toISOString(),
        details: achievementDetails
      };
      
      // Update transaction history
      const history = await this.getTransactionHistory(userId);
      history.transactions.unshift(transaction);
      localStorage.setItem(
        transactionKey,
        JSON.stringify(history.transactions)
      );
      
      // Dispatch event for real-time updates
      const ecoBalanceEvent = new CustomEvent('ecobalancechange', { 
        detail: { 
          newBalance,
          userId
        } 
      });
      window.dispatchEvent(ecoBalanceEvent);
      
      return {
        success: true,
        coinsEarned: amount,
        newBalance,
        transaction
      };
    } catch (error) {
      console.error('Error awarding achievement bonus:', error);
      return {
        success: false,
        error: 'Failed to award achievement bonus'
      };
    }
  }

  /**
   * Generate a transaction ID
   */
  static generateTransactionId() {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get total carbon saved by user
   */
  static async getTotalCarbonSaved(userId = 'user1') {
    try {
      const { transactions } = await this.getTransactionHistory(userId);
      
      const totalCarbonSaved = transactions.reduce((total, txn) => {
        if (txn.carbonSaved && txn.carbonSaved > 0) {
          return total + txn.carbonSaved;
        }
        return total;
      }, 0);
      
      return {
        success: true,
        totalCarbonSaved
      };
    } catch (error) {
      console.error('Error getting total carbon saved:', error);
      return {
        success: false,
        error: 'Failed to get total carbon saved'
      };
    }
  }

  /**
   * Get eco impact summary
   */
  static async getEcoImpactSummary(userId = 'user1') {
    try {
      const { balance } = await this.getBalance(userId);
      const { totalCarbonSaved } = await this.getTotalCarbonSaved(userId);
      const { points, currentTier, nextTier, progress } = await this.getEcoRating(userId);
      const { transactions } = await this.getTransactionHistory(userId);
      
      // Calculate total earned and spent
      const earned = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const spent = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        success: true,
        currentBalance: balance,
        totalEarned: earned,
        totalSpent: spent,
        totalCarbonSaved,
        ecoRating: {
          points,
          currentTier,
          nextTier,
          progress
        }
      };
    } catch (error) {
      console.error('Error getting eco impact summary:', error);
      return {
        success: false,
        error: 'Failed to get eco impact summary'
      };
    }
  }

  /**
   * Reset a user's wallet (for testing purposes)
   */
  static resetUserWallet(userId = 'user1') {
    const balanceKey = `${userId}_${this.ECOCOIN_BALANCE_KEY}`;
    const transactionKey = `${userId}_${this.TRANSACTION_HISTORY_KEY}`;
    
    // Clear existing data
    localStorage.removeItem(balanceKey);
    localStorage.removeItem(transactionKey);
    
    // Initialize a fresh wallet
    return this.initializeWallet(userId);
  }
}

export default EcoCoinService; 