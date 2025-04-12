import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaTrophy, 
  FaLeaf, 
  FaCheck, 
  FaLock, 
  FaCoins, 
  FaChartLine,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaUser
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import EcoCoinService from '../../services/EcoCoinService';

// Progress bar component
const ProgressBar = ({ progress, color = "emerald" }) => (
  <div className="w-full bg-gray-200 rounded-full h-3 mt-2 mb-1">
    <motion.div
      className={`h-3 rounded-full bg-${color}-500`}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </div>
);

// Individual challenge card
const ChallengeCard = ({ challenge, onParticipate, onClaimReward, currentUser }) => {
  const isParticipating = challenge.participants?.includes(currentUser?.id);
  const hasCompleted = challenge.completedBy?.includes(currentUser?.id);
  const progressPercentage = challenge.userProgress?.[currentUser?.id] || 0;
  const canClaimReward = hasCompleted && !challenge.rewardClaimed?.[currentUser?.id];
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div 
        className="h-40 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${challenge.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <div className="flex items-center mb-1">
            {challenge.type === 'individual' ? (
              <FaUser className="mr-2 text-emerald-400" />
            ) : (
              <FaUsers className="mr-2 text-emerald-400" />
            )}
            <span className="text-sm uppercase tracking-wide font-semibold">
              {challenge.type === 'individual' ? 'Individual' : 'Community'} Challenge
            </span>
          </div>
          <h3 className="text-xl font-bold">{challenge.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-amber-500 font-bold">
            <FaCoins className="mr-1" />
            <span>{challenge.reward} EcoCoins</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <FaCalendarAlt className="mr-1" />
            <span>{formatDate(challenge.endDate)}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          {challenge.description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Your Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <ProgressBar progress={progressPercentage} />
        </div>

        <div className="flex items-center justify-between mb-2 text-sm">
          <div className="flex items-center text-gray-600">
            <FaUserFriends className="mr-1" />
            <span>{challenge.participants?.length || 0} Participants</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FaTrophy className="mr-1" />
            <span>{challenge.completedBy?.length || 0} Completed</span>
          </div>
        </div>

        {!isParticipating && !hasCompleted && (
          <motion.button
            className="w-full mt-3 py-2 px-4 bg-emerald-600 text-white rounded-lg font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onParticipate(challenge.id)}
          >
            <FaUsers className="mr-2" />
            Join Challenge
          </motion.button>
        )}
        
        {isParticipating && !hasCompleted && (
          <div className="w-full mt-3 py-2 px-4 bg-blue-100 text-blue-800 rounded-lg font-medium flex items-center justify-center">
            <FaChartLine className="mr-2" />
            In Progress
          </div>
        )}
        
        {hasCompleted && canClaimReward && (
          <motion.button
            className="w-full mt-3 py-2 px-4 bg-amber-500 text-white rounded-lg font-medium flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClaimReward(challenge.id)}
          >
            <FaTrophy className="mr-2" />
            Claim Reward
          </motion.button>
        )}
        
        {hasCompleted && !canClaimReward && (
          <div className="w-full mt-3 py-2 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium flex items-center justify-center">
            <FaCheck className="mr-2" />
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Community challenges leaderboard
const ChallengeLeaderboard = ({ participants }) => {
  // Sort participants by points
  const sortedParticipants = [...participants].sort((a, b) => b.points - a.points);
  
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-bold flex items-center">
          <FaTrophy className="mr-2 text-amber-500" />
          Challenge Leaderboard
        </h3>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto">
        {sortedParticipants.map((participant, index) => (
          <div 
            key={participant.id}
            className={`p-3 flex items-center justify-between ${index < sortedParticipants.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 font-bold text-white ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-gray-200 text-gray-700'}`}>
                {index + 1}
              </div>
              
              <div className="flex flex-col">
                <span className="font-medium">{participant.name}</span>
                <span className="text-xs text-gray-500">
                  {participant.completedChallenges} challenges completed
                </span>
              </div>
            </div>
            
            <div className="font-bold text-emerald-600 flex items-center">
              <FaCoins className="mr-1 text-amber-500" />
              {participant.points}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Main component for community challenges
const EcoCommunityChallenge = () => {
  const { currentUser } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch challenges and leaderboard data
  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For demo, we're using mock data
        const mockChallenges = [
          {
            id: 'c1',
            name: 'Zero Waste Traveler',
            description: 'Travel for 7 days without generating plastic waste. Log your eco-friendly choices.',
            type: 'individual',
            reward: 75,
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            image: 'https://source.unsplash.com/random/800x600/?zerowaste',
            category: 'waste',
            participants: ['user1', 'user2', 'user3'],
            completedBy: ['user2'],
            userProgress: { 'user1': 45, 'user3': 20 },
            rewardClaimed: {}
          },
          {
            id: 'c2',
            name: 'Carbon Offset Champion',
            description: 'Offset the carbon footprint of your next 3 trips using our carbon calculator.',
            type: 'community',
            reward: 100,
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
            image: 'https://source.unsplash.com/random/800x600/?forest',
            category: 'carbon',
            participants: ['user1', 'user4', 'user5', 'user6'],
            completedBy: ['user4', 'user5'],
            userProgress: { 'user1': 66, 'user6': 33 },
            rewardClaimed: { 'user4': true }
          },
          {
            id: 'c3',
            name: 'Local Explorer',
            description: 'Visit 5 local eco-attractions and share your experience with the community.',
            type: 'individual',
            reward: 50,
            endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
            image: 'https://source.unsplash.com/random/800x600/?localtravel',
            category: 'local',
            participants: ['user2', 'user3', 'user7'],
            completedBy: [],
            userProgress: { 'user2': 80, 'user3': 60, 'user7': 40 },
            rewardClaimed: {}
          },
          {
            id: 'c4',
            name: 'Plant-Based Diet Week',
            description: 'Choose plant-based meals during your travels for 7 days and document your experience.',
            type: 'community',
            reward: 80,
            endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
            image: 'https://source.unsplash.com/random/800x600/?plantbased',
            category: 'food',
            participants: ['user1', 'user5', 'user8'],
            completedBy: ['user1'],
            userProgress: { 'user5': 85, 'user8': 71 },
            rewardClaimed: { 'user1': true }
          }
        ];

        // Mock leaderboard data
        const mockLeaderboard = [
          { id: 'user5', name: 'Emma Green', points: 320, completedChallenges: 4 },
          { id: 'user1', name: 'John Doe', points: 280, completedChallenges: 3 },
          { id: 'user4', name: 'Sarah Johnson', points: 250, completedChallenges: 3 },
          { id: 'user2', name: 'Michael Smith', points: 180, completedChallenges: 2 },
          { id: 'user8', name: 'Olivia Brown', points: 150, completedChallenges: 2 },
          { id: 'user3', name: 'David Wilson', points: 120, completedChallenges: 1 },
          { id: 'user7', name: 'Sophia Davis', points: 100, completedChallenges: 1 },
          { id: 'user6', name: 'James Taylor', points: 75, completedChallenges: 1 }
        ];

        setChallenges(mockChallenges);
        setLeaderboard(mockLeaderboard);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        showNotification('Failed to load challenges', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Handle joining a challenge
  const handleParticipate = async (challengeId) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      // In a real implementation, this would be an API call
      const updatedChallenges = challenges.map(c => {
        if (c.id === challengeId) {
          // Add current user to participants
          const participants = [...(c.participants || [])];
          if (!participants.includes(currentUser.id)) {
            participants.push(currentUser.id);
          }
          
          // Initialize progress
          const userProgress = { ...(c.userProgress || {}) };
          userProgress[currentUser.id] = 0;
          
          return { ...c, participants, userProgress };
        }
        return c;
      });
      
      setChallenges(updatedChallenges);
      showNotification(`You've joined the ${challenge.name} challenge!`, 'success');
    } catch (error) {
      console.error('Error joining challenge:', error);
      showNotification('Failed to join challenge', 'error');
    }
  };

  // Handle claiming challenge reward
  const handleClaimReward = async (challengeId) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      // Award EcoCoins
      const result = await EcoCoinService.awardBonusEcoCoins(
        currentUser.id,
        challenge.reward,
        {
          challengeName: challenge.name,
          challengeId: challenge.id,
          completionDate: new Date().toISOString()
        }
      );

      if (result.success) {
        // Update challenges state
        const updatedChallenges = challenges.map(c => {
          if (c.id === challengeId) {
            const rewardClaimed = { ...(c.rewardClaimed || {}) };
            rewardClaimed[currentUser.id] = true;
            return { ...c, rewardClaimed };
          }
          return c;
        });
        
        setChallenges(updatedChallenges);
        showNotification(`You've earned ${challenge.reward} EcoCoins!`, 'success');
      } else {
        showNotification('Failed to claim reward', 'error');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      showNotification('Failed to claim reward', 'error');
    }
  };

  // Display notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Filter challenges by category
  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

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
        
        <h2 className="text-2xl font-bold mb-2">Community Challenges</h2>
        <p className="mb-4 opacity-90">
          Join eco-challenges, make a positive impact, and earn EcoCoins for your sustainable actions.
        </p>
        
        <div className="flex flex-wrap gap-2">
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'all' 
              ? 'bg-white text-emerald-700' 
              : 'bg-white/20 hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
          >
            All Challenges
          </motion.button>
          
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'carbon' 
              ? 'bg-white text-emerald-700' 
              : 'bg-white/20 hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('carbon')}
          >
            Carbon Offset
          </motion.button>
          
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'waste' 
              ? 'bg-white text-emerald-700' 
              : 'bg-white/20 hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('waste')}
          >
            Zero Waste
          </motion.button>
          
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'local' 
              ? 'bg-white text-emerald-700' 
              : 'bg-white/20 hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('local')}
          >
            Local Travel
          </motion.button>
          
          <motion.button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'food' 
              ? 'bg-white text-emerald-700' 
              : 'bg-white/20 hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('food')}
          >
            Sustainable Food
          </motion.button>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold mb-4">Available Challenges</h3>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="bg-gray-100 animate-pulse h-64 rounded-xl"
                />
              ))}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <FaUsers className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">No challenges available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onParticipate={handleParticipate}
                  onClaimReward={handleClaimReward}
                  currentUser={currentUser || { id: 'user1' }} // Mock for demo
                />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
          {isLoading ? (
            <div className="bg-gray-100 animate-pulse h-64 rounded-xl" />
          ) : (
            <ChallengeLeaderboard participants={leaderboard} />
          )}
        </div>
      </div>
      
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

export default EcoCommunityChallenge; 