import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Locked palette — matches ownspce.com. Never pure #000 / #FFF for text.
        bg: '#F5F5F0',
        surface: '#FFFFFF',
        ink: '#1A1A1A',
        muted: '#6B6B6B',
        faint: '#999999',
        border: '#E5E5E0',
        accent: '#CC785C',
        'accent-hover': '#B5674D',
        'accent-light': '#F5E8E3',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        s: '10px',
        m: '14px',
        l: '16px',
        xl: '20px',
      },
      maxWidth: {
        shell: '1120px',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        rise: 'rise 320ms ease both',
      },
    },
  },
  plugins: [],
}

export default config
