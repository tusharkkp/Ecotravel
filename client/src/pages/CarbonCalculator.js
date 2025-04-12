import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlane, FaTrain, FaBus, FaCar, FaShip, 
  FaHotel, FaHome, FaCampground, 
  FaHiking, FaLandmark, FaLeaf,
  FaClipboardList, FaInfoCircle, FaCalculator,
  FaSync, FaWifi, FaTimes
} from 'react-icons/fa';
import CarbonMeter from '../components/calculator/CarbonMeter';
import CalculatorCard from '../components/calculator/CalculatorCard';
import { 
  TransportationOptions, 
  AccommodationOptions, 
  ActivityOptions 
} from '../components/calculator/OptionSelector';
import AnimatedResults from '../components/calculator/AnimatedResults';
import SustainableTips from '../components/calculator/SustainableTips';

// Custom WiFiSlash icon since FaWifiSlash is not available in this version
const WiFiSlash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="1em" height="1em">
    <path d="M320 368c17.64 0 32 14.36 32 32s-14.36 32-32 32s-32-14.36-32-32S302.4 368 320 368zM412.6 192.9C380.5 169.6 341.3 156.1 320 156.1C298.7 156.1 259.5 169.6 227.4 192.9C221.3 198 211.1 197.2 206 191.1C200 184.9 200.8 174.7 206.1 169.6C246.1 141.2 291.2 124.1 320 124.1C348.8 124.1 393.9 141.2 433.9 169.6C440 174.7 440.8 184.9 434.8 191.1C429.7 197.2 419.5 198 412.6 192.9V192.9zM473.1 121.4C428.4 87.74 371.8 64.4 320 64.4C268.2 64.4 211.6 87.74 166 121.4C159.2 126.9 149.1 126.3 144.4 119.5C138.9 112.7 139.5 102.6 146.3 97.07C198.3 59.15 262.1 32.4 320 32.4C377.9 32.4 441.7 59.15 493.7 97.07C500.5 102.6 501.1 112.7 495.6 119.5C490.1 126.3 480 126.9 473.1 121.4V121.4zM4.686 473.9C-0.5954 468.7-1.547 460.2 2.369 453.9L472.4 18.88C478.3 12.54 486.8 11.57 493.1 17.43L493.2 17.52C499.5 23.38 500.5 31.91 494.6 38.25L24.52 473.3C18.6 479.6 10.06 480.6 3.77 474.8L3.718 474.7C3.705 474.7 3.693 474.7 3.68 474.6L4.686 473.9zM537.5 224.2C542.5 217.7 552.7 216.8 558.1 222.7C603.1 260.2 632 308.2 632 334.6C632 340.9 626.9 346 620.7 346C614.4 346 609.3 340.9 609.3 334.6C609.3 316.2 584.3 273.8 544.1 239.9C538.7 234.9 537.7 224.8 542.8 219.4L537.5 224.2zM183.3 154.9L346.9 15.13C338.1 14.53 329.5 14.37 320 14.37C253.3 14.37 187.4 32.21 129.8 65.22C123.7 69 121.2 76.7 123.3 83.63C125.4 90.56 132 95.04 139.4 94.37C155.6 92.91 171.5 91.68 187.2 90.87L183.3 154.9zM297.3 311.1L457.7 174.9C471.1 193.7 483.1 214.5 492.2 237C495.2 244.5 503.4 248.8 511.8 247.5C520.2 246.2 526.3 239.1 526.3 230.5C526.3 228.4 526.2 226.2 525.1 224.2L570.8 184.9C595.8 211.3 613.3 241.4 622.9 272.8C626.3 281.5 635.3 286.5 644.4 284.6C653.6 282.7 659.1 273.9 657.2 264.7C635.3 183.5 568.2 118 483.7 88.23L480.2 91.22C427.3 136.2 297.3 311.1 297.3 311.1z"/>
  </svg>
);

// FaPlus component
const FaPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

