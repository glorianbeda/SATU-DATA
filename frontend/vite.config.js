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
      importMode: "sync",
    }),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    // Pre-transform commonly used files to avoid lag on first request
    warmup: {
      clientFiles: [
        "./src/main.jsx",
        "./src/App.jsx",
        "./src/components/Sidebar.jsx",
        "./src/index.css",
      ],
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
      "framer-motion",
      "react-calendar-heatmap",
      "react-tooltip",
      "react-apexcharts",
      "jspdf",
      "jspdf-autotable",
      "xlsx",
      "jsbarcode",
      "pdfjs-dist",
      "react-pdf",
    ],
    exclude: ["@imgly/background-removal"],
  },
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
