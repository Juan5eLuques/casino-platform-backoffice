import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { BrandTheme, ThemeContextValue } from './types';
import { getThemeConfig } from './registry';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';

/**
 * Contexto de Tema
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Props del ThemeProvider
 */
interface ThemeProviderProps {
   children: ReactNode;
}

/**
 * Aplicar tema al DOM mediante CSS Variables
 */
function applyThemeToDOM(theme: BrandTheme, mode: 'light' | 'dark') {
   const root = document.documentElement;

   // Brand Colors
   root.style.setProperty('--color-brand-primary', theme.brand.primary);
   root.style.setProperty('--color-brand-primary-hover', theme.brand.primaryHover);
   root.style.setProperty('--color-brand-primary-active', theme.brand.primaryActive);
   root.style.setProperty('--color-brand-secondary', theme.brand.secondary);
   root.style.setProperty('--color-brand-secondary-hover', theme.brand.secondaryHover);
   root.style.setProperty('--color-brand-secondary-active', theme.brand.secondaryActive);
   root.style.setProperty('--color-brand-accent', theme.brand.accent);
   root.style.setProperty('--color-brand-accent-hover', theme.brand.accentHover);
   root.style.setProperty('--color-brand-accent-active', theme.brand.accentActive);

   // Background Colors
   root.style.setProperty('--color-bg-primary', theme.background.primary);
   root.style.setProperty('--color-bg-secondary', theme.background.secondary);
   root.style.setProperty('--color-bg-tertiary', theme.background.tertiary);
   root.style.setProperty('--color-bg-inverse', theme.background.inverse);
   root.style.setProperty('--color-bg-elevated', theme.background.elevated);
   root.style.setProperty('--color-bg-sunken', theme.background.sunken);

   // Surface Colors
   root.style.setProperty('--color-surface-default', theme.surface.default);
   root.style.setProperty('--color-surface-elevated', theme.surface.elevated);
   root.style.setProperty('--color-surface-sunken', theme.surface.sunken);
   root.style.setProperty('--color-surface-overlay', theme.surface.overlay);
   root.style.setProperty('--color-surface-hover', theme.surface.hover);
   root.style.setProperty('--color-surface-active', theme.surface.active);

   // Text Colors
   root.style.setProperty('--color-text-primary', theme.text.primary);
   root.style.setProperty('--color-text-secondary', theme.text.secondary);
   root.style.setProperty('--color-text-tertiary', theme.text.tertiary);
   root.style.setProperty('--color-text-inverse', theme.text.inverse);
   root.style.setProperty('--color-text-disabled', theme.text.disabled);
   root.style.setProperty('--color-text-link', theme.text.link);
   root.style.setProperty('--color-text-link-hover', theme.text.linkHover);
   root.style.setProperty('--color-text-link-active', theme.text.linkActive);
   root.style.setProperty('--color-text-muted', theme.text.muted);

   // Border Colors
   root.style.setProperty('--color-border-default', theme.border.default);
   root.style.setProperty('--color-border-subtle', theme.border.subtle);
   root.style.setProperty('--color-border-strong', theme.border.strong);
   root.style.setProperty('--color-border-focus', theme.border.focus);
   root.style.setProperty('--color-border-hover', theme.border.hover);
   root.style.setProperty('--color-border-active', theme.border.active);
   root.style.setProperty('--color-border-error', theme.border.error);
   root.style.setProperty('--color-border-success', theme.border.success);

   // Button Primary
   root.style.setProperty('--color-btn-primary-bg', theme.button.primary.background);
   root.style.setProperty('--color-btn-primary-bg-hover', theme.button.primary.backgroundHover);
   root.style.setProperty('--color-btn-primary-bg-active', theme.button.primary.backgroundActive);
   root.style.setProperty('--color-btn-primary-text', theme.button.primary.text);
   root.style.setProperty('--color-btn-primary-text-hover', theme.button.primary.textHover);
   root.style.setProperty('--color-btn-primary-border', theme.button.primary.border);
   root.style.setProperty('--color-btn-primary-border-hover', theme.button.primary.borderHover);

   // Button Secondary
   root.style.setProperty('--color-btn-secondary-bg', theme.button.secondary.background);
   root.style.setProperty('--color-btn-secondary-bg-hover', theme.button.secondary.backgroundHover);
   root.style.setProperty('--color-btn-secondary-bg-active', theme.button.secondary.backgroundActive);
   root.style.setProperty('--color-btn-secondary-text', theme.button.secondary.text);
   root.style.setProperty('--color-btn-secondary-text-hover', theme.button.secondary.textHover);
   root.style.setProperty('--color-btn-secondary-border', theme.button.secondary.border);
   root.style.setProperty('--color-btn-secondary-border-hover', theme.button.secondary.borderHover);

   // Button Danger
   root.style.setProperty('--color-btn-danger-bg', theme.button.danger.background);
   root.style.setProperty('--color-btn-danger-bg-hover', theme.button.danger.backgroundHover);
   root.style.setProperty('--color-btn-danger-bg-active', theme.button.danger.backgroundActive);
   root.style.setProperty('--color-btn-danger-text', theme.button.danger.text);
   root.style.setProperty('--color-btn-danger-text-hover', theme.button.danger.textHover);
   root.style.setProperty('--color-btn-danger-border', theme.button.danger.border);
   root.style.setProperty('--color-btn-danger-border-hover', theme.button.danger.borderHover);

   // Button Success
   root.style.setProperty('--color-btn-success-bg', theme.button.success.background);
   root.style.setProperty('--color-btn-success-bg-hover', theme.button.success.backgroundHover);
   root.style.setProperty('--color-btn-success-bg-active', theme.button.success.backgroundActive);
   root.style.setProperty('--color-btn-success-text', theme.button.success.text);
   root.style.setProperty('--color-btn-success-text-hover', theme.button.success.textHover);
   root.style.setProperty('--color-btn-success-border', theme.button.success.border);
   root.style.setProperty('--color-btn-success-border-hover', theme.button.success.borderHover);

   // Button Ghost
   root.style.setProperty('--color-btn-ghost-bg', theme.button.ghost.background);
   root.style.setProperty('--color-btn-ghost-bg-hover', theme.button.ghost.backgroundHover);
   root.style.setProperty('--color-btn-ghost-bg-active', theme.button.ghost.backgroundActive);
   root.style.setProperty('--color-btn-ghost-text', theme.button.ghost.text);
   root.style.setProperty('--color-btn-ghost-text-hover', theme.button.ghost.textHover);

   // Button Outline
   root.style.setProperty('--color-btn-outline-bg', theme.button.outline.background);
   root.style.setProperty('--color-btn-outline-bg-hover', theme.button.outline.backgroundHover);
   root.style.setProperty('--color-btn-outline-bg-active', theme.button.outline.backgroundActive);
   root.style.setProperty('--color-btn-outline-text', theme.button.outline.text);
   root.style.setProperty('--color-btn-outline-text-hover', theme.button.outline.textHover);
   root.style.setProperty('--color-btn-outline-border', theme.button.outline.border);
   root.style.setProperty('--color-btn-outline-border-hover', theme.button.outline.borderHover);

   // Status Colors
   root.style.setProperty('--color-status-success', theme.status.success.default);
   root.style.setProperty('--color-status-success-hover', theme.status.success.hover);
   root.style.setProperty('--color-status-success-text', theme.status.success.text);
   root.style.setProperty('--color-status-success-bg', theme.status.success.background);
   root.style.setProperty('--color-status-success-border', theme.status.success.border);

   root.style.setProperty('--color-status-warning', theme.status.warning.default);
   root.style.setProperty('--color-status-warning-hover', theme.status.warning.hover);
   root.style.setProperty('--color-status-warning-text', theme.status.warning.text);
   root.style.setProperty('--color-status-warning-bg', theme.status.warning.background);
   root.style.setProperty('--color-status-warning-border', theme.status.warning.border);

   root.style.setProperty('--color-status-error', theme.status.error.default);
   root.style.setProperty('--color-status-error-hover', theme.status.error.hover);
   root.style.setProperty('--color-status-error-text', theme.status.error.text);
   root.style.setProperty('--color-status-error-bg', theme.status.error.background);
   root.style.setProperty('--color-status-error-border', theme.status.error.border);

   root.style.setProperty('--color-status-info', theme.status.info.default);
   root.style.setProperty('--color-status-info-hover', theme.status.info.hover);
   root.style.setProperty('--color-status-info-text', theme.status.info.text);
   root.style.setProperty('--color-status-info-bg', theme.status.info.background);
   root.style.setProperty('--color-status-info-border', theme.status.info.border);

   // Overlays
   root.style.setProperty('--color-overlay-backdrop', theme.overlay.backdrop);
   root.style.setProperty('--color-overlay-scrim', theme.overlay.scrim);
   root.style.setProperty('--color-overlay-tooltip', theme.overlay.tooltip);

   // Shadows
   root.style.setProperty('--shadow-sm', theme.shadow.sm);
   root.style.setProperty('--shadow-md', theme.shadow.md);
   root.style.setProperty('--shadow-lg', theme.shadow.lg);
   root.style.setProperty('--shadow-xl', theme.shadow.xl);
   root.style.setProperty('--shadow-2xl', theme.shadow['2xl']);
   root.style.setProperty('--shadow-inner', theme.shadow.inner);

   // Gradients (opcional)
   if (theme.gradient) {
      root.style.setProperty('--gradient-primary', theme.gradient.primary);
      root.style.setProperty('--gradient-secondary', theme.gradient.secondary);
      root.style.setProperty('--gradient-accent', theme.gradient.accent);
   }

   // Actualizar clase dark en html
   if (mode === 'dark') {
      document.documentElement.classList.add('dark');
   } else {
      document.documentElement.classList.remove('dark');
   }
}

