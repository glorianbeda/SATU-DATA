/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Blue 600
          light: "#3b82f6", // Blue 500
          dark: "#1d4ed8", // Blue 700
        },
      },
    },
  },
  plugins: [],
};
