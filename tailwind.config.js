/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0B',
        surface: '#111113',
        border: '#1E1E22',
        gold: '#C9A84C',
        'gold-light': '#E8D5A3',
        text: '#F5F5F0',
        muted: '#6B6B7A',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '64': ['4rem', { lineHeight: '1.1' }],
        '80': ['5rem', { lineHeight: '1.05' }],
        '96': ['6rem', { lineHeight: '1' }],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'loading-bar': 'loading-bar 2s infinite linear',
        'fade-up': 'fade-up 0.5s ease forwards',
        'pulse-gold': 'pulse-gold 2s infinite',
      },
      keyframes: {
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201,168,76,0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 50%, #C9A84C 100%)',
        'gold-line': 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(201,168,76,0.15)',
        'gold-sm': '0 0 12px rgba(201,168,76,0.1)',
      },
    },
  },
  plugins: [],
}
