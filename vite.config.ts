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
          if (pkg("react") || pkg("react-dom") || pkg("react-router") || pkg("react-router-dom") || pkg("scheduler"))
            return "vendor-react";
          if (pkg("motion") || pkg("motion-dom") || pkg("motion-utils") || pkg("framer-motion"))
            return "vendor-motion";
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (pkg("lucide-react")) return "vendor-icons";
          // recharts / d3 are left to automatic per-route splitting: they are
          // only reached from lazy dashboard + tool routes.
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
