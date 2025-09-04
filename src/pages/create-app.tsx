import Sidebar from "@/components/sidebar";
import StyledInput from "@/components/forms/input";
import { useEffect, useState } from "react";
import { generateAppCode } from "@/libs/anthropic";

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
    <div className="flex items-center justify-center w-full h-full">
      <Sidebar />
      <main className="flex-1 px-[5vw] py-8 min-w-0 box-border overflow-y-auto h-full">
        <h1 className="text-3xl font-bold mb-8">Create App</h1>
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
          <StyledInput
            as="textarea"
            className="h-64 p-4 rounded-lg"
            placeholder="Describe the app you want to create..."
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
          />
          <button
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Vibe Code It"}
          </button>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {generatedCode && (
            <pre className="mt-8 w-full bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {generatedCode}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateAppPage;
