import React, { Suspense, useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, Environment, Stars, Sparkles, ContactShadows, MeshDistortMaterial, useTexture, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';

interface Milestone {
  year: string;
  title: string;
  description: string;
  planet: string;
  color: string;
  accent: string;
  fogColor: string;
  style: 'industrial' | 'mail' | 'maps' | 'video' | 'chrome' | 'deepmind' | 'alphabet' | 'ai' | 'quantum' | 'gemini' | 'future';
  image: string;
  fauna: {
    animal: string;
    icon: string;
  };
}

// MILESTONES definition
const MILESTONES: Record<number, Milestone> = {
  10: {
    year: '1998',
    title: 'Garage Beginnings',
    description: 'Google is founded in Susan Wojcicki\'s garage in Menlo Park.',
    color: '#8d6e63',
    accent: '#ffccbc',
    fogColor: '#1a0f0a',
    planet: 'Origin',
    style: 'industrial',
    image: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=256', // Golden Retriever
      icon: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=256' // Vintage Tech
    }
  },
  9: {
    year: '2004',
    title: 'The Gmail Revolution',
    description: 'Launch of Gmail with 1GB storage, changing communication forever.',
    color: '#ea4335',
    accent: '#ffffff',
    fogColor: '#100505',
    planet: 'Communicator',
    style: 'mail',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=256', // Pigeon
      icon: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=256' // Envelope
    }
  },
  8: {
    year: '2005',
    title: 'Mapping the World',
    description: 'Google Maps and Earth launch, organizing geographical information.',
    color: '#34a853',
    accent: '#4285f4',
    fogColor: '#051005',
    planet: 'Cartographer',
    style: 'maps',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&q=80&w=256', // Deer
      icon: 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?auto=format&fit=crop&q=80&w=256' // Map pins
    }
  },
  7: {
    year: '2006',
    title: 'The YouTube Era',
    description: 'Acquisition of YouTube, the world\'s window into video.',
    color: '#ff0000',
    accent: '#ffffff',
    fogColor: '#100000',
    planet: 'Broadcast',
    style: 'video',
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&q=80&w=256', // Penguin
      icon: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=256' // Play button
    }
  },
  6: {
    year: '2008',
    title: 'Chrome Browser',
    description: 'A new way to experience the web with speed and security.',
    color: '#4285f4',
    accent: '#fbbc05',
    fogColor: '#050a10',
    planet: 'Navigator',
    style: 'chrome',
    image: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&q=80&w=256', // Bird
      icon: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=256' // Web tech
    }
  },
  5: {
    year: '2012',
    title: 'Neural Networks',
    description: 'DeepMind acquisition sparks the modern AI explosion.',
    color: '#000000',
    accent: '#00ffff',
    fogColor: '#000505',
    planet: 'Synapse',
    style: 'deepmind',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1545671913-b89a0a401b55?auto=format&fit=crop&q=80&w=256', // Octopus
      icon: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9bb5?auto=format&fit=crop&q=80&w=256' // AI/Chip
    }
  },
  4: {
    year: '2015',
    title: 'Alphabet Inc.',
    description: 'Reorganizing to pursue ambitious "Moonshots".',
    color: '#f5f5f5',
    accent: '#ea4335',
    fogColor: '#101010',
    planet: 'Structure',
    style: 'alphabet',
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1560114928-40f1f1eb417e?auto=format&fit=crop&q=80&w=256', // Giraffe
      icon: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=256' // Typography
    }
  },
  3: {
    year: '2016',
    title: 'AI First',
    description: 'Google becomes an AI-first company with Assistant.',
    color: '#202124',
    accent: '#4285f4',
    fogColor: '#050505',
    planet: 'Intelligence',
    style: 'ai',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=256', // Cat
      icon: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=256' // Electronics
    }
  },
  2: {
    year: '2021',
    title: 'Quantum Supremacy',
    description: 'Sycamore processor performs impossible computations.',
    color: '#1a237e',
    accent: '#00e676',
    fogColor: '#050510',
    planet: 'Quantum',
    style: 'quantum',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1533201916185-382a3fc276bc?auto=format&fit=crop&q=80&w=256', // Jellyfish
      icon: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=256' // Abstract
    }
  },
  1: {
    year: '2023',
    title: 'Gemini AI',
    description: 'Most capable multimodal model for the new era.',
    color: '#673ab7',
    accent: '#ffffff',
    fogColor: '#100a1a',
    planet: 'Universal',
    style: 'gemini',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=256', // Turtle
      icon: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=256' // AI/Stars
    }
  },
  0: {
    year: '2030+',
    title: 'The Singularity',
    description: 'Universal intelligence and human-AI synthesis.',
    color: '#ffffff',
    accent: '#ffffff',
    fogColor: '#151515',
    planet: 'Infinity',
    style: 'future',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=512',
    fauna: {
      animal: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=256', // Whale
      icon: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=256' // Crystal/Structure
    }
  },
};

