import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaLeaf } from 'react-icons/fa';

// Component to display carbon rating badges
const CarbonRatingBadge = ({ rating }) => {
  let styles = '';
  let icon = null;
  let label = '';
  
  switch(rating) {
    case 'very-low':
      styles = 'bg-green-100 text-green-800';
      icon = <FaLeaf className="mr-1" />;
      label = 'Very Low Impact';
      break;
    case 'low':
      styles = 'bg-green-100 text-green-800';
      icon = <FaLeaf className="mr-1" />;
      label = 'Low Impact';
      break;
    case 'medium':
      styles = 'bg-yellow-100 text-yellow-800';
      icon = <FaCheckCircle className="mr-1" />;
      label = 'Medium Impact';
      break;
    case 'high':
      styles = 'bg-red-100 text-red-800';
      icon = <FaExclamationTriangle className="mr-1" />;
      label = 'High Impact';
      break;
    default:
      styles = 'bg-gray-100 text-gray-800';
      label = 'Unknown';
  }
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
      {icon}
      {label}
    </div>
  );
};

// Component to display eco rating stars
const EcoRatingStars = ({ rating }) => {
  return (
    <div className="flex items-center">
      {Array(5).fill(0).map((_, index) => (
        <svg 
          key={index}
          className={`w-4 h-4 ${index < rating ? 'text-primary-500' : 'text-gray-300'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const OptionCard = ({ option, isSelected, onSelect, onBook }) => {
  const {
    type,
    name,
    icon,
    description,
    carbonFootprint,
    carbonRating,
    price,
    duration,
    ecoRating
  } = option;
  
  return (
    <motion.div 
      className={`relative rounded-xl overflow-hidden shadow-md ${
        isSelected 
          ? 'border-2 border-primary-500' 
          : 'border border-gray-200'
      }`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-primary-500 text-white p-1 rounded-full">
            <FaCheckCircle size={16} />
          </div>
        </div>
      )}
      
      {/* Card header - colored by type */}
      <div 
        className={`p-4 ${
          type === 'flight' || type === 'hotel' || type === 'city'
            ? 'bg-blue-600'
            : type === 'train' || type === 'ecohotel' || type === 'nature'
              ? 'bg-green-600'
              : 'bg-primary-600'
        } text-white`}
      >
        <div className="flex items-center">
          <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
            {icon}
          </div>
          <h3 className="font-bold text-lg">{name}</h3>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4 bg-white">
        <p className="text-gray-600 mb-4">{description}</p>
        
        {/* Info rows */}
        <div className="space-y-3">
          {/* Carbon footprint */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Carbon:</span>
            <div className="flex items-center">
              <span className="font-medium mr-2">{carbonFootprint} kg CO₂</span>
              <CarbonRatingBadge rating={carbonRating} />
            </div>
          </div>
          
          {/* Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Price:</span>
            <span className="font-bold text-gray-900">${price}</span>
          </div>
          
          {/* Duration if applicable */}
          {duration && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium">{duration}</span>
            </div>
          )}
          
          {/* Eco rating */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Eco Rating:</span>
            <EcoRatingStars rating={ecoRating} />
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={onSelect}
            className={`py-2 rounded-lg transition-colors ${
              isSelected
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
          
          <button
            onClick={onBook}
            className="py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OptionCard; 