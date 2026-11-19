/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Palette 1: Sunset & Red-Violet
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

        // Core Palette 2: "Seashell Garnet Afternoon"
        seashell: {
          50: '#fffbf5',
          100: '#fef5e7',
          200: '#fde9cc',
          300: '#fcd9a9',
          400: '#F6C992', // Seashell Gold/Peach
          500: '#e5ad6b',
          600: '#c88c49',
          700: '#a36a33',
        },
        garnet: {
          50: '#fff1f3',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fda4b4',
          400: '#fb7185',
          500: '#F06575', // Coral pink garnet
          600: '#e13853',
          700: '#be223d',
          800: '#9d1f35',
          900: '#30525C', // Deep Slate Garnet
        },
        iceblue: {
          50: '#f4f7fa',
          100: '#e7ecf2',
          200: '#d3dde7',
          300: '#ACC0D3', // Soft Ice Blue
          400: '#8ba4be',
          500: '#6f8ba9',
          600: '#5484A4',
          700: '#426883',
        },
        dustyrose: {
          50: '#faf4f6',
          100: '#f5e8ed',
          200: '#ebd4de',
          300: '#e0b8ca',
          400: '#D396A6', // Dusty Rose
          500: '#bf798c',
          600: '#a65d70',
          700: '#8c485a',
        },
        medteal: {
          50: '#edfafa',
          100: '#d4f2f3',
          200: '#ade4e6',
          300: '#75ced3',
          400: '#3ab0b7',
          500: '#09A1A1', // Medical Teal
          600: '#068485',
          700: '#09696b',
          800: '#0d5456',
        },
        steelblue: {
          50: '#f2f6f9',
          100: '#e3ecf2',
          200: '#cbdae5',
          300: '#a6c1d3',
          400: '#7ba1bd',
          500: '#5484A4', // Steel Blue
          600: '#426b89',
          700: '#375770',
          800: '#304a5e',
        },

        // Semantic Theme Mappings
        sky: {
          50: '#fff5f3',
          100: '#ffe8e4',
          200: '#ffd5ce',
          300: '#ffb3a7',
          400: '#ff8471',
          500: '#FF5841', // Sunset Orange #FF5841
          600: '#FF5841',
          700: '#ea3e26',
          800: '#c52b15',
          900: '#9e2515',
          950: '#3a121d',
        },
        teal: {
          50: '#edfafa',
          100: '#d4f2f3',
          200: '#ade4e6',
          300: '#75ced3',
          400: '#3ab0b7',
          500: '#09A1A1', // Vibrant Medical Teal #09A1A1
          600: '#09A1A1',
          700: '#068485',
          800: '#09696b',
          900: '#0d5456',
          950: '#083233',
        },
        brand: {
          orange: '#FF5841',
          violet: '#C53678',
          seashell: '#F6C992',
          garnet: '#30525C',
          teal: '#09A1A1',
          iceblue: '#ACC0D3',
          dustyrose: '#D396A6',
          steelblue: '#5484A4',
          white: '#FFFFFF',
        },
        emergency: {
          critical: '#dc2626',
          high: '#FF5841',
          medium: '#F6C992',
          normal: '#09A1A1',
        }
      }
    },
  },
  plugins: [],
}
