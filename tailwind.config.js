/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8fe',
          100: '#f5e8f6',
          200: '#e8cceb',
          300: '#d3a5d6',
          400: '#b073b4',
          500: '#7d3f80',
          600: '#542556',
          700: '#451d47',
          800: '#371638',
          900: '#27102a',
          950: '#1a0a1c',
        },
        sun: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'lift':    '0 12px 32px -12px rgba(125, 63, 128, 0.28)',
        'lift-sm': '0 6px 20px -8px rgba(125, 63, 128, 0.20)',
      },
      keyframes: {
        'pop-once': {
          '0%':   { opacity: 0, transform: 'scale(0.5)' },
          '60%':  { opacity: 1, transform: 'scale(1.15)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'pop-once': 'pop-once 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
      },
    },
  },
  plugins: [],
}
