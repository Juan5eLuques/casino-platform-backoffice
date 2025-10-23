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