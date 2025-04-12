import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTrophy, 
  FaLeaf, 
  FaCoins, 
  FaChartLine,
  FaTree,
  FaWater,
  FaRecycle,
  FaCarAlt,
  FaPlane,
  FaMedal,
  FaCertificate,
  FaCalendar
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import EcoCoinService from '../../services/EcoCoinService';

// Progress circle component
const ProgressCircle = ({ value, maxValue, size = 120, strokeWidth = 8, color = "#10b981" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = value / maxValue;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#e5e7eb"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
};

// Impact metric card
const ImpactMetricCard = ({ icon, title, value, unit, description, color = "emerald" }) => (
  <motion.div
    className="bg-white rounded-xl p-5 shadow-md border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center mb-4`}>
      {React.cloneElement(icon, { className: `text-${color}-600 text-xl` })}
    </div>
    
    <h3 className="text-lg font-bold mb-1">{title}</h3>
    
    <div className="flex items-baseline mb-2">
      <span className="text-2xl font-bold mr-1">{value}</span>
      <span className="text-gray-500">{unit}</span>
    </div>
    
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

// Achievement badge
const AchievementBadge = ({ achievement, onView }) => (
  <motion.div
    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    onClick={() => onView(achievement)}
  >
    <div className="p-4 text-center">
      <div className="w-16 h-16 mx-auto mb-3 relative">
        {achievement.icon}
        {achievement.level && (
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            {achievement.level}
          </div>
        )}
      </div>
      
      <h4 className="font-bold text-sm mb-1">{achievement.name}</h4>
      <p className="text-xs text-gray-500">{achievement.shortDescription}</p>
    </div>
  </motion.div>
);

// Achievement modal
const AchievementModal = ({ achievement, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white rounded-xl p-6 max-w-md w-full"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={e => e.stopPropagation()}
    >
      <div className="text-center mb-4">
        <div className="w-24 h-24 mx-auto mb-4">
          {achievement.icon}
        </div>
        
        <h3 className="text-xl font-bold mb-1">{achievement.name}</h3>
        {achievement.level && (
          <div className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full mb-2">
            Level {achievement.level}
          </div>
        )}
        
        <p className="text-gray-600 mb-4">{achievement.description}</p>
        
        {achievement.criteria && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-left mb-4">
            <p className="font-medium mb-1">How to earn:</p>
            <ul className="list-disc list-inside text-gray-600">
              {achievement.criteria.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {achievement.reward && (
          <div className="bg-emerald-50 rounded-lg p-3 text-sm text-left">
            <p className="font-medium text-emerald-700 mb-1">Reward:</p>
            <p className="text-emerald-600">{achievement.reward}</p>
          </div>
        )}
      </div>
      
      <button
        className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </motion.div>
  </motion.div>
);

// Main impact dashboard component
const EcoImpactDashboard = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState({
    carbonSaved: 0,
    treesSaved: 0,
    wastePrevented: 0,
    waterSaved: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Get transaction history
        const result = await EcoCoinService.getTransactionHistory(currentUser?.id || 'user1');
        
        if (result.success) {
          setTransactions(result.transactions);
          
          // Calculate impact metrics from transaction history
          const carbonSaved = calculateCarbonSaved(result.transactions);
          const treesSaved = calculateTreesSaved(result.transactions);
          const wastePrevented = calculateWastePrevented(result.transactions);
          const waterSaved = calculateWaterSaved(result.transactions);
          
          setImpactMetrics({
            carbonSaved,
            treesSaved,
            wastePrevented,
            waterSaved
          });
          
          // Generate achievements based on transaction history
          const userAchievements = generateAchievements(result.transactions);
          setAchievements(userAchievements);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  // Calculate metrics from transactions
  const calculateCarbonSaved = (transactions) => {
    // Sum up carbon savings from transactions
    // In a real app, this would look at specific transaction details with actual data
    return Math.floor(
      transactions
        .filter(t => t.type === EcoCoinService.REWARD_TYPES.BOOKING || t.type === EcoCoinService.REWARD_TYPES.CHALLENGE)
        .reduce((total, t) => total + Math.abs(t.amount) * 0.5, 0)
    );
  };
  
  const calculateTreesSaved = (transactions) => {
    // Estimate trees saved based on carbon offset
    const carbon = calculateCarbonSaved(transactions);
    return Math.floor(carbon / 20); // Rough estimate: 1 tree ~ 20kg CO2/year
  };
  
  const calculateWastePrevented = (transactions) => {
    // Estimate waste prevented (in kg)
    return Math.floor(
      transactions
        .filter(t => t.type === EcoCoinService.REWARD_TYPES.CHALLENGE)
        .reduce((total, t) => total + Math.abs(t.amount) * 0.1, 0)
    );
  };
  
  const calculateWaterSaved = (transactions) => {
    // Estimate water saved (in liters)
    return Math.floor(
      transactions
        .filter(t => t.type === EcoCoinService.REWARD_TYPES.BOOKING)
        .reduce((total, t) => total + Math.abs(t.amount) * 2, 0)
    );
  };

  // Generate achievements based on transactions
  const generateAchievements = (transactions) => {
    const carbonSaved = calculateCarbonSaved(transactions);
    const challengesCompleted = transactions
      .filter(t => t.type === EcoCoinService.REWARD_TYPES.CHALLENGE)
      .length;
    const ecoFriendlyBookings = transactions
      .filter(t => t.type === EcoCoinService.REWARD_TYPES.BOOKING)
      .length;
    const totalEcoCoins = transactions
      .reduce((total, t) => total + (t.amount > 0 ? t.amount : 0), 0);
    
    const achievements = [];
    
    // Carbon reducer achievement
    if (carbonSaved >= 10) {
      const level = carbonSaved >= 100 ? 3 : carbonSaved >= 50 ? 2 : 1;
      achievements.push({
        id: 'carbon-reducer',
        name: 'Carbon Reducer',
        shortDescription: `Reduced ${carbonSaved}kg of CO2`,
        description: `You've reduced your carbon footprint by ${carbonSaved}kg of CO2 emissions through eco-friendly travel choices.`,
        level,
        icon: <FaLeaf className="w-full h-full text-emerald-500" />,
        criteria: [
          'Offset carbon emissions from your trips',
          'Book eco-friendly accommodations',
          'Choose green transportation options'
        ],
        reward: level === 3 ? '100 EcoCoins Bonus' : level === 2 ? '50 EcoCoins Bonus' : '25 EcoCoins Bonus'
      });
    }
    
    // Challenge master achievement
    if (challengesCompleted >= 1) {
      const level = challengesCompleted >= 5 ? 3 : challengesCompleted >= 3 ? 2 : 1;
      achievements.push({
        id: 'challenge-master',
        name: 'Challenge Master',
        shortDescription: `Completed ${challengesCompleted} challenges`,
        description: `You've successfully completed ${challengesCompleted} eco-challenges, demonstrating your commitment to sustainable travel.`,
        level,
        icon: <FaTrophy className="w-full h-full text-amber-500" />,
        criteria: [
          'Complete eco-travel challenges',
          'Earn points for sustainable actions',
          'Join community challenges'
        ],
        reward: level === 3 ? 'Special Badge & 100 EcoCoins' : level === 2 ? 'Silver Badge & 50 EcoCoins' : 'Bronze Badge & 25 EcoCoins'
      });
    }
    
    // Eco-booker achievement
    if (ecoFriendlyBookings >= 1) {
      const level = ecoFriendlyBookings >= 5 ? 3 : ecoFriendlyBookings >= 3 ? 2 : 1;
      achievements.push({
        id: 'eco-booker',
        name: 'Eco Booker',
        shortDescription: `Made ${ecoFriendlyBookings} eco-bookings`,
        description: `You've made ${ecoFriendlyBookings} eco-friendly bookings, supporting sustainable tourism and reducing your travel footprint.`,
        level,
        icon: <FaCertificate className="w-full h-full text-blue-500" />,
        criteria: [
          'Book accommodations with green certifications',
          'Choose eco-friendly tour operators',
          'Support local and sustainable businesses'
        ],
        reward: level === 3 ? '10% Discount on Next Booking' : level === 2 ? '5% Discount on Next Booking' : 'Eco Booker Badge'
      });
    }
    
    // EcoCoin collector achievement
    if (totalEcoCoins >= 100) {
      const level = totalEcoCoins >= 500 ? 3 : totalEcoCoins >= 250 ? 2 : 1;
      achievements.push({
        id: 'ecocoin-collector',
        name: 'EcoCoin Collector',
        shortDescription: `Earned ${totalEcoCoins} EcoCoins`,
        description: `You've earned a total of ${totalEcoCoins} EcoCoins through your sustainable travel choices and eco-challenges.`,
        level,
        icon: <FaCoins className="w-full h-full text-yellow-500" />,
        criteria: [
          'Complete eco-challenges and earn rewards',
          'Book through certified eco-friendly partners',
          'Offset carbon emissions from your trips'
        ],
        reward: level === 3 ? 'Gold Collector Status' : level === 2 ? 'Silver Collector Status' : 'Bronze Collector Status'
      });
    }
    
    return achievements;
  };

  // Handle viewing an achievement
  const handleViewAchievement = (achievement) => {
    setSelectedAchievement(achievement);
  };

  // Close achievement modal
  const handleCloseAchievement = () => {
    setSelectedAchievement(null);
  };

  return (
    <div className="mb-6">
      <motion.div
        className="bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl p-6 shadow-lg text-white relative overflow-hidden mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 opacity-10">
          <FaLeaf className="w-full h-full" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Your Eco Impact</h2>
        <p className="mb-4 opacity-90">
          Track your contribution to a more sustainable planet through your eco-travel choices.
        </p>
        
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-6">
            <ProgressCircle 
              value={transactions.length} 
              maxValue={20} 
              size={100} 
              color="#ffffff" 
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-1">Eco-travel Progress</h3>
            <p className="text-sm opacity-90">
              You've made {transactions.length} eco-friendly travel choices so far.
              {transactions.length < 20 ? 
                ` Keep going to reach your next milestone!` : 
                ` Congratulations on reaching your milestone!`}
            </p>
          </div>
        </div>
      </motion.div>
      
      <h3 className="text-xl font-bold mb-4">Your Impact Metrics</h3>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className="bg-gray-100 animate-pulse h-40 rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ImpactMetricCard
            icon={<FaLeaf />}
            title="Carbon Saved"
            value={impactMetrics.carbonSaved}
            unit="kg CO2"
            description="Equivalent to driving a car for 3 days"
            color="emerald"
          />
          
          <ImpactMetricCard
            icon={<FaTree />}
            title="Trees Preserved"
            value={impactMetrics.treesSaved}
            unit="trees"
            description="Annual carbon absorption capacity"
            color="green"
          />
          
          <ImpactMetricCard
            icon={<FaRecycle />}
            title="Waste Prevented"
            value={impactMetrics.wastePrevented}
            unit="kg"
            description="Plastic waste kept from landfills and oceans"
            color="blue"
          />
          
          <ImpactMetricCard
            icon={<FaWater />}
            title="Water Saved"
            value={impactMetrics.waterSaved}
            unit="liters"
            description="Through sustainable accommodation choices"
            color="cyan"
          />
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-4">Your Achievements</h3>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className="bg-gray-100 animate-pulse h-32 rounded-xl"
            />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-md">
          <FaTrophy className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500">Complete eco-challenges to earn achievements!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map(achievement => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              onView={handleViewAchievement}
            />
          ))}
        </div>
      )}
      
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={handleCloseAchievement}
        />
      )}
    </div>
  );
};

export default EcoImpactDashboard; 