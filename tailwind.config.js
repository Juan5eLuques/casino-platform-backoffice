/** @type {import('tailwindcss').Config} */
export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   darkMode: 'class',
   theme: {
      extend: {
         colors: {
            // === SISTEMA DE THEMING DINÁMICO ===
            // Brand Colors (usan CSS Variables del ThemeProvider)
            'brand-primary': 'var(--color-brand-primary)',
            'brand-primary-hover': 'var(--color-brand-primary-hover)',
            'brand-secondary': 'var(--color-brand-secondary)',
            'brand-accent': 'var(--color-brand-accent)',

            // Status Colors  
            'status-success': 'var(--color-status-success)',
            'status-success-text': 'var(--color-status-success-text)',
            'status-success-bg': 'var(--color-status-success-bg)',
            'status-success-border': 'var(--color-status-success-border)',

            'status-error': 'var(--color-status-error)',
            'status-error-text': 'var(--color-status-error-text)',
            'status-error-bg': 'var(--color-status-error-bg)',
            'status-error-border': 'var(--color-status-error-border)',

            'status-warning': 'var(--color-status-warning)',
            'status-warning-text': 'var(--color-status-warning-text)',
            'status-warning-bg': 'var(--color-status-warning-bg)',

            'status-info': 'var(--color-status-info)',
            'status-info-text': 'var(--color-status-info-text)',
            'status-info-bg': 'var(--color-status-info-bg)',

            // Button Colors - Primary
            'btn-primary-bg': 'var(--color-btn-primary-bg)',
            'btn-primary-bg-hover': 'var(--color-btn-primary-bg-hover)',
            'btn-primary-bg-active': 'var(--color-btn-primary-bg-active)',
            'btn-primary-text': 'var(--color-btn-primary-text)',
            'btn-primary-border': 'var(--color-btn-primary-border)',
            'btn-primary-border-hover': 'var(--color-btn-primary-border-hover)',

            // Button Colors - Secondary
            'btn-secondary-bg': 'var(--color-btn-secondary-bg)',
            'btn-secondary-bg-hover': 'var(--color-btn-secondary-bg-hover)',
            'btn-secondary-bg-active': 'var(--color-btn-secondary-bg-active)',
            'btn-secondary-text': 'var(--color-btn-secondary-text)',
            'btn-secondary-border': 'var(--color-btn-secondary-border)',
            'btn-secondary-border-hover': 'var(--color-btn-secondary-border-hover)',

            // Button Colors - Danger
            'btn-danger-bg': 'var(--color-btn-danger-bg)',
            'btn-danger-bg-hover': 'var(--color-btn-danger-bg-hover)',
            'btn-danger-bg-active': 'var(--color-btn-danger-bg-active)',
            'btn-danger-text': 'var(--color-btn-danger-text)',
            'btn-danger-border': 'var(--color-btn-danger-border)',
            'btn-danger-border-hover': 'var(--color-btn-danger-border-hover)',

            // Button Colors - Success
            'btn-success-bg': 'var(--color-btn-success-bg)',
            'btn-success-bg-hover': 'var(--color-btn-success-bg-hover)',
            'btn-success-bg-active': 'var(--color-btn-success-bg-active)',
            'btn-success-text': 'var(--color-btn-success-text)',
            'btn-success-border': 'var(--color-btn-success-border)',
            'btn-success-border-hover': 'var(--color-btn-success-border-hover)',

            // Surface hover (para estados hover)
            'surface-hover': 'var(--color-surface-hover)',
         },
         textColor: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
            tertiary: 'var(--color-text-tertiary)',
         },
         backgroundColor: {
            primary: 'var(--color-bg-primary)',
            secondary: 'var(--color-bg-secondary)',
            tertiary: 'var(--color-bg-tertiary)',
            'background-primary': 'var(--color-bg-primary)',
            'background-secondary': 'var(--color-bg-secondary)',
            'background-tertiary': 'var(--color-bg-tertiary)',
         },
         borderColor: {
            DEFAULT: 'var(--color-border-default)',
            default: 'var(--color-border-default)',
            subtle: 'var(--color-border-subtle)',
            'border-primary': 'var(--color-border-default)',
         },
         fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
         },
         animation: {
            'fade-in': 'fadeIn 0.2s ease-in-out',
            'slide-in': 'slideIn 0.3s ease-in-out',
            'scale-in': 'scaleIn 0.2s ease-in-out',
            'shimmer': 'shimmer 3s ease-in-out infinite',
         },
         keyframes: {
            fadeIn: {
               '0%': { opacity: '0' },
               '100%': { opacity: '1' },
            },
            slideIn: {
               '0%': { transform: 'translateX(-100%)' },
               '100%': { transform: 'translateX(0)' },
            },
            scaleIn: {
               '0%': { transform: 'scale(0.95)', opacity: '0' },
               '100%': { transform: 'scale(1)', opacity: '1' },
            },
            shimmer: {
               '0%': { transform: 'translateX(-100%)' },
               '100%': { transform: 'translateX(100%)' },
            },
         },
      },
   },
   plugins: [],
}