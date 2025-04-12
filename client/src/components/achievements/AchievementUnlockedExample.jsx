import React, { useState } from 'react';
import AchievementUnlocked from './AchievementUnlocked';
import { FaLeaf, FaTrophy, FaCertificate, FaCoins } from 'react-icons/fa';

const AchievementUnlockedExample = () => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  
  // Example achievements
  const exampleAchievements = [
    {
      id: 'carbon-reducer',
      name: 'Carbon Reducer',
      shortDescription: 'Reduced 75kg of CO2',
      description: 'You\'ve reduced your carbon footprint by 75kg of CO2 emissions through eco-friendly travel choices.',
      level: 2,
      icon: <FaLeaf className="w-full h-full text-emerald-500" />,
      criteria: [
        'Offset carbon emissions from your trips',
        'Book eco-friendly accommodations',
        'Choose green transportation options'
      ],
      reward: '50 EcoCoins Bonus'
    },
    {
      id: 'challenge-master',
      name: 'Challenge Master',
      shortDescription: 'Completed 3 challenges',
      description: 'You\'ve successfully completed 3 eco-challenges, demonstrating your commitment to sustainable travel.',
      level: 2,
      icon: <FaTrophy className="w-full h-full text-amber-500" />,
      criteria: [
        'Complete eco-travel challenges',
        'Earn points for sustainable actions',
        'Join community challenges'
      ],
      reward: 'Silver Badge & 50 EcoCoins'
    },
    {
      id: 'eco-booker',
      name: 'Eco Booker',
      shortDescription: 'Made 5 eco-bookings',
      description: 'You\'ve made 5 eco-friendly bookings, supporting sustainable tourism and reducing your travel footprint.',
      level: 3,
      icon: <FaCertificate className="w-full h-full text-blue-500" />,
      criteria: [
        'Book accommodations with green certifications',
        'Choose eco-friendly tour operators',
        'Support local and sustainable businesses'
      ],
      reward: '10% Discount on Next Booking'
    },
    {
      id: 'ecocoin-collector',
      name: 'EcoCoin Collector',
      shortDescription: 'Earned 250 EcoCoins',
      description: 'You\'ve earned a total of 250 EcoCoins through your sustainable travel choices and eco-challenges.',
      level: 2,
      icon: <FaCoins className="w-full h-full text-yellow-500" />,
      criteria: [
        'Complete eco-challenges and earn rewards',
        'Book through certified eco-friendly partners',
        'Offset carbon emissions from your trips'
      ],
      reward: 'Silver Collector Status'
    }
  ];

  // Handle showing an achievement
  const handleShowAchievement = (achievement) => {
    setSelectedAchievement(achievement);
    setShowAchievement(true);
  };

  // Handle closing the achievement notification
  const handleCloseAchievement = () => {
    setShowAchievement(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Achievement Unlocked Demonstration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {exampleAchievements.map((achievement) => (
          <div 
            key={achievement.id}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleShowAchievement(achievement)}
          >
            <div className="p-5 flex items-center">
              <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-50 rounded-full flex items-center justify-center">
                <div className="w-10 h-10">
                  {achievement.icon}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
                <p className="text-sm text-gray-600">{achievement.shortDescription}</p>
                <div className="mt-2">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Level {achievement.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-emerald-50 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-emerald-800">How to use this component</h2>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <pre className="text-sm overflow-x-auto">
{`import { useState } from 'react';
import AchievementUnlocked from './components/achievements/AchievementUnlocked';

// In your component:
const [showAchievement, setShowAchievement] = useState(false);
const [achievement, setAchievement] = useState(null);

// When an achievement is unlocked:
const onAchievementUnlocked = (achievementData) => {
  setAchievement(achievementData);
  setShowAchievement(true);
};

// In your JSX:
{showAchievement && (
  <AchievementUnlocked
    achievement={achievement}
    onClose={() => setShowAchievement(false)}
    autoCloseDelay={8000} // Optional
    showConfetti={true} // Optional
  />
)}`}
          </pre>
        </div>
        
        <p className="text-gray-700">
          Click on any of the achievement cards above to see how the AchievementUnlocked component appears when a user earns a new achievement.
        </p>
      </div>
      
      {/* Achievement Unlocked Modal */}
      {showAchievement && (
        <AchievementUnlocked
          achievement={selectedAchievement}
          onClose={handleCloseAchievement}
          autoCloseDelay={0} // Disable auto-close for the demo
        />
      )}
    </div>
  );
};

export default AchievementUnlockedExample; 