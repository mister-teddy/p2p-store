import React from "react";
import { useAtom } from "jotai";
import { appAtom } from "@/state";

const AppList: React.FC = () => {
  const [apps] = useAtom(appAtom);
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Discover Apps</h2>
      <ul className="space-y-6">
        {apps.map((app) => (
          <li key={app.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              {app.name.charAt(0)}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-gray-900">{app.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{app.description}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-sm">★★★★★</span>
                <span className="text-gray-500 text-xs ml-2">(1.2K ratings)</span>
              </div>
            </div>
            <button className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">
              GET
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppList;