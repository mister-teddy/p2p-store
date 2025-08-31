import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { glob } from "glob";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "output-apps",
    assetsDir: "../assets",
    rollupOptions: {
      input: glob.sync("apps/*.tsx", { cwd: __dirname }),
      output: {
        entryFileNames: "[name].js",
        format: "esm",
      },
      preserveEntrySignatures: "strict",
      external: ["react", "react-dom"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
