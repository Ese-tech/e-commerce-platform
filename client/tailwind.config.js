/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Updated color scheme: gold-glänzend, glänzende-dunkel, green-silk, nude-hell
        primary: {
          50: '#fefdf9',   // lightest nude-hell
          100: '#fdf9f0',  // light nude-hell
          200: '#fbf1de',  // nude-hell
          300: '#f7e6c4',  // warm nude
          400: '#f0d196',  // light gold
          500: '#d4af37',  // gold-glänzend (main gold)
          600: '#b8941f',  // deeper gold
          700: '#9c7a14',  // dark gold
          800: '#7a5e0f',  // glänzende-dunkel base
          900: '#5c450a',  // glänzende-dunkel deep
          950: '#3d2d06',  // darkest glänzende-dunkel
        },
        accent: {
          50: '#f0f7f4',   // lightest green-silk
          100: '#dcede4',  // light green-silk
          200: '#b9dbca',  // green-silk
          300: '#8cc2a8',  // medium green-silk
          400: '#5ba085',  // deeper green-silk
          500: '#4a8572',  // main green-silk
          600: '#3a6b5c',  // dark green-silk
          700: '#30564a',  // darker green
          800: '#28453c',  // deep green
          900: '#223a33',  // darkest green
          950: '#11201b',  // near black green
        },
        nude: {
          50: '#fefdf9',   // nude-hell lightest
          100: '#fdf9f0',  // nude-hell light
          200: '#fbf1de',  // nude-hell
          300: '#f7e6c4',  // nude medium
          400: '#f0d196',  // nude warm
          500: '#e8c778',  // nude golden
          600: '#d4af37',  // transitioning to gold
          700: '#b8941f',  // gold undertones
          800: '#9c7a14',  // deep nude-gold
          900: '#7a5e0f',  // darkest nude
        },
        gold: {
          50: '#fefdf8',   // lightest gold shimmer
          100: '#fdf9e8',  // light gold shimmer
          200: '#fbf1c8',  // gold-glänzend light
          300: '#f7e49d',  // gold-glänzend medium
          400: '#f0d066',  // gold-glänzend bright
          500: '#d4af37',  // gold-glänzend main
          600: '#b8941f',  // gold-glänzend deep
          700: '#9c7a14',  // gold-glänzend darker
          800: '#7a5e0f',  // transitioning to dark
          900: '#5c450a',  // glänzende-dunkel
          950: '#3d2d06',  // darkest glänzende-dunkel
        },
        dark: {
          50: '#f7f6f4',   // lightest warm gray
          100: '#edeae6',  // light warm gray  
          200: '#ddd7ce',  // warm gray
          300: '#c8bfb3',  // medium warm gray
          400: '#b0a394',  // deeper warm gray
          500: '#95877a',  // main warm gray
          600: '#7a5e0f',  // glänzende-dunkel light
          700: '#5c450a',  // glänzende-dunkel
          800: '#3d2d06',  // glänzende-dunkel deep
          900: '#2a1f04',  // glänzende-dunkel darker
          950: '#1a1502',  // darkest glänzende-dunkel
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-light': 'bounceLight 2s infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceLight: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-5px)' },
          '70%': { transform: 'translateY(-3px)' },
          '90%': { transform: 'translateY(-2px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f0d066 50%, #d4af37 100%)',
        'silk-gradient': 'linear-gradient(135deg, #4a8572 0%, #8cc2a8 50%, #4a8572 100%)',
        'nude-gradient': 'linear-gradient(135deg, #fbf1de 0%, #f7e6c4 50%, #fbf1de 100%)',
        'dark-gradient': 'linear-gradient(135deg, #5c450a 0%, #7a5e0f 50%, #5c450a 100%)',
      },
    },
  },
  plugins: [],
}