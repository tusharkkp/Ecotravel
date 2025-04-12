import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Float, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Fallback component for when 3D fails to load
const FallbackComponent = () => (
  <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-primary-50 rounded-2xl shadow-eco border border-primary-100">
    <div className="text-center p-6">
      <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-primary-700 mb-2">Eco-Travel Planet</h3>
      <p className="text-gray-600">Plan your sustainable adventures and reduce your carbon footprint while exploring new destinations.</p>
    </div>
  </div>
);

// Planet component
const Planet = () => {
  const planet = useRef();
  const { camera } = useThree();
  
  // Set camera position
  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  // Rotate planet
  useFrame(() => {
    if (planet.current) {
      planet.current.rotation.y += 0.002;
    }
  });

  // Material properties instead of direct material instances
  const landMaterialProps = {
    color: '#5a9c5e',
    metalness: 0.1,
    roughness: 0.8
  };
  
  const waterMaterialProps = {
    color: '#71a69a',
    metalness: 0.4,
    roughness: 0.5
  };

  const cloudMaterialProps = {
    color: 'white',
    transparent: true,
    opacity: 0.8
  };

  return (
    <group ref={planet}>
      {/* Base planet sphere */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          color="#71a69a" 
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      
      {/* Landmasses */}
      <group>
        {/* Continental shapes using scaled spheres as land masses */}
        <mesh position={[1.5, 1.5, 2.2]} scale={[1.2, 0.8, 0.1]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial {...landMaterialProps} />
        </mesh>
        <mesh position={[-1.8, 0.4, 2.2]} scale={[1, 0.6, 0.1]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial {...landMaterialProps} />
        </mesh>
        <mesh position={[0, -2, 2.2]} scale={[1.5, 0.7, 0.1]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial {...landMaterialProps} />
        </mesh>
      </group>
      
      {/* Trees and vegetation on landmasses */}
      <group>
        {/* First continent trees */}
        <mesh position={[1.8, 1.8, 2.4]} scale={[0.2, 0.4, 0.2]}>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#3a623c" />
        </mesh>
        <mesh position={[1.5, 1.5, 2.4]} scale={[0.2, 0.4, 0.2]}>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#3a623c" />
        </mesh>
        <mesh position={[2.1, 1.6, 2.4]} scale={[0.2, 0.4, 0.2]}>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#3a623c" />
        </mesh>
        
        {/* Second continent trees */}
        <mesh position={[-1.9, 0.5, 2.4]} scale={[0.2, 0.4, 0.2]}>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#3a623c" />
        </mesh>
        <mesh position={[-1.6, 0.3, 2.4]} scale={[0.2, 0.4, 0.2]}>
          <coneGeometry args={[1, 2, 8]} />
          <meshStandardMaterial color="#3a623c" />
        </mesh>
      </group>
      
      {/* Clouds */}
      <group>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[2.5, 1, 2.5]} scale={[0.8, 0.5, 0.3]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial {...cloudMaterialProps} />
          </mesh>
        </Float>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.7}>
          <mesh position={[-2.5, -1, 2.5]} scale={[1, 0.6, 0.3]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial {...cloudMaterialProps} />
          </mesh>
        </Float>
      </group>
      
      {/* Transportation elements */}
      <group>
        {/* Electric train */}
        <mesh position={[0, -1.8, 3.2]} rotation={[0, 0.5, 0]} scale={[0.4, 0.15, 0.15]}>
          <boxGeometry args={[1, 1, 2]} />
          <meshStandardMaterial color="#304f32" />
        </mesh>
        
        {/* Eco plane with leafy trail */}
        <group position={[0, 0, 3.5]} rotation={[0, Math.PI / 4, 0]}>
          <mesh scale={[0.2, 0.06, 0.3]}>
            <boxGeometry />
            <meshStandardMaterial color="#c7904a" />
          </mesh>
          {/* Wings */}
          <mesh position={[0, 0, 0]} scale={[0.5, 0.02, 0.1]}>
            <boxGeometry />
            <meshStandardMaterial color="#c7904a" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Main component
const EcoPlanet = ({ className }) => {
  const containerRef = useRef();
  
  // Mouse interaction effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e) => {
      const bounds = container.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;
      
      // Apply a subtle tilt effect based on mouse position
      gsap.to(container, {
        rotationY: (x - 0.5) * 10,
        rotationX: (y - 0.5) * -10,
        duration: 0.5,
        ease: 'power2.out'
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(container, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[450px] rounded-3xl overflow-hidden shadow-eco-lg transform perspective-1000 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <Suspense fallback={<FallbackComponent />}>
        <Canvas shadows>
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024}
          />
          <Planet />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            rotateSpeed={0.5}
          />
          <ContactShadows 
            position={[0, -3.5, 0]} 
            opacity={0.2} 
            blur={2}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default EcoPlanet; 