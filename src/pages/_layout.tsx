import { Suspense } from "react";
import { useAtomValue } from "jotai";
import { adaptiveIs3DModeAtom } from "@/state/3d";
import LayoutManager3D from "@/components/3d/layout-manager";
import Spinner from "@/components/spinner";
// 2D Layout Components
import Sidebar from "@/components/sidebar";
import { Outlet } from "react-router-dom";

// Layout wrapper that contains 3D/2D layout logic - used by individual pages
export function RootLayout() {
  const is3DMode = useAtomValue(adaptiveIs3DModeAtom);

  if (is3DMode) {
    return (
      <Suspense fallback={<Spinner />}>
        <LayoutManager3D />
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
