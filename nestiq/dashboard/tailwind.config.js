/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060e17',
          900: '#0D1B2A',
          800: '#112030',
          700: '#1a3a5c',
          600: '#1e4976',
        },
        gold: {
          300: '#e2c98a',
          400: '#D4B97E',
          500: '#C8A96E',
          600: '#b8953a',
          700: '#9a7a2a',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
