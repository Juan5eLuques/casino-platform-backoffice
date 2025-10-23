/**
 * Formatting utilities for dashboard data
 */

/**
 * Formatea un número como moneda en USD
 * @example formatCurrency(50000) → "$50,000.00"
 */
export function formatCurrency(amount: number): string {
   return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
   }).format(amount);
}

/**
 * Formatea un número como porcentaje
 * @example formatPercent(5.25) → "5.25%"
 */
export function formatPercent(value: number): string {
   return `${value.toFixed(2)}%`;
}

/**
 * Formatea un número con separadores de miles
 * @example formatNumber(1234) → "1,234"
 */
export function formatNumber(value: number): string {
   return new Intl.NumberFormat('es-AR').format(value);
}

/**
 * Formatea números grandes en formato compacto (K, M)
 * @example formatCompact(50000) → "$50K"
 * @example formatCompact(1500000) → "$1.5M"
 */
export function formatCompact(amount: number): string {
   if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
   }
   if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(1)}K`;
   }
   return formatCurrency(amount);
}

/**
 * Formatea tiempo relativo desde una fecha
 * @example formatTimeAgo(new Date(Date.now() - 120000)) → "Hace 2 min"
 */
export function formatTimeAgo(date: Date): string {
   const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

   if (seconds < 60) return 'Hace unos segundos';
   if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
   if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
   return `Hace ${Math.floor(seconds / 86400)} días`;
}

/**
 * Calcula el porcentaje de un valor sobre el total
 * @example getPercentage(25, 100) → 25
 */
export function getPercentage(value: number, total: number): number {
   if (total === 0) return 0;
   return (value / total) * 100;
}

/**
 * Formatea un porcentaje con decimales opcionales
 * @example formatPercentage(25.5, 1) → "25.5%"
 */
export function formatPercentage(value: number, decimals: number = 0): string {
   return `${value.toFixed(decimals)}%`;
}
