import type { BrandThemeConfig } from './types';
import { bet30Theme } from './brands/bet30';
import { pinnacleConfig } from './brands/pinnacle';

/**
 * Registro de todos los temas disponibles por brandId
 */
export const THEME_REGISTRY: Record<string, BrandThemeConfig> = {
   bet30: bet30Theme,
   pinnacle: pinnacleConfig,
   // Agregar más brands aquí:
   // betsson: betssonTheme,
};

/**
 * Obtener configuración de tema por brandId
 */
export function getThemeConfig(brandId: string): BrandThemeConfig {
   const config = THEME_REGISTRY[brandId];

   if (!config) {
      console.warn(`Theme for brand "${brandId}" not found. Falling back to bet30.`);
      return THEME_REGISTRY.bet30;
   }

   return config;
}

/**
 * Obtener todos los brandIds disponibles
 */
export function getAvailableBrands(): string[] {
   return Object.keys(THEME_REGISTRY);
}

/**
 * Validar si un brandId tiene tema configurado
 */
export function hasBrandTheme(brandId: string): boolean {
   return brandId in THEME_REGISTRY;
}
