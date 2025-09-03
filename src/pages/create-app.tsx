import Sidebar from "@/components/sidebar";
import StyledInput from "@/components/forms/input";

const CreateAppPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Sidebar />
      <main className="flex-1 px-[5vw] py-8 min-w-0 box-border overflow-y-auto h-full">
        <h1 className="text-3xl font-bold mb-8">Create App</h1>
        <div className="flex flex-col items-center">
          <StyledInput
            as="textarea"
            className="h-64 p-4 rounded-lg"
            placeholder="Describe the app you want to create..."
          />
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full">
            Vibe Code It
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreateAppPage;
