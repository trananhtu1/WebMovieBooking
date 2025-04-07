/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lightBg: '#fdfdfd',
        lightText: '#333333',
        lightAccent: '#ff5722',
        darkBg: '#121212',
        darkText: '#eeeeee',
        darkAccent: '#ff9800',
      },
    },
    
  },
  plugins: [],
}

