import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

// Cylinder component representing carbon level
const CarbonCylinder = ({ value, maxValue = 1000, color }) => {
  const meshRef = useRef();
  const [height, setHeight] = useState(0);
  const targetHeight = Math.min(Math.max(value / maxValue, 0.05), 1) * 5;
  
  // Animate cylinder height
  useEffect(() => {
    const animateHeight = () => {
      const diff = targetHeight - height;
      if (Math.abs(diff) < 0.01) {
        setHeight(targetHeight);
        return;
      }
      
      setHeight(prev => prev + diff * 0.05);
      requestAnimationFrame(animateHeight);
    };
    
    const animationId = requestAnimationFrame(animateHeight);
    return () => cancelAnimationFrame(animationId);
  }, [targetHeight, height]);
  
  // Get color based on height
  const getColor = () => {
    // Color gradient from green to red based on value
    if (value < maxValue * 0.3) return new THREE.Color(color || 0x00ff00); // Green for low values
    if (value < maxValue * 0.6) return new THREE.Color(color || 0xffff00); // Yellow for medium values
    return new THREE.Color(color || 0xff0000); // Red for high values
  };
  
  // Pulsing animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.2;
    meshRef.current.rotation.y += 0.003;
  });
  
  return (
    <mesh ref={meshRef} position={[0, height / 2, 0]}>
      <cylinderGeometry args={[1, 1, height, 32]} />
      <meshPhongMaterial 
        color={getColor()} 
        shininess={100}
        transparent
        opacity={0.8}
        emissive={getColor()}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Base cylinder for the container
const GlassCylinder = () => {
  const meshRef = useRef();
  
  // Subtle rotation
  useFrame(() => {
    meshRef.current.rotation.y += 0.001;
  });
  
  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[1.1, 1.1, 5, 32, 1, true]} />
      <meshPhongMaterial 
        color="#ffffff" 
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        wireframe={true}
      />
    </mesh>
  );
};

// Floor grid
const Grid = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[15, 15, 15, 15]} />
      <meshBasicMaterial 
        color="#4f8e6c" 
        wireframe 
        transparent 
        opacity={0.3} 
      />
    </mesh>
  );
};

// Particle system for atmospheric effect
const Particles = () => {
  const count = 200;
  const particlesRef = useRef();
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = Math.random() * 10 - 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      scales[i] = Math.random() * 0.2 + 0.05;
    }
    
    particlesRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesRef.current.geometry.setAttribute(
      'scale',
      new THREE.BufferAttribute(scales, 1)
    );
  }, [count]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      particlesRef.current.geometry.attributes.position.array[i3 + 1] += Math.sin(time + i * 0.1) * 0.005;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial 
        size={0.1} 
        color="#88ffaa" 
        transparent 
        opacity={0.6} 
        sizeAttenuation={true} 
      />
    </points>
  );
};

// Environment setup
const SceneSetup = ({ children }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(4, 3, 5);
  }, [camera]);
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />
      {children}
    </>
  );
};

// Label for displaying the value
const CarbonValue = ({ value, label, unit }) => {
  return (
    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md p-4 rounded-lg shadow-lg text-white">
      <div className="text-xs uppercase tracking-wide opacity-80 mb-1">{label}</div>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? value.toFixed(1) : value} 
        <span className="text-sm ml-1 opacity-70">{unit}</span>
      </div>
    </div>
  );
};

// Main component
const CarbonMeter = ({ 
  value = 0, 
  maxValue = 1000, 
  label = "Carbon Emissions",
  unit = "kg CO2e",
  className = ""
}) => {
  // Category based on value
  const getCategory = () => {
    const percentage = value / maxValue;
    if (percentage < 0.3) return "Low Impact";
    if (percentage < 0.6) return "Moderate Impact";
    return "High Impact";
  };
  
  // Get background color based on value
  const getBackgroundColor = () => {
    const percentage = value / maxValue;
    if (percentage < 0.3) return "from-green-100/20 to-green-200/30";
    if (percentage < 0.6) return "from-yellow-100/20 to-yellow-200/30";
    return "from-red-100/20 to-red-200/30";
  };
  
  // Get accent color value for 3D objects
  const getAccentColor = () => {
    const percentage = value / maxValue;
    if (percentage < 0.3) return 0x4ade80; // Green
    if (percentage < 0.6) return 0xfacc15; // Yellow
    return 0xef4444; // Red
  };
  
  return (
    <motion.div 
      className={`relative h-80 w-full bg-gradient-to-b ${getBackgroundColor()} rounded-xl overflow-hidden shadow-lg ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas shadows>
        <SceneSetup>
          <Grid />
          <GlassCylinder />
          <CarbonCylinder 
            value={value} 
            maxValue={maxValue} 
            color={getAccentColor()} 
          />
          <Particles />
        </SceneSetup>
      </Canvas>
      
      <CarbonValue value={value} label={label} unit={unit} />
      
      <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-sm text-white font-medium">
        {getCategory()}
      </div>
      
      {/* Add interactive hint */}
      <div className="absolute bottom-4 left-4 text-white/70 text-xs flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        Drag to rotate
      </div>
    </motion.div>
  );
};

export default CarbonMeter; 