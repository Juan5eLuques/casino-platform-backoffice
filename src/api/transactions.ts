import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   TransactionFilters,
   TransactionResponse,
   CreateTransactionRequest,
   PaginatedResponse,
   UserBalanceResponse
} from '@/types';

export const transactionsApi = {
   // Get transactions with filters and pagination
   getTransactions: async (filters: TransactionFilters = {}): Promise<PaginatedResponse<TransactionResponse>> => {
      try {
         const params = new URLSearchParams();
         
         // Agregar todos los parámetros de filtro válidos
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
               params.append(key, value.toString());
            }
         });

         const response = await apiClient.get(`/admin/transactions?${params.toString()}`);
         return {
            data: response.data.transactions,
            pagination: {
               page: response.data.page,
               limit: response.data.pageSize,
               total: response.data.totalCount,
               pages: response.data.totalPages
            },
         };
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Create transaction (send/remove balance)
   createTransaction: async (transactionData: CreateTransactionRequest): Promise<TransactionResponse> => {
      try {
         const response = await apiClient.post('/admin/transactions', transactionData);
         return handleApiResponse<TransactionResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get user balance - Convenience method
   getUserBalance: async (userId: string, userType: 'BACKOFFICE' | 'PLAYER'): Promise<UserBalanceResponse> => {
      try {
         const response = await apiClient.get(`/admin/users/${userId}/balance?userType=${userType}`);
         return handleApiResponse<UserBalanceResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Helper method to send balance (positive transaction)
   sendBalance: async (
      fromUserId: string,
      fromUserType: 'BACKOFFICE' | 'PLAYER',
      toUserId: string,
      toUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description: string,
      idempotencyKey?: string
   ): Promise<TransactionResponse> => {
      const transactionData: CreateTransactionRequest = {
         fromUserId,
         fromUserType,
         toUserId,
         toUserType,
         amount: Math.abs(amount), // Asegurar que sea positivo
         description,
         idempotencyKey: idempotencyKey || `send-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      return transactionsApi.createTransaction(transactionData);
   },

   // Helper method to remove balance (inverse transaction)
   removeBalance: async (
      fromUserId: string,
      fromUserType: 'BACKOFFICE' | 'PLAYER',
      targetUserId: string,
      targetUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description: string,
      idempotencyKey?: string
   ): Promise<TransactionResponse> => {
      // Para quitar balance, invertimos fromUserId y toUserId
      const transactionData: CreateTransactionRequest = {
         fromUserId: targetUserId,    // El usuario al que le quitamos
         fromUserType: targetUserType,
         toUserId: fromUserId,        // El admin que quita
         toUserType: fromUserType,
         amount: Math.abs(amount),    // Mantener positivo
         description: `Retiro: ${description}`,
         idempotencyKey: idempotencyKey || `remove-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      return transactionsApi.createTransaction(transactionData);
   },
};