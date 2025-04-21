import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLeaf, 
  FaCoins, 
  FaChartLine, 
  FaRecycle,
  FaTree,
  FaWater,
  FaCarAlt,
  FaPlane,
  FaCalendarCheck,
  FaHistory,
  FaAward,
  FaMedal,
  FaCalendar,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaHotel,
  FaHiking
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EcoCoinService from '../../services/EcoCoinService';

// Rating Badge Component
const RatingBadge = ({ tier, points, progress, className }) => {
  // Different badge styles based on tier
  const getTierStyle = (tier) => {
    switch(tier) {
      case 'Seedling':
        return {
          icon: <FaLeaf className="text-green-500" />,
          bgFrom: 'from-green-400',
          bgTo: 'to-green-600',
          textColor: 'text-green-700'
        };
      case 'Sapling':
        return {
          icon: <FaTree className="text-teal-500" />,
          bgFrom: 'from-teal-400',
          bgTo: 'to-teal-600',
          textColor: 'text-teal-700'
        };
      case 'Treehugger':
        return {
          icon: <FaAward className="text-blue-500" />,
          bgFrom: 'from-blue-400',
          bgTo: 'to-blue-600',
          textColor: 'text-blue-700'
        };
      case 'EcoHero':
        return {
          icon: <FaMedal className="text-purple-500" />,
          bgFrom: 'from-purple-400',
          bgTo: 'to-purple-600',
          textColor: 'text-purple-700'
        };
      default:
        return {
          icon: <FaLeaf className="text-green-500" />,
          bgFrom: 'from-green-400',
          bgTo: 'to-green-600',
          textColor: 'text-green-700'
        };
    }
  };
  
  const style = getTierStyle(tier);
  
  return (
    <div className={`${className || ''}`}>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${style.bgFrom} ${style.bgTo} flex items-center justify-center mb-2`}>
          <div className="text-white text-2xl">
            {style.icon}
          </div>
        </div>
        
        <h3 className="font-bold text-lg">{tier}</h3>
        <div className={`${style.textColor} font-medium text-sm mb-2`}>{points} points</div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${style.bgFrom} ${style.bgTo}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Impact Metric Card Component
const ImpactMetricCard = ({ icon, title, value, unit, className }) => (
  <div className={`${className || ''}`}>
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-emerald-600 mr-1">{value}</span>
        <span className="text-gray-500">{unit}</span>
      </div>
    </div>
  </div>
);

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
  const getTypeIcon = (type) => {
    switch(type) {
      case EcoCoinService.REWARD_TYPES.BOOKING:
        return <FaPlane className="text-blue-500" />;
      case EcoCoinService.REWARD_TYPES.CHALLENGE:
        return <FaCalendarCheck className="text-purple-500" />;
      case EcoCoinService.REWARD_TYPES.REFERRAL:
        return <FaCoins className="text-yellow-500" />;
      case EcoCoinService.REWARD_TYPES.CONTRIBUTION:
        return <FaHandHoldingHeart className="text-red-500" />;
      case EcoCoinService.REWARD_TYPES.TREE_PLANTING:
        return <FaTree className="text-green-500" />;
      case EcoCoinService.REWARD_TYPES.EVENT:
        return <FaCalendar className="text-indigo-500" />;
      case EcoCoinService.REWARD_TYPES.ACHIEVEMENT:
        return <FaAward className="text-amber-500" />;
      default:
        return <FaCoins className="text-amber-500" />;
    }
  };
  
  const getTypeLabel = (type) => {
    switch(type) {
      case EcoCoinService.REWARD_TYPES.BOOKING:
        return 'Booking Reward';
      case EcoCoinService.REWARD_TYPES.CHALLENGE:
        return 'Challenge Completed';
      case EcoCoinService.REWARD_TYPES.REFERRAL:
        return 'Referral Bonus';
      case EcoCoinService.REWARD_TYPES.CONTRIBUTION:
        return 'Contribution';
      case EcoCoinService.REWARD_TYPES.TREE_PLANTING:
        return 'Tree Planting';
      case EcoCoinService.REWARD_TYPES.EVENT:
        return 'Event Participation';
      case EcoCoinService.REWARD_TYPES.ACHIEVEMENT:
        return 'Achievement Reward';
      case 'reward_redemption':
        return 'Reward Redemption';
      case 'welcome_bonus':
        return 'Welcome Bonus';
      default:
        return 'Transaction';
    }
  };
  
  const formattedDate = new Date(transaction.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className="flex items-center p-3 border-b border-gray-100 last:border-0">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
        {getTypeIcon(transaction.type)}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{getTypeLabel(transaction.type)}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
          
          <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.amount > 0 ? '+' : ''}{transaction.amount} 
          </div>
        </div>
        
        {transaction.description && (
          <p className="text-xs text-gray-600 mt-1">{transaction.description}</p>
        )}
      </div>
    </div>
  );
};

// FaHandHoldingHeart icon is missing in the imports, defining it here
const FaHandHoldingHeart = (props) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 512 512" 
    height="1em" 
    width="1em" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M429.8 137.8a63.16 63.16 0 0 0-87 5.8l-12.4 14.1a63.1 63.1 0 0 0-87-5.8a57.28 57.28 0 0 0-17.5 41.5c0 15.1 5.3 30.1 15.9 41.4l89 100.3l89-100.3c10.6-11.3 15.9-26.3 15.9-41.4a57.23 57.23 0 0 0-17.47-41.47l-.23-.23Z" />
    <path d="M373.11 278.45L322.29 335a29.43 29.43 0 0 1-42.13 0l-83-93.42a62.89 62.89 0 0 1-16.68-43.36v-2.38c0-17.22 6.87-33.86 19.19-46.1L219.2 130a8 8 0 0 0-10.59-12l-19.51 19.51c-16.7 16.7-26 39.2-25.94 62.67v1.43c0 19.21 7.56 37.7 21 51.33l83 93.42a44.82 44.82 0 0 0 32.31 13.51a44.82 44.82 0 0 0 32.32-13.51l50.82-56.59a8 8 0 0 0-11.18-11.33Z" />
  </svg>
);

// Booking Item Component 
const BookingItem = ({ booking }) => {
  const getBookingTypeIcon = (bookingType) => {
    switch(bookingType) {
      case 'transport':
        return <FaPlane className="text-blue-500" />;
      case 'accommodation':
        return <FaHotel className="text-amber-500" />;
      case 'activity':
        return <FaHiking className="text-green-500" />;
      default:
        return <FaTicketAlt className="text-purple-500" />;
    }
  };

  const formattedDate = booking.bookingDate ? 
    new Date(booking.bookingDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-3"
    >
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
          {getBookingTypeIcon(booking.bookingType)}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{booking.optionName || 'Unnamed Booking'}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <FaCalendarCheck className="mr-1" />
                <span>Booked: {formattedDate}</span>
              </div>
              {booking.ecoRating && (
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaLeaf 
                      key={i} 
                      className={`w-3 h-3 ${i < booking.ecoRating ? 'text-emerald-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="font-bold text-amber-600">+{booking.amount} EcoCoins</div>
              {booking.carbonFootprint && (
                <p className="text-xs text-gray-600 mt-1">
                  <span className="text-emerald-500">
                    {booking.carbonFootprint} kg CO₂ saved
                  </span>
                </p>
              )}
            </div>
          </div>
          
          {booking.bookingReference && (
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
              <span className="text-xs text-gray-500">
                Ref: {booking.bookingReference}
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                Confirmed
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main component
const EcoImpactDashboard = () => {
  const { currentUser } = useAuth();
  const [summaryData, setSummaryData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch summary data
        const impactSummary = await EcoCoinService.getEcoImpactSummary(currentUser?.id);
        
        // Fetch transaction history
        const transactionHistory = await EcoCoinService.getTransactionHistory(currentUser?.id);
        
        if (impactSummary.success && transactionHistory.success) {
          setSummaryData(impactSummary);
          setTransactions(transactionHistory.transactions);
          
          // Filter booking transactions and extract booking details
          const bookings = transactionHistory.transactions
            .filter(tx => tx.type === EcoCoinService.REWARD_TYPES.BOOKING && tx.details)
            .map(tx => ({
              ...tx.details,
              amount: tx.amount,
              id: tx.id,
              timestamp: tx.timestamp
            }));
          
          setConfirmedBookings(bookings);
        }
      } catch (error) {
        console.error('Error fetching eco impact data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="p-4 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-md w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Eco Impact</h2>
        
        {/* Rating Badge */}
        <div className="mb-8">
          <RatingBadge 
            tier={summaryData?.ecoRating?.currentTier?.name || 'Seedling'} 
            points={summaryData?.ecoRating?.points || 0}
            progress={summaryData?.ecoRating?.progress || 0}
            className="max-w-sm mx-auto"
          />
        </div>
        
        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ImpactMetricCard 
            icon={<FaCoins className="text-amber-500" />}
            title="EcoCoins Balance"
            value={summaryData?.currentBalance || 0}
            unit="coins"
          />
          
          <ImpactMetricCard 
            icon={<FaLeaf className="text-emerald-500" />}
            title="Carbon Saved"
            value={summaryData?.totalCarbonSaved || 0}
            unit="kg CO₂"
          />
          
          <ImpactMetricCard 
            icon={<FaTree className="text-green-600" />}
            title="Trees Equivalent"
            value={Math.floor((summaryData?.totalCarbonSaved || 0) / 10)}
            unit="trees"
          />
        </div>
        
        {/* EcoCoin Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <FaChartLine className="text-blue-500 mr-2" />
            EcoCoin Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">+{summaryData?.totalEarned || 0}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">-{summaryData?.totalSpent || 0}</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-amber-600">{summaryData?.currentBalance || 0}</p>
            </div>
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center">
              <FaHistory className="text-gray-500 mr-2" />
              Transaction History
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No transactions found.
              </div>
            ) : (
              transactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            )}
          </div>
        </div>
        
        {/* Confirmed Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center">
              <FaTicketAlt className="text-emerald-500 mr-2" />
              Your Confirmed Bookings
            </h3>
          </div>
          
          <div className="p-4">
            {confirmedBookings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No confirmed bookings yet.</p>
                <button 
                  onClick={() => window.location.href = '/compare'}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Book Eco-Friendly Options
                </button>
              </div>
            ) : (
              confirmedBookings.map(booking => (
                <BookingItem key={booking.id} booking={booking} />
              ))
            )}
          </div>
        </div>
        
        {/* Tips to Increase EcoRating */}
        <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
          <h3 className="text-lg font-bold mb-4 text-green-800 flex items-center">
            <FaLeaf className="mr-2" />
            Tips to Increase Your EcoRating
          </h3>
          
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                <FaCarAlt className="text-green-700 text-xs" />
              </div>
              <p className="text-green-800">
                Book eco-friendly transportation options to earn EcoCoins and save carbon.
              </p>
            </li>
            
            <li className="flex items-start">
              <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                <FaRecycle className="text-green-700 text-xs" />
              </div>
              <p className="text-green-800">
                Complete eco-challenges to earn bonus points and boost your rating.
              </p>
            </li>
            
            <li className="flex items-start">
              <div className="bg-green-200 rounded-full p-1 mr-2 mt-0.5">
                <FaHandHoldingHeart className="text-green-700 text-xs" />
              </div>
              <p className="text-green-800">
                Contribute your EcoCoins to environmental causes for double the rating points.
              </p>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default EcoImpactDashboard; 