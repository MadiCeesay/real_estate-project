/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Ink navy — primary dark surface/text color (not pure black)
        ink: {
          50:  '#F5F6F8',
          100: '#E8EAEF',
          200: '#C7CCD9',
          300: '#9CA5BA',
          400: '#5F6B85',
          500: '#3A435C',
          600: '#272F45',
          700: '#1B2236',
          800: '#141A2A',
          900: '#0F1422',
          950: '#0A0E18',
        },
        // Emerald — primary CTA / trust accent
        emerald: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Amber — featured/highlight only, used sparingly
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        surface: {
          DEFAULT: '#FAFAF9',
          dark: '#0F1422',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 20, 34, 0.10)',
        'glass-lg': '0 20px 60px -10px rgba(15, 20, 34, 0.18)',
        card: '0 1px 3px rgba(15,20,34,0.06), 0 1px 2px rgba(15,20,34,0.04)',
        'card-hover': '0 12px 32px rgba(15,20,34,0.10), 0 4px 8px rgba(15,20,34,0.06)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        shimmer: 'shimmer 1.8s infinite linear',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
