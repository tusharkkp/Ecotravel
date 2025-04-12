import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCoins, 
  FaLeaf, 
  FaTrophy, 
  FaMapMarkedAlt, 
  FaChartLine,
  FaPen,
  FaCamera,
  FaUserFriends,
  FaInfoCircle,
  FaLock
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EcoCoinService from '../../services/EcoCoinService';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [ecoBalance, setEcoBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          // Fetch EcoCoin balance
          const balanceResult = await EcoCoinService.getBalance(currentUser.id);
          if (balanceResult.success) {
            setEcoBalance(balanceResult.balance);
          }
          
          // Fetch recent transactions
          const historyResult = await EcoCoinService.getTransactionHistory(currentUser.id);
          if (historyResult.success) {
            setTransactions(historyResult.transactions.slice(0, 3)); // Get only 3 recent transactions
          }
          
          // For demo, we'll use mock achievements
          setAchievements([
            {
              id: 'carbon-reducer',
              name: 'Carbon Reducer',
              icon: <FaLeaf className="text-emerald-500" />,
              level: 1
            },
            {
              id: 'eco-traveler',
              name: 'Eco Traveler',
              icon: <FaMapMarkedAlt className="text-blue-500" />,
              level: 2
            }
          ]);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-md max-w-md w-full text-center">
          <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Cover photo */}
              <div className="h-32 bg-gradient-to-r from-emerald-500 to-green-600 relative">
                <button className="absolute bottom-2 right-2 p-2 bg-white/30 hover:bg-white/50 rounded-full text-white">
                  <FaCamera />
                </button>
              </div>
              
              {/* Profile info */}
              <div className="px-6 pt-0 pb-6">
                <div className="relative -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-emerald-100 mx-auto">
                    {currentUser.profileImage ? (
                      <img 
                        src={currentUser.profileImage} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white text-4xl font-bold">
                        {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-emerald-600 border border-gray-200 shadow-sm hover:bg-gray-50">
                      <FaPen size={14} />
                    </button>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-center">{currentUser.name}</h1>
                <p className="text-gray-500 text-center mb-6">{currentUser.email}</p>
                
                <div className="flex justify-center mb-6">
                  <div className="px-4 py-2 bg-amber-50 rounded-full flex items-center">
                    <FaCoins className="text-amber-500 mr-2" />
                    <span className="font-bold text-amber-700">{ecoBalance} EcoCoins</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/wallet"
                    className="flex items-center px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg"
                  >
                    <FaCoins className="mr-3" />
                    EcoCoin Wallet
                  </Link>
                  
                  <Link
                    to="/wallet?tab=challenges"
                    className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg"
                  >
                    <FaUserFriends className="mr-3" />
                    Community Challenges
                  </Link>
                  
                  <Link
                    to="/wallet?tab=impact"
                    className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg"
                  >
                    <FaChartLine className="mr-3" />
                    My Eco Impact
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg"
                  >
                    <FaUser className="mr-3" />
                    Profile Settings
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Eco Stats Card */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaLeaf className="mr-2 text-emerald-500" />
                Your Eco Stats
              </h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center text-emerald-700 mb-1">
                      <FaLeaf className="mr-2" />
                      <h3 className="font-semibold">Carbon Saved</h3>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">75 kg</p>
                    <p className="text-xs text-emerald-600">Your eco-friendly choices have made a difference!</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center text-amber-700 mb-1">
                      <FaCoins className="mr-2" />
                      <h3 className="font-semibold">Total Earned</h3>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">{ecoBalance + 50} EcoCoins</p>
                    <p className="text-xs text-amber-600">From eco-bookings and challenges</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-700 mb-1">
                      <FaTrophy className="mr-2" />
                      <h3 className="font-semibold">Eco Level</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">Level 2</p>
                    <p className="text-xs text-blue-600">Eco Explorer</p>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FaCoins className="mr-2 text-amber-500" />
                  Recent Activity
                </h2>
                <Link to="/wallet?tab=history" className="text-sm text-emerald-600 hover:text-emerald-700">
                  View All
                </Link>
              </div>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {transaction.type === EcoCoinService.REWARD_TYPES.BOOKING ? 'Eco-friendly booking reward' :
                             transaction.type === EcoCoinService.REWARD_TYPES.CHALLENGE ? 'Challenge completed' :
                             transaction.type === EcoCoinService.REWARD_TYPES.REDEMPTION ? 'Reward redemption' :
                             'EcoCoin transaction'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
            
            {/* Achievements */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FaTrophy className="mr-2 text-amber-500" />
                  Achievements
                </h2>
                <Link to="/wallet?tab=impact" className="text-sm text-emerald-600 hover:text-emerald-700">
                  View All
                </Link>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : achievements.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No achievements yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="p-4 bg-gray-50 rounded-lg text-center">
                      <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center text-xl mb-2 relative">
                        {achievement.icon}
                        {achievement.level && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
                            {achievement.level}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium">{achievement.name}</p>
                    </div>
                  ))}
                  
                  {/* Locked achievements */}
                  {Array.from({ length: 4 - achievements.length }).map((_, index) => (
                    <div key={`locked-${index}`} className="p-4 bg-gray-100 rounded-lg text-center opacity-60">
                      <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center text-xl mb-2 text-gray-400">
                        <FaLock />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Locked</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 