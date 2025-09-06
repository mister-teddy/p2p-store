import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { Mesh } from 'three';
import { useSpring, animated } from '@react-spring/three';
import type { WindowConfig } from '@/state/3d';

interface Window3DProps {
  config: WindowConfig;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  width?: number;
  height?: number;
}

export default function Window3D({
  config,
  children,
  onClose,
  onMinimize,
  onMaximize,
  width = 4,
  height = 6,
}: Window3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // Smooth animation for position, rotation, and scale
  const { position, rotation, scale } = useSpring({
    position: config.position,
    rotation: config.rotation,
    scale: config.scale,
    config: { tension: 200, friction: 25 },
  });

  // Hover and focus effects
  const { glowIntensity } = useSpring({
    glowIntensity: hovered ? 0.2 : focused ? 0.1 : 0,
    config: { tension: 300, friction: 30 },
  });

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current && !config.isMinimized) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
      meshRef.current.position.y =
        config.position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  if (!config.isVisible) return null;

  return (
    <animated.group
      position={position.get() as [number, number, number]}
      rotation={rotation.get() as [number, number, number]}
      scale={scale.get() as [number, number, number]}
    >
      {/* Window Frame */}
      <RoundedBox
        ref={meshRef}
        args={[width, height, 0.2]}
        radius={0.1}
        smoothness={8}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => setFocused(!focused)}
      >
        <meshStandardMaterial
          color={focused ? '#3b82f6' : hovered ? '#6366f1' : '#f8fafc'}
          transparent
          opacity={0.95}
          metalness={0.1}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Window Content */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.11]}
        style={{
          width: `${width * 60}px`,
          height: `${height * 60}px`,
          pointerEvents: 'auto',
        }}
      >
        <div
          className={`
            relative w-full h-full bg-white rounded-lg shadow-xl border
            transition-all duration-200 overflow-hidden
            ${focused ? 'ring-2 ring-blue-500' : ''}
            ${hovered ? 'shadow-2xl' : ''}
          `}
          style={{
            opacity: config.isMinimized ? 0.7 : 1,
            transform: `scale(${config.isMinimized ? 0.8 : 1})`,
          }}
        >
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  />
                )}
                {onMinimize && (
                  <button
                    onClick={onMinimize}
                    className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
                  />
                )}
                {onMaximize && (
                  <button
                    onClick={onMaximize}
                    className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                  />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {config.id}
              </span>
            </div>
          </div>

          {/* Window Body */}
          <div className="flex-1 overflow-auto p-4">
            {children}
          </div>
        </div>
      </Html>

      {/* Glow Effect */}
      {glowIntensity.get() > 0 && (
        <RoundedBox
          args={[width + 0.2, height + 0.2, 0.3]}
          radius={0.15}
          smoothness={8}
        >
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={glowIntensity.get()}
          />
        </RoundedBox>
      )}
    </animated.group>
  );
}