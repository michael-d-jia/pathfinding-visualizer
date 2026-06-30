import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works on GitHub Pages project sites
// (https://<user>.github.io/<repo>/) without hardcoding the repo name.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    // Honor a port assigned via the PORT env var (used by the preview harness);
    // fall back to Vite's default otherwise.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
});
