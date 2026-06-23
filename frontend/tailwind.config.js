/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#D6A93A', // Primary Gold
          600: '#B8860B', // Darker Gold
        },
        ivory: '#FAF8F3', // Main background
        dark: '#1F1A17', // Text primary
        grayText: '#6B6B6B', // Text secondary
        borderLight: '#E8E2D8', // Light border
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
