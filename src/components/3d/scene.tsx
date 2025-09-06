import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid, Stats } from "@react-three/drei";
import { Suspense, type ReactNode, useRef, useEffect } from "react";
import { PerspectiveCamera } from "three";
import { useAtom } from "jotai";
import { cameraPositionAtom, enabled3DModeAtom } from "@/state/3d";

interface SceneProps {
  children: ReactNode;
  showGrid?: boolean;
  showStats?: boolean;
}

export default function Scene({
  children,
  showGrid = true,
  showStats = false,
}: SceneProps) {
  const [cameraPosition, setCameraPosition] = useAtom(cameraPositionAtom);
  const [is3DMode] = useAtom(enabled3DModeAtom);
  const cameraRef = useRef<PerspectiveCamera>(null);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(...cameraPosition);
    }
  }, [cameraPosition]);

  if (!is3DMode) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: cameraPosition,
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        shadows
        className="bg-gradient-to-b from-slate-50 to-slate-100"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Environment */}
          <Environment preset="city" />

          {/* Grid */}
          {showGrid && (
            <Grid
              position={[0, -2, 0]}
              args={[100, 100]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#6b7280"
              sectionSize={10}
              sectionThickness={1}
              sectionColor="#374151"
              fadeDistance={50}
              fadeStrength={1}
              infiniteGrid
            />
          )}

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
            target={[0, 0, 0]}
            onChange={(event) => {
              if (event?.target?.object?.position) {
                const { x, y, z } = event.target.object.position;
                setCameraPosition([x, y, z]);
              }
            }}
          />

          {/* Debug Stats */}
          {showStats && <Stats />}

          {/* Scene Content */}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
