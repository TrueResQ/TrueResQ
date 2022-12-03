/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#599cb3",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
