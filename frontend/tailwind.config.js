/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
          outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
   themes: ["light"],
  },
};
