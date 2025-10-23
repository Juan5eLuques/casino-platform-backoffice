import { apiClient, handleApiCall } from './client';
import type {
   DashboardOverviewResponse,
   DashboardParams,
} from '../types/dashboard';
import type { DashboardMetrics, ActivityData } from '@/types';

export const dashboardApi = {
   /**
    * Obtiene el resumen general del dashboard (NEW API)
    * @param params - Parámetros de filtrado (scope, from, to, timezone)
    * @returns Datos del dashboard con finanzas, casino, usuarios y alertas
    */
   getOverview: async (
      params: DashboardParams
   ): Promise<DashboardOverviewResponse> => {
      const searchParams = new URLSearchParams({
         scope: params.scope,
         ...(params.from && { from: params.from }),
         ...(params.to && { to: params.to }),
         ...(params.timezone && { timezone: params.timezone }),
      });

      return handleApiCall<DashboardOverviewResponse>(
         () => apiClient.get(`/admin/dashboard/overview?${searchParams}`)
      );
   },

   // ====================================
   // OLD API (Legacy) - Keep for backward compatibility
   // ====================================

   // Get dashboard metrics
   getMetrics: async (): Promise<DashboardMetrics> => {
      // This endpoint doesn't exist in the current API, so we'll simulate it
      // In a real implementation, you would create this endpoint in the backend
      const [players] = await Promise.all([
         apiClient.get('/admin/players?page=1&limit=1'),
         apiClient.get('/admin/users?page=1&limit=1'),
         apiClient.get('/admin/brands?page=1&limit=1'),
      ]);

      // Mock data - in reality this would come from dedicated dashboard endpoints
      return {
         totalPlayersActive: players.data.pagination?.total || 0,
         totalBalance: 150000, // This would come from a dedicated endpoint
         transactionsToday: 45, // This would come from a dedicated endpoint
         usersOnline: 3, // This would come from a dedicated endpoint
         revenueMonth: 25000, // This would come from a dedicated endpoint
      };
   },

   // Get activity data for charts
   getActivityData: async (days = 30): Promise<ActivityData[]> => {
      // Mock data - in reality this would come from dedicated analytics endpoints
      const data: ActivityData[] = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
         const date = new Date(today);
         date.setDate(date.getDate() - i);

         data.push({
            date: date.toISOString().split('T')[0],
            players: Math.floor(Math.random() * 50) + 10,
            transactions: Math.floor(Math.random() * 100) + 20,
            revenue: Math.floor(Math.random() * 5000) + 1000,
         });
      }

      return data;
   },
};