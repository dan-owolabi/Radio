/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'digital': ['Orbitron', 'monospace'],
        'geist': ['Geist', 'sans-serif'],
        'geist-mono': ['Geist Mono', 'monospace'],
      },
      colors: {
        'accent-peach': '#ffe8d6',
        'lcd-green': '#94a191',
        'lcd-green-glow': '#b4c1b1',
        gray: {
          500: '#666666',
        },
      },
    },
  },
  plugins: [],
}
