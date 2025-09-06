import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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
  isDragging: boolean;
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
  const dragStart = useRef<{
    pointer: THREE.Vector2;
    position: THREE.Vector3;
  }>({
    pointer: new THREE.Vector2(),
    position: new THREE.Vector3(),
  });
  const lastPosition = useRef<[number, number, number]>(position);
  const { camera, pointer } = useThree();

  const [windowState, setWindowStateX] = useState<WindowState>({
    position: position,
    size: size,
    isHovered: false,
    isFocused: false,
    isMinimized: false,
    isDragging: false,
  });

  const setWindowState = (...args: Parameters<typeof setWindowStateX>) => {
    setWindowStateX(...args);
  };

  // Spring animations for smooth transitions
  const { position: animatedPosition, scale: animatedScale } = useSpring({
    position: windowState.isDragging
      ? lastPosition.current
      : windowState.position,
    scale: windowState.isMinimized ? [0.2, 0.2, 0.2] : [1, 1, 1],
    config: {
      tension: 200,
      friction: 25,
      mass: 1,
    },
  });

  // Optimized drag handling and camera-facing logic
  useFrame((state) => {
    if (!meshRef.current) return;

    if (windowState.isDragging && dragStart.current) {
      // Calculate the difference between current pointer and drag start
      const pointerDelta = new THREE.Vector2(
        pointer.x - dragStart.current.pointer.x,
        pointer.y - dragStart.current.pointer.y
      );

      // Convert screen space delta to world space
      // Use camera's view matrix to maintain consistent movement regardless of camera angle
      const worldDelta = new THREE.Vector3();
      const cameraMatrix = camera.matrixWorld.clone();

      // Get camera's right and up vectors
      const right = new THREE.Vector3();
      const up = new THREE.Vector3();
      cameraMatrix.extractBasis(right, up, new THREE.Vector3());

      // Apply the pointer delta to world coordinates
      // Scale by distance from camera for consistent movement speed
      const distance = camera.position.distanceTo(dragStart.current.position);
      const scale = distance * 0.5; // Adjust this multiplier for sensitivity

      worldDelta.addScaledVector(right, pointerDelta.x * scale);
      worldDelta.addScaledVector(up, -pointerDelta.y * scale); // Flip Y for intuitive movement

      const newPosition: [number, number, number] = [
        dragStart.current.position.x + worldDelta.x,
        dragStart.current.position.y + worldDelta.y,
        dragStart.current.position.z + worldDelta.z,
      ];

      // Update position directly on the mesh for performance
      meshRef.current.position.set(
        newPosition[0],
        newPosition[1],
        newPosition[2]
      );
      lastPosition.current = newPosition;
    } else if (!windowState.isMinimized) {
      // Subtle floating animation when not dragging
      const time = state.clock.elapsedTime;
      const baseY = windowState.position[1];
      meshRef.current.position.y = baseY + Math.sin(time * 0.3) * 0.02;
    }

    // Always face the camera
    meshRef.current.lookAt(camera.position);
  });

  // Optimized event handlers
  const handlePointerEnter = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isHovered: true }));
  }, []);

  const handlePointerLeave = useCallback(() => {
    setWindowState((prev) => ({ ...prev, isHovered: false }));
  }, []);

  const isInteractiveElement = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName.toLowerCase();
    return tag === "input" || tag === "textarea" || target.isContentEditable;
  };

  const handlePointerDown = useCallback(
    (event: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
      // Prevent drag/focus if clicking on input/textarea/contenteditable
      if (isInteractiveElement(event.target)) return;

      event.stopPropagation();
      event.preventDefault();

      if (meshRef.current) {
        // Store the initial pointer position and window position
        dragStart.current = {
          pointer: new THREE.Vector2(pointer.x, pointer.y),
          position: new THREE.Vector3().copy(meshRef.current.position),
        };

        setWindowState((prev) => ({
          ...prev,
          isDragging: true,
          isFocused: true,
        }));
      }
    },
    [pointer]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      // Prevent drag/focus if touching input/textarea/contenteditable
      if (isInteractiveElement(event.target)) return;

      // Handle 3-finger gesture for minimization
      if (event.touches.length === 3) {
        event.preventDefault();
        setWindowState((prev) => ({
          ...prev,
          isMinimized: !prev.isMinimized,
        }));
        return;
      }

      // Regular drag start for single touch
      handlePointerDown(event);
    },
    [handlePointerDown]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      // Prevent focus toggle if clicking on input/textarea/contenteditable
      if (isInteractiveElement(event.target)) return;

      event.stopPropagation();
      if (!windowState.isDragging) {
        setWindowState((prev) => ({ ...prev, isFocused: !prev.isFocused }));
      }
    },
    [windowState.isDragging]
  );

  const handleMinimize = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setWindowState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  // Efficient global drag end handling - only when dragging
  useEffect(() => {
    if (!windowState.isDragging) return;

    const handleGlobalPointerUp = () => {
      // Update state with final position
      setWindowState((prev) => ({
        ...prev,
        isDragging: false,
        position: lastPosition.current,
      }));
    };

    document.addEventListener("pointerup", handleGlobalPointerUp);
    document.addEventListener("touchend", handleGlobalPointerUp);

    return () => {
      document.removeEventListener("pointerup", handleGlobalPointerUp);
      document.removeEventListener("touchend", handleGlobalPointerUp);
    };
  }, [windowState.isDragging]);

  // Minimized icon view
  if (windowState.isMinimized) {
    return (
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
            className="w-full h-full flex items-center justify-center text-4xl cursor-pointer hover:scale-110 transition-transform duration-200 bg-white/20 backdrop-blur rounded-2xl border border-white/30"
            onClick={handleMinimize}
            title={title}
          >
            {icon}
          </div>
        </Html>
      </animated.group>
    );
  }

  // Main window view
  return (
    <animated.group
      ref={meshRef}
      position={animatedPosition.get() as [number, number, number]}
      scale={animatedScale.get() as [number, number, number]}
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
              transition-all duration-300 backdrop-blur-xl cursor-grab
              ${
                windowState.isFocused
                  ? "shadow-2xl shadow-blue-500/20"
                  : "shadow-xl"
              }
              ${windowState.isHovered ? "shadow-3xl" : ""}
              ${windowState.isDragging ? "cursor-grabbing" : ""}
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
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
          onMouseDown={handlePointerDown}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
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
  );
}
