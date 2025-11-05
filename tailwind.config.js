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

            // Button Colors - Secondary
            'btn-secondary-bg': 'var(--color-btn-secondary-bg)',
            'btn-secondary-bg-hover': 'var(--color-btn-secondary-bg-hover)',
            'btn-secondary-bg-active': 'var(--color-btn-secondary-bg-active)',
            'btn-secondary-text': 'var(--color-btn-secondary-text)',
            'btn-secondary-border': 'var(--color-btn-secondary-border)',

            // Button Colors - Danger
            'btn-danger-bg': 'var(--color-btn-danger-bg)',
            'btn-danger-bg-hover': 'var(--color-btn-danger-bg-hover)',
            'btn-danger-bg-active': 'var(--color-btn-danger-bg-active)',
            'btn-danger-text': 'var(--color-btn-danger-text)',
            'btn-danger-border': 'var(--color-btn-danger-border)',

            // Button Colors - Success
            'btn-success-bg': 'var(--color-btn-success-bg)',
            'btn-success-bg-hover': 'var(--color-btn-success-bg-hover)',
            'btn-success-bg-active': 'var(--color-btn-success-bg-active)',
            'btn-success-text': 'var(--color-btn-success-text)',
            'btn-success-border': 'var(--color-btn-success-border)',

            // Button Colors - Warning
            'btn-warning-bg': 'var(--color-btn-warning-bg)',
            'btn-warning-bg-hover': 'var(--color-btn-warning-bg-hover)',
            'btn-warning-bg-active': 'var(--color-btn-warning-bg-active)',
            'btn-warning-text': 'var(--color-btn-warning-text)',
            'btn-warning-border': 'var(--color-btn-warning-border)',

            // Colores específicos de Bet 30
            brand: {
               primary: '#dc2626',
               secondary: '#1e40af',
               accent: '#f59e0b',
            },
            bet30: {
               red: {
                  50: '#fef2f2',
                  500: '#dc2626',
                  900: '#7f1d1d',
               },
               blue: {
                  50: '#eff6ff',
                  500: '#1e40af',
                  900: '#1e3a8a',
               }
            },
            // Bet 30 Primary (Rojo característico)
            primary: {
               50: '#fef2f2',
               100: '#fee2e2',
               200: '#fecaca',
               300: '#fca5a5',
               400: '#f87171',
               500: '#dc2626', // Color principal de Bet 30
               600: '#dc2626',
               700: '#b91c1c',
               800: '#991b1b',
               900: '#7f1d1d',
               950: '#450a0a',
            },
            // Deep Blue Secondary
            secondary: {
               50: '#f8fafc',
               100: '#f1f5f9',
               200: '#e2e8f0',
               300: '#cbd5e1',
               400: '#94a3b8',
               500: '#64748b',
               600: '#475569',
               700: '#334155',
               800: '#1e293b',
               900: '#0f172a',
               950: '#020617',
            },
            // Casino Green Success
            success: {
               50: '#ecfdf5',
               100: '#d1fae5',
               200: '#a7f3d0',
               300: '#6ee7b7',
               400: '#34d399',
               500: '#10b981',
               600: '#059669',
               700: '#047857',
               800: '#065f46',
               900: '#064e3b',
               950: '#022c22',
            },
            // Alert Red Danger
            danger: {
               50: '#fef2f2',
               100: '#fee2e2',
               200: '#fecaca',
               300: '#fca5a5',
               400: '#f87171',
               500: '#ef4444',
               600: '#dc2626',
               700: '#b91c1c',
               800: '#991b1b',
               900: '#7f1d1d',
               950: '#450a0a',
            },
            // Casino Orange Warning
            warning: {
               50: '#fff7ed',
               100: '#ffedd5',
               200: '#fed7aa',
               300: '#fdba74',
               400: '#fb923c',
               500: '#f97316',
               600: '#ea580c',
               700: '#c2410c',
               800: '#9a3412',
               900: '#7c2d12',
               950: '#431407',
            },
            // Dark theme backgrounds
            'dark-bg': '#0f172a',
            'dark-bg-secondary': '#1e293b',
            'dark-bg-tertiary': '#334155',

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
         },
         borderColor: {
            DEFAULT: 'var(--color-border-default)',
            default: 'var(--color-border-default)',
            subtle: 'var(--color-border-subtle)',
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