// Default emission factors in case API fails
const defaultEmissionFactors = {
  transportation: {
    flight: 0.255, // kg CO2e per km per person
    train: 0.041,
    bus: 0.027,
    car: 0.17,
    boat: 0.19
  },
  accommodation: {
    hotel: 15, // kg CO2e per night
    hostel: 5,
    apartment: 8,
    camping: 2
  },
  activities: {
    tour: 4, // kg CO2e per activity
    adventure: 6,
    cultural: 2,
    leisure: 3
  }
};

// Configure axios with base URL, timeout and auth
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_KEY = process.env.REACT_APP_API_KEY;
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '8000', 10);
const RETRY_INTERVAL = parseInt(process.env.REACT_APP_API_RETRY_INTERVAL || '60000', 10);

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = API_TIMEOUT;

// Configure auth headers if API key is present
if (API_KEY) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${API_KEY}`;
}

const CarbonCalculator = () => {
  const [calculationData, setCalculationData] = useState({
    transportation: [],
    accommodations: [],
    activities: [],
    tripName: 'My Trip'
  });
  const [transportationType, setTransportationType] = useState('flight');
  const [transportationDistance, setTransportationDistance] = useState('');
  const [transportationPassengers, setTransportationPassengers] = useState(1);
  const [accommodationType, setAccommodationType] = useState('hotel');
  const [accommodationNights, setAccommodationNights] = useState(1);
  const [activityType, setActivityType] = useState('tour');
  const [calculationResult, setCalculationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emissionFactors, setEmissionFactors] = useState(defaultEmissionFactors);
  const [tripName, setTripName] = useState('My Trip');
  const [apiAvailable, setApiAvailable] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  const [activeSection, setActiveSection] = useState('transportation');

  // Function to retry API connection
  const retryApiConnection = useCallback(async () => {
    setIsRetrying(true);
    try {
      console.log('Attempting to reconnect to API server...');
      const response = await axios.get('/api/calculator/factors', { 
        timeout: 5000,
        headers: API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}
      });
      
      if (response.data && response.data.data && response.data.data.emissionFactors) {
        console.log('Successfully reconnected to API server');
        setEmissionFactors(response.data.data.emissionFactors);
        setApiAvailable(true);
        setOfflineMode(false);
        setShowConnectionAlert(true);
        // Auto-hide the success connection alert after 5 seconds
        setTimeout(() => setShowConnectionAlert(false), 5000);
      }
    } catch (err) {
      console.error('Failed to reconnect to API:', err);
      setApiAvailable(false);
      setOfflineMode(true);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    // Fetch emission factors on component mount
    const fetchEmissionFactors = async () => {
      try {
        console.log('Attempting to connect to API at:', API_BASE_URL);
        const headers = {};
        if (API_KEY) {
          console.log('Using API key for authentication');
          headers['Authorization'] = `Bearer ${API_KEY}`;
        }
        
        const response = await axios.get('/api/calculator/factors', { headers });
        if (response.data && response.data.data && response.data.data.emissionFactors) {
          console.log('API connection successful, using server emission factors');
          setEmissionFactors(response.data.data.emissionFactors);
          setApiAvailable(true);
          setOfflineMode(false);
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (err) {
        console.error('Failed to fetch emission factors:', err);
        // Check for specific error types
        if (err.code === 'ECONNABORTED') {
          console.log('API connection timeout');
        } else if (err.response) {
          console.log('API responded with error status:', err.response.status);
          
          // Check for auth errors
          if (err.response.status === 401 || err.response.status === 403) {
            console.log('Authentication error - check your API key');
          }
        } else if (err.request) {
          console.log('No response received from API');
        }
        
        // Use default emission factors instead
        console.log('Switching to offline mode with default emission factors');
        setEmissionFactors(defaultEmissionFactors);
        setApiAvailable(false);
        setOfflineMode(true);
      }
    };

    fetchEmissionFactors();

    // Set up auto-retry mechanism
    const retryInterval = setInterval(() => {
      if (!apiAvailable) {
        retryApiConnection();
      }
    }, RETRY_INTERVAL);

    return () => clearInterval(retryInterval);
  }, [retryApiConnection, apiAvailable]);

  // Function to calculate emissions locally if API is not available
  const calculateLocalEmissions = () => {
    // Calculate transportation emissions
    let transportationEmissions = 0;
    const transportationWithEmissions = calculationData.transportation.map(item => {
      const factor = emissionFactors.transportation[item.type] || 0.2;
      const emissions = factor * item.distance.value / (item.passengers || 1);
      transportationEmissions += emissions;
      return { ...item, emissions };
    });
    
    // Calculate accommodation emissions
    let accommodationEmissions = 0;
    const accommodationsWithEmissions = calculationData.accommodations.map(item => {
      const factor = emissionFactors.accommodation[item.type] || 10;
      const emissions = factor * item.nights;
      accommodationEmissions += emissions;
      return { ...item, emissions };
    });
    
    // Calculate activity emissions
    let activityEmissions = 0;
    const activitiesWithEmissions = calculationData.activities.map(item => {
      const factor = emissionFactors.activities[item.type] || 3;
      activityEmissions += factor;
      return { ...item, emissions: factor };
    });
    
    // Calculate total emissions
    const totalEmissions = transportationEmissions + accommodationEmissions + activityEmissions;
    
    // Generate recommendations
    const recommendations = [];
    
    if (transportationEmissions > 0) {
      recommendations.push({
        category: 'transportation',
        suggestion: 'Consider using trains instead of flights for shorter distances',
        potentialSavings: transportationEmissions * 0.3
      });
    }
    
    if (accommodationEmissions > 0) {
      recommendations.push({
        category: 'accommodation',
        suggestion: 'Choose eco-certified hotels or hostels',
        potentialSavings: accommodationEmissions * 0.2
      });
    }
    
    // Calculate potential savings
    const potentialSavings = recommendations.reduce((total, rec) => total + rec.potentialSavings, 0);
    
    return {
      tripName: tripName || 'My Trip',
      transportation: transportationWithEmissions,
      accommodations: accommodationsWithEmissions,
      activities: activitiesWithEmissions,
      totalEmissions,
      potentialSavings,
      recommendations
    };
  };

  const addTransportation = () => {
    if (!transportationDistance || transportationDistance <= 0) {
      setError('Please enter a valid distance');
      return;
    }

    const newTransportation = {
      type: transportationType,
      distance: {
        value: parseFloat(transportationDistance),
        unit: 'km'
      },
      passengers: parseInt(transportationPassengers, 10) || 1
    };

    setCalculationData(prev => ({
      ...prev,
      transportation: [...prev.transportation, newTransportation]
    }));
    setTransportationDistance('');
    setError('');
  };

  const addAccommodation = () => {
    if (accommodationNights <= 0) {
      setError('Please enter a valid number of nights');
      return;
    }

    const newAccommodation = {
      type: accommodationType,
      nights: parseInt(accommodationNights, 10)
    };

    setCalculationData(prev => ({
      ...prev,
      accommodations: [...prev.accommodations, newAccommodation]
    }));
    setAccommodationNights(1);
    setError('');
  };

  const addActivity = () => {
    const newActivity = {
      type: activityType
    };

    setCalculationData(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
    setError('');
  };

  const removeTransportation = (index) => {
    setCalculationData(prev => ({
      ...prev,
      transportation: prev.transportation.filter((_, i) => i !== index)
    }));
  };

  const removeAccommodation = (index) => {
    setCalculationData(prev => ({
      ...prev,
      accommodations: prev.accommodations.filter((_, i) => i !== index)
    }));
  };

  const removeActivity = (index) => {
    setCalculationData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const calculateEmissions = async () => {
    if (calculationData.transportation.length === 0 && 
        calculationData.accommodations.length === 0 && 
        calculationData.activities.length === 0) {
      setError('Please add at least one transportation, accommodation, or activity');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (apiAvailable && !offlineMode) {
        // Try API first with timeout option
        console.log('Calculating emissions via API');
        try {
          // Prepare headers with auth if needed
          const headers = {};
          if (API_KEY) {
            headers['Authorization'] = `Bearer ${API_KEY}`;
          }
          
          const response = await axios.post('/api/calculator', {
            ...calculationData,
            tripName: tripName
          }, { 
            timeout: API_TIMEOUT * 1.25, // Slightly longer timeout for calculation
            headers
          });
          
          if (response.data && response.data.data && response.data.data.calculation) {
            console.log('Calculation successful via API');
            setCalculationResult(response.data.data.calculation);
          } else {
            console.log('Invalid calculation response, using local calculation');
            setCalculationResult(calculateLocalEmissions());
          }
        } catch (apiError) {
          console.error('API calculation failed:', apiError);
          console.log('Falling back to local calculation');
          setCalculationResult(calculateLocalEmissions());
          // Only update API status if we get a connection error, not just a calculation error
          if (apiError.code === 'ECONNABORTED' || !apiError.response) {
            setApiAvailable(false);
            setOfflineMode(true);
          }
        }
      } else {
        // Use local calculation if API is not available
        console.log('Using local calculation mode');
        setCalculationResult(calculateLocalEmissions());
      }
      
      setIsLoading(false);
      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Failed to calculate emissions:', err);
      // Fall back to local calculation if any error occurs
      console.log('Error in calculation flow, using local fallback');
      setCalculationResult(calculateLocalEmissions());
      setError('We encountered an issue with our calculation service. Using local calculation instead.');
      setIsLoading(false);
    }
  };

  const getTransportationIcon = (type) => {
    switch (type) {
      case 'flight': return <FaPlane className="mr-2" />;
      case 'train': return <FaTrain className="mr-2" />;
      case 'bus': return <FaBus className="mr-2" />;
      case 'car': return <FaCar className="mr-2" />;
      case 'boat': return <FaShip className="mr-2" />;
      default: return <FaCar className="mr-2" />;
    }
  };

  const getAccommodationIcon = (type) => {
    switch (type) {
      case 'hotel': return <FaHotel className="mr-2" />;
      case 'hostel': return <FaHome className="mr-2" />;
      case 'apartment': return <FaHome className="mr-2" />;
      case 'camping': return <FaCampground className="mr-2" />;
      default: return <FaHotel className="mr-2" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'tour': return <FaLandmark className="mr-2" />;
      case 'adventure': return <FaHiking className="mr-2" />;
      case 'cultural': return <FaLandmark className="mr-2" />;
      case 'leisure': return <FaHome className="mr-2" />;
      default: return <FaLandmark className="mr-2" />;
    }
  };

  // Get emission ratio for the 3D visualization (between 0 and 1)
  const getEmissionRatio = () => {
    if (!calculationResult) return 0.5; // middle position if no result
    
    const totalEmissions = parseFloat(calculationResult.totalEmissions) || 0;
    
    // Scale the emissions from 0-500 to 0-1
    const ratio = Math.min(totalEmissions / 500, 1);
    
    // Adjust so it looks balanced at 100
    return ratio;
  };

  return (
    <div className="bg-gradient-to-br from-secondary-50 to-primary-50 min-h-screen">
      <div className="relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-leaf-pattern opacity-5 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
            <div className="lg:w-7/12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold mb-4 text-primary-800">Carbon Footprint Calculator</h1>
                <p className="mb-8 text-lg text-gray-700">
                  Estimate the carbon emissions for your trip and receive recommendations 
                  to reduce your environmental impact.
                </p>
              </motion.div>
              
              {/* Connection Status Indicator - only show when offline */}
              <AnimatePresence>
                {offlineMode && (
                  <motion.div 
                    className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <WiFiSlash className="mr-3 text-amber-600" />
                      <div>
                        <p className="font-medium">Offline Calculation Mode</p>
                        <p className="text-sm text-amber-700">Using built-in emission factors for your calculation</p>
                      </div>
                    </div>
                    <button 
                      className={`flex items-center space-x-1 text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg transition-all ${isRetrying ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={retryApiConnection}
                      disabled={isRetrying}
                    >
                      <FaSync className={`mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Connecting...' : 'Reconnect'}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Connection Success Alert */}
              <AnimatePresence>
                {showConnectionAlert && apiAvailable && (
                  <motion.div 
                    className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <FaWifi className="mr-3 text-green-600" />
                      <p>Connected to emission calculation server</p>
                    </div>
                    <button 
                      className="text-green-700 hover:text-green-900"
                      onClick={() => setShowConnectionAlert(false)}
                    >
                      <FaTimes />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {error && (
                <motion.div 
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-3" />
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
              
              <CalculatorCard 
                title="Trip Name" 
                icon={<FaClipboardList />} 
                className="mb-8"
              >
                <input
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Enter your trip name"
                />
              </CalculatorCard>
              
              {/* Navigation Tabs */}
              <div className="flex mb-6 border-b border-gray-200">
                <button
                  className={`py-3 px-5 font-medium text-lg relative ${activeSection === 'transportation' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-600'}`}
                  onClick={() => setActiveSection('transportation')}
                >
                  Transportation
                  {activeSection === 'transportation' && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"
                      layoutId="activeTab"
                    />
                  )}
                </button>
                <button
                  className={`py-3 px-5 font-medium text-lg relative ${activeSection === 'accommodation' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-600'}`}
                  onClick={() => setActiveSection('accommodation')}
                >
                  Accommodation
                  {activeSection === 'accommodation' && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"
                      layoutId="activeTab"
                    />
                  )}
                </button>
                <button
                  className={`py-3 px-5 font-medium text-lg relative ${activeSection === 'activities' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-600'}`}
                  onClick={() => setActiveSection('activities')}
                >
                  Activities
                  {activeSection === 'activities' && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"
                      layoutId="activeTab"
                    />
                  )}
                </button>
              </div>
              
              {/* Transportation Section */}
              {activeSection === 'transportation' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalculatorCard
                    title="Transportation" 
                    icon={<FaCar />}
                    className="mb-6"
                  >
                    <div className="mb-5">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
                      <TransportationOptions 
                        selected={transportationType}
                        onChange={setTransportationType}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Distance (km)
                        </label>
                        <input
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          type="number"
                          value={transportationDistance}
                          onChange={(e) => setTransportationDistance(e.target.value)}
                          min="0"
                          placeholder="Enter distance"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Passengers
                        </label>
                        <input
                          className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          type="number"
                          value={transportationPassengers}
                          onChange={(e) => setTransportationPassengers(e.target.value)}
                          min="1"
                          placeholder="Number of passengers"
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center transition-all duration-300"
                      onClick={addTransportation}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPlus className="mr-2" />
                      Add Transportation
                    </motion.button>
                    
                    {/* Transportation List */}
                    {calculationData.transportation.length > 0 && (
                      <div className="mt-5">
                        <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Added Transportation:</h3>
                        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200">
                          {calculationData.transportation.map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex items-center">
                                {getTransportationIcon(item.type)}
                                <span className="capitalize">{item.type}</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span>{item.distance.value} km</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span>{item.passengers} passenger{item.passengers !== 1 ? 's' : ''}</span>
                              </div>
                              <button
                                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                onClick={() => removeTransportation(index)}
                              >
                                <FaTimes />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CalculatorCard>
                </motion.div>
              )}
              
              {/* Accommodation Section */}
              {activeSection === 'accommodation' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalculatorCard 
                    title="Accommodation" 
                    icon={<FaHotel />}
                    className="mb-6"
                  >
                    <div className="mb-5">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
                      <AccommodationOptions 
                        selected={accommodationType}
                        onChange={setAccommodationType}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Nights
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        type="number"
                        value={accommodationNights}
                        onChange={(e) => setAccommodationNights(e.target.value)}
                        min="1"
                        placeholder="Number of nights"
                      />
                    </div>
                    
                    <motion.button
                      className="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50 flex items-center justify-center transition-all duration-300"
                      onClick={addAccommodation}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPlus className="mr-2" />
                      Add Accommodation
                    </motion.button>
                    
                    {/* Accommodation List */}
                    {calculationData.accommodations.length > 0 && (
                      <div className="mt-5">
                        <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Added Accommodations:</h3>
                        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200">
                          {calculationData.accommodations.map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex items-center">
                                {getAccommodationIcon(item.type)}
                                <span className="capitalize">{item.type}</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span>{item.nights} night{item.nights !== 1 ? 's' : ''}</span>
                              </div>
                              <button
                                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                onClick={() => removeAccommodation(index)}
                              >
                                <FaTimes />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CalculatorCard>
                </motion.div>
              )}
              
              {/* Activities Section */}
              {activeSection === 'activities' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalculatorCard 
                    title="Activities" 
                    icon={<FaHiking />}
                    className="mb-6"
                  >
                    <div className="mb-5">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Type</label>
                      <ActivityOptions 
                        selected={activityType}
                        onChange={setActivityType}
                      />
                    </div>
                    
                    <motion.button
                      className="w-full bg-accent-600 hover:bg-accent-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-opacity-50 flex items-center justify-center transition-all duration-300"
                      onClick={addActivity}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaPlus className="mr-2" />
                      Add Activity
                    </motion.button>
                    
                    {/* Activities List */}
                    {calculationData.activities.length > 0 && (
                      <div className="mt-5">
                        <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Added Activities:</h3>
                        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200">
                          {calculationData.activities.map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex items-center">
                                {getActivityIcon(item.type)}
                                <span className="capitalize">{item.type}</span>
                              </div>
                              <button
                                className="text-red-500 hover:text-red-700 transition-colors duration-300"
                                onClick={() => removeActivity(index)}
                              >
                                <FaTimes />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CalculatorCard>
                </motion.div>
              )}
              
              {/* Calculate Button */}
              <motion.button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl text-lg flex items-center justify-center space-x-2 mt-6 mb-8"
                onClick={calculateEmissions}
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FaCalculator className="mr-2" />
                <span>{isLoading ? 'Calculating...' : 'Calculate Carbon Footprint'}</span>
                
                {isLoading && (
                  <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </motion.button>
            </div>
            
            <div className="lg:w-5/12 lg:sticky lg:top-24">
              {/* Connection Status Indicator in Sidebar */}
              <AnimatePresence>
                {offlineMode && (
                  <motion.div 
                    className="mb-4 bg-white/40 backdrop-blur-md p-3 rounded-xl border border-amber-200 flex items-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="bg-amber-100 p-2 rounded-lg mr-3">
                      <WiFiSlash className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">Using offline calculation</p>
                      <div className="text-xs text-gray-500 mt-0.5">Results may vary from official carbon databases</div>
                    </div>
                    <div className="tooltip relative group">
                      <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
                        <FaInfoCircle className="text-gray-500" />
                      </button>
                      <div className="tooltip-content invisible group-hover:visible absolute right-0 w-64 bg-gray-900 text-white text-xs rounded p-2 z-10">
                        We're currently unable to reach our emission calculation server. 
                        Using built-in emission factors which may be less precise than our real-time database.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
                <div className="flex items-center mb-4">
                  <FaLeaf className="text-xl text-primary-600 mr-2" />
                  <h3 className="text-xl font-semibold text-primary-800">Carbon Impact Visualization</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  This interactive 3D visualization shows your carbon footprint. 
                  Add your travel details and calculate to see how your choices impact the environment.
                </p>
                
                <CarbonMeter 
                  value={calculationResult ? parseFloat(calculationResult.totalEmissions) || 0 : 0} 
                  maxValue={1000}
                  label="Carbon Footprint"
                  unit="kg CO2e"
                />
                
                <div className="flex justify-between mt-6 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                    <span className="text-gray-700">Low Impact</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block mr-2"></span>
                    <span className="text-gray-700">Moderate</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
                    <span className="text-gray-700">High Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div id="results-section" className="mt-10">
            <AnimatedResults calculationResult={calculationResult} offlineMode={offlineMode} />
            {calculationResult && <SustainableTips calculationResult={calculationResult} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCalculator; 