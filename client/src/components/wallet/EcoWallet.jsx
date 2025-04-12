import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCoins, 
  FaHistory, 
  FaGift, 
  FaChevronRight, 
  FaChevronDown, 
  FaLeaf,
  FaReceipt,
  FaExchangeAlt,
  FaTrophy,
  FaUsers,
  FaChartLine,
  FaCertificate
} from 'react-icons/fa';
import EcoCoinService from '../../services/EcoCoinService';
import { AuthContext } from '../../context/AuthContext';
import EcoCommunityChallenge from './EcoCommunityChallenge';
import EcoImpactDashboard from './EcoImpactDashboard';

const BalanceCard = ({ balance, onHistoryClick, onRewardsClick }) => (
  <motion.div 
    className="bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl p-6 shadow-lg text-white relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 opacity-10">
      <FaLeaf className="w-full h-full" />
    </div>
    
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">EcoCoin Balance</h2>
      <div className="flex items-center">
        <FaCoins className="text-yellow-300 mr-2" size={24} />
        <span className="text-3xl font-bold">{balance}</span>
      </div>
    </div>
    
    <div className="flex justify-between mt-4">
      <motion.button
        className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onHistoryClick}
      >
        <FaHistory className="mr-2" />
        Transaction History
      </motion.button>
      
      <motion.button
        className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRewardsClick}
      >
        <FaGift className="mr-2" />
        Redeem Rewards
      </motion.button>
    </div>
  </motion.div>
);

