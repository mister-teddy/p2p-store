import { useEffect, useState } from "react";
import { generateAppCode } from "@/libs/anthropic";
import StyledInput from "@/components/forms/input";

const CreateAppPage: React.FC = () => {
  const [description, setDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Trigger code generation on mount (user enters app)
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const code = await generateAppCode(
          "Generate a starter app code for a new user."
        );
        setGeneratedCode(code);
      } catch (err) {
        setError((err as Error).message || "Failed to generate code.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Trigger code generation on button click
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const code = await generateAppCode(
        description || "Generate a starter app code for a new user."
      );
      setGeneratedCode(code);
    } catch (err) {
      setError((err as Error).message || "Failed to generate code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Create App</h1>

      <div className="flex-1 flex flex-col space-y-4">
        {/* Description Input */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your app:
          </label>
          <StyledInput
            as="textarea"
            className="w-full h-32 p-3 rounded-lg border border-gray-300 resize-none"
            placeholder="Describe the app you want to create..."
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
          />
        </div>

        {/* Generate Button */}
        <button
          className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }
              text-white
            `}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "✨ Vibe Code It"}
        </button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Generated Code */}
        {generatedCode && (
          <div className="flex-1 overflow-hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated Code:
            </label>
            <pre className="w-full h-full bg-gray-900 text-green-400 p-3 rounded-lg overflow-auto text-xs font-mono">
              {generatedCode}
            </pre>
          </div>
        )}

        {/* Loading State */}
        {loading && !generatedCode && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Generating your app...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAppPage;
