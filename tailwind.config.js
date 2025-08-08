/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx", 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", 
        secondary: "#FBBF24",
        accent: '#AB8BFF', 
        light: {
          100: '#d6c6ff',
          200: 'Ab8BFF',
          300: '#8a6eff',
        },
        dark: {
          100: '#4b2c6f',
          200: '#3a1f5c',
          300: '#2a1449',
        },
      },
    }
  },
  plugins: [],
}