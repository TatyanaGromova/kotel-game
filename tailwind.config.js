/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0d0f12',
          900: '#14181d',
          800: '#1c2229',
          700: '#252d36',
          600: '#323c48',
        },
        warm: {
          400: '#f59e0b',
          500: '#ea580c',
          600: '#c2410c',
          glow: '#ff8c42',
        },
        frost: {
          300: '#a8d4e6',
          500: '#6eb5d4',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 0 30px rgba(234, 88, 12, 0.35)',
        boiler: '0 0 60px rgba(255, 140, 66, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        flicker: 'flicker 1.5s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
