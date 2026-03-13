/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#050510',
        'neon-blue': '#00F0FF',
        'neon-purple': '#9D00FF',
        'neon-pink': '#FF2BD6',
        'neon-green': '#00FFA3',
        'panel-dark': '#0D0D1A',
        'panel-darker': '#080812',
      },
      boxShadow: {
        'neon-blue': '0 0 8px #00F0FF, 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 8px #9D00FF, 0 0 20px rgba(157, 0, 255, 0.3)',
        'neon-pink': '0 0 8px #FF2BD6, 0 0 20px rgba(255, 43, 214, 0.3)',
        'neon-green': '0 0 8px #00FFA3, 0 0 20px rgba(0, 255, 163, 0.3)',
        'neon-blue-lg': '0 0 12px #00F0FF, 0 0 30px rgba(0, 240, 255, 0.4), 0 0 60px rgba(0, 240, 255, 0.15)',
        'neon-purple-lg': '0 0 12px #9D00FF, 0 0 30px rgba(157, 0, 255, 0.4), 0 0 60px rgba(157, 0, 255, 0.15)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px #00F0FF, 0 0 10px rgba(0, 240, 255, 0.3)' },
          '100%': { boxShadow: '0 0 10px #00F0FF, 0 0 25px rgba(0, 240, 255, 0.5), 0 0 50px rgba(0, 240, 255, 0.2)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cyber-grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
