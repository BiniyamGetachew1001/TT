/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'slide-in': 'slidein 0.3s forwards ease-out',
        'slide-out': 'slideout 0.3s forwards ease-in',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
