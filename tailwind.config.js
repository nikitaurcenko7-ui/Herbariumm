/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Arial', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 35px rgba(138, 222, 134, 0.16)'
      }
    }
  },
  plugins: []
}
