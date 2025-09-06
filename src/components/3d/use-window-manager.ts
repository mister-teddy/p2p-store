import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { windowConfigsAtom, WINDOW_LAYOUTS, type WindowConfig, type WindowManagerActions } from '@/state/3d';

export const useWindowManager = (): WindowManagerActions => {
  const [windowConfigs, setWindowConfigs] = useAtom(windowConfigsAtom);

  return useMemo(() => ({
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
        const updated = { ...prev };
        delete updated[id];
        return updated;
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
      console.log('Repositioning windows...');
    },
  }), [windowConfigs, setWindowConfigs]);
};