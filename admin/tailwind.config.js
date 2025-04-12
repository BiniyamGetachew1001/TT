/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-brown': '#2d1e14',
        'medium-brown': '#4a2e1c',
        'light-brown': '#7a4528',
        'gold': '#c9a52c',
      },
    },
  },
  plugins: [],
}