// Global preloading removed to prevent initialization bottlenecks if some assets fail

// Voxel bitmask for digits 0-9 (5x7 grid)
const DIGITS: Record<number, number[][]> = {
  0: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  1: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  2: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  3: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  4: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
  ],
  5: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  6: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  7: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  8: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  9: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
};

// Safe texture loading hook that doesn't suspend
function useSafeTexture(url: string | null | undefined) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;
    setError(false);
    
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      url,
      (tex) => {
        tex.needsUpdate = true;
        setTexture(tex);
      },
      undefined,
      () => {
        setError(true);
        console.warn(`Failed to load texture: ${url}`);
      }
    );
  }, [url]);

  return { texture, error };
}

function Voxel({ position, milestone, x, y, isSpecial, texture }: { position: [number, number, number], milestone: Milestone, x: number, y: number, isSpecial: boolean, texture: THREE.Texture | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Organic growth lerp
    meshRef.current.scale.lerp(targetScale.current, delta * 8);

    switch (milestone.style) {
      case 'industrial':
        meshRef.current.position.y = position[1] + Math.sin(time + x) * 0.05;
        break;
      case 'mail':
        meshRef.current.rotation.x = Math.sin(time * 2 + x) * 0.3;
        break;
      case 'quantum':
        meshRef.current.visible = Math.sin(time * 10 + x) > -0.7;
        break;
      case 'gemini':
        meshRef.current.rotation.y = time * 2;
        break;
      case 'ai':
        meshRef.current.position.x = position[0] + (Math.random() - 0.5) * 0.01;
        break;
      default:
        meshRef.current.position.y = position[1] + Math.sin(time + position[0] * 0.4) * 0.04;
    }
  });

  useEffect(() => {
    const dist = Math.sqrt(x * x + y * y);
    targetScale.current.set(0, 0, 0);
    const timeout = setTimeout(() => {
      targetScale.current.set(1, 1, 1);
    }, dist * 35 + Math.random() * 40); 
    return () => clearTimeout(timeout);
  }, [milestone.style, position[0], position[1]]);

  const getGeometry = () => {
    switch (milestone.style) {
      case 'industrial': return <boxGeometry args={[0.98, 0.6 + Math.random() * 0.4, 1.2]} />;
      case 'chrome': return <torusGeometry args={[0.4, 0.12, 12, 24]} />;
      case 'deepmind': return <sphereGeometry args={[0.45, 16, 16]} />;
      case 'quantum': return <octahedronGeometry args={[0.65]} />;
      case 'gemini': return <dodecahedronGeometry args={[0.65]} />;
      default: return <boxGeometry args={[0.95, 0.95, 0.95]} />;
    }
  };

  const getMaterial = () => {
    const hasMap = isSpecial && texture;
    const commonProps = {
      map: hasMap ? texture : null,
      roughness: hasMap ? 0.2 : 0.1,
      metalness: hasMap ? 0.1 : 0.3,
      emissive: milestone.accent,
      emissiveIntensity: isSpecial ? (hovered ? 8 : 1.5) : (hovered ? 5 : 0.4),
    };

    switch (milestone.style) {
      case 'industrial':
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : (isSpecial ? '#5d4037' : '#a1887f')} />;
      case 'mail':
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : (isSpecial ? '#ea4335' : '#ffffff')} />;
      case 'maps':
        const isPin = x === 2 && y === 0;
        return <meshStandardMaterial {...commonProps} color={isPin ? '#ea4335' : (hasMap ? '#ffffff' : (x === 2 || y === 3 ? '#ffffff' : '#34a853'))} />;
      case 'video':
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : (isSpecial ? '#ffffff' : '#cc0000')} />;
      case 'chrome':
        const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : colors[(x + y) % 4]} />;
      case 'deepmind':
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : "#000"} emissiveIntensity={isSpecial ? 5 : 1} />;
      case 'quantum':
        return <meshPhysicalMaterial {...commonProps} transmission={0.9} thickness={2} roughness={0.1} transparent opacity={0.8} />;
      case 'gemini':
        return <MeshDistortMaterial {...commonProps} speed={4} distort={0.4} radius={1} emissiveIntensity={2} />;
      case 'ai':
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : (isSpecial ? milestone.accent : '#111')} wireframe={!isSpecial && !hasMap} />;
      case 'alphabet':
        const alphaColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : alphaColors[(x + y) % 4]} />;
      case 'future':
        return <meshStandardMaterial {...commonProps} color="#ffffff" emissiveIntensity={isSpecial ? 15 : 2} />;
      default:
        return <meshStandardMaterial {...commonProps} color={hasMap ? '#ffffff' : milestone.color} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      {getGeometry()}
      {getMaterial()}
    </mesh>
  );
}

