import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Scale = ({ emissionRatio = 0.5 }) => {
  // emissionRatio: 0 = all green, 1 = all emissions
  const scale = useRef();
  const pivot = useRef();
  
  // Adjust the tilt based on emissionRatio
  useEffect(() => {
    if (pivot.current) {
      // Calculate rotation angle between -0.3 and 0.3 radians
      const angle = (emissionRatio - 0.5) * 0.6;
      pivot.current.rotation.z = angle;
    }
  }, [emissionRatio]);

  // Gentle floating animation
  useFrame((state) => {
    if (scale.current) {
      scale.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={scale}>
      {/* Main pivot point */}
      <group ref={pivot}>
        {/* Base stand */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.2, 0.3, 1.2, 16]} />
          <meshStandardMaterial color="#5a5a5a" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Scale arm */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[3, 0.1, 0.3]} />
          <meshStandardMaterial color="#757575" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Left plate - Emissions side */}
        <group position={[-1.2, -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
            <meshStandardMaterial color="#d32f2f" />
          </mesh>
          
          {/* Emission cloud */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <group position={[0, 0.3, 0]}>
              <Sphere args={[0.25, 16, 16]} position={[0.15, 0.1, 0]}>
                <MeshDistortMaterial 
                  color="#888888" 
                  speed={1.5} 
                  distort={0.3} 
                  radius={1} 
                />
              </Sphere>
              <Sphere args={[0.2, 16, 16]} position={[-0.15, 0.15, 0.1]}>
                <MeshDistortMaterial 
                  color="#888888" 
                  speed={1.5} 
                  distort={0.2} 
                />
              </Sphere>
              <Sphere args={[0.15, 16, 16]} position={[0.1, 0.25, -0.1]}>
                <MeshDistortMaterial 
                  color="#888888" 
                  speed={1.5} 
                  distort={0.3} 
                />
              </Sphere>
            </group>
          </Float>
        </group>
        
        {/* Right plate - Eco-friendly side */}
        <group position={[1.2, -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.6, 0.6, 0.05, 32]} />
            <meshStandardMaterial color="#4caf50" />
          </mesh>
          
          {/* Tree */}
          <group position={[0, 0.3, 0]}>
            {/* Trunk */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
              <meshStandardMaterial color="#795548" />
            </mesh>
            
            {/* Leaves */}
            <mesh position={[0, 0.25, 0]}>
              <coneGeometry args={[0.2, 0.4, 8]} />
              <meshStandardMaterial color="#2e7d32" />
            </mesh>
            
            {/* Bicycle */}
            <group position={[0.25, -0.1, 0]} scale={[0.1, 0.1, 0.1]}>
              {/* Frame */}
              <mesh>
                <torusGeometry args={[0.5, 0.05, 8, 16, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#2196f3" />
              </mesh>
              
              {/* Wheels */}
              <mesh position={[-0.5, 0, 0]}>
                <torusGeometry args={[0.3, 0.03, 8, 16]} />
                <meshStandardMaterial color="#9e9e9e" />
              </mesh>
              <mesh position={[0.5, 0, 0]}>
                <torusGeometry args={[0.3, 0.03, 8, 16]} />
                <meshStandardMaterial color="#9e9e9e" />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const CarbonMeter = ({ emissionRatio = 0.5, className }) => {
  return (
    <div className={`h-64 md:h-80 w-full ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <Scale emissionRatio={emissionRatio} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default CarbonMeter; 