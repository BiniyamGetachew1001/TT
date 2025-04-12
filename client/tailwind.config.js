/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#B8860B', // Golden color for primary elements
          '600': '#9A7209',
        },
        'background': {
          'dark': '#1C1614', // Dark brown background
          'card': 'rgba(44, 31, 27, 0.95)', // Card background with opacity
        },
        'surface': {
          'light': 'rgba(255, 255, 255, 0.1)', // Light surface for cards
          'dark': 'rgba(0, 0, 0, 0.2)', // Dark surface for cards
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top left, rgba(184, 134, 11, 0.1) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}

