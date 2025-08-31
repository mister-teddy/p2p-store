import { categoriesAtom, selectedCategoryIndexAtom } from "@/state";
import { useAtom, useAtomValue } from "jotai";
import Profile from "./profile";
import { useMemo } from "react";
import { unwrap } from "jotai/utils";

export default function Sidebar() {
  const categories = useAtomValue(
    useMemo(() => unwrap(categoriesAtom, (prev) => prev ?? []), [])
  );
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useAtom(
    selectedCategoryIndexAtom
  );

  return (
    <aside className="flex flex-col sticky top-0 h-full z-10 p-6 pr-0">
      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-[28px] shadow-[0_4px_24px_0_rgba(0,0,0,0.06)] w-72 border border-gray-100">
        <div className="p-4">
          <input
            name="search"
            type="text"
            placeholder="Search"
            className="w-full px-5 py-2 rounded-full border border-gray-200 bg-bg focus:outline-none focus:ring-1 focus:ring-blue-300 placeholder-gray-500 transition-all"
          />
        </div>
        <nav className="flex-1 overflow-y-auto no-scrollbar">
          <ul className="space-y-0.5">
            {categories.map((category, i) => (
              <li
                onClick={() => setSelectedCategoryIndex(i)}
                key={category.label}
                className={`flex items-center px-5 py-2 cursor-pointer transition-colors select-none font-normal tracking-tight ${
                  selectedCategoryIndex === i
                    ? "text-blue-600 bg-gray-100 font-medium"
                    : "text-gray-700 hover:bg-bg"
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.label}
              </li>
            ))}
          </ul>
        </nav>

        <Profile />
      </div>
    </aside>
  );
}
