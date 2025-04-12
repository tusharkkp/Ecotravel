import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCoins, 
  FaHistory, 
  FaExchangeAlt, 
  FaStore, 
  FaChartLine,
  FaHandHoldingHeart
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import EcoCoinService from '../services/EcoCoinService';
import { Link } from 'react-router-dom';

const WalletPage = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchWalletData = async () => {
      setIsLoading(true);
      try {
        // Fetch balance
        const balanceResult = await EcoCoinService.getBalance(currentUser?.id);
        if (balanceResult.success) {
          setBalance(balanceResult.balance);
        }
        
        // Fetch transaction history
        const historyResult = await EcoCoinService.getTransactionHistory(currentUser?.id);
        if (historyResult.success) {
          setTransactions(historyResult.transactions);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWalletData();
  }, [currentUser]);
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const renderTransactionIcon = (type) => {
    switch (type) {
      case EcoCoinService.REWARD_TYPES.BOOKING:
        return <div className="bg-blue-100 p-2 rounded-full"><FaExchangeAlt className="text-blue-600" /></div>;
      case EcoCoinService.REWARD_TYPES.CHALLENGE:
        return <div className="bg-purple-100 p-2 rounded-full"><FaChartLine className="text-purple-600" /></div>;
      case EcoCoinService.REWARD_TYPES.REFERRAL:
        return <div className="bg-yellow-100 p-2 rounded-full"><FaCoins className="text-yellow-600" /></div>;
      case 'reward_redemption':
        return <div className="bg-amber-100 p-2 rounded-full"><FaStore className="text-amber-600" /></div>;
      case 'contribution':
        return <div className="bg-red-100 p-2 rounded-full"><FaHandHoldingHeart className="text-red-600" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><FaCoins className="text-gray-600" /></div>;
    }
  };
  
  const renderTransactionLabel = (type) => {
    switch (type) {
      case EcoCoinService.REWARD_TYPES.BOOKING:
        return 'Eco-friendly Booking';
      case EcoCoinService.REWARD_TYPES.CHALLENGE:
        return 'Challenge Completed';
      case EcoCoinService.REWARD_TYPES.REFERRAL:
        return 'Referral Bonus';
      case 'reward_redemption':
        return 'Reward Redemption';
      case 'contribution':
        return 'Environmental Contribution';
      case 'welcome_bonus':
        return 'Welcome Bonus';
      default:
        return 'Transaction';
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">EcoCoin Wallet</h1>
          
          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 opacity-10">
              <FaCoins className="w-full h-full" />
            </div>
            
            <div className="md:flex justify-between items-center">
              <div>
                <p className="text-amber-100 mb-1">Current Balance</p>
                <h2 className="text-4xl font-bold mb-2">{balance} EcoCoins</h2>
                <p className="text-amber-100 text-sm max-w-md">
                  Use your EcoCoins to contribute to environmental causes or redeem for eco-friendly rewards.
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
                <Link
                  to="/contribute"
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center transition-colors"
                >
                  <FaHandHoldingHeart className="mr-2" />
                  Contribute
                </Link>
                
                <Link
                  to="/rewards"
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center transition-colors"
                >
                  <FaStore className="mr-2" />
                  Rewards
                </Link>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                className={`pb-4 px-1 text-sm font-medium ${
                  activeTab === 'overview' 
                    ? 'text-amber-600 border-b-2 border-amber-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              
              <button
                className={`pb-4 px-1 text-sm font-medium ${
                  activeTab === 'history' 
                    ? 'text-amber-600 border-b-2 border-amber-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('history')}
              >
                Transaction History
              </button>
            </div>
          </div>
          
          {activeTab === 'overview' ? (
            <div>
              {/* EcoCoin Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-green-600 font-bold">Total Earned</div>
                  <div className="text-2xl font-bold mt-1">
                    +{transactions
                      .filter(t => t.amount > 0)
                      .reduce((sum, t) => sum + t.amount, 0)} EcoCoins
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-red-600 font-bold">Total Spent</div>
                  <div className="text-2xl font-bold mt-1">
                    {transactions
                      .filter(t => t.amount < 0)
                      .reduce((sum, t) => sum + t.amount, 0)} EcoCoins
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-amber-600 font-bold">Current Balance</div>
                  <div className="text-2xl font-bold mt-1">{balance} EcoCoins</div>
                </div>
              </div>
              
              {/* Recent Transactions */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
                
                {transactions.length === 0 ? (
                  <div className="bg-white rounded-xl p-6 text-center text-gray-500 shadow-sm border border-gray-100">
                    No transactions yet
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {transactions.slice(0, 5).map((transaction, index) => (
                      <div 
                        key={transaction.id} 
                        className={`p-4 flex items-center ${
                          index < transactions.slice(0, 5).length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        {renderTransactionIcon(transaction.type)}
                        
                        <div className="ml-4 flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{renderTransactionLabel(transaction.type)}</p>
                              <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                            </div>
                            
                            <div className={`font-bold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {transactions.length > 5 && (
                      <div className="p-3 bg-gray-50 text-center">
                        <button 
                          className="text-sm text-amber-600 font-medium hover:text-amber-700"
                          onClick={() => setActiveTab('history')}
                        >
                          View all transactions
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>
              
              {transactions.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center text-gray-500 shadow-sm border border-gray-100">
                  No transactions yet
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {transactions.map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className={`p-4 flex items-center ${
                        index < transactions.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      {renderTransactionIcon(transaction.type)}
                      
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{renderTransactionLabel(transaction.type)}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                            {transaction.description && (
                              <p className="text-xs text-gray-600 mt-1">{transaction.description}</p>
                            )}
                          </div>
                          
                          <div className={`font-bold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage; 