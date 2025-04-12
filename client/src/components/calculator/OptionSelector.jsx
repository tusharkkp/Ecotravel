import React from 'react';
import { motion } from 'framer-motion';
import {
  FaPlane, FaTrain, FaBus, FaCar, FaShip, 
  FaHotel, FaHome, FaCampground, 
  FaLandmark, FaHiking, FaUmbrellaBeach, FaTheaterMasks
} from 'react-icons/fa';

const MotionOption = ({ 
  icon, 
  label, 
  value, 
  selected, 
  onChange,
  type = 'primary'
}) => {
  // Set color scheme based on type
  const colors = {
    primary: {
      selected: 'bg-primary-100 text-primary-700 border-primary-300',
      icon: 'bg-primary-500 text-white',
      hover: 'hover:bg-primary-50 hover:border-primary-200',
    },
    secondary: {
      selected: 'bg-secondary-100 text-secondary-700 border-secondary-300',
      icon: 'bg-secondary-500 text-white',
      hover: 'hover:bg-secondary-50 hover:border-secondary-200',
    },
    accent: {
      selected: 'bg-accent-100 text-accent-700 border-accent-300',
      icon: 'bg-accent-500 text-white',
      hover: 'hover:bg-accent-50 hover:border-accent-200',
    }
  };

  const color = colors[type] || colors.primary;

  return (
    <motion.div
      className={`
        flex flex-col items-center p-3 border rounded-xl cursor-pointer mb-1
        transition-all duration-200 ease-in-out
        ${selected ? color.selected : 'bg-white border-gray-200 text-gray-700'}
        ${selected ? '' : color.hover}
      `}
      onClick={() => onChange(value)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`
        p-3 rounded-full mb-2
        ${selected ? color.icon : 'bg-gray-200 text-gray-600'}
      `}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  );
};

const TransportationOptions = ({ selected, onChange }) => {
  const options = [
    { label: 'Flight', value: 'flight', icon: <FaPlane /> },
    { label: 'Train', value: 'train', icon: <FaTrain /> },
    { label: 'Bus', value: 'bus', icon: <FaBus /> },
    { label: 'Car', value: 'car', icon: <FaCar /> },
    { label: 'Boat', value: 'boat', icon: <FaShip /> },
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {options.map(option => (
        <MotionOption
          key={option.value}
          label={option.label}
          value={option.value}
          icon={option.icon}
          selected={selected === option.value}
          onChange={onChange}
          type="primary"
        />
      ))}
    </div>
  );
};

const AccommodationOptions = ({ selected, onChange }) => {
  const options = [
    { label: 'Hotel', value: 'hotel', icon: <FaHotel /> },
    { label: 'Hostel', value: 'hostel', icon: <FaHome /> },
    { label: 'Apartment', value: 'apartment', icon: <FaHome /> },
    { label: 'Camping', value: 'camping', icon: <FaCampground /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map(option => (
        <MotionOption
          key={option.value}
          label={option.label}
          value={option.value}
          icon={option.icon}
          selected={selected === option.value}
          onChange={onChange}
          type="secondary"
        />
      ))}
    </div>
  );
};

const ActivityOptions = ({ selected, onChange }) => {
  const options = [
    { label: 'Tour', value: 'tour', icon: <FaLandmark /> },
    { label: 'Adventure', value: 'adventure', icon: <FaHiking /> },
    { label: 'Cultural', value: 'cultural', icon: <FaTheaterMasks /> },
    { label: 'Leisure', value: 'leisure', icon: <FaUmbrellaBeach /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {options.map(option => (
        <MotionOption
          key={option.value}
          label={option.label}
          value={option.value}
          icon={option.icon}
          selected={selected === option.value}
          onChange={onChange}
          type="accent"
        />
      ))}
    </div>
  );
};

export { TransportationOptions, AccommodationOptions, ActivityOptions }; 