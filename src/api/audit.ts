import { apiClient } from './client';
import { AuditLog, ProviderAuditLog, PaginatedResponse } from '@/types';

interface BackofficeAuditParams {
   userId?: string;
   action?: string;
   targetType?: string;
   targetId?: string;
   page?: number;
   pageSize?: number;
   startDate?: string;
   endDate?: string;
}

interface ProviderAuditParams {
   provider?: string;
   sessionId?: string;
   playerId?: string;
   brandCode?: string;
   action?: string;
   page?: number;
   pageSize?: number;
   startDate?: string;
   endDate?: string;
}

export const auditApi = {
   /**
    * Obtener logs de auditoría del backoffice
    */
   getBackofficeLogs: async (params?: BackofficeAuditParams) => {
      const response = await apiClient.get<PaginatedResponse<AuditLog>>(
         '/api/v1/admin/audit/backoffice',
         { params }
      );
      return response.data;
   },

   /**
    * Obtener logs de auditoría de providers
    */
   getProviderLogs: async (params?: ProviderAuditParams) => {
      const response = await apiClient.get<PaginatedResponse<ProviderAuditLog>>(
         '/api/v1/admin/audit/provider',
         { params }
      );
      return response.data;
   },

   /**
    * Exportar logs de auditoría a CSV (opcional)
    */
   exportBackofficeLogs: async (params?: BackofficeAuditParams) => {
      const response = await apiClient.get('/api/v1/admin/audit/backoffice/export', {
         params,
         responseType: 'blob',
      });
      return response.data;
   },

   /**
    * Exportar logs de providers a CSV (opcional)
    */
   exportProviderLogs: async (params?: ProviderAuditParams) => {
      const response = await apiClient.get('/api/v1/admin/audit/provider/export', {
         params,
         responseType: 'blob',
      });
      return response.data;
   },
};
