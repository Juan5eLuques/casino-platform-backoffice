/**
 * Sistema de Theming Multi-Brand
 * Exportaciones centrales
 */

// Types
export type {
   BrandTheme,
   BrandThemeConfig,
   ThemeMode,
   ThemeContextValue,
   ButtonColors,
   ButtonTheme,
   BrandColors,
   BackgroundColors,
   SurfaceColors,
   TextColors,
   BorderColors,
   StatusColors,
   ShadowConfig,
   ContrastValidation,
   ThemeDefinition,
} from './types';

// Provider y Hook
export { ThemeProvider, useTheme } from './ThemeProvider';

// Registry
export { THEME_REGISTRY, getThemeConfig, getAvailableBrands, hasBrandTheme } from './registry';

// Temas
export { bet30LightTheme, bet30DarkTheme } from './default';
export { bet30Theme } from './brands/bet30';

// Utilidades
export {
   getContrastRatio,
   validateContrast,
   generateContrastReport,
   darken,
   lighten,
   generateColorVariants,
   getCSSVariable,
   setCSSVariable,
} from './utils';
