import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const ContributionCard3D = ({ 
  id,
  name, 
  description, 
  icon, 
  minAmount, 
  onSelect, 
  selected,
  impactDescription,
  color = 'emerald'
}) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowOpacity, setGlowOpacity] = useState(0);
  const [glowX, setGlowX] = useState(0);
  const [glowY, setGlowY] = useState(0);
  
  // Define gradient colors based on provided color
  const getGradients = () => {
    const colorMap = {
      'emerald': 'from-emerald-500 to-green-600',
      'blue': 'from-blue-500 to-cyan-600',
      'amber': 'from-amber-500 to-yellow-600',
      'teal': 'from-teal-500 to-cyan-600'
    };
    
    return colorMap[color] || colorMap.emerald;
  };
  
  // Handle mouse movement for 3D effect
  useEffect(() => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      
      // Calculate mouse position relative to card center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate rotation (limited range)
      const rotateXValue = (mouseY / (rect.height / 2)) * -5; // -5 to 5 degrees
      const rotateYValue = (mouseX / (rect.width / 2)) * 5; // -5 to 5 degrees
      
      // Calculate glow position (relative to mouse position)
      const glowXValue = (mouseX / rect.width) * 100 + 50;
      const glowYValue = (mouseY / rect.height) * 100 + 50;
      
      // Apply transformations
      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
      setGlowOpacity(0.2);
      setGlowX(glowXValue);
      setGlowY(glowYValue);
    };
    
    const handleMouseLeave = () => {
      // Reset transformations
      setRotateX(0);
      setRotateY(0);
      setGlowOpacity(0);
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <motion.div 
      ref={cardRef}
      className={`relative bg-white rounded-xl cursor-pointer overflow-hidden 
      ${selected ? 'ring-2 ring-offset-2' : 'shadow-lg hover:shadow-xl'} 
      ${selected ? `ring-${color}-500` : 'ring-transparent'}`}
      onClick={() => onSelect(id)}
      whileHover={{ y: -5 }}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Top accent bar with icon */}
      <div className={`h-2 bg-gradient-to-r ${getGradients()}`}></div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(var(--glow-color), ${glowOpacity}), transparent 50%)`,
          transition: 'background 0.2s ease-out',
          '--glow-color': color === 'emerald' ? '16, 185, 129' : 
                         color === 'blue' ? '59, 130, 246' :
                         color === 'amber' ? '245, 158, 11' : 
                         color === 'teal' ? '20, 184, 166' : '16, 185, 129'
        }}
      ></div>
      
      <div className="p-5 relative z-10">
        <div className="flex items-center mb-4">
          <div className={`bg-${color}-100 p-3 rounded-full mr-3 transform transition-transform ${selected ? 'scale-110' : ''}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{name}</h3>
            <p className="text-xs text-gray-500">Min. {minAmount} EcoCoins</p>
          </div>
          
          {selected && (
            <motion.div 
              className={`ml-auto text-${color}-500`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <FaCheckCircle />
            </motion.div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        {impactDescription && (
          <div className={`bg-${color}-50 p-3 rounded-md text-sm text-gray-700`}>
            <div className="flex items-center mb-1">
              <FaInfoCircle className={`text-${color}-500 mr-1`} />
              <span className="font-medium">Impact:</span>
            </div>
            {impactDescription}
          </div>
        )}

        {/* Interactive badge */}
        <div className="mt-4 flex justify-end">
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${selected ? `bg-${color}-500 text-white` : `text-${color}-700 bg-${color}-100`} 
            transition-colors duration-300
          `}>
            {selected ? 'Selected' : 'Select to Contribute'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContributionCard3D; 