import type { AppProps } from "@/types";
import { useState, useEffect } from "react";

export default function Notepad({
  db,
}: AppProps<{
  note: {
    content: string;
  };
}>) {
  const [note, setNote] = useState("");

  // Load note from db on mount
  useEffect(() => {
    db.schema
      .createTable("note")
      .ifNotExists()
      .addColumn("content", "text")
      .execute()
      .then(async () => {
        await db
          .insertInto("note")
          .values([{ content: "Discover" }])
          .execute();
      });
  }, [db]);

  // Save note to db on change
  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    try {
      await db.updateTable("note").set({ content: value }).execute();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f6fa] to-[#e9ecef] flex items-center justify-center font-sans">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md min-w-[320px]">
        <h1 className="font-semibold text-2xl mb-5 tracking-tight text-gray-900 text-center">
          Notepad
        </h1>
        <textarea
          value={note}
          onChange={handleChange}
          rows={12}
          className="w-full text-base font-mono bg-[#f7f8fa] border border-gray-200 rounded-xl p-4 resize-vertical text-gray-900 outline-none shadow-sm transition-colors focus:border-blue-400"
          placeholder="Type your notes here..."
          autoFocus
        />
      </div>
    </div>
  );
}
