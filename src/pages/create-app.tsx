import { useEffect, useState } from "react";
import StyledInput from "@/components/forms/input";
import { generateAppCode } from "@/libs/anthropic";
import { useAtom, useSetAtom } from "jotai";
import { generatedCodeState, promptState } from "@/state/app-ecosystem";
import { windowsStatesAtom } from "@/state/3d";
import Spinner from "@/components/spinner";

const CreateAppPage: React.FC = () => {
  const [prompt, setPrompt] = useAtom(promptState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedCode, setGeneratedCode] = useAtom(generatedCodeState);
  const setActiveWindows = useSetAtom(windowsStatesAtom);

  useEffect(() => {
    // Open the generated code window when there's generated code
    if (generatedCode) {
      setActiveWindows((prev) => {
        const createdAppWindow = prev.find((w) => w.title === "Create App");
        if (createdAppWindow) {
          // If the window already exists, just bring it to front
          createdAppWindow.biFoldContent = (
            <div dangerouslySetInnerHTML={{ __html: generatedCode }}></div>
          );
          return [...prev];
        }
        return prev;
      });
    }
  }, [generatedCode, setActiveWindows]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const code = await generateAppCode(prompt);
      setGeneratedCode(code);
    } catch (err) {
      setError((err as Error).message || "Failed to generate code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat area */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        {error ? (
          <div className="p-4 text-red-500 text-sm">{error}</div>
        ) : loading ? (
          <Spinner />
        ) : generatedCode ? (
          <pre className="p-4 self-stretch whitespace-pre-wrap bg-gray-900 text-gray-200 font-mono text-sm">
            {generatedCode}
          </pre>
        ) : null}
      </div>

      {/* Prompt input bar */}
      <div className="w-full px-4 py-3 bg-[#e3e3e3] border-t border-gray-200 flex items-center gap-2 flex-none">
        <StyledInput
          as="input"
          className="flex-1 h-10 px-3 rounded-xl border border-gray-300 bg-white text-base focus:border-blue-400 transition"
          placeholder="Build anything"
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrompt(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && !loading) handleGenerate();
          }}
          disabled={loading}
          type="text"
          autoComplete="off"
        />
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
          onClick={handleGenerate}
          disabled={loading}
          aria-label="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CreateAppPage;
