import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlane, 
  FaCar, 
  FaTrain, 
  FaBus, 
  FaLeaf, 
  FaHotel, 
  FaUtensils, 
  FaHiking,
  FaWater,
  FaCheck,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Sample data for demonstration
const TRAVEL_OPTIONS = {
  transportation: [
    { 
      id: 'trans1', 
      type: 'plane', 
      name: 'Economy Flight', 
      provider: 'Green Air',
      price: 299,
      ecoRating: 2, 
      carbonFootprint: 320,
      ecoFeatures: ['Carbon offset included', 'Newer fuel-efficient aircraft'],
      icon: <FaPlane />
    },
    { 
      id: 'trans2', 
      type: 'train', 
      name: 'High-speed Train', 
      provider: 'EcoRail',
      price: 189,
      ecoRating: 5, 
      carbonFootprint: 41,
      ecoFeatures: ['Electric powered', '100% renewable energy', 'Zero direct emissions'],
      icon: <FaTrain />
    },
    { 
      id: 'trans3', 
      type: 'bus', 
      name: 'Electric Bus', 
      provider: 'GreenGo Bus',
      price: 85,
      ecoRating: 4, 
      carbonFootprint: 68,
      ecoFeatures: ['Electric vehicle', 'Reduced road congestion', 'Shared transport'],
      icon: <FaBus />
    },
    { 
      id: 'trans4', 
      type: 'car', 
      name: 'Electric Car Rental', 
      provider: 'EcoMove',
      price: 150,
      ecoRating: 4, 
      carbonFootprint: 72,
      ecoFeatures: ['Zero tailpipe emissions', 'Renewable charging options'],
      icon: <FaCar />
    }
  ],
  accommodation: [
    {
      id: 'accom1',
      type: 'hotel',
      name: 'Green Valley Hotel',
      location: 'City Center',
      price: 120,
      ecoRating: 4,
      carbonFootprint: 18,
      ecoFeatures: ['LEED Certified', 'Solar powered', 'Water conservation systems', 'Organic linens'],
      icon: <FaHotel />
    },
    {
      id: 'accom2',
      type: 'hotel',
      name: 'EcoStay Resort',
      location: 'Beachfront',
      price: 210,
      ecoRating: 5,
      carbonFootprint: 12,
      ecoFeatures: ['Zero waste policy', 'Farm-to-table dining', 'Rainwater harvesting', 'EV charging'],
      icon: <FaHotel />
    },
    {
      id: 'accom3',
      type: 'hotel',
      name: 'Urban Lodge',
      location: 'Downtown',
      price: 95,
      ecoRating: 3,
      carbonFootprint: 24,
      ecoFeatures: ['Energy efficient appliances', 'Reduced plastic usage', 'Local suppliers'],
      icon: <FaHotel />
    }
  ],
  activities: [
    {
      id: 'act1',
      type: 'tour',
      name: 'Eco Hiking Tour',
      duration: '4 hours',
      price: 45,
      ecoRating: 5,
      carbonFootprint: 2,
      ecoFeatures: ['Small groups', 'Leave no trace principles', 'Environmental education', 'Wildlife protection'],
      icon: <FaHiking />
    },
    {
      id: 'act2',
      type: 'dining',
      name: 'Farm-to-Table Experience',
      duration: '3 hours',
      price: 65,
      ecoRating: 5,
      carbonFootprint: 4,
      ecoFeatures: ['Local organic produce', 'Zero food waste', 'Sustainable farming tour', 'Vegetarian options'],
      icon: <FaUtensils />
    },
    {
      id: 'act3',
      type: 'water',
      name: 'Sustainable Boat Tour',
      duration: '2 hours',
      price: 55,
      ecoRating: 4,
      carbonFootprint: 8,
      ecoFeatures: ['Electric boat', 'Marine conservation support', 'Educational component'],
      icon: <FaWater />
    }
  ]
};

// EcoRating component
const EcoRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FaLeaf 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-emerald-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

