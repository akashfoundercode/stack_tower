/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          sky1: '#38bdf8',
          sky2: '#fde047',
          sun: '#fbbf24',
          gold: '#f59e0b',
          crimson: '#e11d48',
          emerald: '#10b981',
          navy: '#0f172a',
          slate: '#1e293b'
        }
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 1.5s infinite alternate',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseGlow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(251, 191, 36, 0.9))' }
        }
      }
    },
  },
  plugins: [],
}

