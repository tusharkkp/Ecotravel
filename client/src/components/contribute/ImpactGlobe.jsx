import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { FaTree, FaWater, FaPaw } from 'react-icons/fa';
import * as THREE from 'three';

// Marker component for impact locations
const ImpactMarker = ({ position, type, text, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  let Icon = FaTree;
  let color = "bg-green-500";
  
  if (type === "ocean") {
    Icon = FaWater;
    color = "bg-blue-500";
  } else if (type === "wildlife") {
    Icon = FaPaw;
    color = "bg-amber-500";
  }
  
  return (
    <Html position={position} distanceFactor={10}>
      <div 
        className="relative cursor-pointer"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <div 
          className={`w-4 h-4 ${color} rounded-full flex items-center justify-center z-10 transform transition-transform duration-300 ${hovered ? 'scale-150' : 'scale-100'}`}
        >
          <Icon className="text-white text-[8px]" />
        </div>
        
        {hovered && (
          <div className="absolute -translate-x-1/2 -translate-y-full left-2 bottom-5 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
            {text}
          </div>
        )}
        
        <div 
          className={`absolute top-0 left-0 w-full h-full ${color} rounded-full animate-ping opacity-50`}
        ></div>
      </div>
    </Html>
  );
};

// Globe component
const Globe = ({ selectedProject }) => {
  const earthRef = useRef();
  const cloudRef = useRef();
  const [earthTexture, setEarthTexture] = useState(null);
  const [cloudsTexture, setCloudsTexture] = useState(null);
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  
  // Create fallback textures
  useEffect(() => {
    // Create fallback earth texture
    const createEarthTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Fill with blue for oceans
      ctx.fillStyle = '#1E88E5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add green continents (simplified shapes)
      ctx.fillStyle = '#43A047';
      
      // North America
      ctx.beginPath();
      ctx.ellipse(256, 200, 150, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // South America
      ctx.beginPath();
      ctx.ellipse(350, 350, 80, 120, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Europe/Africa
      ctx.beginPath();
      ctx.ellipse(512, 256, 120, 180, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Asia/Australia
      ctx.beginPath();
      ctx.ellipse(700, 230, 180, 130, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Australia
      ctx.beginPath();
      ctx.ellipse(800, 380, 60, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Convert to texture
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };
    
    // Create fallback clouds texture
    const createCloudsTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      // Transparent background
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some cloud shapes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      
      // Generate random cloud patches
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 30 + Math.random() * 70;
        
        for (let j = 0; j < 5; j++) {
          const cloudX = x + Math.random() * 100 - 50;
          const cloudY = y + Math.random() * 60 - 30;
          const cloudRadius = radius * (0.5 + Math.random() * 0.5);
          
          ctx.beginPath();
          ctx.arc(cloudX, cloudY, cloudRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Convert to texture
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };
    
    // Load textures with fallbacks
    const loadTextures = async () => {
      try {
        // Try to load the actual texture files
        const loader = new THREE.TextureLoader();
        
        const earthTexturePromise = new Promise((resolve, reject) => {
          loader.load(
            '/textures/earth.jpg',
            (texture) => resolve(texture),
            undefined,
            (error) => {
              console.warn('Could not load earth texture:', error);
              resolve(createEarthTexture());
            }
          );
        });
        
        const cloudsTexturePromise = new Promise((resolve, reject) => {
          loader.load(
            '/textures/clouds.jpg',
            (texture) => resolve(texture),
            undefined,
            (error) => {
              console.warn('Could not load clouds texture:', error);
              resolve(createCloudsTexture());
            }
          );
        });
        
        const [earth, clouds] = await Promise.all([earthTexturePromise, cloudsTexturePromise]);
        
        setEarthTexture(earth);
        setCloudsTexture(clouds);
        setTexturesLoaded(true);
      } catch (error) {
        console.error('Error loading textures:', error);
        // Use fallbacks if loading fails
        setEarthTexture(createEarthTexture());
        setCloudsTexture(createCloudsTexture());
        setTexturesLoaded(true);
      }
    };
    
    loadTextures();
    
    // Import THREE directly within this component
    return () => {
      // Cleanup textures if needed
      if (earthTexture) earthTexture.dispose();
      if (cloudsTexture) cloudsTexture.dispose();
    };
  }, []);
  
  // Rotation animation
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsedTime * 0.05;
    }
    
    if (cloudRef.current) {
      cloudRef.current.rotation.y = elapsedTime * 0.07;
    }
  });
  
  // Impact locations - example coordinates
  // Note: These are normalized to sphere coordinates
  const impactLocations = [
    { position: [0, 0.8, 1.8], type: "forest", text: "Amazon Rainforest" },
    { position: [1.5, 0.4, 1.2], type: "forest", text: "Borneo Reforestation" },
    { position: [-1.2, 0.7, 1.5], type: "forest", text: "Congo Basin" },
    { position: [0.7, -0.7, 1.9], type: "wildlife", text: "Galapagos Conservation" },
    { position: [-1.7, -0.3, 1.2], type: "wildlife", text: "African Wildlife Reserve" },
    { position: [0.5, 0.2, 2.2], type: "ocean", text: "Great Barrier Reef" },
    { position: [-0.9, -0.9, 1.8], type: "ocean", text: "Pacific Cleanup" },
    { position: [1.9, 0, 0.9], type: "ocean", text: "Mediterranean Initiative" },
  ];
  
  // Handle marker click
  const handleMarkerClick = (location) => {
    console.log(`Clicked on ${location.text}`);
    // Add any additional click handler functionality here
  };
  
  // If textures are not loaded yet, show an empty sphere
  if (!texturesLoaded) {
    return (
      <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1E88E5" />
      </Sphere>
    );
  }
  
  return (
    <>
      {/* Earth */}
      <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          map={earthTexture} 
          specularMap={earthTexture}
          shininess={5}
        />
      </Sphere>
      
      {/* Clouds */}
      <Sphere ref={cloudRef} args={[2.05, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          map={cloudsTexture} 
          transparent={true}
          opacity={0.3}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Impact markers */}
      {impactLocations.map((location, index) => (
        <ImpactMarker 
          key={index}
          position={location.position}
          type={location.type}
          text={location.text}
          onClick={() => handleMarkerClick(location)}
        />
      ))}
    </>
  );
};

// Fallback component for when 3D fails to load
const GlobeFallback = () => (
  <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-emerald-50 rounded-2xl">
    <div className="text-center p-6">
      <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-emerald-700 mb-2">Global Impact Visualization</h3>
      <p className="text-gray-600">Loading 3D globe visualization...</p>
    </div>
  </div>
);

// Main exported component
const ImpactGlobe = ({ selectedProject, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef();
  
  // Check if WebGL is supported
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsVisible(!!gl);
    } catch (e) {
      setIsVisible(false);
      console.error('WebGL not supported');
    }
  }, []);
  
  if (!isVisible) {
    return <GlobeFallback />;
  }
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl ${className || ''}`}
    >
      <Suspense fallback={<GlobeFallback />}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          
          {/* Main globe */}
          <Globe selectedProject={selectedProject} />
          
          {/* Controls */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </Suspense>
      
      {/* Overlay text */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
        <h3 className="font-medium text-gray-800">Global Contributions</h3>
        <p className="text-xs text-gray-600">Explore impact projects worldwide</p>
      </div>
    </motion.div>
  );
};

export default ImpactGlobe; 