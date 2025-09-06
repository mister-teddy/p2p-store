import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 3D Mode State
export const enabled3DModeAtom = atomWithStorage("is3DMode", true);

// Camera State
export const cameraPositionAtom = atom<[number, number, number]>([0, 5, 15]);
export const cameraTargetAtom = atom<[number, number, number]>([0, 0, 0]);

// Layout State
export interface WindowConfig {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  isMinimized: boolean;
  isMaximized: boolean;
  isVisible: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  title?: string;
  content?: React.ReactNode;
}

export const windowConfigsAtom = atom<Record<string, WindowConfig>>({});

// Window Layout Presets
export const WINDOW_LAYOUTS = {
  grid: {
    positions: [
      [0, 0, 0] as [number, number, number],
      [5, 0, 0] as [number, number, number],
      [-5, 0, 0] as [number, number, number],
      [0, 3, 0] as [number, number, number],
      [5, 3, 0] as [number, number, number],
      [-5, 3, 0] as [number, number, number],
    ],
  },
  minimized: {
    positions: [
      [-8, -5, 0] as [number, number, number],
      [-6, -5, 0] as [number, number, number],
      [-4, -5, 0] as [number, number, number],
      [-2, -5, 0] as [number, number, number],
      [0, -5, 0] as [number, number, number],
      [2, -5, 0] as [number, number, number],
    ],
  },
};

// Window Manager Actions Interface
export interface WindowManagerActions {
  createWindow: (id: string, options?: Partial<WindowConfig>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  repositionWindows: () => void;
}

// Responsive State
export const deviceTypeAtom = atom<"desktop" | "tablet" | "mobile">("desktop");

// Performance capability detection
export const deviceCapabilitiesAtom = atom((get) => {
  const deviceType = get(deviceTypeAtom);

  // Detect WebGL support
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch {
      return false;
    }
  })();

  // Detect hardware acceleration
  const hasHardwareAcceleration = (() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      if (!gl) return false;

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : "";

      // Check for software rendering indicators
      return !renderer.toLowerCase().includes("software");
    } catch {
      return false;
    }
  })();

  // Performance scoring based on device type and capabilities
  const performanceScore = (() => {
    let score = 0;

    if (deviceType === "desktop") score += 3;
    else if (deviceType === "tablet") score += 2;
    else score += 1; // mobile

    if (hasWebGL) score += 2;
    if (hasHardwareAcceleration) score += 2;

    // Check for high memory
    interface NavigatorWithDeviceMemory extends Navigator {
      deviceMemory?: number;
    }
    const nav = navigator as NavigatorWithDeviceMemory;
    if (nav.deviceMemory && nav.deviceMemory >= 4) score += 1;

    // Check for high CPU count
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4)
      score += 1;

    return score;
  })();

  return {
    deviceType,
    hasWebGL,
    hasHardwareAcceleration,
    performanceScore,
    canRun3D: performanceScore >= 5, // Minimum score for 3D
    recommendedQuality:
      performanceScore >= 7 ? "high" : performanceScore >= 5 ? "medium" : "low",
  };
});

// Auto-detect device type based on screen size and user agent
export const responsiveIs3DModeAtom = atom((get) => {
  const userRequested3D = get(enabled3DModeAtom);
  const capabilities = get(deviceCapabilitiesAtom);

  // Force 2D mode if device can't handle 3D
  if (!capabilities.canRun3D) return false;

  return userRequested3D;
});

// Quality settings based on device capabilities
export const renderQualityAtom = atom((get) => {
  const capabilities = get(deviceCapabilitiesAtom);
  const is3D = get(responsiveIs3DModeAtom);

  if (!is3D) {
    return {
      shadows: false,
      antialiasing: false,
      pixelRatio: 1,
      maxLights: 2,
      particleCount: 0,
    };
  }

  switch (capabilities.recommendedQuality) {
    case "high":
      return {
        shadows: true,
        antialiasing: true,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        maxLights: 8,
        particleCount: 100,
      };
    case "medium":
      return {
        shadows: true,
        antialiasing: false,
        pixelRatio: 1,
        maxLights: 4,
        particleCount: 50,
      };
    case "low":
    default:
      return {
        shadows: false,
        antialiasing: false,
        pixelRatio: 1,
        maxLights: 2,
        particleCount: 25,
      };
  }
});

// Frame System State
export interface FrameConfig {
  id: string;
  title: string;
  position: [number, number, number];
  size: [number, number];
  isVisible: boolean;
  component: React.ComponentType;
}

export const framesConfigAtom = atom<Record<string, FrameConfig>>({
  calendar: {
    id: "calendar",
    title: "Calendar",
    position: [-12, 2, 0],
    size: [3, 4],
    isVisible: true,
    component: () => null, // Will be replaced with actual component
  },
  todo: {
    id: "todo",
    title: "To-Do",
    position: [-12, -2, 0],
    size: [3, 4],
    isVisible: true,
    component: () => null,
  },
  weather: {
    id: "weather",
    title: "Weather",
    position: [-12, 6, 0],
    size: [3, 2],
    isVisible: true,
    component: () => null,
  },
});

// Animation State
export const animationStateAtom = atom<"idle" | "transitioning" | "zooming">(
  "idle"
);
