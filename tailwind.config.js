/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,jsx}', './app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111110',
        paper: '#f0ece4',
        gold: '#c6a77c',
        muted: '#a09d96'
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
}
