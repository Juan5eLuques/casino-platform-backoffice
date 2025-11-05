import type { BrandThemeConfig } from '../types';
import { bet30LightTheme, bet30DarkTheme } from '../default';

/**
 * Configuración de tema para Bet30
 */
export const bet30Theme: BrandThemeConfig = {
   brandId: 'bet30',
   brandName: 'Bet30',
   themes: {
      light: bet30LightTheme,
      dark: bet30DarkTheme,
   },
   defaultMode: 'light',
};
