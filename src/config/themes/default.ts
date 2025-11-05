import type { BrandTheme } from './types';

/**
 * Tema Default - Bet30
 * Paleta profesional para backoffice con excelente contraste y elegancia corporativa
 * Inspirado en diseños de plataformas financieras y empresariales modernas
 */

/**
 * Tema Claro (Light Mode)
 */
export const bet30LightTheme: BrandTheme = {
   // Metadata
   name: 'Bet30 Light',
   brandId: 'bet30',
   version: '2.0.0',

   // Colores de Identidad - Azul corporativo moderno con acento vibrante
   brand: {
      primary: '#0F172A',        // Azul marino oscuro (casi negro) - profesional y elegante
      primaryHover: '#1E293B',   // Azul marino medio
      primaryActive: '#334155',  // Azul marino claro
      secondary: '#3B82F6',      // Azul vibrante - para acciones importantes
      secondaryHover: '#2563EB',
      secondaryActive: '#1D4ED8',
      accent: '#10B981',         // Verde esmeralda - para éxito y confirmaciones
      accentHover: '#059669',
      accentActive: '#047857',
   },

   // Backgrounds - Grises cálidos ultra sutiles
   background: {
      primary: '#FFFFFF',        // Blanco puro - máximo contraste
      secondary: '#F8FAFC',      // Slate-50 - muy suave
      tertiary: '#F1F5F9',       // Slate-100 - contraste sutil
      inverse: '#0F172A',        // Azul marino oscuro
      elevated: '#FFFFFF',       // Blanco para cards elevadas
      sunken: '#F8FAFC',         // Slate-50 para inputs
   },

   // Surfaces
   surface: {
      default: '#FFFFFF',
      elevated: '#FFFFFF',
      sunken: '#F8FAFC',
      overlay: 'rgba(15, 23, 42, 0.75)',
      hover: '#F8FAFC',
      active: '#F1F5F9',
   },

   // Botones - Diseño moderno con estados claros
   button: {
      primary: {
         background: '#0F172A',
         backgroundHover: '#1E293B',
         backgroundActive: '#334155',
         text: '#FFFFFF',
         textHover: '#FFFFFF',
         border: '#0F172A',
         borderHover: '#1E293B',
      },
      secondary: {
         background: '#3B82F6',
         backgroundHover: '#2563EB',
         backgroundActive: '#1D4ED8',
         text: '#FFFFFF',
         textHover: '#FFFFFF',
         border: '#3B82F6',
         borderHover: '#2563EB',
      },
      danger: {
         background: '#EA580C',
         backgroundHover: '#C2410C',
         backgroundActive: '#9A3412',
         text: '#FFFFFF',
         textHover: '#FFFFFF',
         border: '#EA580C',
         borderHover: '#C2410C',
      },
      success: {
         background: '#10B981',
         backgroundHover: '#059669',
         backgroundActive: '#047857',
         text: '#FFFFFF',
         textHover: '#FFFFFF',
         border: '#10B981',
         borderHover: '#059669',
      },
      ghost: {
         background: 'transparent',
         backgroundHover: '#F1F5F9',
         backgroundActive: '#E2E8F0',
         text: '#475569',
         textHover: '#1E293B',
         border: 'transparent',
         borderHover: 'transparent',
      },
      outline: {
         background: 'transparent',
         backgroundHover: '#F8FAFC',
         backgroundActive: '#F1F5F9',
         text: '#0F172A',
         textHover: '#1E293B',
         border: '#CBD5E1',
         borderHover: '#94A3B8',
      },
   },

   // Textos - Contraste óptimo para legibilidad
   text: {
      primary: '#0F172A',        // Azul marino oscuro - excelente contraste
      secondary: '#475569',      // Slate-600 - secundario legible
      tertiary: '#94A3B8',       // Slate-400 - terciario sutil
      inverse: '#FFFFFF',        // Blanco
      disabled: '#CBD5E1',       // Slate-300 - deshabilitado claro
      link: '#3B82F6',           // Azul vibrante para links
      linkHover: '#2563EB',
      linkActive: '#1D4ED8',
      muted: '#64748B',          // Slate-500 - texto apagado
   },

   // Borders - Sutiles pero definidos
   border: {
      default: '#E2E8F0',        // Slate-200 - borde por defecto
      subtle: '#F1F5F9',         // Slate-100 - borde muy sutil
      strong: '#CBD5E1',         // Slate-300 - borde fuerte
      focus: '#3B82F6',          // Azul vibrante para focus
      hover: '#CBD5E1',
      active: '#94A3B8',
      error: '#F97316',          // Naranja en lugar de rojo
      success: '#10B981',
   },

   // Estados Semánticos - Colores vibrantes y claros
   status: {
      success: {
         default: '#10B981',
         hover: '#059669',
         text: '#065F46',
         background: '#D1FAE5',
         border: '#6EE7B7',
      },
      warning: {
         default: '#F59E0B',
         hover: '#D97706',
         text: '#92400E',
         background: '#FEF3C7',
         border: '#FCD34D',
      },
      error: {
         default: '#F97316',
         hover: '#EA580C',
         text: '#C2410C',
         background: '#FFEDD5',
         border: '#FB923C',
      },
      info: {
         default: '#3B82F6',
         hover: '#2563EB',
         text: '#1E40AF',
         background: '#DBEAFE',
         border: '#93C5FD',
      },
   },

   // Overlays
   overlay: {
      backdrop: 'rgba(15, 23, 42, 0.75)',
      scrim: 'rgba(0, 0, 0, 0.5)',
      tooltip: 'rgba(15, 23, 42, 0.97)',
   },

   // Shadows - Sutiles y profesionales
   shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
   },

   // Gradients - Modernos y sutiles
   gradient: {
      primary: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      secondary: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      accent: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
   },
};

