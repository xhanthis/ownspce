import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ownspce Landing v2 palette — warm sand + terracotta.
        bg: '#faf6ed',
        sand: '#f4efe7',
        surface: '#fdfbf6',
        card: '#fffdf8',
        ink: '#2b2620',
        body: '#4b433a',
        soft: '#6b6255',
        muted: '#7a7062',
        faint: '#a2937d',
        border: '#e2d8c6',
        'border-2': '#e6dcca',
        line: '#ece2d1',
        accent: '#b0745a',
        'accent-hover': '#8e5a44',
        dark: '#231f1a',
        // Secondary category accents used in the product mockups.
        sage: '#8ba17e',
        blue: '#6f8bb0',
        plum: '#a97fa0',
        gold: '#c39a4e',
        stone: '#8a8070',
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-hanken-grotesk)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '1180px',
      },
      keyframes: {
        osrise: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'none', opacity: '1' },
        },
        osfloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        osbar: {
          '0%, 42%': { opacity: '0.25' },
          '50%, 92%': { opacity: '1' },
          '100%': { opacity: '0.25' },
        },
        oscaret: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        ospulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.18)', opacity: '0.15' },
        },
      },
      animation: {
        rise: 'osrise 320ms ease both',
        float: 'osfloat 7s ease-in-out infinite',
        bar: 'osbar 5.2s ease-in-out infinite',
        caret: 'oscaret 1s step-end infinite',
        pulse: 'ospulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
