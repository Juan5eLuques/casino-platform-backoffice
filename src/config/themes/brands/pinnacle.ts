import type { BrandTheme, BrandThemeConfig } from '../types';

/**
 * Tema Pinnacle
 * Basado en el color principal #00A859 (verde característico de Pinnacle)
 */

/**
 * Tema Claro (Light Mode)
 */
export const pinnacleLightTheme: BrandTheme = {
   // Metadata
   name: 'Pinnacle Light',
   brandId: 'pinnacle',
   version: '1.0.0',

   // Colores de Identidad Pinnacle
   brand: {
      primary: '#00A859',        // Verde Pinnacle
      primaryHover: '#008f4c',   // Hover más oscuro
      primaryActive: '#007a41',  // Active aún más oscuro
      secondary: '#0a2540',      // Azul oscuro profundo
      secondaryHover: '#051627',
      secondaryActive: '#020b14',
      accent: '#FFB800',         // Amarillo dorado
      accentHover: '#e6a600',
      accentActive: '#cc9400',
   },

   // Backgrounds
   background: {
      primary: '#ffffff',        // Blanco puro
      secondary: '#f8fafb',      // Muy suave gris azulado
      tertiary: '#f1f5f7',       // Gris azulado claro
      inverse: '#0a2540',        // Azul oscuro Pinnacle
      elevated: '#ffffff',       // Blanco para cards con sombra
      sunken: '#f8fafb',         // Gris suave para inputs
   },

   // Surfaces
   surface: {
      default: '#ffffff',
      elevated: '#ffffff',
      sunken: '#f1f5f7',
      overlay: 'rgba(10, 37, 64, 0.5)', // Overlay con azul Pinnacle
      hover: '#f8fafb',
      active: '#f1f5f7',
   },

   // Botones
   button: {
      primary: {
         background: '#00A859',
         backgroundHover: '#008f4c',
         backgroundActive: '#007a41',
         text: '#ffffff',
         textHover: '#ffffff',
         border: '#00A859',
         borderHover: '#008f4c',
      },
      secondary: {
         background: '#f1f5f7',
         backgroundHover: '#e1e7eb',
         backgroundActive: '#d1dae0',
         text: '#0a2540',
         textHover: '#051627',
         border: '#d1dae0',
         borderHover: '#b8c5ce',
      },
      danger: {
         background: '#dc2626',
         backgroundHover: '#b91c1c',
         backgroundActive: '#991b1b',
         text: '#ffffff',
         textHover: '#ffffff',
         border: '#dc2626',
         borderHover: '#b91c1c',
      },
      success: {
         background: '#00A859',
         backgroundHover: '#008f4c',
         backgroundActive: '#007a41',
         text: '#ffffff',
         textHover: '#ffffff',
         border: '#00A859',
         borderHover: '#008f4c',
      },
      ghost: {
         background: 'transparent',
         backgroundHover: '#f1f5f7',
         backgroundActive: '#e1e7eb',
         text: '#0a2540',
         textHover: '#051627',
         border: 'transparent',
         borderHover: 'transparent',
      },
      outline: {
         background: 'transparent',
         backgroundHover: '#f1f5f7',
         backgroundActive: '#e1e7eb',
         text: '#00A859',
         textHover: '#008f4c',
         border: '#00A859',
         borderHover: '#008f4c',
      },
   },

   // Text
   text: {
      primary: '#0a2540',        // Azul oscuro Pinnacle
      secondary: '#475569',      // Gris medio
      tertiary: '#94a3b8',       // Gris claro
      inverse: '#ffffff',        // Blanco
      disabled: '#cbd5e1',       // Gris muy claro
      link: '#00A859',           // Verde Pinnacle
      linkHover: '#008f4c',
      linkActive: '#007a41',
      muted: '#64748b',          // Gris medio-claro
   },

   // Bordes
   border: {
      default: '#e2e8f0',        // Gris claro
      subtle: '#f1f5f7',         // Gris muy claro
      strong: '#cbd5e1',         // Gris medio
      focus: '#00A859',          // Verde Pinnacle en focus
      hover: '#94a3b8',          // Gris más oscuro en hover
      active: '#64748b',         // Gris oscuro active
      error: '#dc2626',          // Rojo para errores
      success: '#00A859',        // Verde Pinnacle
   },

   // Estados
   status: {
      success: {
         default: '#00A859',     // Verde Pinnacle
         hover: '#008f4c',
         text: '#006b3a',        // Texto verde oscuro
         background: '#d1f4e3',  // Fondo verde claro
         border: '#7dd9ac',      // Borde verde medio
      },
      warning: {
         default: '#f59e0b',
         hover: '#d97706',
         text: '#92400e',
         background: '#fef3c7',
         border: '#fcd34d',
      },
      error: {
         default: '#dc2626',
         hover: '#b91c1c',
         text: '#991b1b',
         background: '#fee2e2',
         border: '#fca5a5',
      },
      info: {
         default: '#0284c7',
         hover: '#0369a1',
         text: '#075985',
         background: '#e0f2fe',
         border: '#7dd3fc',
      },
   },

   // Overlays
   overlay: {
      backdrop: 'rgba(10, 37, 64, 0.5)',
      scrim: 'rgba(10, 37, 64, 0.3)',
      tooltip: 'rgba(10, 37, 64, 0.95)',
   },

   // Sombras
   shadow: {
      sm: '0 1px 2px 0 rgba(10, 37, 64, 0.05)',
      md: '0 4px 6px -1px rgba(10, 37, 64, 0.1), 0 2px 4px -1px rgba(10, 37, 64, 0.06)',
      lg: '0 10px 15px -3px rgba(10, 37, 64, 0.1), 0 4px 6px -2px rgba(10, 37, 64, 0.05)',
      xl: '0 20px 25px -5px rgba(10, 37, 64, 0.1), 0 10px 10px -5px rgba(10, 37, 64, 0.04)',
      '2xl': '0 25px 50px -12px rgba(10, 37, 64, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(10, 37, 64, 0.06)',
   },
};

