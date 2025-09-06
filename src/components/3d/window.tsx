import React, {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, RoundedBox, PresentationControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import type { Mesh, Vector3 } from "three";
import * as THREE from "three";

interface Window3DProps {
  children: ReactNode;
  title?: string;
  icon?: string;
  position?: [number, number, number];
}

interface WindowState {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  isHovered: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isDragging: boolean;
  isResizing: boolean;
  size: [number, number];
}

export default function Window3D({
  children,
  title = "Window",
  icon = "📱",
  position: initialPosition = [0, 0, 0],
}: Window3DProps) {
  const meshRef = useRef<Mesh>(null);
  const dragStartRef = useRef<Vector3 | undefined>(undefined);
  const initialPositionRef = useRef<Vector3 | undefined>(undefined);
  const { camera, raycaster, pointer } = useThree();

  // Internal window state
  const [windowState, setWindowState] = useState<WindowState>({
    position: initialPosition,
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    isHovered: false,
    isFocused: false,
    isMinimized: false,
    isMaximized: false,
    isDragging: false,
    isResizing: false,
    size: [12, 16],
  });

  // Spring animations for smooth transitions
  const { position, rotation, scale, opacity } = useSpring({
    position: windowState.position,
    rotation: windowState.rotation,
    scale: windowState.isMinimized ? [0.2, 0.2, 0.2] : windowState.scale,
    opacity: windowState.isMinimized ? 0.9 : 1,
    config: {
      tension: 200,
      friction: 25,
      mass: 1,
    },
  });

  // Glow and interaction effects
  const { glowIntensity, frameColor, shadowIntensity } = useSpring({
    glowIntensity: windowState.isHovered
      ? 0.3
      : windowState.isFocused
      ? 0.15
      : 0,
    frameColor: windowState.isFocused
      ? "#3b82f6"
      : windowState.isHovered
      ? "#6366f1"
      : "#f8fafc",
    shadowIntensity: windowState.isDragging
      ? 0.8
      : windowState.isHovered
      ? 0.6
      : 0.3,
    config: { tension: 300, friction: 30 },
  });

  // Floating animation when not interacting
  useFrame((state) => {
    if (
      meshRef.current &&
      !windowState.isDragging &&
      !windowState.isMinimized
    ) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.01;
      meshRef.current.rotation.y = Math.sin(time * 0.15) * 0.01;
      meshRef.current.position.y =
        windowState.position[1] + Math.sin(time * 0.3) * 0.02;
    }
  });

  // Window interaction handlers
  const handlePointerEnter = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isHovered: true }));
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerLeave = useCallback(() => {
    setWindowState((prev) => ({
      ...prev,
      isHovered: false,
      isDragging: false,
    }));
    document.body.style.cursor = "default";
  }, []);

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setWindowState((prev) => ({ ...prev, isFocused: !prev.isFocused }));
  }, []);

  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();

      // Calculate drag start position in world space
      const intersect = event.intersections[0];
      if (intersect && meshRef.current) {
        dragStartRef.current = intersect.point.clone();
        initialPositionRef.current = new THREE.Vector3(...windowState.position);

        setWindowState((prev) => ({
          ...prev,
          isDragging: true,
          isFocused: true,
        }));

        document.body.style.cursor = "grabbing";
      }
    },
    [windowState.position]
  );

  const handlePointerMove = useCallback(() => {
    if (
      !windowState.isDragging ||
      !dragStartRef.current ||
      !initialPositionRef.current
    )
      return;

    // Calculate new position based on drag
    raycaster.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      const delta = intersectPoint.clone().sub(dragStartRef.current);
      const newPosition: [number, number, number] = [
        initialPositionRef.current.x + delta.x,
        initialPositionRef.current.y + delta.y,
        initialPositionRef.current.z,
      ];

      setWindowState((prev) => ({ ...prev, position: newPosition }));
    }
  }, [windowState.isDragging, camera, raycaster, pointer]);

  const handlePointerUp = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isDragging: false }));
    document.body.style.cursor = windowState.isHovered ? "pointer" : "default";
    dragStartRef.current = undefined;
    initialPositionRef.current = undefined;
  }, [windowState.isHovered]);

  // Touch tracking for gesture detection
  const touchStartRef = useRef<{ touches: TouchList; time: number } | null>(
    null
  );

  // Window control handlers
  const handleMinimize = useCallback(() => {
    setWindowState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  }, []);

  // Handle touch start for gesture detection
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 3) {
      touchStartRef.current = {
        touches: e.touches,
        time: Date.now(),
      };
    }
  }, []);

  // Handle touch end for gesture completion
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (touchStartRef.current && e.changedTouches.length === 3) {
        const timeDiff = Date.now() - touchStartRef.current.time;
        if (timeDiff < 500) {
          // Quick 3-finger tap
          handleMinimize();
        }
      }
      touchStartRef.current = null;
    },
    [handleMinimize]
  );

  // Handle content area mouse down for dragging
  const handleContentMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if the target is an interactive element
      const isInteractive =
        target.matches(
          "input, button, select, textarea, a, [contenteditable], [tabindex]"
        ) ||
        target.closest(
          "input, button, select, textarea, a, [contenteditable], [tabindex]"
        );

      // Only start dragging if not clicking on interactive elements
      if (!isInteractive) {
        e.preventDefault();
        setWindowState((prev) => ({
          ...prev,
          isDragging: true,
          isFocused: true,
        }));

        // Store initial mouse position for dragging
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        dragStartRef.current = new THREE.Vector3(
          e.clientX - rect.left,
          e.clientY - rect.top,
          0
        );
        initialPositionRef.current = new THREE.Vector3(...windowState.position);

        document.body.style.cursor = "grabbing";
      }
    },
    [windowState.position]
  );

  // Add touch event listeners
  useEffect(() => {
    const handleTouchStartGlobal = (e: TouchEvent) => handleTouchStart(e);
    const handleTouchEndGlobal = (e: TouchEvent) => handleTouchEnd(e);

    document.addEventListener("touchstart", handleTouchStartGlobal);
    document.addEventListener("touchend", handleTouchEndGlobal);

    return () => {
      document.removeEventListener("touchstart", handleTouchStartGlobal);
      document.removeEventListener("touchend", handleTouchEndGlobal);
    };
  }, [handleTouchStart, handleTouchEnd]);

  if (!windowState.position) return null;

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
          position={position.get() as [number, number, number]}
          rotation={rotation.get() as [number, number, number]}
          scale={scale.get() as [number, number, number]}
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

  return (
    <PresentationControls
      enabled={!windowState.isDragging}
      global
      snap
      rotation={[0, 0.3, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
    >
      {false && (
        <RoundedBox
          ref={meshRef}
          args={[windowState.size[0], windowState.size[1], 0.2]}
          radius={0.1}
          smoothness={8}
          castShadow
          receiveShadow
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <animated.meshStandardMaterial
            color={frameColor.get()}
            transparent
            opacity={opacity.get()}
            metalness={0.1}
            roughness={0.2}
          />
        </RoundedBox>
      )}

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
            ${
              windowState.isFocused
                ? "shadow-2xl shadow-blue-500/20"
                : "shadow-xl"
            }
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
          onMouseDown={handleContentMouseDown}
        >
          {/* Window Header */}
          <div
            className="flex items-center justify-center px-6 py-3 backdrop-blur-md cursor-move"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <span className="text-sm font-semibold text-gray-800 select-none tracking-wide">
              {title}
            </span>
          </div>

          {/* Window Body */}
          <div
            className="flex-1 overflow-auto"
            style={{ height: "calc(100% - 60px)" }}
          >
            {children}
          </div>
        </div>
      </Html>

      {/* Glow Effect */}
      {glowIntensity.get() > 0 && (
        <RoundedBox
          args={[windowState.size[0] + 0.2, windowState.size[1] + 0.2, 0.3]}
          radius={0.15}
          smoothness={8}
        >
          <animated.meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={glowIntensity.get()}
          />
        </RoundedBox>
      )}

      {/* Enhanced Shadow */}
      {false && (
        <mesh position={[0, 0, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry
            args={[windowState.size[0] + 1, windowState.size[1] + 1]}
          />
          <animated.meshBasicMaterial
            color="#000000"
            transparent
            opacity={shadowIntensity.get() * 0.1}
          />
        </mesh>
      )}
    </PresentationControls>
  );
}
