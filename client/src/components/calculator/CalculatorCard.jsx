import React, { useRef, useEffect } from 'react';

const CalculatorCard = ({ 
  children, 
  title,
  icon,
  className = '',
  active = false,
  onClick,
  hoverScale = true,
  interactive = true,
}) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (!interactive || !cardRef.current) return;
    
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      // Calculate the gradient position
      const gradientX = 100 * x;
      const gradientY = 100 * y;
      
      // Apply gradient overlay effect
      card.style.background = `
        linear-gradient(
          135deg, 
          rgba(255, 255, 255, 0.15) ${gradientX}%, 
          rgba(255, 255, 255, 0.05) ${gradientX + 50}%
        ),
        ${active ? 'rgba(90, 156, 94, 0.15)' : 'rgba(255, 255, 255, 0.1)'}
      `;
      
      // Apply subtle transform
      if (hoverScale) {
        card.style.transform = `
          perspective(1000px)
          scale3d(1.02, 1.02, 1.02)
          rotateX(${(y - 0.5) * -5}deg)
          rotateY(${(x - 0.5) * 5}deg)
        `;
      }
    };
    
    const handleMouseLeave = () => {
      // Reset background
      card.style.background = active 
        ? 'rgba(90, 156, 94, 0.15)'
        : 'rgba(255, 255, 255, 0.1)';
      
      // Reset transform
      card.style.transform = 'perspective(1000px) scale3d(1, 1, 1) rotateX(0) rotateY(0)';
    };
    
    if (interactive) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (interactive) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, hoverScale, active]);
  
  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden
        backdrop-blur-md
        border border-white/20
        rounded-xl
        transition-all duration-300
        ${active ? 'border-primary-300/50 shadow-lg shadow-primary-500/10' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: active ? 'rgba(90, 156, 94, 0.15)' : 'rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
    >
      {/* Header with icon and title */}
      {(icon || title) && (
        <div className="flex items-center mb-3 px-5 pt-5">
          {icon && (
            <div className={`
              mr-3 text-xl md:text-2xl flex-shrink-0
              ${active ? 'text-primary-600' : 'text-gray-500'}
              transition-colors duration-300
            `}>
              {icon}
            </div>
          )}
          {title && (
            <h3 className={`
              font-medium text-lg
              ${active ? 'text-primary-800' : 'text-gray-700'}
              transition-colors duration-300
            `}>
              {title}
            </h3>
          )}
        </div>
      )}
      
      {/* Card content */}
      <div className="p-5 pt-0">
        {children}
      </div>
      
      {/* Glass shine effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
    </div>
  );
};

export default CalculatorCard; 