// Option Card component
const OptionCard = ({ option, type, onSelect, isSelected }) => {
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all cursor-pointer ${
        isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-100 hover:shadow-md'
      }`}
      whileHover={{ y: -5 }}
      onClick={() => onSelect(option.id, type)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-full mr-3">
              {option.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{option.name}</h3>
              <p className="text-sm text-gray-500">{option.provider || option.location || option.duration}</p>
            </div>
          </div>
          {isSelected && (
            <div className="p-1 bg-emerald-500 rounded-full text-white">
              <FaCheck size={12} />
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <EcoRating rating={option.ecoRating} />
          <div className="text-xl font-bold">${option.price}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg mb-3">
          <div className="flex items-center mb-1">
            <FaLeaf className="text-emerald-500 mr-2" />
            <span className="text-sm font-medium">Carbon Footprint: {option.carbonFootprint} kg CO₂</span>
          </div>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Eco Features:</p>
          <ul className="text-xs text-gray-600">
            {option.ecoFeatures.map((feature, index) => (
              <li key={index} className="mb-1 flex items-start">
                <span className="text-emerald-500 mr-1">•</span> {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// Main component
const CompareOptions = () => {
  const { currentUser } = useAuth();
  const [destination, setDestination] = useState('');
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  
  const handleOptionSelect = (id, type) => {
    switch(type) {
      case 'transportation':
        setSelectedTransport(id === selectedTransport ? null : id);
        break;
      case 'accommodation':
        setSelectedAccommodation(id === selectedAccommodation ? null : id);
        break;
      case 'activities':
        setSelectedActivity(id === selectedActivity ? null : id);
        break;
      default:
        break;
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would search for options based on the destination
    // For now, we'll just use our sample data
    console.log("Searching for options in:", destination);
  };
  
  const calculateTotalPrice = () => {
    let total = 0;
    
    if (selectedTransport) {
      const transport = TRAVEL_OPTIONS.transportation.find(t => t.id === selectedTransport);
      total += transport.price;
    }
    
    if (selectedAccommodation) {
      const accommodation = TRAVEL_OPTIONS.accommodation.find(a => a.id === selectedAccommodation);
      total += accommodation.price;
    }
    
    if (selectedActivity) {
      const activity = TRAVEL_OPTIONS.activities.find(a => a.id === selectedActivity);
      total += activity.price;
    }
    
    return total;
  };
  
  const calculateTotalFootprint = () => {
    let total = 0;
    
    if (selectedTransport) {
      const transport = TRAVEL_OPTIONS.transportation.find(t => t.id === selectedTransport);
      total += transport.carbonFootprint;
    }
    
    if (selectedAccommodation) {
      const accommodation = TRAVEL_OPTIONS.accommodation.find(a => a.id === selectedAccommodation);
      total += accommodation.carbonFootprint;
    }
    
    if (selectedActivity) {
      const activity = TRAVEL_OPTIONS.activities.find(a => a.id === selectedActivity);
      total += activity.carbonFootprint;
    }
    
    return total;
  };
  
  const calculateEcoCoinsEarned = () => {
    // Base formula: 10 EcoCoins per option + 1 per $ spent on eco-friendly options (rating 4-5)
    let ecoCoins = 0;
    
    if (selectedTransport) {
      const transport = TRAVEL_OPTIONS.transportation.find(t => t.id === selectedTransport);
      ecoCoins += 10;
      if (transport.ecoRating >= 4) {
        ecoCoins += Math.floor(transport.price * 0.1);
      }
    }
    
    if (selectedAccommodation) {
      const accommodation = TRAVEL_OPTIONS.accommodation.find(a => a.id === selectedAccommodation);
      ecoCoins += 10;
      if (accommodation.ecoRating >= 4) {
        ecoCoins += Math.floor(accommodation.price * 0.1);
      }
    }
    
    if (selectedActivity) {
      const activity = TRAVEL_OPTIONS.activities.find(a => a.id === selectedActivity);
      ecoCoins += 10;
      if (activity.ecoRating >= 4) {
        ecoCoins += Math.floor(activity.price * 0.1);
      }
    }
    
    return ecoCoins;
  };
  
  const handleBooking = () => {
    // In a real app, this would process the booking and award EcoCoins
    // For demo purposes, we'll just show a summary
    setShowBookingSummary(true);
  };
  
  const isBookingPossible = selectedTransport && selectedAccommodation;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Compare & Book Eco-Friendly Options</h1>
        
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Select dates"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Search
              </button>
            </div>
          </form>
        </div>
        
        {/* Options comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Transportation options */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-2">
                <FaPlane className="text-blue-600" />
              </div>
              Transportation
            </h2>
            
            <div className="space-y-4">
              {TRAVEL_OPTIONS.transportation.map(option => (
                <OptionCard
                  key={option.id}
                  option={option}
                  type="transportation"
                  onSelect={handleOptionSelect}
                  isSelected={option.id === selectedTransport}
                />
              ))}
            </div>
          </div>
          
          {/* Accommodation options */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="p-2 bg-amber-100 rounded-full mr-2">
                <FaHotel className="text-amber-600" />
              </div>
              Accommodation
            </h2>
            
            <div className="space-y-4">
              {TRAVEL_OPTIONS.accommodation.map(option => (
                <OptionCard
                  key={option.id}
                  option={option}
                  type="accommodation"
                  onSelect={handleOptionSelect}
                  isSelected={option.id === selectedAccommodation}
                />
              ))}
            </div>
          </div>
          
          {/* Activities options */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="p-2 bg-green-100 rounded-full mr-2">
                <FaHiking className="text-green-600" />
              </div>
              Activities
            </h2>
            
            <div className="space-y-4">
              {TRAVEL_OPTIONS.activities.map(option => (
                <OptionCard
                  key={option.id}
                  option={option}
                  type="activities"
                  onSelect={handleOptionSelect}
                  isSelected={option.id === selectedActivity}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Booking summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Selection</h2>
          
          {selectedTransport || selectedAccommodation || selectedActivity ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Total Price</p>
                  <p className="text-2xl font-bold text-gray-900">${calculateTotalPrice()}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Carbon Footprint</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateTotalFootprint()} kg CO₂</p>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-emerald-700 mb-1">EcoCoins Earned</p>
                  <p className="text-2xl font-bold text-emerald-600">+{calculateEcoCoinsEarned()}</p>
                </div>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={!isBookingPossible}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                  isBookingPossible
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Book Your Eco-Trip
              </button>
              
              {!isBookingPossible && (
                <p className="text-center text-sm text-red-500 mt-2">
                  Please select at least transportation and accommodation
                </p>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p>Select options to see your trip summary</p>
            </div>
          )}
        </div>
        
        {/* Booking confirmation modal */}
        {showBookingSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h3>
              
              <div className="mb-6">
                <div className="bg-emerald-100 rounded-lg p-4 flex items-center mb-4">
                  <FaLeaf className="text-emerald-600 text-xl mr-3" />
                  <div>
                    <p className="font-bold text-emerald-800">Eco-Impact</p>
                    <p className="text-emerald-700">
                      You've earned {calculateEcoCoinsEarned()} EcoCoins for your sustainable choices!
                    </p>
                  </div>
                </div>
                
                <p className="mb-4">Your booking details:</p>
                
                <div className="border-b border-gray-100 pb-3 mb-3">
                  <p className="font-bold">Transportation:</p>
                  <p>{TRAVEL_OPTIONS.transportation.find(t => t.id === selectedTransport)?.name}</p>
                </div>
                
                <div className="border-b border-gray-100 pb-3 mb-3">
                  <p className="font-bold">Accommodation:</p>
                  <p>{TRAVEL_OPTIONS.accommodation.find(a => a.id === selectedAccommodation)?.name}</p>
                </div>
                
                {selectedActivity && (
                  <div className="border-b border-gray-100 pb-3 mb-3">
                    <p className="font-bold">Activity:</p>
                    <p>{TRAVEL_OPTIONS.activities.find(a => a.id === selectedActivity)?.name}</p>
                  </div>
                )}
                
                <div className="border-b border-gray-100 pb-3 mb-3">
                  <p className="font-bold">Total Carbon Footprint:</p>
                  <p>{calculateTotalFootprint()} kg CO₂</p>
                </div>
                
                <div>
                  <p className="font-bold">Total Price:</p>
                  <p>${calculateTotalPrice()}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBookingSummary(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Close
                </button>
                
                <button
                  onClick={() => {
                    setShowBookingSummary(false);
                    // Clear selections
                    setSelectedTransport(null);
                    setSelectedAccommodation(null);
                    setSelectedActivity(null);
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  Book Another Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CompareOptions; 