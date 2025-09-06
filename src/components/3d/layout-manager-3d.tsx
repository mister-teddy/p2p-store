import { type ReactNode, useEffect } from "react";
import { useAtom } from "jotai";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stats } from "@react-three/drei";
import {
  responsiveIs3DModeAtom,
  deviceTypeAtom,
  deviceCapabilitiesAtom,
  renderQualityAtom,
  cameraPositionAtom,
  cameraTargetAtom,
  animationStateAtom,
} from "@/state/3d";
import GestureSystem3D from "./gesture-system-3d";
import HouseEnvironment from "./house-environment";

interface LayoutManager3DProps {
  children: ReactNode;
  showStats?: boolean;
  enableOrbitControls?: boolean;
  className?: string;
}

export default function LayoutManager3D({
  children,
  showStats = false,
  enableOrbitControls = true,
  className = "w-full h-full",
}: LayoutManager3DProps) {
  const [is3DMode] = useAtom(responsiveIs3DModeAtom);
  const [deviceType, setDeviceType] = useAtom(deviceTypeAtom);
  const [deviceCapabilities] = useAtom(deviceCapabilitiesAtom);
  const [renderQuality] = useAtom(renderQualityAtom);
  const [cameraPosition, setCameraPosition] = useAtom(cameraPositionAtom);
  const [cameraTarget] = useAtom(cameraTargetAtom);
  const [animationState] = useAtom(animationStateAtom);

  // Device detection effect
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, [setDeviceType]);

  // If not in 3D mode, render children in 2D
  if (!is3DMode) {
    return (
      <div className={className}>
        <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{
          position: cameraPosition,
          fov: deviceType === "mobile" ? 85 : 75,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, renderQuality.pixelRatio]}
        shadows={renderQuality.shadows}
        gl={{
          antialias: renderQuality.antialiasing,
          alpha: true,
          powerPreference:
            deviceCapabilities.performanceScore >= 6
              ? "high-performance"
              : "default",
        }}
        className="bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100"
      >
        {/* Lighting Setup - Warm house lighting */}
        <ambientLight intensity={0.6} color="#fff8dc" />

        {/* Main ceiling light */}
        <pointLight
          position={[0, 12, 0]}
          intensity={0.8}
          color="#fff8dc"
          castShadow={renderQuality.shadows}
          shadow-mapSize-width={renderQuality.shadows ? 1024 : 512}
          shadow-mapSize-height={renderQuality.shadows ? 1024 : 512}
        />

        {/* Window lighting */}
        <directionalLight
          position={[25, 15, 0]}
          intensity={0.4}
          color="#ffffff"
          castShadow={renderQuality.shadows}
          shadow-mapSize-width={renderQuality.shadows ? 2048 : 1024}
          shadow-mapSize-height={renderQuality.shadows ? 2048 : 1024}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        {renderQuality.maxLights > 3 && (
          <>
            {/* Kitchen area light */}
            <pointLight position={[0, 8, 15]} intensity={0.4} color="#f0f8ff" />

            {/* Living room accent light */}
            <pointLight
              position={[-12, 6, -10]}
              intensity={0.3}
              color="#ffe4b5"
            />
          </>
        )}

        {/* House Environment */}
        <HouseEnvironment />

        {/* Environment */}
        <Environment preset="apartment" background={false} />

        {/* Optional Grid System - disabled for house environment */}

        {/* Camera Controls */}
        {enableOrbitControls && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={80}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI - Math.PI / 8}
            target={cameraTarget}
            onChange={(event) => {
              if (
                event?.target?.object?.position &&
                animationState === "idle"
              ) {
                const { x, y, z } = event.target.object.position;
                setCameraPosition([x, y, z]);
              }
            }}
            onStart={() => {
              // Optional: Set animation state when user starts interaction
            }}
            onEnd={() => {
              // Optional: Reset animation state when interaction ends
            }}
          />
        )}

        {/* Performance Stats */}
        {showStats && <Stats />}

        {/* Gesture System */}
        <GestureSystem3D
          enableKeyboardControls={deviceType === "desktop"}
          enableMouseControls={true}
          enableTouchControls={deviceType !== "desktop"}
        />

        {/* Scene Content */}
        <group>{children}</group>

        {/* Optional Fog - disabled for house environment */}
      </Canvas>

      {/* 3D Mode Toggle & Performance Info (for development/debugging) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 z-50 space-y-2">
          <button
            onClick={() => {
              // Toggle between force 3D and auto mode
              console.log("Current 3D mode:", is3DMode);
              console.log("Device capabilities:", deviceCapabilities);
              console.log("Render quality:", renderQuality);
            }}
            className="px-3 py-1 bg-black/20 text-white rounded-lg text-sm backdrop-blur block"
          >
            {is3DMode ? "3D" : "2D"} | {deviceType}
          </button>
          <div className="px-3 py-1 bg-black/20 text-white rounded-lg text-xs backdrop-blur">
            Performance: {deviceCapabilities.performanceScore}/10
            <br />
            Quality: {deviceCapabilities.recommendedQuality}
            <br />
            WebGL: {deviceCapabilities.hasWebGL ? "✓" : "✗"}
            <br />
            Hardware: {deviceCapabilities.hasHardwareAcceleration ? "✓" : "✗"}
          </div>
        </div>
      )}
    </div>
  );
}
