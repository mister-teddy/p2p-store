import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox, Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Group } from "three";
import { useAtomValue } from "jotai";
import { installedAppsAtom, storeAppsAtom } from "@/state/app-ecosystem";
import type { AppTable } from "@/types";
import type { Selectable } from "kysely";
import { deviceTypeAtom } from "@/state/3d";
import AppIcon from "../app-icon";
import FormatMoney from "../format/money";
import AppEntry from "../app-entry";

interface AppGrid3DProps {
  installedOnly?: boolean;
  columns?: number;
  spacing?: number;
  cardWidth?: number;
  cardHeight?: number;
}

interface AppCard3DProps {
  app: Selectable<AppTable>;
  position: [number, number, number];
  cardWidth: number;
  cardHeight: number;
  index: number;
}

function AppCard3D({
  app,
  position,
  cardWidth,
  cardHeight,
  index,
}: AppCard3DProps) {
  const meshRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Smooth hover animations
  const { scale, positionOffset, rotation } = useSpring({
    scale: hovered ? [1.05, 1.05, 1.05] : [1, 1, 1],
    positionOffset: hovered ? [0, 0.2, 0.2] : [0, 0, 0],
    rotation: hovered ? [0, 0, 0] : [0, 0, 0],
    config: { tension: 300, friction: 25 },
  });

  // Subtle floating animation
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y =
        position[1] + Math.sin(time * 0.5 + index * 0.3) * 0.1;
      meshRef.current.rotation.y = Math.sin(time * 0.2 + index * 0.2) * 0.02;
    }
  });

  return (
    <AppEntry key={app.id} app={app}>
      {({ onClick }) => (
        <animated.group
          ref={meshRef}
          position={position.map((p, i) => p + (positionOffset.get() as number[])[i]) as [number, number, number]}
          scale={scale.get() as [number, number, number]}
          rotation={rotation.get() as [number, number, number]}
        >
          {/* Card Background */}
          <RoundedBox
            args={[cardWidth, cardHeight, 0.15]}
            radius={0.15}
            smoothness={8}
            castShadow
            receiveShadow
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={() => {
              setClicked(true);
              setTimeout(() => setClicked(false), 150);
              onClick();
            }}
          >
            <meshStandardMaterial
              color={hovered ? "#ffffff" : "#f8fafc"}
              transparent
              opacity={0.95}
              metalness={0.05}
              roughness={0.1}
              envMapIntensity={0.5}
            />
          </RoundedBox>

          {/* Content Panel */}
          <Html
            transform
            occlude="blending"
            position={[0, 0, 0.08]}
            style={{
              width: `${cardWidth * 60}px`,
              height: `${cardHeight * 60}px`,
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            <div
              className={`
                relative w-full h-full p-4 bg-transparent
                transition-all duration-200 cursor-pointer
                flex flex-col items-center justify-center text-center
                ${clicked ? "scale-95" : ""}
              `}
              onClick={onClick}
            >
              {/* App Icon */}
              <div className="mb-3">
                <AppIcon app={app} />
              </div>

              {/* App Name */}
              <h3
                className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2"
                style={{
                  viewTransitionName: `app-name-${app.id}`,
                }}
              >
                {app.name}
              </h3>

              {/* App Description */}
              <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                {app.description}
              </p>

              {/* Price/Action Button */}
              <button
                type="button"
                className={`
                  px-3 py-1 text-xs font-medium rounded-full
                  transition-colors duration-200
                  ${
                    hovered
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-blue-50 text-blue-600"
                  }
                `}
              >
                {app.price ? <FormatMoney amount={app.price} /> : "Open"}
              </button>

              {/* Version Info */}
              <div className="mt-2 text-xs text-gray-400">
                v{app.version || "1.0"}
              </div>
            </div>
          </Html>

          {/* Glow Effect */}
          {hovered && (
            <RoundedBox
              args={[cardWidth + 0.1, cardHeight + 0.1, 0.2]}
              radius={0.2}
              smoothness={8}
            >
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
            </RoundedBox>
          )}
        </animated.group>
      )}
    </AppEntry>
  );
}

export default function AppGrid3D({
  installedOnly = false,
  columns = 4,
  spacing = 4,
  cardWidth = 3,
  cardHeight = 4,
}: AppGrid3DProps) {
  const apps = useAtomValue(installedOnly ? installedAppsAtom : storeAppsAtom);
  const deviceType = useAtomValue(deviceTypeAtom);

  // Responsive grid configuration
  const gridConfig = useMemo(() => {
    let cols = columns;
    let cardW = cardWidth;
    let cardH = cardHeight;
    let gap = spacing;

    if (deviceType === "mobile") {
      cols = 2;
      cardW = 2.5;
      cardH = 3.5;
      gap = 3;
    } else if (deviceType === "tablet") {
      cols = 3;
      cardW = 2.8;
      cardH = 3.8;
      gap = 3.5;
    }

    return { cols, cardW, cardH, gap };
  }, [deviceType, columns, cardWidth, cardHeight, spacing]);

  // Calculate grid positions
  const gridPositions = useMemo(() => {
    const { cols, gap } = gridConfig;
    const positions: Array<[number, number, number]> = [];

    apps.forEach((_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      // Center the grid
      const totalWidth = (cols - 1) * gap;
      const startX = -totalWidth / 2;

      const x = startX + col * gap;
      const y = 2 - row * (gap * 0.8); // Slightly less vertical spacing
      const z = 0;

      positions.push([x, y, z]);
    });

    return positions;
  }, [apps, gridConfig]);

  if (apps.length === 0) {
    return (
      <group position={[0, 0, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={1}
          color="#6b7280"
          anchorX="center"
          anchorY="middle"
        >
          {installedOnly ? "No apps installed" : "No apps available"}
        </Text>
      </group>
    );
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={1.2}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {installedOnly ? "Dashboard" : "App Store"}
      </Text>

      {/* App Cards */}
      {apps.map((app, index) => (
        <AppCard3D
          key={app.id}
          app={app}
          position={gridPositions[index]}
          cardWidth={gridConfig.cardW}
          cardHeight={gridConfig.cardH}
          index={index}
        />
      ))}
    </group>
  );
}
