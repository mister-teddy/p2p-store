import { appsAtom, selectedCategoryAtom } from "@/state";
import { useAtomValue } from "jotai";
import FormatMoney from "./format/money";
import { useMemo } from "react";
import Spinner from "./spinner";

export default function AppList() {
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const apps = useAtomValue(appsAtom);

  // Split apps into 3 chunks, memoized
  const appChunks = useMemo(() => {
    const chunkSize = Math.ceil(apps.length / 3);
    return [
      apps.slice(0, chunkSize),
      apps.slice(chunkSize, chunkSize * 2),
      apps.slice(chunkSize * 2),
    ];
  }, [apps]);

  if (!selectedCategory) {
    return <Spinner />;
  }

  return (
    <main className="flex-1 px-[5vw] py-8 min-w-0 box-border overflow-y-auto h-full">
      <h1 className="text-3xl font-bold mb-8">{selectedCategory.label}</h1>
      <section className="mb-10 h-full">
        <h2 className="text-xl font-semibold mb-5">
          Apps and Games We Love Right Now
        </h2>
        <div className="w-full flex flex-col lg:flex-row lg:gap-10">
          {appChunks.map((chunk, i) => (
            <div
              key={i}
              className="w-full lg:w-1/3 flex flex-col border-b border-gray-200 lg:border-none last:border-none"
            >
              {chunk.map((app) => (
                <div
                  key={app.id}
                  className={`flex items-center py-6 px-2 min-w-[320px] max-w-full app-list-item border-b border-gray-200 last:border-none`}
                >
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg mr-6 text-4xl">
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-lg">{app.name}</div>
                      <button
                        type="button"
                        className="text-blue-600 font-bold text-sm ml-4 bg-bg rounded-full px-4 py-1"
                      >
                        {app.price ? <FormatMoney amount={app.price} /> : "Get"}
                      </button>
                    </div>
                    <div className="text-gray-500 text-sm mb-2">
                      {app.description}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="mr-2">
                        Version: {app.version || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
