import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Cache static images for 2 months (5184000 seconds), must revalidate after expiry
      "Cache-Control": "public, max-age=5184000, must-revalidate",
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Prevent duplicate React copies (common cause of "useState is null" / invalid hook call)
    dedupe: ["react", "react-dom"],
  },
}));
