import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaLeaf, FaSeedling, FaGlobeAmericas } from 'react-icons/fa';

// Animated leaf component
const AnimatedLeaf = ({ delay, className }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      y: [-20, 0, 20, 40], 
      rotate: [0, 10, -10, 15] 
    }}
    transition={{ 
      duration: 8, 
      repeat: Infinity, 
      delay: delay,
      times: [0, 0.2, 0.8, 1] 
    }}
  >
    <FaLeaf className="text-emerald-400 opacity-70" size={14} />
  </motion.div>
);

const ContributionHero = () => {
  const heroRef = useRef(null);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-700 text-white"
      style={{ 
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      {/* Animated leaves */}
      <AnimatedLeaf delay={0} className="left-[10%] top-[20%]" />
      <AnimatedLeaf delay={1} className="left-[25%] top-[50%]" />
      <AnimatedLeaf delay={2} className="right-[15%] top-[30%]" />
      <AnimatedLeaf delay={3} className="right-[30%] top-[60%]" />
      <AnimatedLeaf delay={4} className="left-[50%] top-[70%]" />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full"
          >
            <FaHandHoldingHeart className="text-emerald-300 text-3xl md:text-4xl" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Make an <span className="text-emerald-300">Impact</span> Today
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-emerald-50/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform your EcoCoins into meaningful environmental action. Every contribution helps build a more sustainable world.
          </motion.p>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="mb-2">
                <FaSeedling className="text-emerald-300 text-3xl mx-auto" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Plant Trees</h3>
              <p className="text-emerald-50/80 text-sm">Support reforestation projects worldwide</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="mb-2">
                <FaGlobeAmericas className="text-emerald-300 text-3xl mx-auto" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Save Ecosystems</h3>
              <p className="text-emerald-50/80 text-sm">Preserve biodiversity and protect habitats</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6">
              <div className="mb-2">
                <FaLeaf className="text-emerald-300 text-3xl mx-auto" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Reduce Carbon</h3>
              <p className="text-emerald-50/80 text-sm">Fund climate initiatives and carbon offsets</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Contribute Now
            </button>
          </motion.div>
        </div>
      </div>
      
      {/* Wave SVG divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16 md:h-24"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-white"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-white"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-white"
          />
        </svg>
      </div>
    </div>
  );
};

export default ContributionHero; 