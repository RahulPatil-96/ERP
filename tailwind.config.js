/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        primary: {
          DEFAULT: '#6366f1',
          dark: '#818cf8'
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          dark: '#a78bfa'
        },
        background: {
          DEFAULT: '#ffffff',
          dark: '#1a1a1a'
        },
        card: {
          DEFAULT: '#f9fafb',
          dark: '#1f2937'
        },
        text: {
          DEFAULT: '#111827',
          dark: '#f3f4f6'
        }
      },
      backgroundColor: {
        DEFAULT: 'var(--background)',
        dark: 'var(--background-dark)'
      },
      textColor: {
        DEFAULT: 'var(--text)',
        dark: 'var(--text-dark)'
      }
    },
  },
  plugins: [],
};
