import React from "react";
import { useAtom } from "jotai";
import { dummyAppAtom } from "@/state";

const DummyAppList: React.FC = () => {
  const [apps] = useAtom(dummyAppAtom);
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">dummy-app-list</h2>
      <ul className="space-y-2">
        {apps.map((app) => (
          <li key={app.id} className="p-2 border rounded flex flex-col">
            <span className="font-semibold text-blue-600">{app.name}</span>
            <span className="text-gray-600 text-sm">{app.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DummyAppList;