const TransactionItem = ({ transaction }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getIcon = () => {
    switch (transaction.type) {
      case EcoCoinService.REWARD_TYPES.BOOKING:
        return <FaReceipt className="text-emerald-500" size={20} />;
      case EcoCoinService.REWARD_TYPES.REFERRAL:
        return <FaExchangeAlt className="text-blue-500" size={20} />;
      case EcoCoinService.REWARD_TYPES.SIGNUP:
        return <FaTrophy className="text-yellow-500" size={20} />;
      case EcoCoinService.REWARD_TYPES.CHALLENGE:
        return <FaTrophy className="text-purple-500" size={20} />;
      case EcoCoinService.REWARD_TYPES.REDEMPTION:
        return <FaGift className="text-red-500" size={20} />;
      default:
        return <FaCoins className="text-gray-500" size={20} />;
    }
  };
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getTransactionTitle = () => {
    switch (transaction.type) {
      case EcoCoinService.REWARD_TYPES.BOOKING:
        return transaction.details?.bookingName || "Eco-friendly booking reward";
      case EcoCoinService.REWARD_TYPES.REFERRAL:
        return "Referral reward";
      case EcoCoinService.REWARD_TYPES.SIGNUP:
        return "Sign-up bonus";
      case EcoCoinService.REWARD_TYPES.CHALLENGE:
        return transaction.details?.challengeName || "Challenge completed";
      case EcoCoinService.REWARD_TYPES.REDEMPTION:
        return transaction.details?.rewardName 
          ? `Redeemed: ${transaction.details.rewardName}` 
          : "Reward redemption";
      default:
        return "EcoCoin transaction";
    }
  };
  
  return (
    <motion.div 
      className="border border-gray-100 rounded-lg bg-white shadow-sm mb-3 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-gray-50 rounded-full">
            {getIcon()}
          </div>
          <div>
            <p className="font-medium">{getTransactionTitle()}</p>
            <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`font-bold mr-2 ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
          </span>
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="px-4 pb-4 text-sm bg-gray-50"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="py-2">
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">{transaction.id}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">New Balance:</span>
                <span>{transaction.balance} EcoCoins</span>
              </div>
              
              {transaction.details && Object.keys(transaction.details).map(key => {
                // Skip internal or sensitive fields
                if (key === 'id' || key === 'userId' || key === 'amount') return null;
                
                // Format the detail value
                let value = transaction.details[key];
                if (typeof value === 'object') {
                  value = JSON.stringify(value);
                }
                
                return (
                  <div className="flex justify-between mb-1" key={key}>
                    <span className="text-gray-600">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="max-w-[200px] truncate">{value}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TransactionHistory = ({ transactions }) => (
  <motion.div
    className="mt-6 bg-white rounded-xl p-6 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    <h3 className="text-xl font-bold mb-4 flex items-center">
      <FaHistory className="mr-2 text-gray-600" />
      Transaction History
    </h3>
    
    <div className="max-h-[400px] overflow-y-auto pr-2">
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No transactions yet</p>
      ) : (
        transactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))
      )}
    </div>
  </motion.div>
);

const RewardCard = ({ reward, balance, onRedeem }) => {
  const canAfford = balance >= reward.cost;
  
  return (
    <motion.div 
      className={`border rounded-xl overflow-hidden shadow-md bg-white ${!canAfford ? 'opacity-70' : ''}`}
      whileHover={canAfford ? { y: -5, scale: 1.02 } : {}}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ backgroundImage: `url(${reward.image})` }}
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-lg">{reward.name}</h4>
          <div className="flex items-center text-amber-500 font-bold">
            <FaCoins className="mr-1" />
            {reward.cost}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mt-2 h-12 overflow-hidden">
          {reward.description}
        </p>
        
        <motion.button
          className={`w-full mt-4 py-2 rounded-lg flex items-center justify-center ${
            canAfford 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileTap={canAfford ? { scale: 0.98 } : {}}
          onClick={() => canAfford && onRedeem(reward)}
          disabled={!canAfford}
        >
          <FaGift className="mr-2" />
          {canAfford ? 'Redeem Reward' : 'Insufficient EcoCoins'}
        </motion.button>
      </div>
    </motion.div>
  );
};

const RewardsGallery = ({ rewards, balance, onRedeem }) => (
  <motion.div
    className="mt-6 bg-white rounded-xl p-6 shadow-md"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
  >
    <h3 className="text-xl font-bold mb-4 flex items-center">
      <FaGift className="mr-2 text-gray-600" />
      Available Rewards
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {rewards.map(reward => (
        <RewardCard 
          key={reward.id} 
          reward={reward} 
          balance={balance}
          onRedeem={onRedeem}
        />
      ))}
    </div>
  </motion.div>
);

const RedemptionModal = ({ reward, onConfirm, onCancel, isLoading }) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-xl max-w-md w-full p-6"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
    >
      <h3 className="text-xl font-bold text-center mb-4">Confirm Redemption</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Reward:</span>
          <span>{reward.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Cost:</span>
          <span className="flex items-center text-amber-600">
            <FaCoins className="mr-1" />
            {reward.cost} EcoCoins
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-6">
        Are you sure you want to redeem this reward? This action cannot be undone.
      </p>
      
      <div className="flex space-x-4">
        <button
          className="flex-1 py-2 bg-gray-200 rounded-lg"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <motion.button
          className="flex-1 py-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center"
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Confirm Redemption'
          )}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

const EcoWallet = () => {
  const { currentUser } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('wallet');
  
  useEffect(() => {
    const loadWalletData = async () => {
      setIsLoading(true);
      
      try {
        // Get user's balance
        const balanceResult = await EcoCoinService.getBalance(currentUser.id);
        if (balanceResult.success) {
          setBalance(balanceResult.balance);
        }
        
        // Get transaction history
        const historyResult = await EcoCoinService.getTransactionHistory(currentUser.id);
        if (historyResult.success) {
          setTransactions(historyResult.transactions);
        }
        
        // Get available rewards
        const rewardsResult = await EcoCoinService.getAvailableRewards();
        if (rewardsResult.success) {
          setRewards(rewardsResult.rewards);
        }
      } catch (error) {
        console.error("Error loading wallet data:", error);
        showNotification("Error loading wallet data. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser) {
      loadWalletData();
    }
  }, [currentUser]);
  
  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
  };
  
  const handleRedeemConfirm = async () => {
    setIsRedeeming(true);
    
    try {
      const result = await EcoCoinService.redeemEcoCoins(
        currentUser.id, 
        selectedReward.cost, 
        { 
          rewardId: selectedReward.id,
          rewardName: selectedReward.name,
          rewardCategory: selectedReward.category
        }
      );
      
      if (result.success) {
        setBalance(result.balance);
        
        // Add the new transaction to the history
        setTransactions(prev => [result.transaction, ...prev]);
        
        showNotification(`Successfully redeemed ${selectedReward.name}!`, "success");
      } else {
        showNotification(result.message || "Failed to redeem reward. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      showNotification("Error processing redemption. Please try again.", "error");
    } finally {
      setIsRedeeming(false);
      setSelectedReward(null);
    }
  };
  
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  
  // Reset wallet data for troubleshooting
  const handleResetWallet = () => {
    if (window.confirm('Are you sure you want to reset your EcoWallet? This will reset your balance to the initial welcome bonus and remove all transaction history.')) {
      try {
        const userId = currentUser.id || 'user1';
        EcoCoinService.resetUserWallet(userId);
        
        // Reload wallet data
        loadWalletData();
        
        // Show success notification
        showNotification('Wallet reset successfully! Your balance has been restored to the welcome bonus amount.', 'success');
      } catch (error) {
        console.error('Error resetting wallet:', error);
        showNotification('Failed to reset wallet. Please try again.', 'error');
      }
    }
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'wallet':
        return (
          <>
            <BalanceCard 
              balance={balance} 
              onHistoryClick={() => setActiveTab('history')}
              onRewardsClick={() => setActiveTab('rewards')}
            />
            
            {isLoading ? (
              <div className="bg-white rounded-xl p-6 shadow-md animate-pulse h-64 mt-6"></div>
            ) : (
              <>
                <TransactionHistory transactions={transactions.slice(0, 5)} />
                
                <div className="flex justify-center mt-4">
                  <motion.button
                    className="text-emerald-600 font-medium flex items-center hover:text-emerald-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('history')}
                  >
                    View All Transactions <FaChevronRight className="ml-1" />
                  </motion.button>
                </div>
              </>
            )}
          </>
        );
        
      case 'history':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaHistory className="mr-2 text-emerald-600" />
              Transaction History
            </h2>
            
            {isLoading ? (
              <div className="bg-white rounded-xl p-6 shadow-md animate-pulse h-64"></div>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </>
        );
        
      case 'rewards':
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaGift className="mr-2 text-emerald-600" />
              Redeem EcoCoins
            </h2>
            
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Available Balance</h3>
                <div className="flex items-center text-xl font-bold text-amber-500">
                  <FaCoins className="mr-2" />
                  {balance} EcoCoins
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">
                Use your EcoCoins to redeem eco-friendly rewards and contribute to a more sustainable future.
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className="bg-gray-100 animate-pulse h-64 rounded-xl" 
                  />
                ))}
              </div>
            ) : (
              <RewardsGallery 
                rewards={rewards} 
                balance={balance} 
                onRedeem={handleRedeemClick} 
              />
            )}
          </>
        );
        
      case 'challenges':
        return <EcoCommunityChallenge />;
        
      case 'impact':
        return <EcoImpactDashboard />;
        
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Tab navigation */}
      <div className="mb-6 flex flex-nowrap overflow-x-auto pb-2 gap-2">
        <motion.button
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'wallet' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('wallet')}
        >
          <FaCoins className="mr-2" />
          My EcoWallet
        </motion.button>
        
        <motion.button
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'history' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('history')}
        >
          <FaHistory className="mr-2" />
          Transaction History
        </motion.button>
        
        <motion.button
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'rewards' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('rewards')}
        >
          <FaGift className="mr-2" />
          Redeem Rewards
        </motion.button>
        
        <motion.button
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'challenges' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('challenges')}
        >
          <FaUsers className="mr-2" />
          Community Challenges
        </motion.button>
        
        <motion.button
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center whitespace-nowrap ${
            activeTab === 'impact' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('impact')}
        >
          <FaChartLine className="mr-2" />
          My Eco Impact
        </motion.button>
      </div>
      
      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
      
      {/* Redemption modal */}
      {selectedReward && (
        <RedemptionModal
          reward={selectedReward}
          onConfirm={handleRedeemConfirm}
          onCancel={() => setSelectedReward(null)}
          isLoading={isRedeeming}
        />
      )}
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-600 text-white' 
                : notification.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcoWallet; 