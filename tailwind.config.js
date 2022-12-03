/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#599cb3",
        background: "#000000",
        text: "#ffffff",
        "background-secondary": "#303030",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
