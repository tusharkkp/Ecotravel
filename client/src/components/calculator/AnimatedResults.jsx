import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlane, FaHotel, FaHiking, FaLeaf, 
  FaCarSide, FaChartPie, FaInfoCircle,
  FaDatabase
} from 'react-icons/fa';

// Animated counter component
const AnimatedCounter = ({ value, unit, duration = 1, decimals = 2 }) => {
  const [displayValue, setDisplayValue] = React.useState(0);
  
  React.useEffect(() => {
    let startTime;
    let animationFrame;
    
    const updateValue = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setDisplayValue(progress * value);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };
    
    animationFrame = requestAnimationFrame(updateValue);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);
  
  return (
    <span>{displayValue.toFixed(decimals)} {unit}</span>
  );
};

// Progress bar component
const ProgressBar = ({ value, maxValue = 100, color }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <motion.div 
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};

// Category result card
const CategoryResultCard = ({ title, value, icon, color, barColor, maxValue = 100 }) => {
  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg ${color} text-white mr-3`}>
          {icon}
        </div>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      </div>
      
      <div className="text-3xl font-bold mb-3 text-gray-800">
        <AnimatedCounter value={value} unit="kg CO2e" />
      </div>
      
      <ProgressBar value={value} maxValue={maxValue} color={barColor} />
    </motion.div>
  );
};

// Recommendation component
const Recommendation = ({ recommendation, index }) => {
  return (
    <motion.div 
      className="mb-4 bg-white/70 backdrop-blur-md p-4 rounded-lg shadow-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
    >
      <div className="flex">
        <div className="mr-3 text-primary-600 mt-1">
          <FaLeaf />
        </div>
        <div>
          <p className="font-medium text-gray-800 mb-1">{recommendation.suggestion}</p>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <span>Potential savings: </span>
            <span className="ml-1">
              <AnimatedCounter 
                value={parseFloat(recommendation.potentialSavings) || 0} 
                unit="kg CO2e" 
                decimals={1}
                duration={0.8} 
              />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Custom WiFiSlash icon since FaWifiSlash is not available in this version
const WiFiSlash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="1em" height="1em">
    <path d="M320 368c17.64 0 32 14.36 32 32s-14.36 32-32 32s-32-14.36-32-32S302.4 368 320 368zM412.6 192.9C380.5 169.6 341.3 156.1 320 156.1C298.7 156.1 259.5 169.6 227.4 192.9C221.3 198 211.1 197.2 206 191.1C200 184.9 200.8 174.7 206.1 169.6C246.1 141.2 291.2 124.1 320 124.1C348.8 124.1 393.9 141.2 433.9 169.6C440 174.7 440.8 184.9 434.8 191.1C429.7 197.2 419.5 198 412.6 192.9V192.9zM473.1 121.4C428.4 87.74 371.8 64.4 320 64.4C268.2 64.4 211.6 87.74 166 121.4C159.2 126.9 149.1 126.3 144.4 119.5C138.9 112.7 139.5 102.6 146.3 97.07C198.3 59.15 262.1 32.4 320 32.4C377.9 32.4 441.7 59.15 493.7 97.07C500.5 102.6 501.1 112.7 495.6 119.5C490.1 126.3 480 126.9 473.1 121.4V121.4zM4.686 473.9C-0.5954 468.7-1.547 460.2 2.369 453.9L472.4 18.88C478.3 12.54 486.8 11.57 493.1 17.43L493.2 17.52C499.5 23.38 500.5 31.91 494.6 38.25L24.52 473.3C18.6 479.6 10.06 480.6 3.77 474.8L3.718 474.7C3.705 474.7 3.693 474.7 3.68 474.6L4.686 473.9zM537.5 224.2C542.5 217.7 552.7 216.8 558.1 222.7C603.1 260.2 632 308.2 632 334.6C632 340.9 626.9 346 620.7 346C614.4 346 609.3 340.9 609.3 334.6C609.3 316.2 584.3 273.8 544.1 239.9C538.7 234.9 537.7 224.8 542.8 219.4L537.5 224.2zM183.3 154.9L346.9 15.13C338.1 14.53 329.5 14.37 320 14.37C253.3 14.37 187.4 32.21 129.8 65.22C123.7 69 121.2 76.7 123.3 83.63C125.4 90.56 132 95.04 139.4 94.37C155.6 92.91 171.5 91.68 187.2 90.87L183.3 154.9zM297.3 311.1L457.7 174.9C471.1 193.7 483.1 214.5 492.2 237C495.2 244.5 503.4 248.8 511.8 247.5C520.2 246.2 526.3 239.1 526.3 230.5C526.3 228.4 526.2 226.2 525.1 224.2L570.8 184.9C595.8 211.3 613.3 241.4 622.9 272.8C626.3 281.5 635.3 286.5 644.4 284.6C653.6 282.7 659.1 273.9 657.2 264.7C635.3 183.5 568.2 118 483.7 88.23L480.2 91.22C427.3 136.2 297.3 311.1 297.3 311.1z"/>
  </svg>
);

// Main AnimatedResults component
const AnimatedResults = ({ calculationResult, offlineMode = false }) => {
  if (!calculationResult) return null;
  
  // Calculate total emissions from each category
  const transportationEmissions = calculationResult.transportation.reduce(
    (acc, item) => acc + (parseFloat(item.emissions) || 0), 0
  );
  
  const accommodationEmissions = calculationResult.accommodations.reduce(
    (acc, item) => acc + (parseFloat(item.emissions) || 0), 0
  );
  
  const activitiesEmissions = calculationResult.activities.reduce(
    (acc, item) => acc + (parseFloat(item.emissions) || 0), 0
  );
  
  // Find maximum value for progress bars
  const maxEmissionValue = Math.max(
    transportationEmissions,
    accommodationEmissions,
    activitiesEmissions,
    50 // minimum value to ensure bars aren't too large for small emissions
  );
  
  // Calculate car driving equivalent
  const carDrivingEquivalent = ((parseFloat(calculationResult.totalEmissions) || 0) / 0.17 * 0.001).toFixed(1);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-2xl shadow-lg border border-white/50 relative"
      >
        {/* Offline Mode Indicator Badge */}
        {offlineMode && (
          <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs flex items-center z-10">
            <WiFiSlash className="mr-1" />
            <span>Offline Calculation</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-primary-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Carbon Footprint Results
          </motion.h2>
          
          <motion.div
            className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Trip: {calculationResult.tripName}
          </motion.div>
        </div>
        
        {/* Category Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <CategoryResultCard 
            title="Transportation" 
            value={transportationEmissions}
            icon={<FaPlane />}
            color="bg-blue-500"
            barColor="bg-blue-500"
            maxValue={maxEmissionValue}
          />
          
          <CategoryResultCard 
            title="Accommodation" 
            value={accommodationEmissions}
            icon={<FaHotel />}
            color="bg-purple-500"
            barColor="bg-purple-500"
            maxValue={maxEmissionValue}
          />
          
          <CategoryResultCard 
            title="Activities" 
            value={activitiesEmissions}
            icon={<FaHiking />}
            color="bg-amber-500"
            barColor="bg-amber-500"
            maxValue={maxEmissionValue}
          />
        </div>
        
        {/* Total Footprint */}
        <motion.div 
          className="bg-gradient-to-r from-white/70 to-white/80 backdrop-blur-md p-6 rounded-xl shadow-md mb-8 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100 to-transparent rounded-full -mr-10 -mt-10 opacity-60"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.7, 0.6] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-600 text-white mr-4">
                  <FaChartPie className="text-xl" />
                </div>
                <h3 className="font-bold text-xl md:text-2xl text-gray-800">Total Carbon Footprint</h3>
              </div>
              
              {/* Data Source Badge */}
              <div className={`text-xs rounded-full py-1 px-2 flex items-center ${
                offlineMode ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <span className="mr-1">{offlineMode ? 'Local Data' : 'API Data'}</span>
                {offlineMode ? <WiFiSlash /> : <FaDatabase />}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                  <AnimatedCounter 
                    value={parseFloat(calculationResult.totalEmissions) || 0} 
                    unit="kg CO2e" 
                    duration={1.5}
                  />
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FaCarSide className="mr-2" />
                  <span>Equivalent to driving approximately <span className="font-medium">{carDrivingEquivalent} km</span> in a standard car</span>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="h-24 w-full relative overflow-hidden rounded-lg">
                  {/* CO2 Level Visualization */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-400 to-green-400" />
                  
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 bg-white/20"
                    initial={{ height: '100%' }}
                    animate={{ 
                      height: `${100 - Math.min((parseFloat(calculationResult.totalEmissions) || 0) / 500 * 100, 100)}%` 
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg shadow-sm">
                      CO2 Level
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Recommendations */}
        {calculationResult.recommendations && calculationResult.recommendations.length > 0 && (
          <motion.div 
            className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg bg-primary-600 text-white mr-3">
                <FaInfoCircle />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Recommendations</h3>
            </div>
            
            <div className="mb-6">
              {calculationResult.recommendations.map((rec, index) => (
                <Recommendation key={index} recommendation={rec} index={index} />
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Total potential savings:</span>
              <div className="text-xl font-bold text-green-600">
                <AnimatedCounter 
                  value={parseFloat(calculationResult.potentialSavings) || 0} 
                  unit="kg CO2e" 
                  duration={1.2}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedResults; 