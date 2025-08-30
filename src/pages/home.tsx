import { Suspense } from "react";
import AppList from "@/components/app-list";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">ノート</h1>
      <Suspense fallback={<div>Loading apps...</div>}>
        <AppList />
      </Suspense>
    </div>
  );
};

export default HomePage;