/**
 * Tema Oscuro (Dark Mode)
 */
export const pinnacleDarkTheme: BrandTheme = {
   // Metadata
   name: 'Pinnacle Dark',
   brandId: 'pinnacle',
   version: '1.0.0',

   // Colores de Identidad (mantener coherencia)
   brand: {
      primary: '#00C569',        // Verde más brillante para dark
      primaryHover: '#00A859',
      primaryActive: '#008f4c',
      secondary: '#60a5fa',      // Azul más claro
      secondaryHover: '#3b82f6',
      secondaryActive: '#2563eb',
      accent: '#FFD233',         // Amarillo más brillante
      accentHover: '#FFB800',
      accentActive: '#e6a600',
   },

   // Backgrounds
   background: {
      primary: '#0a1929',        // Azul muy oscuro
      secondary: '#0f2137',      // Azul oscuro medio
      tertiary: '#142d44',       // Azul oscuro claro
      inverse: '#ffffff',        // Blanco
      elevated: '#0f2137',       // Azul oscuro para cards
      sunken: '#0a1929',         // Azul muy oscuro para inputs
   },

   // Surfaces
   surface: {
      default: '#0f2137',
      elevated: '#142d44',
      sunken: '#0a1929',
      overlay: 'rgba(10, 25, 41, 0.9)',
      hover: '#1a3550',
      active: '#0f2137',
   },

   // Botones
   button: {
      primary: {
         background: '#00C569',
         backgroundHover: '#00A859',
         backgroundActive: '#008f4c',
         text: '#0a1929',         // Texto oscuro en verde brillante
         textHover: '#0a1929',
         border: '#00C569',
         borderHover: '#00A859',
      },
      secondary: {
         background: '#1a3550',
         backgroundHover: '#214363',
         backgroundActive: '#2a5075',
         text: '#e2e8f0',
         textHover: '#f1f5f9',
         border: '#2a5075',
         borderHover: '#3a6088',
      },
      danger: {
         background: '#ef4444',
         backgroundHover: '#dc2626',
         backgroundActive: '#b91c1c',
         text: '#ffffff',
         textHover: '#ffffff',
         border: '#ef4444',
         borderHover: '#dc2626',
      },
      success: {
         background: '#00C569',
         backgroundHover: '#00A859',
         backgroundActive: '#008f4c',
         text: '#0a1929',
         textHover: '#0a1929',
         border: '#00C569',
         borderHover: '#00A859',
      },
      ghost: {
         background: 'transparent',
         backgroundHover: '#1a3550',
         backgroundActive: '#214363',
         text: '#e2e8f0',
         textHover: '#f1f5f9',
         border: 'transparent',
         borderHover: 'transparent',
      },
      outline: {
         background: 'transparent',
         backgroundHover: '#1a3550',
         backgroundActive: '#214363',
         text: '#00C569',
         textHover: '#00A859',
         border: '#00C569',
         borderHover: '#00A859',
      },
   },

   // Text
   text: {
      primary: '#f8fafc',        // Blanco casi puro
      secondary: '#cbd5e1',      // Gris claro
      tertiary: '#64748b',       // Gris medio
      inverse: '#0a1929',        // Azul oscuro
      disabled: '#475569',       // Gris oscuro
      link: '#00C569',           // Verde brillante
      linkHover: '#00dd75',
      linkActive: '#00A859',
      muted: '#94a3b8',          // Gris medio-claro
   },

   // Bordes
   border: {
      default: '#1e3a52',        // Azul oscuro
      subtle: '#142d44',         // Azul muy oscuro
      strong: '#2a5075',         // Azul medio
      focus: '#00C569',          // Verde brillante en focus
      hover: '#3a6088',          // Azul más claro en hover
      active: '#4a7098',         // Azul claro active
      error: '#ef4444',          // Rojo brillante
      success: '#00C569',        // Verde brillante
   },

   // Estados
   status: {
      success: {
         default: '#00C569',
         hover: '#00dd75',
         text: '#4ade80',        // Verde claro
         background: '#0a2e1f',  // Verde muy oscuro
         border: '#166534',      // Verde oscuro
      },
      warning: {
         default: '#fbbf24',
         hover: '#f59e0b',
         text: '#fcd34d',
         background: '#2e1f0a',
         border: '#78350f',
      },
      error: {
         default: '#ef4444',
         hover: '#dc2626',
         text: '#fca5a5',
         background: '#2e0a0a',
         border: '#7f1d1d',
      },
      info: {
         default: '#38bdf8',
         hover: '#0ea5e9',
         text: '#7dd3fc',
         background: '#0a1e2e',
         border: '#164e63',
      },
   },

   // Overlays
   overlay: {
      backdrop: 'rgba(10, 25, 41, 0.9)',
      scrim: 'rgba(10, 25, 41, 0.5)',
      tooltip: 'rgba(10, 25, 41, 0.98)',
   },

   // Sombras (más suaves en dark mode)
   shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
   },
};

/**
 * Configuración de la marca Pinnacle
 */
export const pinnacleConfig: BrandThemeConfig = {
   brandId: 'pinnacle',
   brandName: 'Pinnacle',
   themes: {
      light: pinnacleLightTheme,
      dark: pinnacleDarkTheme,
   },
   defaultMode: 'light',
};
