/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mila-inspired aesthetic: White (#FFFFFF), Sunset Orange (#FF5841), Red-Violet (#C53678)
        sunset: {
          50: '#fff5f3',
          100: '#ffe8e4',
          200: '#ffd5ce',
          300: '#ffb3a7',
          400: '#ff8471',
          500: '#FF5841', // Sunset orange primary
          600: '#ea3e26',
          700: '#c52b15',
          800: '#9e2515',
          900: '#822417',
        },
        redviolet: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fad0e4',
          300: '#f7a8ce',
          400: '#f071ae',
          500: '#C53678', // Red-violet secondary
          600: '#ab2261',
          700: '#8e194e',
          800: '#751741',
          900: '#631839',
        },
        // Theme-wide mappings for instant cohesive brand transformation
        sky: {
          50: '#fff5f3',
          100: '#ffe8e4',
          200: '#ffd5ce',
          300: '#ffb3a7',
          400: '#ff8471',
          500: '#FF5841', // Sunset Orange #FF5841
          600: '#FF5841', // Primary UI actions, highlights & badges
          700: '#ea3e26',
          800: '#c52b15',
          900: '#9e2515',
          950: '#3a121d',
        },
        teal: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fad0e4',
          300: '#f7a8ce',
          400: '#f071ae',
          500: '#C53678', // Red-Violet #C53678
          600: '#C53678', // Secondary accents
          700: '#ab2261',
          800: '#8e194e',
          900: '#751741',
          950: '#2b0918',
        },
        blue: {
          50: '#fdf2f7',
          100: '#fce7f1',
          200: '#fad0e4',
          300: '#f7a8ce',
          400: '#f071ae',
          500: '#C53678',
          600: '#C53678',
          700: '#ab2261',
          800: '#8e194e',
          900: '#751741',
        },
        brand: {
          orange: '#FF5841',
          violet: '#C53678',
          white: '#FFFFFF',
          50: '#fff5f3',
          100: '#ffe8e4',
          500: '#FF5841',
          600: '#ea3e26',
          700: '#C53678',
          800: '#8e194e',
          900: '#631839',
        },
        emergency: {
          critical: '#dc2626',
          high: '#FF5841',
          medium: '#ca8a04',
          normal: '#16a34a',
        }
      }
    },
  },
  plugins: [],
}
