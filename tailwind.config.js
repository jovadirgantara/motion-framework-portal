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
        accent: {
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}