/**
 * Provider de Tema
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
   const { currentBrand } = useAuthStore();
   const { darkMode, setDarkMode } = useUIStore();

   const [brandId, setBrandId] = useState(currentBrand?.id || 'bet30');
   const [mode, setMode] = useState<'light' | 'dark'>(darkMode ? 'dark' : 'light');

   // Obtener configuración de tema
   const themeConfig = getThemeConfig(brandId);
   const theme = mode === 'dark' ? themeConfig.themes.dark : themeConfig.themes.light;

   // Sincronizar con currentBrand
   useEffect(() => {
      if (currentBrand?.id && currentBrand.id !== brandId) {
         setBrandId(currentBrand.id);
      }
   }, [currentBrand, brandId]);

   // Sincronizar con darkMode del store
   useEffect(() => {
      const newMode = darkMode ? 'dark' : 'light';
      if (newMode !== mode) {
         setMode(newMode);
      }
   }, [darkMode, mode]);

   // Aplicar tema al DOM
   useEffect(() => {
      applyThemeToDOM(theme, mode);
   }, [theme, mode]);

   // Handlers
   const handleSetMode = (newMode: 'light' | 'dark') => {
      setMode(newMode);
      setDarkMode(newMode === 'dark');
   };

   const handleSwitchBrand = (newBrandId: string) => {
      setBrandId(newBrandId);
   };

   const value: ThemeContextValue = {
      theme,
      mode,
      brandId,
      setMode: handleSetMode,
      switchBrand: handleSwitchBrand,
   };

   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook para acceder al tema activo
 */
export function useTheme(): ThemeContextValue {
   const context = useContext(ThemeContext);

   if (!context) {
      throw new Error('useTheme must be used within a ThemeProvider');
   }

   return context;
}
