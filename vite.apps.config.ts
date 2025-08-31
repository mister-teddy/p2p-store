import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { glob } from "glob";

const entries = {};
const files = glob.sync("apps/*.tsx", { cwd: __dirname });
for (const file of files) {
  const name = file.replace(/\.tsx$/, "");
  entries[name] = resolve(__dirname, file);
}

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "output",
    assetsDir: "../assets",
    rollupOptions: {
      input: entries,
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "../assets/[name]-[hash].js",
        assetFileNames: "../assets/[name]-[hash][extname]",
        format: "es",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
