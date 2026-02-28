/** @type {import('tailwindcss').Config} */
const { Colors } = require('./constants/Colors');

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: Colors.primary[50],
          100: Colors.primary[100],
          200: Colors.primary[200],
          300: Colors.primary[300],
          400: Colors.primary[400],
          500: Colors.primary[500],
          600: Colors.primary[600],
          700: Colors.primary[700],
          800: Colors.primary[800],
          900: Colors.primary[900],
        },
      },
    },
  },
  plugins: [],
}
