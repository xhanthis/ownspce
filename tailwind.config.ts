import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#141414',
        elev: '#1E1E1E',
        t1: '#F5F5F5',
        t2: '#999999',
        t3: '#666666',
        border: '#2A2A2A',
        'border-mid': '#3A3A3A',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#EAB308',
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
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
    },
  },
  plugins: [],
}

export default config
