// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00ACB8',
        'primary-dark': '#008f99',
        'dark-bg': '#0d1117',
        'dark-card': '#111827',
        'dark-card2': '#1a2332',
        'body': '#333333',
        'muted': '#888888',
        'light-bg': '#f9f9f9',
      },
      fontFamily: {
        muller: ['Muller', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', lg: '2rem' },
        screens: { xl: '1280px' },
      },
    },
  },
  plugins: [],
}

export default config
