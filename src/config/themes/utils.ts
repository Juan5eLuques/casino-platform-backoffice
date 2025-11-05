/**
 * Utilidades para el sistema de theming
 */

import type { ContrastValidation } from './types';

/**
 * Convertir hex a RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result
      ? {
         r: parseInt(result[1], 16),
         g: parseInt(result[2], 16),
         b: parseInt(result[3], 16),
      }
      : null;
}

/**
 * Calcular luminosidad relativa (WCAG 2.0)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
   const rsRGB = r / 255;
   const gsRGB = g / 255;
   const bsRGB = b / 255;

   const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
   const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
   const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

   return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calcular ratio de contraste entre dos colores (WCAG 2.0)
 */
export function getContrastRatio(color1: string, color2: string): number {
   const rgb1 = hexToRgb(color1);
   const rgb2 = hexToRgb(color2);

   if (!rgb1 || !rgb2) {
      console.warn('Invalid color format. Use hex format (#RRGGBB)');
      return 0;
   }

   const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
   const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

   const lighter = Math.max(l1, l2);
   const darker = Math.min(l1, l2);

   return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validar contraste según WCAG 2.0
 */
export function validateContrast(
   foreground: string,
   background: string
): ContrastValidation {
   const ratio = getContrastRatio(foreground, background);

   return {
      ratio,
      passes: {
         aa: ratio >= 4.5,           // WCAG AA para texto normal
         aaLarge: ratio >= 3,        // WCAG AA para texto grande (18pt+ o 14pt+ bold)
         aaa: ratio >= 7,            // WCAG AAA para texto normal
         aaaLarge: ratio >= 4.5,     // WCAG AAA para texto grande
      },
   };
}

/**
 * Generar reporte de contraste para un tema
 */
export function generateContrastReport(theme: any): Record<string, ContrastValidation> {
   return {
      // Texto sobre fondos
      'text-primary-on-bg-primary': validateContrast(
         theme.text.primary,
         theme.background.primary
      ),
      'text-secondary-on-bg-primary': validateContrast(
         theme.text.secondary,
         theme.background.primary
      ),
      'text-primary-on-surface': validateContrast(
         theme.text.primary,
         theme.surface.default
      ),

      // Botones
      'btn-primary-text': validateContrast(
         theme.button.primary.text,
         theme.button.primary.background
      ),
      'btn-secondary-text': validateContrast(
         theme.button.secondary.text,
         theme.button.secondary.background
      ),
      'btn-danger-text': validateContrast(
         theme.button.danger.text,
         theme.button.danger.background
      ),
      'btn-success-text': validateContrast(
         theme.button.success.text,
         theme.button.success.background
      ),

      // Status
      'status-error-text': validateContrast(
         theme.status.error.text,
         theme.status.error.background
      ),
      'status-success-text': validateContrast(
         theme.status.success.text,
         theme.status.success.background
      ),
      'status-warning-text': validateContrast(
         theme.status.warning.text,
         theme.status.warning.background
      ),
      'status-info-text': validateContrast(
         theme.status.info.text,
         theme.status.info.background
      ),
   };
}

/**
 * Oscurecer un color hex
 */
export function darken(hex: string, percent: number): string {
   const rgb = hexToRgb(hex);
   if (!rgb) return hex;

   const factor = 1 - percent / 100;
   const r = Math.round(rgb.r * factor);
   const g = Math.round(rgb.g * factor);
   const b = Math.round(rgb.b * factor);

   return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
      .toString(16)
      .padStart(2, '0')}`;
}

/**
 * Aclarar un color hex
 */
export function lighten(hex: string, percent: number): string {
   const rgb = hexToRgb(hex);
   if (!rgb) return hex;

   const factor = percent / 100;
   const r = Math.round(rgb.r + (255 - rgb.r) * factor);
   const g = Math.round(rgb.g + (255 - rgb.g) * factor);
   const b = Math.round(rgb.b + (255 - rgb.b) * factor);

   return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
      .toString(16)
      .padStart(2, '0')}`;
}

/**
 * Generar variantes de un color
 */
export function generateColorVariants(baseColor: string) {
   return {
      base: baseColor,
      hover: darken(baseColor, 10),
      active: darken(baseColor, 20),
      light: lighten(baseColor, 30),
      lighter: lighten(baseColor, 50),
      lightest: lighten(baseColor, 70),
      dark: darken(baseColor, 30),
      darker: darken(baseColor, 50),
      darkest: darken(baseColor, 70),
   };
}

/**
 * Obtener valor de CSS variable
 */
export function getCSSVariable(variable: string): string {
   return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

/**
 * Establecer valor de CSS variable
 */
export function setCSSVariable(variable: string, value: string): void {
   document.documentElement.style.setProperty(variable, value);
}
