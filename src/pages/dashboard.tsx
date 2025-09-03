import { Suspense } from "react";
import AppList from "@/components/app-list";
import Sidebar from "@/components/sidebar";
import Spinner from "@/components/spinner";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Sidebar />
      <Suspense fallback={<Spinner />}>
        <AppList installedOnly />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
