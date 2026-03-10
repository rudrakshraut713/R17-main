import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  Sphere, 
  MeshDistortMaterial, 
  useTexture, 
  Environment, 
  useGLTF, 
  OrbitControls,
  useAnimations
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Gaming Character component
const GamingCharacter = ({ position = [0, -2, -3], scale = 2 }) => {
  const group = useRef<THREE.Group>(null);
  
  useEffect(() => {
    // Add hover effect
    const hoverTimeline = gsap.timeline({ repeat: -1, yoyo: true });
    if (group.current) {
      hoverTimeline.to(group.current.position, {
        y: position[1] + 0.2,
        duration: 2,
        ease: "power1.inOut"
      });
    }
    
    return () => {
      hoverTimeline.kill();
    };
  }, []);
  
  // Rotate character slightly on each frame
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group} position={position as any} scale={[scale, scale, scale]}>
      {/* 移除了中心方块 */}
    </group>
  );
};


// Floating sphere component with distortion effect
const FloatingSphere = ({ position, color, speed, distort, scale }: { 
  position: [number, number, number], 
  color: string, 
  speed: number,
  distort: number,
  scale: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animate the sphere on each frame
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle floating motion
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
  });

  return (
    <Sphere args={[1, 64, 64]} position={position} scale={scale} ref={meshRef}>
      <MeshDistortMaterial 
        color={color} 
        attach="material" 
        distort={distort} 
        speed={0.5} 
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

// Enhanced Particle system for background effect
const ParticleSystem = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 800;
  
  // Create particles geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(particleCount * 3);
  const colorArray = new Float32Array(particleCount * 3);
  const sizeArray = new Float32Array(particleCount);
  
  // Randomly position particles in 3D space with colors and sizes
  for (let i = 0; i < particleCount; i++) {
    // Position
    positionArray[i * 3] = (Math.random() - 0.5) * 25;
    positionArray[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 25;
    
    // Color - gaming theme colors (blues, purples, teals)
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      // Blue tones
      colorArray[i * 3] = 0.1 + Math.random() * 0.2; // R
      colorArray[i * 3 + 1] = 0.3 + Math.random() * 0.3; // G
      colorArray[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
    } else if (colorChoice < 0.66) {
      // Purple tones
      colorArray[i * 3] = 0.5 + Math.random() * 0.3; // R
      colorArray[i * 3 + 1] = 0.1 + Math.random() * 0.2; // G
      colorArray[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
    } else {
      // Teal/cyan tones
      colorArray[i * 3] = 0.1 + Math.random() * 0.2; // R
      colorArray[i * 3 + 1] = 0.7 + Math.random() * 0.3; // G
      colorArray[i * 3 + 2] = 0.7 + Math.random() * 0.3; // B
    }
    
    // Size variation
    sizeArray[i] = Math.random() * 0.1 + 0.03;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
  
  // Animate particles with interactive wave effect
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    // Create wave-like motion
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Apply sine wave effect
      positions[i3 + 1] = y + Math.sin(time * 0.5 + x * 0.5) * 0.02;
      positions[i3] = x + Math.cos(time * 0.3 + z * 0.2) * 0.01;
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.rotation.x = time * 0.03;
    particlesRef.current.rotation.y = time * 0.02;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry" {...particlesGeometry} />
      <pointsMaterial 
        attach="material" 
        vertexColors
        size={0.1} 
        transparent 
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Interactive elements component - 移除了5个小方块
const InteractiveElements = () => {
  // 已移除小方块，返回空组件
  return null;
};

// Main scene component
const Scene = () => {
  const sceneRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    // Initial animation when component mounts
    if (sceneRef.current) {
      gsap.from(sceneRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "elastic.out(1, 0.5)"
      });
    }
  }, []);
  
  return (
    <group ref={sceneRef}>
      <ParticleSystem />
      <GamingCharacter />
      <InteractiveElements />
      <FloatingSphere position={[-4, 2, -5]} color="#ff6b6b" speed={0.5} distort={0.4} scale={1.5} />
      <FloatingSphere position={[4, 1, -6]} color="#4dabf7" speed={0.7} distort={0.3} scale={1.2} />
      <FloatingSphere position={[5, -1, -10]} color="#4ecdc4" speed={0.3} distort={0.3} scale={2} />
      <FloatingSphere position={[0, 3, -8]} color="#45b7d1" speed={0.4} distort={0.5} scale={1} />
      <FloatingSphere position={[3, -2, -6]} color="#ffffff" speed={0.2} distort={0.2} scale={0.8} />
      <Environment preset="night" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 2.5} 
        maxPolarAngle={Math.PI / 1.5}
        rotateSpeed={0.3}
      />
    </group>
  );
};

// Main ThreeBackground component
const ThreeBackground = () => {
  return (
    <div className="three-background">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
        dpr={[1, 2]} // Optimize for performance
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4dabf7" />
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;