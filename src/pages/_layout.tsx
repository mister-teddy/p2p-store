import { Suspense } from "react";
import { useAtomValue } from "jotai";
import { responsiveIs3DModeAtom } from "@/state/3d";
import LayoutManager3D from "@/components/3d/layout-manager-3d";
import WindowManager3D from "@/components/3d/window-manager-3d";
import FrameSystem3D from "@/components/3d/frame-system-3d";
import Sidebar3D from "@/components/3d/sidebar-3d";
import Spinner from "@/components/spinner";
// 2D Layout Components
import Sidebar from "@/components/sidebar";
import { Outlet } from "react-router-dom";

// Layout wrapper that contains 3D/2D layout logic - used by individual pages
export function RootLayout() {
  const is3DMode = useAtomValue(responsiveIs3DModeAtom);

  if (is3DMode) {
    return (
      <Suspense fallback={<Spinner />}>
        <LayoutManager3D
          showStats={process.env.NODE_ENV === "development"}
          className="w-full h-screen"
        >
          <WindowManager3D>
            {/* Frame System - Persistent UI elements */}
            <FrameSystem3D showFrames={true} />

            {/* Sidebar Navigation - now has access to Router context */}
            <Sidebar3D position={[-8, 0, 2]} />

            {/* Page content goes here */}
            <Outlet />
          </WindowManager3D>
        </LayoutManager3D>
      </Suspense>
    );
  }

  // 2D fallback for mobile or when 3D is disabled
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex-1">
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
