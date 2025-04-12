import React, { useState, useEffect } from 'react';
import { FaMedal, FaGift, FaTrophy, FaPlane, FaHotel, FaHiking, FaCheckCircle, FaLock, FaUnlock, FaLeaf, FaTree, FaSeedling, FaAward, FaGlobeAmericas } from 'react-icons/fa';
import axios from 'axios';
import AchievementUnlocked from '../components/achievements/AchievementUnlocked';

const Rewards = () => {
  // State for user data, rewards, loading states, and notifications
  const [userData, setUserData] = useState({
    points: 1450,
    level: "Green Explorer",
    badges: ["Eco Starter", "Carbon Reducer"],
    totalSaved: 350, // kg of CO2
    achievements: [],
    completedTrips: 3,
    carbonReduced: 350
  });
  
  // State for rewards data
  const [rewards, setRewards] = useState([]);
  
  // State for achievements
  const [achievements, setAchievements] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Track which reward is being redeemed (for loading state)
  const [redeemingId, setRedeemingId] = useState(null);
  
  // Track which achievement is being unlocked
  const [unlockingId, setUnlockingId] = useState(null);
  
  // Track the unlocked achievement
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  
  // Track whether the achievement unlocked modal is shown
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  
  // Initialize with example data - in a real application, fetch from API
  useEffect(() => {
    setRewards([
      {
        id: 1,
        name: "10% Off Eco Hotel Stay",
        type: "discount",
        category: "accommodation",
        pointCost: 500,
        value: "10%",
        icon: <FaHotel className="text-2xl text-secondary-600" />,
        description: "Get 10% off your next stay at any eco-certified hotel in our network.",
        isRedeemed: false,
        code: "ECO10HOTEL"
      },
      {
        id: 2,
        name: "Carbon Offset Flight",
        type: "perk",
        category: "transportation",
        pointCost: 1200,
        value: "100%",
        icon: <FaPlane className="text-2xl text-secondary-600" />,
        description: "We'll offset 100% of the carbon emissions from your next flight.",
        isRedeemed: false,
        code: "CARBONNEUTRAL"
      },
      {
        id: 3,
        name: "Free Eco Tour",
        type: "coupon",
        category: "activity",
        pointCost: 2000,
        value: "Free",
        icon: <FaHiking className="text-2xl text-secondary-600" />,
        description: "Enjoy a complimentary eco-tour at select destinations.",
        isRedeemed: false,
        code: "FREETOUR2025"
      }
    ]);
    
    setAchievements([
      {
        id: 101,
        name: "Green Explorer Badge",
        type: "badge",
        category: "achievement",
        pointCost: 0,
        reward: 100,
        icon: <FaTree className="text-2xl text-accent-600" />,
        description: "Earned after completing 5 eco-friendly trips.",
        isUnlocked: false,
        requirement: { type: 'trips', value: 5 }
      },
      {
        id: 102,
        name: "Carbon Master",
        type: "badge",
        category: "achievement",
        pointCost: 0,
        reward: 250,
        icon: <FaGlobeAmericas className="text-2xl text-accent-600" />,
        description: "Reduce carbon by at least 500kg through eco-friendly choices.",
        isUnlocked: false,
        requirement: { type: 'carbon', value: 500 }
      },
      {
        id: 103,
        name: "Eco Champion",
        type: "badge",
        category: "achievement",
        pointCost: 0,
        reward: 500,
        icon: <FaAward className="text-2xl text-accent-600" />,
        description: "Redeem at least 3 eco-rewards.",
        isUnlocked: false,
        requirement: { type: 'redemptions', value: 3 }
      }
    ]);
    
    // In a real app, you would fetch actual user data here
    // fetchUserData();
    
  }, []);
  
  // Function to show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  // Function to handle reward redemption
  const handleRedeemReward = async (reward) => {
    if (userData.points < reward.pointCost) {
      showToast('Not enough points to redeem this reward', 'error');
      return;
    }
    
    setRedeemingId(reward.id);
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // await axios.post(`/api/rewards/${reward.id}/redeem`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user points
      setUserData(prev => ({
        ...prev,
        points: prev.points - reward.pointCost,
        // Increment redemption count for achievement tracking
        redemptions: (prev.redemptions || 0) + 1
      }));
      
      // Update reward status
      setRewards(prev => 
        prev.map(r => 
          r.id === reward.id ? { ...r, isRedeemed: true } : r
        )
      );
      
      // Show success message
      showToast(`Successfully redeemed: ${reward.name}`, 'success');
      
      // Check if any achievements should be unlocked based on redemptions
      checkAchievements('redemptions');
      
    } catch (err) {
      console.error('Error redeeming reward:', err);
      showToast('Failed to redeem reward. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      setRedeemingId(null);
    }
  };
  
  // Function to handle unlocking achievements
  const handleUnlockAchievement = async (achievement) => {
    // Check if requirements are met
    if (!checkRequirement(achievement)) {
      showToast(`You haven't met the requirements for ${achievement.name} yet!`, 'error');
      return;
    }
    
    setUnlockingId(achievement.id);
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // await axios.post(`/api/achievements/${achievement.id}/unlock`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update achievements
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievement.id ? { ...a, isUnlocked: true } : a
        )
      );
      
      // Add to badges
      setUserData(prev => ({
        ...prev,
        badges: [...prev.badges, achievement.name],
        // Award points for unlocking achievement
        points: prev.points + achievement.reward
      }));
      
      // Show the achievement unlocked animation
      setUnlockedAchievement(achievement);
      setShowAchievementModal(true);
      
    } catch (err) {
      console.error('Error unlocking achievement:', err);
      showToast('Failed to unlock achievement. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      setUnlockingId(null);
    }
  };
  
  // Function to check if achievement requirements are met
  const checkRequirement = (achievement) => {
    const { requirement } = achievement;
    
    if (!requirement) return false;
    
    switch (requirement.type) {
      case 'trips':
        return userData.completedTrips >= requirement.value;
      case 'carbon':
        return userData.carbonReduced >= requirement.value;
      case 'redemptions':
        return (userData.redemptions || 0) >= requirement.value;
      default:
        return false;
    }
  };
  
  // Function to automatically check achievement eligibility
  const checkAchievements = (type) => {
    achievements.forEach(achievement => {
      if (!achievement.isUnlocked && 
          achievement.requirement?.type === type && 
          checkRequirement(achievement)) {
        // Notify user of available achievement
        showToast(`You can now unlock: ${achievement.name}!`, 'info');
      }
    });
  };
  
  // Display redeemed rewards differently
  const getRewardDisplay = (reward) => {
    if (reward.isRedeemed) {
      return (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl">
          <div className="flex items-center text-green-700 mb-2">
            <FaCheckCircle className="mr-2" />
            <span className="font-medium">Redeemed</span>
          </div>
          <p className="text-sm">Redemption Code: <span className="font-mono font-medium bg-white px-2 py-1 rounded">{reward.code}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 relative animate-fade-in-up">
      {/* Achievement Unlocked Modal */}
      {showAchievementModal && unlockedAchievement && (
        <AchievementUnlocked
          achievement={unlockedAchievement}
          onClose={() => {
            setShowAchievementModal(false);
            setUnlockedAchievement(null);
            // Show toast after the modal is closed
            showToast(`Achievement unlocked: ${unlockedAchievement.name}! +${unlockedAchievement.reward} points`, 'success');
          }}
          showConfetti={true}
        />
      )}
      
      {/* Toast Notification - Enhanced */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-md transform translate-x-0 transition-transform duration-500 flex items-center ${
          toast.type === 'success' ? 'bg-primary-500' : 
          toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          <div className="mr-3">
            {toast.type === 'success' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
      
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-700 font-display">Eco Rewards Program</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Earn points for your eco-friendly travel choices and redeem them for exclusive rewards.
        </p>
      </div>

      {/* User Stats - Enhanced with eco-themed gradient and animations */}
      <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 text-white mb-12 overflow-hidden shadow-eco-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {/* Background leaf pattern */}
        <div className="absolute inset-0 bg-leaf-pattern opacity-10"></div>
        
        {/* Floating leaves animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="leaf leaf-1"></div>
          <div className="leaf leaf-2"></div>
          <div className="leaf leaf-3"></div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-2">Welcome back, Eco Traveler!</h2>
            <p className="opacity-90 max-w-md">Your sustainable choices have saved <strong>{userData.totalSaved}kg</strong> of CO₂ so far. Keep it up!</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-3xl font-bold">{userData.points}</div>
              <div className="text-sm opacity-90">Available Points</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-3xl font-bold">{userData.level}</div>
              <div className="text-sm opacity-90">Current Level</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="text-3xl font-bold">{userData.totalSaved} kg</div>
              <div className="text-sm opacity-90">CO₂ Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section - Enhanced with cards and animations */}
      <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="section-title">
          <div className="section-title-icon">
            <FaTrophy />
          </div>
          <h2 className="text-2xl font-poppins font-bold">Your Eco Achievements</h2>
          <div className="ml-auto">
            <span className="badge-success">
              {userData.badges.length} Earned
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {userData.badges.map((badge, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-eco border border-primary-100 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-eco-lg">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-3 animate-leaf-sway">
                <FaTrophy className="text-2xl text-primary-600" />
              </div>
              <h3 className="font-medium text-lg">{badge}</h3>
            </div>
          ))}
          
          {/* Locked achievements */}
          {achievements
            .filter(a => !userData.badges.includes(a.name))
            .map(achievement => (
              <div key={achievement.id} className="bg-gray-50 rounded-2xl p-6 text-center shadow-sm border border-gray-100 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FaLock className="text-xl text-gray-400" />
                </div>
                <h3 className="font-medium text-lg">{achievement.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* Available Rewards - Enhanced with card design and color indicators */}
      <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="section-title">
          <div className="section-title-icon">
            <FaGift />
          </div>
          <h2 className="text-2xl font-poppins font-bold">Available Rewards</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map(reward => (
            <div key={reward.id} className="bg-white rounded-2xl shadow-eco overflow-hidden border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-eco-lg">
              {/* Card color indicator based on category */}
              <div className={`h-2 ${
                reward.category === 'accommodation' ? 'bg-primary-500' : 
                reward.category === 'transportation' ? 'bg-secondary-500' : 
                'bg-accent-500'
              }`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-4">
                    <div className="mr-3 bg-primary-100 p-3 rounded-full">
                      {reward.icon}
                    </div>
                    <h3 className="text-lg font-bold">{reward.name}</h3>
                  </div>
                  {reward.pointCost > 0 && (
                    <div className="bg-primary-100 text-primary-700 px-3 py-1.5 text-sm font-medium rounded-full flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                      </svg>
                      {reward.pointCost} pts
                    </div>
                  )}
                </div>
                
                <div className="mb-2 flex items-center">
                  <span className={`inline-block px-2 py-1 text-xs rounded-md ${
                    reward.type === 'discount' ? 'bg-accent-100 text-accent-800' : 
                    reward.type === 'perk' ? 'bg-secondary-100 text-secondary-800' : 
                    'bg-primary-100 text-primary-800'
                  }`}>
                    {reward.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">{reward.description}</p>
                
                {/* Display redemption details if already redeemed */}
                {getRewardDisplay(reward)}
                
                {/* Show button only if not already redeemed */}
                {!reward.isRedeemed && (
                  <button 
                    className={`w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center ${
                      userData.points >= reward.pointCost 
                        ? 'bg-primary-600 hover:bg-primary-700 text-white transform hover:-translate-y-1' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } transition-all duration-300 shadow-eco hover:shadow-eco-lg`}
                    disabled={userData.points < reward.pointCost || isLoading}
                    onClick={() => handleRedeemReward(reward)}
                  >
                    {redeemingId === reward.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Redeeming...
                      </>
                    ) : (
                      <>
                        <FaGift className="mr-2" />
                        Redeem Reward
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Achievements Section - Enhanced with progress indicators */}
      <div className="pb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="section-title">
          <div className="section-title-icon">
            <FaLeaf />
          </div>
          <h2 className="text-2xl font-poppins font-bold">Unlock Eco Achievements</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map(achievement => (
            <div key={achievement.id} className="bg-white rounded-2xl shadow-eco overflow-hidden border border-gray-100 hover:border-accent-200 transition-all duration-300 hover:shadow-eco-lg">
              <div className={`h-2 bg-accent-500`}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="mr-3 bg-accent-100 p-3 rounded-full">
                      {achievement.icon}
                    </div>
                    <h3 className="text-lg font-bold">{achievement.name}</h3>
                  </div>
                  <div className="bg-accent-100 text-accent-700 px-3 py-1.5 text-sm font-medium rounded-full flex items-center">
                    +{achievement.reward} pts
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{achievement.description}</p>
                
                {/* Progress indicator with visually enhanced design */}
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="font-medium">
                      {achievement.requirement?.type === 'trips' && `${userData.completedTrips}/${achievement.requirement.value} trips`}
                      {achievement.requirement?.type === 'carbon' && `${userData.carbonReduced}/${achievement.requirement.value} kg CO₂`}
                      {achievement.requirement?.type === 'redemptions' && `${userData.redemptions || 0}/${achievement.requirement.value} redemptions`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-accent-500 h-3 rounded-full relative"
                      style={{ 
                        width: `${Math.min(100, calculateProgress(achievement) * 100)}%`,
                      }}
                    >
                      {calculateProgress(achievement) > 0.1 && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute inset-0 opacity-20 stripe-animation"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Status indicator and unlock button */}
                {achievement.isUnlocked || userData.badges.includes(achievement.name) ? (
                  <div className="flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-xl border border-green-100">
                    <FaCheckCircle className="mr-2" />
                    <span className="font-medium">Achievement Unlocked!</span>
                  </div>
                ) : (
                  <button 
                    className={`w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center ${
                      checkRequirement(achievement) 
                        ? 'bg-accent-600 hover:bg-accent-700 text-white transform hover:-translate-y-1' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } transition-all duration-300 shadow-eco hover:shadow-eco-lg`}
                    disabled={!checkRequirement(achievement) || isLoading}
                    onClick={() => handleUnlockAchievement(achievement)}
                  >
                    {unlockingId === achievement.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Unlocking...
                      </>
                    ) : (
                      <>
                        {checkRequirement(achievement) ? <FaUnlock className="mr-2" /> : <FaLock className="mr-2" />}
                        Unlock Achievement
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Helper function to calculate progress percentage for achievement
  function calculateProgress(achievement) {
    const { requirement } = achievement;
    if (!requirement) return 0;
    
    switch (requirement.type) {
      case 'trips':
        return Math.min(1, userData.completedTrips / requirement.value);
      case 'carbon':
        return Math.min(1, userData.carbonReduced / requirement.value);
      case 'redemptions':
        return Math.min(1, (userData.redemptions || 0) / requirement.value);
      default:
        return 0;
    }
  }
};

export default Rewards; 