/**
 * Tema Oscuro (Dark Mode)
 */
export const bet30DarkTheme: BrandTheme = {
   // Metadata
   name: 'Bet30 Dark',
   brandId: 'bet30',
   version: '2.0.0',

   // Colores de Identidad - Ajustados para dark mode
   brand: {
      primary: '#60A5FA',        // Azul brillante para dark
      primaryHover: '#3B82F6',   // Azul vibrante
      primaryActive: '#2563EB',  // Azul intenso
      secondary: '#94A3B8',      // Slate claro
      secondaryHover: '#CBD5E1',
      secondaryActive: '#E2E8F0',
      accent: '#34D399',         // Verde esmeralda brillante
      accentHover: '#10B981',
      accentActive: '#059669',
   },

   // Backgrounds - Oscuros con profundidad
   background: {
      primary: '#0F172A',        // Slate-900 - fondo principal
      secondary: '#1E293B',      // Slate-800 - secundario
      tertiary: '#334155',       // Slate-700 - terciario
      inverse: '#FFFFFF',        // Blanco para modals
      elevated: '#1E293B',       // Elevado con Slate-800
      sunken: '#0B1120',         // Más oscuro que primary
   },

   // Surfaces
   surface: {
      default: '#1E293B',
      elevated: '#334155',
      sunken: '#0B1120',
      overlay: 'rgba(15, 23, 42, 0.95)',
      hover: '#334155',
      active: '#475569',
   },

   // Botones - Brillantes y con buen contraste
   button: {
      primary: {
         background: '#3B82F6',
         backgroundHover: '#2563EB',
         backgroundActive: '#1D4ED8',
         text: '#FFFFFF',
         textHover: '#FFFFFF',
         border: '#3B82F6',
         borderHover: '#2563EB',
      },
      secondary: {
         background: '#334155',
         backgroundHover: '#475569',
         backgroundActive: '#64748B',
         text: '#F1F5F9',
         textHover: '#FFFFFF',
         border: '#475569',
         borderHover: '#64748B',
      },
      danger: {
         background: '#FB923C',
         backgroundHover: '#F97316',
         backgroundActive: '#EA580C',
         text: '#FFFFFF',
         textHover: '#FFFFFF',
         border: '#FB923C',
         borderHover: '#F97316',
      },
      success: {
         background: '#10B981',
         backgroundHover: '#059669',
         backgroundActive: '#047857',
         text: '#FFFFFF',
         textHover: '#FFFFFF',
         border: '#10B981',
         borderHover: '#059669',
      },
      ghost: {
         background: 'transparent',
         backgroundHover: '#334155',
         backgroundActive: '#475569',
         text: '#CBD5E1',
         textHover: '#F1F5F9',
         border: 'transparent',
         borderHover: 'transparent',
      },
      outline: {
         background: 'transparent',
         backgroundHover: 'rgba(59, 130, 246, 0.1)',
         backgroundActive: 'rgba(59, 130, 246, 0.2)',
         text: '#60A5FA',
         textHover: '#3B82F6',
         border: '#475569',
         borderHover: '#60A5FA',
      },
   },

   // Textos - Alto contraste en dark
   text: {
      primary: '#F8FAFC',        // Slate-50 - texto principal
      secondary: '#CBD5E1',      // Slate-300 - secundario
      tertiary: '#94A3B8',       // Slate-400 - terciario
      inverse: '#0F172A',        // Slate-900 oscuro
      disabled: '#64748B',       // Slate-500 - deshabilitado
      link: '#60A5FA',           // Azul brillante
      linkHover: '#3B82F6',
      linkActive: '#2563EB',
      muted: '#94A3B8',          // Slate-400 - apagado
   },

   // Borders - Visibles en dark
   border: {
      default: '#334155',        // Slate-700
      subtle: '#1E293B',         // Slate-800 - muy sutil
      strong: '#475569',         // Slate-600 - fuerte
      focus: '#3B82F6',          // Azul vibrante
      hover: '#475569',
      active: '#64748B',
      error: '#FB923C',          // Naranja en lugar de rojo
      success: '#10B981',
   },

   // Estados Semánticos - Brillantes para dark
   status: {
      success: {
         default: '#10B981',
         hover: '#059669',
         text: '#6EE7B7',
         background: 'rgba(16, 185, 129, 0.15)',
         border: '#047857',
      },
      warning: {
         default: '#F59E0B',
         hover: '#D97706',
         text: '#FCD34D',
         background: 'rgba(245, 158, 11, 0.15)',
         border: '#B45309',
      },
      error: {
         default: '#FB923C',
         hover: '#F97316',
         text: '#FDBA74',
         background: 'rgba(249, 115, 22, 0.15)',
         border: '#EA580C',
      },
      info: {
         default: '#3B82F6',
         hover: '#2563EB',
         text: '#93C5FD',
         background: 'rgba(59, 130, 246, 0.15)',
         border: '#1D4ED8',
      },
   },

   // Overlays
   overlay: {
      backdrop: 'rgba(15, 23, 42, 0.95)',
      scrim: 'rgba(0, 0, 0, 0.75)',
      tooltip: 'rgba(30, 41, 59, 0.97)',
   },

   // Shadows - Más pronunciadas en dark mode
   shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.6)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.7)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
   },

   // Gradients - Vibrantes para dark
   gradient: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
      secondary: 'linear-gradient(135deg, #334155 0%, #64748B 100%)',
      accent: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
   },
};
