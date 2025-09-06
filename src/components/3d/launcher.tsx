import CONFIG from "@/config";
import Profile from "../profile";
import Window3D from "./window";
import { windowsStatesAtom } from "@/state/3d";
import { useSetAtom } from "jotai";

export default function Launcher3D() {
  const setWindows = useSetAtom(windowsStatesAtom);

  return (
    <Window3D size={[8, 10]}>
      {/* Profile Section */}
      <Profile />
      {/* Navigation Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          {CONFIG.SIDEBAR_ITEMS.map((item) => (
            <div key={item.path} className="relative">
              <button
                onClick={async () => {
                  const randomX = (Math.random() - 0.5) * 20; // X: -10 to 10
                  const randomY = Math.random() * 5 + 2;

                  setWindows((prev) => [
                    ...prev,
                    {
                      title: item.title,
                      icon: item.icon,
                      component: item.component,
                      position: [randomX, randomY, prev.length + 1],
                    },
                  ]);
                }}
                className={`
                    flex flex-col items-center justify-center
                    p-4 rounded-lg transition-all duration-200
                    aspect-square w-full
                    ${
                      location.pathname === item.path
                        ? "text-blue-600 bg-blue-50 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }
                  `}
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">
                  {item.title}
                </span>
              </button>
            </div>
          ))}
        </div>
      </nav>
    </Window3D>
  );
}
