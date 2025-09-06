import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, RoundedBox, Plane } from '@react-three/drei';
import * as THREE from 'three';

export default function HouseEnvironment() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Subtle breathing animation for the house
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <Plane
        args={[80, 80]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#8b7355" />
      </Plane>

      {/* Room Walls */}
      <group position={[0, 0, 0]}>
        {/* Back wall */}
        <Box args={[40, 20, 1]} position={[0, 5, -20]} receiveShadow>
          <meshLambertMaterial color="#f5f5dc" />
        </Box>
        
        {/* Left wall */}
        <Box args={[1, 20, 40]} position={[-20, 5, 0]} receiveShadow>
          <meshLambertMaterial color="#f0f0f0" />
        </Box>
        
        {/* Right wall */}
        <Box args={[1, 20, 40]} position={[20, 5, 0]} receiveShadow>
          <meshLambertMaterial color="#f0f0f0" />
        </Box>
      </group>

      {/* Living Room Furniture */}
      <group position={[-12, -2, -10]}>
        {/* Sofa */}
        <RoundedBox args={[6, 2, 3]} position={[0, 0, 0]} castShadow>
          <meshLambertMaterial color="#4a5568" />
        </RoundedBox>
        <RoundedBox args={[6.2, 1, 0.5]} position={[0, 1.25, -1.25]} castShadow>
          <meshLambertMaterial color="#2d3748" />
        </RoundedBox>
        
        {/* Coffee Table */}
        <RoundedBox args={[4, 0.3, 2]} position={[0, -1.5, 2]} castShadow>
          <meshLambertMaterial color="#8b4513" />
        </RoundedBox>
        <Box args={[0.2, 1, 0.2]} position={[-1.8, -2.5, 1]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        <Box args={[0.2, 1, 0.2]} position={[1.8, -2.5, 1]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        <Box args={[0.2, 1, 0.2]} position={[-1.8, -2.5, 3]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        <Box args={[0.2, 1, 0.2]} position={[1.8, -2.5, 3]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
      </group>

      {/* Office Area */}
      <group position={[12, -2, -10]}>
        {/* Desk */}
        <RoundedBox args={[8, 0.3, 4]} position={[0, 1, 0]} castShadow>
          <meshLambertMaterial color="#8b4513" />
        </RoundedBox>
        <Box args={[0.3, 2, 0.3]} position={[-3.5, -0.5, -1.5]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        <Box args={[0.3, 2, 0.3]} position={[3.5, -0.5, -1.5]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        <Box args={[0.3, 2, 0.3]} position={[-3.5, -0.5, 1.5]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        <Box args={[0.3, 2, 0.3]} position={[3.5, -0.5, 1.5]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>

        {/* Office Chair */}
        <RoundedBox args={[2, 0.3, 2]} position={[0, 0.5, 4]} castShadow>
          <meshLambertMaterial color="#2d3748" />
        </RoundedBox>
        <RoundedBox args={[2, 3, 0.3]} position={[0, 2.5, 3]} castShadow>
          <meshLambertMaterial color="#2d3748" />
        </RoundedBox>
        <Box args={[0.2, 1.5, 0.2]} position={[0, -0.5, 4]} castShadow>
          <meshLambertMaterial color="#1a202c" />
        </Box>
      </group>

      {/* Kitchen Area */}
      <group position={[0, -2, 15]}>
        {/* Kitchen Island */}
        <RoundedBox args={[12, 1, 4]} position={[0, 0, 0]} castShadow>
          <meshLambertMaterial color="#f7fafc" />
        </RoundedBox>
        
        {/* Bar Stools */}
        <RoundedBox args={[1.2, 0.2, 1.2]} position={[-4, 1, -3]} castShadow>
          <meshLambertMaterial color="#8b4513" />
        </RoundedBox>
        <Box args={[0.2, 2, 0.2]} position={[-4, -1, -3]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        
        <RoundedBox args={[1.2, 0.2, 1.2]} position={[0, 1, -3]} castShadow>
          <meshLambertMaterial color="#8b4513" />
        </RoundedBox>
        <Box args={[0.2, 2, 0.2]} position={[0, -1, -3]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
        
        <RoundedBox args={[1.2, 0.2, 1.2]} position={[4, 1, -3]} castShadow>
          <meshLambertMaterial color="#8b4513" />
        </RoundedBox>
        <Box args={[0.2, 2, 0.2]} position={[4, -1, -3]} castShadow>
          <meshLambertMaterial color="#654321" />
        </Box>
      </group>

      {/* Plants for ambiance */}
      <group>
        {/* Plant 1 - Corner */}
        <Box args={[1, 0.8, 1]} position={[-17, -2, -17]} castShadow>
          <meshLambertMaterial color="#8b4513" />
        </Box>
        <Box args={[2, 4, 0.2]} position={[-17, 1, -17]} castShadow>
          <meshLambertMaterial color="#22543d" />
        </Box>
        <Box args={[0.2, 4, 2]} position={[-17, 1, -17]} castShadow>
          <meshLambertMaterial color="#22543d" />
        </Box>

        {/* Plant 2 - Other corner */}
        <Box args={[1, 0.8, 1]} position={[17, -2, -17]} castShadow>
          <meshLambertMaterial color="#8b4513" />
        </Box>
        <Box args={[1.5, 3, 0.2]} position={[17, 0.5, -17]} castShadow>
          <meshLambertMaterial color="#2f855a" />
        </Box>
        <Box args={[0.2, 3, 1.5]} position={[17, 0.5, -17]} castShadow>
          <meshLambertMaterial color="#2f855a" />
        </Box>
      </group>

      {/* Ceiling */}
      <Plane
        args={[40, 40]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 15, 0]}
        receiveShadow
      >
        <meshLambertMaterial color="#ffffff" />
      </Plane>

      {/* Windows (transparent planes for lighting) */}
      <group>
        <Plane
          args={[8, 6]}
          position={[20, 8, -5]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <meshBasicMaterial color="#87ceeb" transparent opacity={0.3} />
        </Plane>
        <Plane
          args={[8, 6]}
          position={[20, 8, 5]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <meshBasicMaterial color="#87ceeb" transparent opacity={0.3} />
        </Plane>
      </group>
    </group>
  );
}