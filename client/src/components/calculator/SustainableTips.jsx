import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaPlane, FaHotel, FaHiking, FaLightbulb, FaAward } from 'react-icons/fa';

// Array of sustainable travel tips categorized by type and impact level
const tips = {
  transportation: {
    high: [
      "Consider taking a train instead of flying for distances under 500km - trains produce up to 90% less CO2.",
      "If you must fly, choose non-stop flights as takeoffs and landings use the most fuel.",
      "Offset your flight emissions through verified carbon offset programs.",
      "Choose airlines with newer, more fuel-efficient aircraft fleets."
    ],
    medium: [
      "Choose economy over business or first class - premium seats have a larger carbon footprint.",
      "Pack lighter to reduce the plane's fuel consumption.",
      "Use public transportation at your destination rather than renting a car."
    ],
    low: [
      "Consider using bike-sharing programs at your destination.",
      "Explore options for electric vehicle rentals at your destination.",
      "Research destinations with good public transportation systems."
    ]
  },
  accommodation: {
    high: [
      "Choose eco-certified hotels or eco-lodges that implement green practices.",
      "Stay in locally-owned accommodations that support the local economy.",
      "Consider hostels or shared accommodations which have a lower per-person footprint."
    ],
    medium: [
      "Reuse towels and linens during your stay rather than requesting daily changes.",
      "Turn off lights, air conditioning, and electronics when leaving your room.",
      "Use the 'Do Not Disturb' sign to reduce unnecessary cleaning services."
    ],
    low: [
      "Use water sparingly, especially in regions with water scarcity.",
      "Bring a reusable water bottle and toiletry containers instead of using hotel disposables."
    ]
  },
  activities: {
    high: [
      "Choose activities that don't rely on fossil fuels, like hiking, cycling, or kayaking.",
      "Support conservation-focused tours and activities that give back to the environment.",
      "Avoid activities that harm wildlife or natural habitats."
    ],
    medium: [
      "Join group tours instead of private tours to reduce per-person emissions.",
      "Support local businesses and artisans rather than buying imported souvenirs.",
      "Research eco-friendly tour operators that prioritize sustainability."
    ],
    low: [
      "Respect nature by staying on designated trails and following Leave No Trace principles.",
      "Participate in local conservation or beach cleanup efforts during your trip.",
      "Choose digital tickets and guides instead of printed materials."
    ]
  },
  general: [
    "Download travel apps that help you make more sustainable choices.",
    "Bring a reusable shopping bag, water bottle, and utensils to reduce single-use plastics.",
    "Learn a few phrases in the local language to better connect with local communities.",
    "Research local environmental issues before your trip so you can travel more responsibly.",
    "Consider purchasing carbon offsets to neutralize your trip's emissions."
  ]
};

// Helper function to determine impact level based on emissions
const getImpactLevel = (emissions, category) => {
  const thresholds = {
    transportation: { low: 50, medium: 200 },
    accommodation: { low: 20, medium: 80 },
    activities: { low: 10, medium: 30 }
  };
  
  const threshold = thresholds[category];
  if (!threshold) return 'medium';
  
  if (emissions < threshold.low) return 'low';
  if (emissions < threshold.medium) return 'medium';
  return 'high';
};

// Tip Card Component
const TipCard = ({ tip, icon, color, index }) => {
  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 border-l-4 ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="flex">
        <div className={`mr-3 mt-1 text-lg ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
        <p className="text-gray-700">{tip}</p>
      </div>
    </motion.div>
  );
};

// Achievement Badge Component
const AchievementBadge = ({ title, description, icon, level }) => {
  const colors = {
    bronze: 'from-amber-200 to-amber-400',
    silver: 'from-gray-300 to-gray-500',
    gold: 'from-yellow-200 to-yellow-500'
  };
  
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br ${colors[level]} shadow-lg`}>
        <div className="text-white text-2xl">
          {icon}
        </div>
      </div>
      <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      <p className="text-xs text-gray-600 text-center mt-1">{description}</p>
    </motion.div>
  );
};

// Main component
const SustainableTips = ({ calculationResult }) => {
  if (!calculationResult) return null;
  
  // Calculate impact levels
  const transportationEmissions = calculationResult.transportation.reduce(
    (acc, item) => acc + (parseFloat(item.emissions) || 0), 0
  );
  
  const accommodationEmissions = calculationResult.accommodations.reduce(
    (acc, item) => acc + (parseFloat(item.emissions) || 0), 0
  );
  
  const activitiesEmissions = calculationResult.activities.reduce(
    (acc, item) => acc + (parseFloat(item.emissions) || 0), 0
  );
  
  const totalEmissions = parseFloat(calculationResult.totalEmissions) || 0;
  
  // Determine impact levels
  const transportationImpact = getImpactLevel(transportationEmissions, 'transportation');
  const accommodationImpact = getImpactLevel(accommodationEmissions, 'accommodation');
  const activitiesImpact = getImpactLevel(activitiesEmissions, 'activities');
  
  // Select appropriate tips based on impact levels
  const selectedTips = [
    ...tips.transportation[transportationImpact].slice(0, 2),
    ...tips.accommodation[accommodationImpact].slice(0, 2),
    ...tips.activities[activitiesImpact].slice(0, 2),
    ...tips.general.slice(0, 2)
  ];
  
  // Shuffle array to get a mix of tips
  const shuffledTips = [...selectedTips].sort(() => 0.5 - Math.random()).slice(0, 5);
  
  // Determine achievement level
  const getAchievementLevel = () => {
    if (totalEmissions < 100) return 'gold';
    if (totalEmissions < 300) return 'silver';
    return 'bronze';
  };
  
  const achievementLevel = getAchievementLevel();
  
  return (
    <motion.div
      className="bg-gradient-to-r from-green-50/70 to-blue-50/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          className="text-2xl font-bold text-green-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaLeaf className="inline-block mr-2" />
          Sustainable Travel Tips
        </motion.h2>
        
        <motion.div
          className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-green-700 font-medium"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Personalized for {calculationResult.tripName}
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {shuffledTips.map((tip, index) => {
          let icon = <FaLightbulb />;
          let color = 'border-green-500';
          
          if (tip.includes('flight') || tip.includes('train') || tip.includes('transportation')) {
            icon = <FaPlane />;
            color = 'border-blue-500';
          } else if (tip.includes('hotel') || tip.includes('accommodation') || tip.includes('room')) {
            icon = <FaHotel />;
            color = 'border-purple-500';
          } else if (tip.includes('activities') || tip.includes('tour') || tip.includes('hiking')) {
            icon = <FaHiking />;
            color = 'border-amber-500';
          }
          
          return (
            <TipCard
              key={index}
              tip={tip}
              icon={icon}
              color={color}
              index={index}
            />
          );
        })}
      </div>
      
      {/* Achievements section */}
      <div className="border-t border-green-200/50 pt-6 mt-4">
        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
          <FaAward className="mr-2" />
          Your Eco-Travel Achievements
        </h3>
        
        <div className="flex justify-around">
          <AchievementBadge
            title="Eco Traveler"
            description={`You're on your way to becoming a sustainable traveler!`}
            icon={<FaLeaf />}
            level={achievementLevel}
          />
          
          <AchievementBadge
            title="Carbon Saver"
            description={`Saved ${calculationResult.potentialSavings?.toFixed(1) || '0'} kg CO2e`}
            icon={<FaLightbulb />}
            level={achievementLevel}
          />
          
          <AchievementBadge
            title="Planet Protector"
            description={`Making a difference with every journey`}
            icon={<FaAward />}
            level={achievementLevel}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SustainableTips; 