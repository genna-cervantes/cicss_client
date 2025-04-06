/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-text-yellow': 'linear-gradient(to bottom, #FFEC99 0%, #FFEFA5 17%, #FFDE61 67%, #FFCC1D 82%, #FFBA21 100%)'
      },
      fontFamily: {
        "Akira-Expanded": ["Akira-Expanded", "sans-serif"],
        "Helvetica-Neue-Heavy": ["HelveticaNueueHeavy", "sans-serif"],
        Manrope: ["Manrope", "sans-serif"],
        CyGrotesk: ["CyGrotesk", "sans-serif"]
      },
      colors: {
        primary: "#022666",
        secondary: "#0350D3",
        custom_yellow: "#FFCC1D",
        custom_black: "#1E1E1E",
        custom_lightblue: "rgba(241, 250, 255, 0.50)",
        custom_skyblue: "#BFDDF6",
      },
    },
  },
  plugins: [],
}

