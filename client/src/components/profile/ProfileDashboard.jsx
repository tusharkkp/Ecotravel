import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaEdit, 
  FaLeaf, 
  FaAward, 
  FaChartLine, 
  FaCog,
  FaSignOutAlt,
  FaHistory,
  FaCoins
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EcoCoinService from '../../services/EcoCoinService';

const StatCard = ({ icon, title, value, color }) => (
  <motion.div 
    className={`p-6 rounded-xl shadow-sm bg-white border-l-4 ${color}`}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className="flex items-start">
      <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-600', '-100')} ${color.replace('border-', 'text-')}`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const BadgeItem = ({ name, description, earned, date }) => (
  <motion.div 
    className={`p-4 rounded-lg border ${earned ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
    whileHover={{ scale: earned ? 1.02 : 1 }}
  >
    <div className="flex items-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        earned ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
      }`}>
        <FaAward size={24} />
      </div>
      <div className="ml-4">
        <h3 className={`font-medium ${earned ? 'text-gray-900' : 'text-gray-500'}`}>{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        {earned && date && <p className="text-xs text-emerald-600 mt-1">Earned on {date}</p>}
      </div>
    </div>
  </motion.div>
);

const ProfileDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Get EcoCoin balance and transactions
    const fetchEcoCoinData = async () => {
      try {
        const userBalanceResult = await EcoCoinService.getBalance();
        const userTransactionsResult = await EcoCoinService.getTransactionHistory();
        
        if (userBalanceResult && userBalanceResult.success) {
          setBalance(userBalanceResult.balance);
        }
        
        if (userTransactionsResult && userTransactionsResult.success) {
          setTransactions(userTransactionsResult.transactions || []);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching EcoCoin data:', error);
        setTransactions([]);
      }
    };
    
    fetchEcoCoinData();
  }, [currentUser, navigate]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  if (!currentUser) {
    return null; // Will redirect to login via useEffect
  }
  
  // Example badges - in a real app these would come from the user's data
  const badges = [
    { 
      id: 1, 
      name: 'First Green Trip', 
      description: 'Completed your first eco-friendly trip', 
      earned: true, 
      date: '15 Jun 2023' 
    },
    { 
      id: 2, 
      name: 'Carbon Saver', 
      description: 'Saved over 100kg of carbon emissions', 
      earned: currentUser.carbonSaved >= 100, 
      date: currentUser.carbonSaved >= 100 ? '23 Aug 2023' : null 
    },
    { 
      id: 3, 
      name: 'EcoCoin Collector', 
      description: 'Earned over 500 EcoCoins', 
      earned: balance >= 500, 
      date: balance >= 500 ? '10 Oct 2023' : null 
    },
    { 
      id: 4, 
      name: 'Sustainable Explorer', 
      description: 'Booked 5 or more green accommodations', 
      earned: false, 
      date: null 
    },
  ];
  
  // Calculate eco-friendly trips count safely
  const getEcoFriendlyTripsCount = () => {
    if (!transactions || !Array.isArray(transactions)) {
      return 0;
    }
    return transactions.filter(t => 
      t && t.type === EcoCoinService.REWARD_TYPES.BOOKING
    ).length || 0;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
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
                </div>
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <p className="text-emerald-100">{currentUser.email}</p>
                
                <div className="mt-4 bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white flex items-center">
                  <FaCoins className="text-yellow-300 mr-2" />
                  <span>{balance} EcoCoins</span>
                </div>
              </div>
              
              <div className="p-6">
                <nav className="space-y-2">
                  <Link 
                    to="/profile/settings" 
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    <FaCog className="mr-3" />
                    Account Settings
                  </Link>
                  <Link 
                    to="/eco-wallet" 
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    <FaCoins className="mr-3" />
                    EcoCoin Wallet
                  </Link>
                  <Link 
                    to="/travel-history" 
                    className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    <FaHistory className="mr-3" />
                    Travel History
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Logout
                  </button>
                </nav>
              </div>
            </motion.div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                  <Link 
                    to="/profile/settings" 
                    className="text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1">{currentUser.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="mt-1">{currentUser.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="mt-1">
                      {currentUser.createdAt 
                        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not available'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                    <p className="mt-1 capitalize">{currentUser.role || 'User'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Eco-Impact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard 
                  icon={<FaLeaf size={18} />} 
                  title="Carbon Saved" 
                  value={`${currentUser.carbonSaved || 0}kg`} 
                  color="border-emerald-600" 
                />
                
                <StatCard 
                  icon={<FaCoins size={18} />} 
                  title="EcoCoins Earned" 
                  value={balance} 
                  color="border-yellow-600" 
                />
                
                <StatCard 
                  icon={<FaChartLine size={18} />} 
                  title="Eco-Friendly Trips" 
                  value={getEcoFriendlyTripsCount()} 
                  color="border-blue-600" 
                />
              </div>
            </motion.div>
            
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Badges</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map(badge => (
                  <BadgeItem 
                    key={badge.id}
                    name={badge.name}
                    description={badge.description}
                    earned={badge.earned}
                    date={badge.date}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard; 