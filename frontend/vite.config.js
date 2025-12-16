import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";

// https://vite.dev/config/
//
// SECURITY WARNING: This project uses client-side React ONLY (via @vitejs/plugin-react).
// Do NOT add React Server Components (RSC) to this project. RSC packages have critical
// vulnerabilities: CVE-2025-55182 (RCE), CVE-2025-55184 (DoS), CVE-2025-67779 (DoS),
// CVE-2025-55183 (Source code exposure). These affect react-server-dom-* packages.
// If RSC is ever needed, upgrade to React >=19.2.3 and verify patches are applied.
//
export default defineConfig({
  plugins: [
    react(),
    Pages({
      importMode: "async",
    }),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material",
      "axios",
      "@imgly/background-removal",
      "react-i18next",
      "i18next",
    ],
    exclude: ["@imgly/background-removal"],
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
