/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./utils/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#646cff",
          accent: "#61dafb",
          muted: "#888888",
          background: "#ffffff",
          foreground: "#000000",
        },
      },
    },
    plugins: [],
  };
  