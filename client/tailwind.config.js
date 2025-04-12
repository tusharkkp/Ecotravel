/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f8f2',
          100: '#e4f1e4',
          200: '#c8e3ca',
          300: '#a7d0a9',
          400: '#7fb681',
          500: '#5a9c5e',
          600: '#477c4a',
          700: '#3a623c',
          800: '#304f32',
          900: '#2a422c',
          950: '#132314',
        },
        secondary: {
          50: '#f3f7f6',
          100: '#e7efed',
          200: '#cddfd9',
          300: '#a2c5bc',
          400: '#71a69a',
          500: '#509084',
          600: '#3d736a',
          700: '#345e56',
          800: '#2d4c47',
          900: '#27403c',
          950: '#142522',
        },
        accent: {
          50: '#fbf7f0',
          100: '#f3e8d4',
          200: '#e6d0ad',
          300: '#dab87e',
          400: '#d1a35a',
          500: '#c7904a',
          600: '#b27539',
          700: '#935b2e',
          800: '#7a4b29',
          900: '#654025',
          950: '#372010',
        },
        earth: {
          100: '#F5F5DC', // Beige
          200: '#D2B48C', // Tan
          300: '#A0522D', // Brown
        }
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        lato: ['Lato', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'eco-sm': '0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'eco': '0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.12)',
        'eco-lg': '0 10px 25px rgba(46, 125, 50, 0.1), 0 4px 10px rgba(46, 125, 50, 0.2)',
      },
      animation: {
        'leaf-sway': 'leafSway 5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        leafSway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      },
      backgroundImage: {
        'leaf-pattern': "url('/src/assets/patterns/leaf-pattern.svg')",
        'wave-pattern': "url('/src/assets/patterns/wave-pattern.svg')",
        'earth-gradient': 'linear-gradient(120deg, rgba(90, 156, 94, 0.95), rgba(80, 144, 132, 0.85))',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
} 