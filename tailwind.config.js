/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#080a0c',
          900: '#0f1216',
          850: '#131820',
          800: '#1a2028',
          700: '#242c36',
          600: '#323c48',
        },
        steel: {
          400: '#7a8fa3',
          500: '#5a6d82',
          600: '#3d4d5c',
        },
        warm: {
          300: '#fdba74',
          400: '#f59e0b',
          500: '#ea580c',
          600: '#c2410c',
          glow: '#ff8c42',
          ember: '#ff6b2c',
        },
        frost: {
          200: '#d4eaf4',
          300: '#a8d4e6',
          500: '#6eb5d4',
          700: '#3d7a9a',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 0 40px rgba(234, 88, 12, 0.35), 0 0 80px rgba(255, 107, 44, 0.12)',
        'warm-sm': '0 0 20px rgba(234, 88, 12, 0.25)',
        boiler: '0 0 80px rgba(255, 140, 66, 0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        alert: '0 0 50px rgba(220, 38, 38, 0.35)',
        depth: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'metal-gradient': 'linear-gradient(145deg, #2a3440 0%, #1a2028 50%, #141820 100%)',
        'warm-radial': 'radial-gradient(ellipse at center, rgba(255, 140, 66, 0.2) 0%, transparent 70%)',
        'hero-mesh': 'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(234, 88, 12, 0.15) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(90, 109, 130, 0.12) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
