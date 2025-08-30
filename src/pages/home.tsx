import React from "react";
import DummyAppList from "@/components/app-list";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">home-page</h1>
      <DummyAppList />
    </div>
  );
};

export default HomePage;
