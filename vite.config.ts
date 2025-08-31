import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { spawn } from "child_process";
import { rename } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "build-apps",
      async closeBundle() {
        const child = spawn(
          "npx",
          ["vite", "build", "--config", "vite.apps.config.ts"],
          { stdio: "inherit", shell: true }
        );
        child.on("close", async (code) => {
          if (code !== 0) {
            console.error(`apps build failed with code ${code}`);
            return;
          }
          // Move output-apps to output/apps
          const src = join(process.cwd(), "output-apps");
          const dest = join(process.cwd(), "output", "apps");
          if (existsSync(src)) {
            try {
              await rename(src, dest);
              console.log("Moved output-apps to output/apps");
            } catch (err) {
              console.error("Failed to move output-apps:", err);
            }
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