function VoxelNumber({ number, milestone, texture }: { number: number, milestone: Milestone, texture: THREE.Texture | null }) {
  const digits = number.toString().split('').map(Number);
  
  return (
    <group>
      {digits.map((digit, digitIdx) => {
        const grid = DIGITS[digit] || DIGITS[0];
        const offset = digitIdx * 6 - (digits.length > 1 ? 3 : 0);
        return (
          <group key={digitIdx} position={[offset, 0, 0]}>
            {grid.map((row, y) => 
              row.map((active, x) => {
                if (!active) return null;
                
                let posZ = 0;
                let special = (x + y) % 5 === 0;

                if (milestone.style === 'maps') {
                  posZ = Math.sin(x * 0.5 + y * 0.5) * 2;
                } else if (milestone.style === 'industrial') {
                  posZ = (x % 2 === 0) ? 0.3 : -0.3;
                } else if (milestone.style === 'video') {
                  const isPlayCenter = x >= 2 && x <= 3 && y >= 3 && y <= 4;
                  if (isPlayCenter) special = true;
                }

                return (
                  <Voxel 
                    key={`${digitIdx}-${y}-${x}`} 
                    position={[x - 2, (6 - y) - 3, posZ]} 
                    milestone={milestone}
                    x={x}
                    y={y}
                    isSpecial={special}
                    texture={texture}
                  />
                );
              })
            )}
          </group>
        );
      })}
    </group>
  );
}


function FaunaCompanion({ milestone, index }: { milestone: Milestone, index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const { texture: animalTexture } = useSafeTexture(milestone.fauna.animal);
  const { texture: iconTexture } = useSafeTexture(milestone.fauna.icon);
  
  const initialPos = useMemo(() => {
    const angle = (index / 5) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 18 + Math.random() * 8;
    return [
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 12,
      Math.sin(angle) * radius
    ] as [number, number, number];
  }, [index]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const phase = index * 2;
    
    const angle = time * 0.08 + phase;
    const radius = 22;
    meshRef.current.position.x = Math.cos(angle) * radius;
    meshRef.current.position.z = Math.sin(angle) * radius;
    meshRef.current.position.y = initialPos[1] + Math.sin(time * 0.4 + phase) * 1.5;
    
    meshRef.current.lookAt(state.camera.position);
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <planeGeometry args={[2.5, 2.5]} />
        <meshBasicMaterial map={animalTexture} transparent opacity={0.7} side={THREE.DoubleSide} alphaTest={0.5} />
      </mesh>
      
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[0, 1.8, 0.1]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial map={iconTexture} transparent opacity={0.8} side={THREE.DoubleSide} alphaTest={0.1} />
        </mesh>
      </Float>
      
      <pointLight intensity={1.5} distance={5} color={milestone.accent} />
    </group>
  );
}

function PlanetEnvironment({ milestone }: { milestone: Milestone }) {
  const debris = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, (Math.random() - 0.7) * 40] as [number, number, number],
    size: Math.random() * 0.8 + 0.1,
    speed: Math.random() * 2 + 0.5
  })), []);

  const { texture: planetTexture } = useSafeTexture(milestone.image);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.color.lerp(new THREE.Color(milestone.color), delta * 4);
      materialRef.current.emissive.lerp(new THREE.Color(milestone.accent), delta * 4);
    }
    if (glowRef.current) {
      glowRef.current.color.lerp(new THREE.Color(milestone.accent), delta * 4);
    }
    if (lightRef.current) {
      lightRef.current.color.lerp(new THREE.Color(milestone.accent), delta * 4);
    }
  });

  return (
    <group>
      <Stars radius={150} depth={50} count={7000} factor={4} saturation={1} fade speed={1.5} />
      <Sparkles count={300} scale={50} size={2} speed={0.3} color={milestone.accent} opacity={0.4} />
      
      {/* Era Animals */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Suspense key={i} fallback={null}>
          <FaunaCompanion milestone={milestone} index={i} />
        </Suspense>
      ))}

      {/* The Central Planet */}
      <mesh position={[0, 0, -10]} castShadow receiveShadow>
        <sphereGeometry args={[8, 64, 64]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={planetTexture}
          color={milestone.color} 
          roughness={0.8}
          metalness={0.2}
          emissive={milestone.accent}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh position={[0, 0, -10]}>
        <sphereGeometry args={[8.2, 32, 32]} />
        <meshBasicMaterial ref={glowRef} color={milestone.accent} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      
      <ContactShadows 
        position={[0, -12, 0]} 
        opacity={0.8} 
        scale={60} 
        blur={2} 
        far={20} 
        color={milestone.color} 
      />

      {debris.map((item) => (
        <Float key={item.id} speed={item.speed} rotationIntensity={3} floatIntensity={3}>
          <mesh position={item.position}>
            {milestone.style === 'quantum' ? (
              <octahedronGeometry args={[item.size]} />
            ) : milestone.style === 'deepmind' ? (
              <sphereGeometry args={[item.size, 8, 8]} />
            ) : (
              <boxGeometry args={[item.size, item.size, item.size]} />
            )}
            <meshStandardMaterial 
              color={milestone.color} 
              emissive={milestone.accent} 
              emissiveIntensity={0.3} 
              transparent 
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}

      {/* Global light based on milestone */}
      <pointLight ref={lightRef} position={[0, -5, 0]} intensity={10} color={milestone.accent} distance={30} />
    </group>
  );
}

function SmoothScene({ count, milestone }: { count: number, milestone: Milestone }) {
  const groupRef = useRef<THREE.Group>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const pointRef = useRef<THREE.PointLight>(null);
  const { texture: iconTexture } = useSafeTexture(milestone.fauna.icon);
  
  const targetX = count >= 10 ? -5 : -1.5;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 3.5);
    }
    
    // Smooth background color
    if (state.scene.background instanceof THREE.Color) {
      state.scene.background.lerp(new THREE.Color(milestone.fogColor), delta * 3.5);
    }
    if (state.scene.fog instanceof THREE.Fog) {
      state.scene.fog.color.lerp(new THREE.Color(milestone.fogColor), delta * 3.5);
    }

    // Smooth lights
    if (spotRef.current) spotRef.current.color.lerp(new THREE.Color(milestone.accent), delta * 4);
    if (pointRef.current) pointRef.current.color.lerp(new THREE.Color(milestone.color), delta * 4);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={1.5} />
      <spotLight ref={spotRef} position={[30, 40, 30]} angle={0.4} penumbra={1} intensity={25} color={milestone.accent} castShadow />
      <pointLight ref={pointRef} position={[-30, 20, 10]} intensity={15} color={milestone.color} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <group ref={groupRef} scale={2.5}>
          <Sparkles count={80} scale={10} size={3} speed={0.4} color={milestone.accent} opacity={0.6} />
          <VoxelNumber 
            number={count} 
            milestone={milestone}
            texture={iconTexture}
          />
        </group>
      </Float>
    </>
  );
}

