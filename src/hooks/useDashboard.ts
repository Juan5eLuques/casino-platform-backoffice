import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';
import type { DashboardScope } from '../types/dashboard';

interface UseDashboardParams {
   scope: DashboardScope;
   from?: Date;
   to?: Date;
   timezone?: string;
   autoRefresh?: boolean;
}

/**
 * Hook personalizado para obtener datos del dashboard
 * 
 * @param scope - Alcance de los datos (DIRECT, TREE, GLOBAL)
 * @param from - Fecha de inicio del período
 * @param to - Fecha de fin del período
 * @param timezone - Zona horaria (default: UTC)
 * @param autoRefresh - Habilitar actualización automática cada 30s
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useDashboard({
 *   scope: 'TREE',
 *   from: new Date('2025-01-01'),
 *   to: new Date(),
 *   autoRefresh: true
 * });
 * ```
 */
export function useDashboard({
   scope,
   from,
   to,
   timezone = 'UTC',
   autoRefresh = false,
}: UseDashboardParams) {
   return useQuery({
      queryKey: ['dashboard', 'overview', scope, from?.toISOString(), to?.toISOString(), timezone],
      queryFn: async () => {
         const params = {
            scope,
            ...(from && { from: from.toISOString() }),
            ...(to && { to: to.toISOString() }),
            timezone,
         };

         return dashboardApi.getOverview(params);
      },
      refetchInterval: autoRefresh ? 30000 : false, // 30 segundos
      staleTime: 30000, // Los datos se consideran frescos por 30s
      retry: 3, // Reintentar 3 veces en caso de error
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
   });
}
