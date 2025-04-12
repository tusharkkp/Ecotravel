import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlane, FaTrain, FaBus, FaCar, FaShip, 
  FaHotel, FaHome, FaCampground,
  FaHiking, FaTree, FaCity, FaWater,
  FaLeaf, FaArrowRight, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import OptionCard from './OptionCard';
import BookingModal from './BookingModal';
import { useAuth } from '../../context/AuthContext';

const ComparisonTool = () => {
  const { currentUser } = useAuth();
  
  // Option states
  const [transportOptions, setTransportOptions] = useState([]);
  const [accommodationOptions, setAccommodationOptions] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);
  
  // Selection states
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState(null);
  const [bookingOption, setBookingOption] = useState(null);
  
  // Load comparison data
  useEffect(() => {
    // This would normally come from an API call
    // For now, we'll use static data
    setTransportOptions([
      {
        id: 't1',
        type: 'flight',
        name: 'Economy Flight',
        icon: <FaPlane />,
        description: 'Standard economy flight',
        carbonFootprint: 180,
        carbonRating: 'high',
        price: 299,
        duration: '2h 15m',
        ecoRating: 1,
        bookingUrl: 'https://booking.com/flights',
        partnerCode: 'ECO123'
      },
      {
        id: 't2',
        type: 'train',
        name: 'High-Speed Train',
        icon: <FaTrain />,
        description: 'Electric high-speed train service',
        carbonFootprint: 28,
        carbonRating: 'low',
        price: 89,
        duration: '3h 45m',
        ecoRating: 4,
        bookingUrl: 'https://booking.com/trains',
        partnerCode: 'ECO123'
      },
      {
        id: 't3',
        type: 'bus',
        name: 'Express Bus',
        icon: <FaBus />,
        description: 'Modern coach with Wi-Fi',
        carbonFootprint: 42,
        carbonRating: 'medium',
        price: 45,
        duration: '4h 30m',
        ecoRating: 3,
        bookingUrl: 'https://booking.com/buses',
        partnerCode: 'ECO123'
      }
    ]);
    
    setAccommodationOptions([
      {
        id: 'a1',
        type: 'hotel',
        name: 'Standard Hotel',
        icon: <FaHotel />,
        description: 'Comfortable 3-star hotel',
        carbonFootprint: 18,
        carbonRating: 'medium',
        price: 120,
        ecoRating: 2,
        amenities: ['Wi-Fi', 'Restaurant', 'Pool'],
        bookingUrl: 'https://booking.com/hotels',
        partnerCode: 'ECO123'
      },
      {
        id: 'a2',
        type: 'ecohotel',
        name: 'Eco-Certified Lodge',
        icon: <FaHome />,
        description: 'Sustainable accommodation with green certification',
        carbonFootprint: 8,
        carbonRating: 'low',
        price: 145,
        ecoRating: 5,
        amenities: ['Organic food', 'Solar powered', 'Water conservation'],
        bookingUrl: 'https://booking.com/eco-hotels',
        partnerCode: 'ECO123'
      },
      {
        id: 'a3',
        type: 'camping',
        name: 'Tent Camping',
        icon: <FaCampground />,
        description: 'Campsite in natural surroundings',
        carbonFootprint: 4,
        carbonRating: 'very-low',
        price: 35,
        ecoRating: 5,
        amenities: ['Natural setting', 'Minimal amenities', 'Low impact'],
        bookingUrl: 'https://booking.com/camping',
        partnerCode: 'ECO123'
      }
    ]);
    
    setActivityOptions([
      {
        id: 'act1',
        type: 'city',
        name: 'City Tour',
        icon: <FaCity />,
        description: 'Guided tour of historical sites',
        carbonFootprint: 12,
        carbonRating: 'medium',
        price: 65,
        duration: '4 hours',
        ecoRating: 3,
        bookingUrl: 'https://booking.com/activities',
        partnerCode: 'ECO123'
      },
      {
        id: 'act2',
        type: 'nature',
        name: 'Guided Eco-Hike',
        icon: <FaHiking />,
        description: 'Nature walk with certified guide',
        carbonFootprint: 3,
        carbonRating: 'very-low',
        price: 45,
        duration: '3 hours',
        ecoRating: 5,
        bookingUrl: 'https://booking.com/eco-activities',
        partnerCode: 'ECO123'
      },
      {
        id: 'act3',
        type: 'water',
        name: 'Boat Tour',
        icon: <FaWater />,
        description: 'Scenic boat tour of coastline',
        carbonFootprint: 22,
        carbonRating: 'high',
        price: 89,
        duration: '2 hours',
        ecoRating: 2,
        bookingUrl: 'https://booking.com/water-activities',
        partnerCode: 'ECO123'
      }
    ]);
  }, []);
  
  // Calculate total carbon footprint of selections
  const calculateTotalFootprint = () => {
    let total = 0;
    if (selectedTransport) total += selectedTransport.carbonFootprint;
    if (selectedAccommodation) total += selectedAccommodation.carbonFootprint;
    if (selectedActivity) total += selectedActivity.carbonFootprint;
    return total;
  };
  
  // Calculate potential EcoCoins reward
  const calculatePotentialEcoCoins = () => {
    // Base reward amount
    const baseReward = 50;
    
    // Get eco ratings for each selection
    const transportRating = selectedTransport ? selectedTransport.ecoRating : 0;
    const accommodationRating = selectedAccommodation ? selectedAccommodation.ecoRating : 0;
    const activityRating = selectedActivity ? selectedActivity.ecoRating : 0;
    
    // Calculate multiplier based on eco ratings (1-5 scale)
    const ratingsSum = transportRating + accommodationRating + activityRating;
    const maxPossibleRating = 15; // 5 + 5 + 5
    const percentageOfMax = ratingsSum / maxPossibleRating;
    
    // Apply multiplier to base reward
    return Math.round(baseReward * percentageOfMax * 10);
  };
  
  // Handle booking intent
  const handleBookNow = (type, option) => {
    // If user is not logged in, redirect to login
    if (!currentUser) {
      // Store booking intent in localStorage
      localStorage.setItem('bookingIntent', JSON.stringify({
        type,
        optionId: option.id
      }));
      
      // Redirect to login
      window.location.href = '/login?redirect=comparison';
      return;
    }
    
    // Otherwise, show booking modal
    setBookingType(type);
    setBookingOption(option);
    setShowBookingModal(true);
  };
  
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Compare Travel Options</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Make eco-conscious travel choices and earn rewards
          </p>
        </div>
        
        {/* Transportation Options */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FaPlane className="text-primary-600 text-xl mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Transportation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transportOptions.map(option => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={selectedTransport?.id === option.id}
                onSelect={() => setSelectedTransport(option)}
                onBook={() => handleBookNow('transport', option)}
              />
            ))}
          </div>
        </section>
        
        {/* Accommodation Options */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FaHotel className="text-primary-600 text-xl mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Accommodation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodationOptions.map(option => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={selectedAccommodation?.id === option.id}
                onSelect={() => setSelectedAccommodation(option)}
                onBook={() => handleBookNow('accommodation', option)}
              />
            ))}
          </div>
        </section>
        
        {/* Activity Options */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <FaHiking className="text-primary-600 text-xl mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activityOptions.map(option => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={selectedActivity?.id === option.id}
                onSelect={() => setSelectedActivity(option)}
                onBook={() => handleBookNow('activity', option)}
              />
            ))}
          </div>
        </section>
        
        {/* Summary Section */}
        {(selectedTransport || selectedAccommodation || selectedActivity) && (
          <motion.section 
            className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Eco-Friendly Trip</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Carbon Footprint */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaLeaf className="text-primary-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Total Carbon Footprint</h3>
                </div>
                <p className="text-2xl font-bold text-primary-700">{calculateTotalFootprint()} kg CO₂</p>
                <p className="text-sm text-gray-500 mt-1">Based on your selections</p>
              </div>
              
              {/* Potential EcoCoins */}
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs mr-2">E</span>
                  <h3 className="font-semibold text-gray-900">Potential EcoCoins</h3>
                </div>
                <p className="text-2xl font-bold text-primary-700">{calculatePotentialEcoCoins()} coins</p>
                <p className="text-sm text-gray-500 mt-1">Earn by booking eco-friendly options</p>
              </div>
              
              {/* Carbon Savings */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaTree className="text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Carbon Savings</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {selectedTransport && selectedTransport.carbonRating === 'low' ? '152 kg CO₂' : 'Choose eco options'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Compared to standard options</p>
              </div>
            </div>
            
            {/* Selected Options */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Your Selections</h3>
              
              <div className="space-y-3">
                {selectedTransport && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {selectedTransport.icon}
                      <span className="ml-2 font-medium">{selectedTransport.name}</span>
                      {selectedTransport.carbonRating === 'low' && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Eco-Friendly
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleBookNow('transport', selectedTransport)}
                      className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                )}
                
                {selectedAccommodation && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {selectedAccommodation.icon}
                      <span className="ml-2 font-medium">{selectedAccommodation.name}</span>
                      {selectedAccommodation.carbonRating === 'low' && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Eco-Friendly
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleBookNow('accommodation', selectedAccommodation)}
                      className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                )}
                
                {selectedActivity && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {selectedActivity.icon}
                      <span className="ml-2 font-medium">{selectedActivity.name}</span>
                      {selectedActivity.carbonRating === 'low' && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Eco-Friendly
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleBookNow('activity', selectedActivity)}
                      className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </div>
      
      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <BookingModal
            bookingType={bookingType}
            bookingOption={bookingOption}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComparisonTool; 