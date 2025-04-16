/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          geist: "var(--font-geist-sans)",
          press: "var(--font-press-start)",
        },
      },
    },
    plugins: [],
  };
  