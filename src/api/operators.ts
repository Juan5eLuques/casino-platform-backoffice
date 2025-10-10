import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   Operator,
   PaginatedResponse
} from '@/types';

export const operatorsApi = {
   // Get operators with filters and pagination
   getOperators: async (filters: {
      name?: string;
      status?: 'ACTIVE' | 'INACTIVE';
      page?: number;
      limit?: number;
   } = {}): Promise<PaginatedResponse<Operator>> => {
      try {
         const params = new URLSearchParams();
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
               params.append(key, value.toString());
            }
         });

         const response = await apiClient.get(`/admin/operators?${params.toString()}`);
         return {
            data: response.data.operators,
            pagination: response.data.pagination,
         };
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get operator by ID
   getOperator: async (operatorId: string): Promise<Operator> => {
      try {
         const response = await apiClient.get(`/admin/operators/${operatorId}`);
         return handleApiResponse<Operator>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Create new operator
   createOperator: async (operatorData: { name: string; status: 'ACTIVE' | 'INACTIVE' }): Promise<Operator> => {
      try {
         const response = await apiClient.post('/admin/operators', operatorData);
         return handleApiResponse<Operator>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Update operator
   updateOperator: async (operatorId: string, updates: Partial<Operator>): Promise<Operator> => {
      try {
         const response = await apiClient.patch(`/admin/operators/${operatorId}`, updates);
         return handleApiResponse<Operator>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Delete operator
   deleteOperator: async (operatorId: string): Promise<void> => {
      try {
         await apiClient.delete(`/admin/operators/${operatorId}`);
      } catch (error) {
         return handleApiError(error);
      }
   },
};