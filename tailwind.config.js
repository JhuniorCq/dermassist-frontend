/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#4393C5",
        "primary-hover": "#377aa5",
        "primary-hard": "#1F5D84",
        "primary-hard-hover": "#1a4c6e",
        "primary-soft": "#89C5EA",
        "primary-soft-hover": "#a5d4f1",
      },
    },
  },
  plugins: [],
};
