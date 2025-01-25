/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "Akira-Expanded": ["Akira-Expanded", "sans-serif"],
        "Helvetica-Neue-Heavy": ["Helvetica-Neue-Heavy", "sans-serif"],
        Manrope: ["Manrope", "sans-serif"],
      },
      colors: {
        primary: "#02296D",
        secondary: "#0350D3",
        custom_yellow: "#FFCC1D",
        custom_black: "#1E1E1E",
        custom_lightblue: "rgba(241, 250, 255, 0.50)",
        custom_skyblue: "#BFDDF6",
      },
    },
  },
};