export default function App() {
  const [count, setCount] = useState(10);
  const milestone = MILESTONES[count];

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 10));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full relative bg-black overflow-hidden font-sans text-white">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 3, 28]} fov={40} />
        <OrbitControls 
          enablePan={false} 
          minDistance={15} 
          maxDistance={45}
          autoRotate
          autoRotateSpeed={1.5}
          enableZoom={false}
        />
        
        <color attach="background" args={[milestone.fogColor]} />
        <fog attach="fog" args={[milestone.fogColor, 15, 65]} />

        <Suspense fallback={
          <group>
            <mesh>
              <sphereGeometry args={[1]} />
              <meshBasicMaterial color="#333" wireframe />
            </mesh>
          </group>
        }>
          <SmoothScene count={count} milestone={milestone} />
          <PlanetEnvironment milestone={milestone} />
        </Suspense>
        
        <Environment preset="night" />
      </Canvas>

      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <motion.div
          key={milestone.year}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-2"
        >
          <h1 className="text-8xl font-black tracking-tighter" style={{ color: milestone.accent }}>
            {milestone.year}
          </h1>
          <h2 className="text-3xl font-bold uppercase tracking-widest opacity-80">
            {milestone.title}
          </h2>
          <p className="max-w-md text-lg text-gray-400 font-medium">
            {milestone.description}
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-12 z-20 flex gap-1.5 p-4 rounded-full bg-white/5 backdrop-blur-md">
        {Array.from({ length: 11 }).map((_, i) => (
          <button 
            key={i}
            onClick={(e) => { e.stopPropagation(); setCount(10 - i); }}
            className="h-1 w-12 transition-all duration-500 hover:h-4 group relative"
            style={{ 
              backgroundColor: 10 - i === count ? milestone.accent : 'rgba(255,255,255,0.1)',
              boxShadow: 10 - i === count ? `0 0 20px ${milestone.accent}` : 'none'
            }}
          />
        ))}
      </div>
      
      <div 
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={() => setCount(prev => (prev > 0 ? prev - 1 : 10))}
      />
    </div>
  );
}


