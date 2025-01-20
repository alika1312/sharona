/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        palette: {
          lightPink: "#d8b7ac",
          beige: "#e7e2d4",
          brown: "#957567",
          softPeach: "#e4cbc0",
          darkBrown: "#3a2c27",
          brite: "#fdf6ed",
          purpul: "#e6e0f4",
        },
      },
      // Add zoom utility
      spacing: {
        100: "100%",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".zoom-100": {
          zoom: "100%",
        },
        ".zoom-80": {
          zoom: "80%",
        },
      });
    },
  ],
};
