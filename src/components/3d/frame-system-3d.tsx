import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Group } from "three";
import { useAtomValue } from "jotai";
import { framesConfigAtom, deviceTypeAtom } from "@/state/3d";

// Individual Frame Components
interface CalendarFrameProps {
  isVisible: boolean;
}

function CalendarFrame({ isVisible }: CalendarFrameProps) {
  if (!isVisible) return null;

  const today = new Date();
  const currentMonth = today.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const currentDay = today.getDate();

  return (
    <div className="flex flex-col h-full p-3 bg-white/90 backdrop-blur rounded-lg">
      <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">
        {currentMonth}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center font-medium text-gray-500 p-1">
            {day}
          </div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`
              text-center p-1 rounded cursor-pointer transition-colors
              ${
                day === currentDay
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

interface TodoFrameProps {
  isVisible: boolean;
}

function TodoFrame({ isVisible }: TodoFrameProps) {
  const [todos] = useState([
    { id: 1, text: "Review new apps", completed: false },
    { id: 2, text: "Update dashboard", completed: true },
    { id: 3, text: "Test 3D interface", completed: false },
  ]);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full p-3 bg-white/90 backdrop-blur rounded-lg">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">To-Do</h3>
      <div className="flex-1 space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`
              flex items-center space-x-2 text-xs p-2 rounded
              ${todo.completed ? "bg-green-50 text-green-800" : "bg-gray-50"}
            `}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              readOnly
              className="w-3 h-3"
            />
            <span className={todo.completed ? "line-through" : ""}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>
      <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors">
        + Add task
      </button>
    </div>
  );
}

interface WeatherFrameProps {
  isVisible: boolean;
}

function WeatherFrame({ isVisible }: WeatherFrameProps) {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full p-3 bg-white/90 backdrop-blur rounded-lg">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Weather</h3>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-2xl mb-2">☀️</div>
        <div className="text-lg font-bold text-gray-800">72°F</div>
        <div className="text-xs text-gray-600">Sunny</div>
        <div className="text-xs text-gray-500 mt-1">San Francisco</div>
      </div>
    </div>
  );
}

interface Frame3DProps {
  id: string;
  title: string;
  position: [number, number, number];
  size: [number, number];
  isVisible: boolean;
  component: React.ComponentType<{ isVisible: boolean }>;
  index: number;
}

function Frame3D({
  title,
  position,
  size,
  isVisible,
  component: Component,
  index,
}: Frame3DProps) {
  const meshRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Smooth animations
  const { scale, opacity, positionOffset } = useSpring({
    scale: expanded
      ? [1.2, 1.2, 1.2]
      : hovered
      ? [1.05, 1.05, 1.05]
      : [1, 1, 1],
    opacity: isVisible ? 1 : 0,
    positionOffset: hovered ? [0.1, 0, 0.1] : [0, 0, 0],
    config: { tension: 300, friction: 25 },
  });

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current && isVisible) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y =
        position[1] + Math.sin(time * 0.4 + index * 0.5) * 0.1;
      meshRef.current.rotation.z = Math.sin(time * 0.3 + index * 0.3) * 0.01;
    }
  });

  if (!isVisible) return null;

  return (
    <animated.group
      ref={meshRef}
      position={position.map((p, i) => p + (positionOffset.get() as number[])[i]) as [number, number, number]}
      scale={scale.get() as [number, number, number]}
    >
      {/* Frame Background */}
      <RoundedBox
        args={[size[0], size[1], 0.1]}
        radius={0.1}
        smoothness={6}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => setExpanded(!expanded)}
      >
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={opacity.get() * 0.95}
          metalness={0.05}
          roughness={0.1}
          envMapIntensity={0.2}
        />
      </RoundedBox>

      {/* Frame Content */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.06]}
        style={{
          width: `${size[0] * 60}px`,
          height: `${size[1] * 60}px`,
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <div
          className={`
            w-full h-full transition-all duration-200
            ${expanded ? "transform scale-110" : ""}
          `}
        >
          <Component isVisible={isVisible} />
        </div>
      </Html>

      {/* Frame Title (floating above) */}
      <Text
        position={[0, size[1] / 2 + 0.3, 0.1]}
        fontSize={0.15}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Subtle glow effect when hovered */}
      {hovered && (
        <RoundedBox
          args={[size[0] + 0.1, size[1] + 0.1, 0.15]}
          radius={0.15}
          smoothness={6}
        >
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
        </RoundedBox>
      )}
    </animated.group>
  );
}

interface FrameSystem3DProps {
  showFrames?: boolean;
}

export default function FrameSystem3D({
  showFrames = true,
}: FrameSystem3DProps) {
  const framesConfig = useAtomValue(framesConfigAtom);
  const deviceType = useAtomValue(deviceTypeAtom);

  // Frame components mapping
  const frameComponents = useMemo(
    () => ({
      calendar: CalendarFrame,
      todo: TodoFrame,
      weather: WeatherFrame,
    }),
    []
  );

  // Responsive frame positions and sizes
  const responsiveFrames = useMemo(() => {
    const frames = Object.values(framesConfig);

    if (deviceType === "mobile") {
      // On mobile, stack frames vertically on the left
      return frames.map((frame, index) => ({
        ...frame,
        position: [-6, 2 - index * 3, -1] as [number, number, number],
        size: [frame.size[0] * 0.8, frame.size[1] * 0.8] as [number, number],
      }));
    } else if (deviceType === "tablet") {
      // On tablet, slightly adjust positions
      return frames.map((frame) => ({
        ...frame,
        position: [-9, frame.position[1], frame.position[2]] as [
          number,
          number,
          number
        ],
        size: [frame.size[0] * 0.9, frame.size[1] * 0.9] as [number, number],
      }));
    }

    // Desktop - use original positions
    return frames;
  }, [framesConfig, deviceType]);

  if (!showFrames) return null;

  return (
    <group>
      {responsiveFrames.map((frame, index) => {
        const Component =
          frameComponents[frame.id as keyof typeof frameComponents];

        if (!Component) return null;

        return (
          <Frame3D
            key={frame.id}
            id={frame.id}
            title={frame.title}
            position={frame.position}
            size={frame.size}
            isVisible={frame.isVisible}
            component={Component}
            index={index}
          />
        );
      })}
    </group>
  );
}
