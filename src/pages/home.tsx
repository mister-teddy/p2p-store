import { Suspense } from "react";
import AppList from "@/components/app-list";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Suspense fallback={<div>Loading apps...</div>}>
        <AppList />
      </Suspense>
    </div>
  );
};

export default HomePage;