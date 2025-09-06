import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { 
  windowConfigsAtom
} from '@/state/3d';
import Window3D from './window-3d';

interface WindowManager3DProps {
  children?: React.ReactNode;
}

interface WindowManagerActions {
  createWindow: (id: string, options?: Partial<WindowConfig>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  repositionWindows: () => void;
}

interface WindowConfig {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  isMinimized: boolean;
  isMaximized: boolean;
  isVisible: boolean;
  zIndex: number;
  width: number;
  height: number;
  title: string;
  content?: React.ReactNode;
}

// Window layout configurations
const WINDOW_LAYOUTS = {
  grid: {
    positions: [
      [0, 2, 0], [4, 2, 0], [-4, 2, 0],
      [0, -2, 0], [4, -2, 0], [-4, -2, 0],
    ] as Array<[number, number, number]>,
    spacing: 4,
  },
  minimized: {
    positions: [
      [-10, -4, 1], [-7, -4, 1], [-4, -4, 1], [-1, -4, 1],
      [2, -4, 1], [5, -4, 1], [8, -4, 1], [11, -4, 1],
    ] as Array<[number, number, number]>,
    scale: [0.3, 0.3, 0.3] as [number, number, number],
  },
};

export default function WindowManager3D({ children }: WindowManager3DProps) {
  const [windowConfigs, setWindowConfigs] = useAtom(windowConfigsAtom);

  const windows = useMemo(() => Object.values(windowConfigs), [windowConfigs]);

  // Window management actions
  const windowActions: WindowManagerActions = useMemo(() => ({
    createWindow: (id: string, options = {}) => {
      const windowCount = Object.keys(windowConfigs).length;
      const defaultPosition = WINDOW_LAYOUTS.grid.positions[windowCount % WINDOW_LAYOUTS.grid.positions.length];
      
      const newWindow: WindowConfig = {
        id,
        position: defaultPosition,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        isMinimized: false,
        isMaximized: false,
        isVisible: true,
        zIndex: windowCount + 1,
        width: 4,
        height: 6,
        title: id,
        ...options,
      };

      setWindowConfigs((prev) => ({
        ...prev,
        [id]: newWindow,
      }));
    },

    closeWindow: (id: string) => {
      setWindowConfigs((prev) => {
        const newConfigs = { ...prev };
        delete newConfigs[id];
        return newConfigs;
      });
    },

    minimizeWindow: (id: string) => {
      setWindowConfigs((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: true,
          position: WINDOW_LAYOUTS.minimized.positions[
            Object.keys(prev).indexOf(id) % WINDOW_LAYOUTS.minimized.positions.length
          ],
        },
      }));
    },

    maximizeWindow: (id: string) => {
      setWindowConfigs((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: false,
          isMaximized: true,
          position: [0, 0, 2],
          scale: [1.5, 1.5, 1.5],
          zIndex: Math.max(...Object.values(prev).map(w => w.zIndex)) + 1,
        },
      }));
    },

    focusWindow: (id: string) => {
      const maxZ = Math.max(...Object.values(windowConfigs).map(w => w.zIndex));
      
      setWindowConfigs((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          zIndex: maxZ + 1,
        },
      }));
    },

    repositionWindows: () => {
      console.log('Repositioning windows...'); // Implementation placeholder
    },
  }), [windowConfigs, setWindowConfigs]);

  // Three-finger swipe gesture detection (simplified)
  const handleGesture = (event: React.TouchEvent) => {
    // Convert pointer event to touch-like interface for gesture detection
    if (event.touches.length === 3) {
      // Minimize all windows
      setWindowConfigs((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          updated[id] = { ...updated[id], isMinimized: true };
        });
        return updated;
      });
    }
  };

  return (
    <group onPointerDown={handleGesture}>
      {windows.map((window) => (
        <Window3D
          key={window.id}
          config={{
            id: window.id,
            position: window.position,
            rotation: window.rotation,
            scale: window.scale,
            isMinimized: window.isMinimized,
            isMaximized: window.isMaximized,
            isVisible: window.isVisible,
            zIndex: window.zIndex,
          }}
          width={window.width}
          height={window.height}
          onClose={() => windowActions.closeWindow(window.id)}
          onMinimize={() => windowActions.minimizeWindow(window.id)}
          onMaximize={() => windowActions.maximizeWindow(window.id)}
        >
          {window.content || (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{window.title}</h3>
                <p className="text-sm">Window content goes here</p>
              </div>
            </div>
          )}
        </Window3D>
      ))}
      
      {/* Additional children (like FrameSystem3D, AppGrid3D, etc.) */}
      {children}

      {/* Development Controls */}
      {process.env.NODE_ENV === 'development' && (
        <group position={[0, -6, 0]}>
          <mesh onClick={() => windowActions.createWindow(`window-${Date.now()}`)}>
            <boxGeometry args={[1, 0.5, 0.1]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </group>
      )}
    </group>
  );
}

