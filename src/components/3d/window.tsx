import { useRef, useState, useCallback, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, PresentationControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

interface Window3DProps {
  children: ReactNode;
  title?: string;
  icon?: string;
  position?: [number, number, number];
  size?: [number, number];
}

interface WindowState {
  position: [number, number, number];
  isHovered: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  size: [number, number];
}

export default function Window3D({
  children,
  title,
  icon,
  position = [0, 0, 0],
  size = [12, 16],
}: Window3DProps) {
  const meshRef = useRef<THREE.Group>(null);

  const [windowState, setWindowState] = useState<WindowState>({
    position: position,
    size: size,
    isHovered: false,
    isFocused: false,
    isMinimized: false,
  });

  // Spring animations for smooth transitions
  const { position: animatedPosition, scale: animatedScale } = useSpring({
    position: windowState.position,
    scale: windowState.isMinimized ? [0.2, 0.2, 0.2] : [1, 1, 1],
    config: {
      tension: 200,
      friction: 25,
      mass: 1,
    },
  });

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current && !windowState.isMinimized) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = windowState.position[1] + Math.sin(time * 0.3) * 0.02;
    }
  });

  // Simplified interaction handlers
  const handlePointerEnter = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isHovered: true }));
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerLeave = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isHovered: false }));
    document.body.style.cursor = "default";
  }, []);

  const handleClick = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isFocused: !prev.isFocused }));
  }, []);

  const handleMinimize = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  // Minimized icon view
  if (windowState.isMinimized) {
    return (
      <PresentationControls
        enabled={false}
        global
        snap
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <animated.group
          ref={meshRef}
          position={animatedPosition.get() as [number, number, number]}
          scale={animatedScale.get() as [number, number, number]}
        >
          <Html
            transform
            occlude="blending"
            position={[0, 0, 0]}
            style={{
              width: "60px",
              height: "60px",
              pointerEvents: "auto",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center text-4xl cursor-pointer hover:scale-110 transition-transform duration-200 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30"
              onClick={handleMinimize}
              title={title}
            >
              {icon}
            </div>
          </Html>
        </animated.group>
      </PresentationControls>
    );
  }

  // Main window view
  return (
    <PresentationControls
      global
      snap
      rotation={[0, 0.3, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
    >
      <animated.group
        ref={meshRef}
        position={animatedPosition.get() as [number, number, number]}
        scale={animatedScale.get() as [number, number, number]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        {/* Window Content */}
        <Html
          transform
          position={[0, 0, 0.11]}
          style={{
            width: `${windowState.size[0] * 60}px`,
            height: `${windowState.size[1] * 60}px`,
            pointerEvents: "auto",
          }}
        >
          <div
            className={`
              relative w-full h-full rounded-2xl overflow-hidden
              transition-all duration-300 backdrop-blur-xl
              ${windowState.isFocused ? "shadow-2xl shadow-blue-500/20" : "shadow-xl"}
              ${windowState.isHovered ? "shadow-3xl" : ""}
            `}
            style={{
              background: windowState.isFocused
                ? "rgba(255, 255, 255, 0.95)"
                : "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: windowState.isFocused
                ? "1px solid rgba(59, 130, 246, 0.3)"
                : "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Window Header */}
            {title && (
              <div
                className="flex items-center justify-between px-6 py-3 backdrop-blur-md"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <span className="text-sm font-semibold text-gray-800 select-none tracking-wide">
                  {title}
                </span>
                <button
                  onClick={handleMinimize}
                  className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Window Body */}
            <div
              className="flex-1 overflow-auto"
              style={{ height: title ? "calc(100% - 60px)" : "100%" }}
            >
              {children}
            </div>
          </div>
        </Html>
      </animated.group>
    </PresentationControls>
  );
}