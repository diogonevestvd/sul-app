import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        paper: '#faf8f7',
        bordeaux: {
          50: '#faf3f5',
          100: '#f3dfe4',
          200: '#e6bcc6',
          300: '#d48c9e',
          400: '#bc6079',
          500: '#a53f5d',
          600: '#8f2746',
          700: '#751a37',
          800: '#5f152d',
          900: '#471020'
        }
      },
      fontFamily: {
        display: ['Aileron', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 55px rgba(72, 16, 32, 0.08)',
        card: '0 14px 32px rgba(72, 16, 32, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
