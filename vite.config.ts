import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split long-lived vendor code out of the app chunk so repeat visits
        // (and route changes) hit cache instead of re-downloading React etc.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          const pkg = (name: string) =>
            new RegExp(`[\\\\/]node_modules[\\\\/]${name}[\\\\/]`).test(id);
          // Only pin the two libraries every route needs. Anything else
          // (radix, supabase, recharts, jspdf…) is left to automatic
          // per-route splitting so a lazy dashboard dependency never lands
          // on the marketing site's critical path.
          if (pkg("react") || pkg("react-dom") || pkg("react-router") || pkg("react-router-dom") || pkg("scheduler"))
            return "vendor-react";
          if (pkg("motion") || pkg("motion-dom") || pkg("motion-utils") || pkg("framer-motion"))
            return "vendor-motion";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
