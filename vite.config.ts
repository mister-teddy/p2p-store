import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile(), tailwindcss()],
  build: {
    outDir: "output",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
