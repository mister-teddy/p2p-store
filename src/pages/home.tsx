import { Suspense } from "react";
import AppList from "@/components/app-list";
import Sidebar from "@/components/sidebar";
import Spinner from "@/components/spinner";

const HomePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Sidebar />
      <Suspense fallback={<Spinner />}>
        <AppList />
      </Suspense>
    </div>
  );
};

export default HomePage;
