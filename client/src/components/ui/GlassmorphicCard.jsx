import React, { useRef, useEffect } from 'react';
import { applyGlassmorphism } from '../../utils/animation';

const GlassmorphicCard = ({ 
  children, 
  className = '', 
  bgOpacity = 0.1,
  blurAmount = 10,
  borderOpacity = 0.1,
  interactive = true,
  color = 'white',
  intensity = 0.2,
  hoverScale = true,
  ...props 
}) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (!interactive || !cardRef.current) return;
    
    const cleanup = applyGlassmorphism(cardRef, {
      intensity,
      lightOpacity: 0.15,
      radius: 16
    });
    
    // Set initial background color
    cardRef.current.style.setProperty(
      '--bg-color', 
      `rgba(${color === 'white' ? '255, 255, 255' : 
            color === 'primary' ? '90, 156, 94' :
            color === 'secondary' ? '80, 144, 132' : 
            color === 'accent' ? '199, 144, 74' : 
            '255, 255, 255'}, ${bgOpacity})`
    );
    
    return cleanup;
  }, [interactive, intensity, color, bgOpacity]);
  
  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden
        backdrop-blur-${blurAmount === 10 ? 'xl' : blurAmount === 5 ? 'md' : 'sm'}
        border border-white/10
        ${hoverScale ? 'transition-transform hover:scale-[1.02]' : ''}
        ${className}
      `}
      style={{
        backgroundColor: `rgba(${
          color === 'white' ? '255, 255, 255' : 
          color === 'primary' ? '90, 156, 94' :
          color === 'secondary' ? '80, 144, 132' : 
          color === 'accent' ? '199, 144, 74' : 
          '255, 255, 255'
        }, ${bgOpacity})`,
        borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
      }}
      {...props}
    >
      {/* Glass shine effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      
      {children}
    </div>
  );
};

export default GlassmorphicCard; 