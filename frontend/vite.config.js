import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";

// https://vite.dev/config/
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
