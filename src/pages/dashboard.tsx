import { Suspense } from "react";
import { useAtomValue } from "jotai";
import { responsiveIs3DModeAtom } from "@/state/3d";
import AppGrid3D from "@/components/3d/app-grid-3d";
// Fallback 2D components
import AppList from "@/components/app-list";

const DashboardPage: React.FC = () => {
  const is3DMode = useAtomValue(responsiveIs3DModeAtom);

  if (!is3DMode) {
    return <AppList installedOnly />;
  }

  return (
    <Suspense fallback={null}>
      {/* Main App Grid */}
      <AppGrid3D
        installedOnly={true}
        columns={4}
        spacing={4}
        cardWidth={3}
        cardHeight={4}
      />
    </Suspense>
  );
};

export default DashboardPage;
