/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        rich: {
          black: "#0D0F1B",
        },
        dark: {
          green: "#032221",
        },
        bangladesh: {
          green: "#02624C",
        },
        mountain: {
          meadow: "#2CC5A5",
        },
        caribbean: {
          green: "#00DF81",
        },
        antiflash: {
          white: "#F1F7F5",
        },
        pine: "#063B28",
        basil: "#08453A",
        forest: "#095644",
        frog: "#178D69",
        mint: "#2FAB6C",
        stone: "#707D7D",
        pistachio: "#ACDCC4",
      },
    },
  },
  plugins: [],
};
