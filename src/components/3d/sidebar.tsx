import { useState } from "react";
import CONFIG from "@/config";
import Profile from "../profile";
import StyledInput from "../forms/input";
import Window3D from "./window";
import { windowsStatesAtom } from "@/state/3d";
import { useSetAtom } from "jotai";

export default function Sidebar3D() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const setWindows = useSetAtom(windowsStatesAtom);

  return (
    <Window3D title="Navigation" icon="🧭">
      <div className="flex flex-col h-full">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <StyledInput
            name="search"
            type="text"
            placeholder="Search apps..."
            className={`
              w-full px-4 py-2 text-sm rounded-full border
              transition-all duration-200
              ${
                isSearchFocused
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }
            `}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {CONFIG.SIDEBAR_ITEMS.map((item) => (
              <div key={item.path} className="relative">
                <button
                  onClick={async () => {
                    setWindows((prev) => [
                      ...prev,
                      {
                        title: item.title,
                        icon: item.icon,
                        component: item.component,
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

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <Profile />
        </div>
      </div>
    </Window3D>
  );
}
