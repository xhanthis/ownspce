import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f4efe7',
        surface: '#fbf8f2',
        elev: '#efe8dc',
        t1: '#2b2620',
        t2: '#7a7062',
        t3: '#a49a8a',
        body: '#403930',
        border: '#e2d8c6',
        'border-mid': '#ded3c0',
        accent: '#b0745a',
        'accent-dark': '#8f5640',
        ink: '#2b2620',
        'ink-t1': '#f4efe7',
        'ink-t2': '#c8bfae',
        'ink-t3': '#b0a795',
        'ink-line': 'rgba(244,239,231,0.16)',
        'ink-fill': 'rgba(244,239,231,0.04)',
        sage: '#8ba17e',
        success: '#5d7452',
        danger: '#c25a3f',
        lane: '#b0745a',
        impact: '#6f8bb0',
        board: '#7f9673',
        quicknote: '#a97fa0',
        plain: '#9a8f7d',
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-hanken-grotesk)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        s: '8px',
        m: '12px',
        l: '16px',
        xl: '24px',
      },
      spacing: {
        xs: '4px',
        s: '8px',
        m: '12px',
        l: '16px',
        xl: '24px',
        xxl: '32px',
        xxxl: '48px',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 2.6s ease-in-out infinite',
        rise: 'rise 300ms ease both',
      },
    },
  },
  plugins: [],
}

export default config
