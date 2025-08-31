import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { spawn } from "child_process";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "build-apps",
      closeBundle() {
        const child = spawn(
          "npx",
          ["vite", "build", "--config", "vite.apps.config.ts"],
          { stdio: "inherit", shell: true }
        );
        child.on("close", (code) => {
          if (code !== 0) {
            console.error(`apps build failed with code ${code}`);
          }
        });
      },
    },
  ],
  build: {
    outDir: "output",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["sqlocal"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
