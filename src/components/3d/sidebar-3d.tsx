import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Group } from "three";
import { useAtomValue } from "jotai";
import { deviceTypeAtom } from "@/state/3d";
import CONFIG from "@/config";
import Profile from "../profile";
import StyledInput from "../forms/input";

interface Sidebar3DProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
}

interface NavItem3DProps {
  item: {
    path: string;
    icon: string;
    title: string;
  };
  position: [number, number, number];
  isActive: boolean;
  index: number;
}

function NavItem3D({ item, position, isActive, index }: NavItem3DProps) {
  const meshRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  // Smooth hover animations
  const { scale, positionOffset } = useSpring({
    scale: hovered ? 1.1 : 1,
    positionOffset: hovered ? 0.1 : 0,
    config: { tension: 400, friction: 30 },
  });

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.x =
        position[0] + Math.sin(time * 0.5 + index * 0.2) * 0.02;
    }
  });

  return (
    <animated.group
      ref={meshRef}
      position={[
        position[0] + (positionOffset.get() as number),
        position[1],
        position[2] + (positionOffset.get() as number),
      ]}
      scale={scale.get() as number}
    >
      {/* Navigation Item Background */}
      <RoundedBox
        args={[3, 0.6, 0.1]}
        radius={0.1}
        smoothness={4}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isActive ? "#3b82f6" : hovered ? "#e5e7eb" : "#ffffff"}
          transparent
          opacity={isActive ? 0.9 : hovered ? 0.7 : 0.1}
          metalness={0.1}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Navigation Content */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.06]}
        style={{
          width: "180px",
          height: "36px",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <button
          onClick={() => navigate(item.path)}
          className={`
            flex items-center justify-center w-full h-full px-4
            text-sm font-medium transition-colors duration-200 rounded-lg
            ${
              isActive
                ? "text-white"
                : hovered
                ? "text-gray-900"
                : "text-gray-600"
            }
          `}
        >
          <span className="mr-2 text-base">{item.icon}</span>
          {item.title}
        </button>
      </Html>
    </animated.group>
  );
}

export default function Sidebar3D({
  position = [-8, 0, 2],
  width = 3.5,
  height = 10,
}: Sidebar3DProps) {
  const location = useLocation();
  const deviceType = useAtomValue(deviceTypeAtom);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Responsive sizing
  const sidebarConfig = {
    width: deviceType === "mobile" ? width * 0.8 : width,
    height: deviceType === "mobile" ? height * 0.9 : height,
    position:
      deviceType === "mobile"
        ? ([position[0] * 0.7, position[1], position[2] * 0.8] as [
            number,
            number,
            number
          ])
        : position,
  };

  return (
    <group position={sidebarConfig.position}>
      {/* Main Sidebar Panel */}
      <RoundedBox
        args={[sidebarConfig.width, sidebarConfig.height, 0.2]}
        radius={0.2}
        smoothness={8}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.95}
          metalness={0.05}
          roughness={0.1}
          envMapIntensity={0.3}
        />
      </RoundedBox>

      {/* Sidebar Content */}
      <Html
        transform
        occlude="blending"
        position={[0, 0, 0.11]}
        style={{
          width: `${sidebarConfig.width * 60}px`,
          height: `${sidebarConfig.height * 60}px`,
          pointerEvents: "auto",
        }}
      >
        <div className="flex flex-col h-full p-4 bg-transparent">
          {/* Search Bar */}
          <div className="mb-6">
            <StyledInput
              name="search"
              type="text"
              placeholder="Search apps..."
              className={`
                w-full px-4 py-2 text-sm rounded-full border
                transition-all duration-200
                ${
                  isSearchFocused
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {CONFIG.SIDEBAR_ITEMS.map((item) => (
              <div key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium
                    rounded-lg transition-all duration-200
                    ${
                      location.pathname === item.path
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.title}
                </Link>
              </div>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <Profile />
          </div>
        </div>
      </Html>

      {/* Navigation Items in 3D (Alternative approach) */}
      <group position={[0, 2, 0.15]}>
        {CONFIG.SIDEBAR_ITEMS.map((item, index) => (
          <NavItem3D
            key={item.path}
            item={item}
            position={[0, -index * 0.8, 0]}
            isActive={location.pathname === item.path}
            index={index}
          />
        ))}
      </group>

      {/* Floating Action Button for 3D Mode Toggle */}
      <group position={[0, -4.5, 0.15]}>
        <RoundedBox
          args={[0.8, 0.8, 0.15]}
          radius={0.4}
          smoothness={8}
          castShadow
        >
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.3}
            roughness={0.1}
          />
        </RoundedBox>

        <Html
          transform
          position={[0, 0, 0.08]}
          style={{
            width: "48px",
            height: "48px",
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={() => {
              // Toggle 3D mode functionality
              console.log("Toggle 3D mode");
            }}
            className="w-full h-full flex items-center justify-center text-white text-lg hover:scale-110 transition-transform duration-200"
            title="Toggle 3D Mode"
          >
            🌐
          </button>
        </Html>
      </group>

      {/* Subtle glow effect */}
      <RoundedBox
        args={[sidebarConfig.width + 0.1, sidebarConfig.height + 0.1, 0.25]}
        radius={0.25}
        smoothness={8}
      >
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
      </RoundedBox>
    </group>
  );
}
