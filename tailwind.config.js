/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        headline: ['"Plus Jakarta Sans"', 'Inter', ...defaultTheme.fontFamily.sans],
        body: ['Inter', ...defaultTheme.fontFamily.sans],
        label: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono]
      },
      colors: {
        // Surface tokens — channel-format vars so opacity modifiers like /10 apply.
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'surface-container-low': 'rgb(var(--surface-container-low-rgb) / <alpha-value>)',
        'surface-container-high': 'rgb(var(--surface-container-high-rgb) / <alpha-value>)',
        'surface-container-highest':
          'rgb(var(--surface-container-highest-rgb) / <alpha-value>)',
        'surface-container-lowest':
          'rgb(var(--surface-container-lowest-rgb) / <alpha-value>)',
        'outline-variant': 'rgb(var(--outline-variant-rgb) / <alpha-value>)',
        'text-main': 'rgb(var(--text-main-rgb) / <alpha-value>)',
        // Keep the alpha-baked rgba so `text-text-muted` defaults to its 60%
        // intent. Opacity modifiers on this token are intentionally not used.
        'text-muted': 'var(--text-muted)',
        primary: {
          DEFAULT: 'rgb(var(--primary-rgb) / <alpha-value>)',
          dim: 'rgb(var(--primary-dim-rgb) / <alpha-value>)',
          container: 'rgb(var(--primary-container-rgb) / <alpha-value>)',
          on: 'rgb(var(--on-primary-container-rgb) / <alpha-value>)'
        },
        secondary: 'rgb(var(--secondary-rgb) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary-rgb) / <alpha-value>)',
        // Neutral grays kept for any text-gray-* / border-gray-* usages.
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b'
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      boxShadow: {
        'glow-emerald': '0 0 30px rgba(0, 255, 163, 0.18)',
        'glow-emerald-lg': '0 0 60px rgba(0, 255, 163, 0.25)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.45)'
      },
      backgroundImage: {
        'kinetic': 'linear-gradient(135deg, var(--primary-dim) 0%, var(--primary-container) 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      backdropBlur: {
        '3xl': '64px'
      }
    }
  },
  plugins: []
}
