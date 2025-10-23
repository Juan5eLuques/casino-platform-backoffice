import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   TransactionFilters,
   TransactionResponse,
   CreateTransactionRequest,
   RollbackTransactionRequest,
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

   // Create transaction - Nueva API unificada
   createTransaction: async (transactionData: CreateTransactionRequest): Promise<TransactionResponse> => {
      try {
         const response = await apiClient.post('/admin/transactions', transactionData);
         return handleApiResponse<TransactionResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Rollback transaction - Revertir una transacción
   rollbackTransaction: async (externalRef: string): Promise<TransactionResponse> => {
      try {
         const rollbackData: RollbackTransactionRequest = { externalRef };
         const response = await apiClient.post('/admin/transactions/rollback', rollbackData);
         return handleApiResponse<TransactionResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get user balance
   getUserBalance: async (userId: string, userType: 'BACKOFFICE' | 'PLAYER'): Promise<UserBalanceResponse> => {
      try {
         const response = await apiClient.get(`/admin/users/${userId}/balance?userType=${userType}`);
         return handleApiResponse<UserBalanceResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // ========== MÉTODOS HELPER PARA OPERACIONES DEL BACKOFFICE ==========

   /**
    * DEPÓSITO (Botón +)
    * - SUPER_ADMIN: Usa DEPOSIT (crea dinero desde null)
    * - Otros roles: Usa TRANSFER (desde su wallet)
    */
   depositFunds: async (
      currentUserId: string,
      currentUserType: 'BACKOFFICE' | 'PLAYER',
      isSuperAdmin: boolean,
      toUserId: string,
      toUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description?: string
   ): Promise<TransactionResponse> => {
      const transactionData: CreateTransactionRequest = {
         fromUserId: isSuperAdmin ? null : currentUserId,
         fromUserType: isSuperAdmin ? null : currentUserType,
         toUserId,
         toUserType,
         amount: Math.abs(amount),
         transactionType: isSuperAdmin ? 'MINT' : 'TRANSFER',
         idempotencyKey: `deposit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         description: description || (isSuperAdmin ? 'Depósito de fondos' : 'Transferencia de fondos')
      };

      return transactionsApi.createTransaction(transactionData);
   },

   /**
    * RETIRO (Botón -)
    * Usa TRANSFER invirtiendo los usuarios: del target al current user
    */
   withdrawFunds: async (
      currentUserId: string,
      currentUserType: 'BACKOFFICE' | 'PLAYER',
      targetUserId: string,
      targetUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description?: string
   ): Promise<TransactionResponse> => {
      const transactionData: CreateTransactionRequest = {
         fromUserId: targetUserId,  // INVERTIDO: del usuario target
         fromUserType: targetUserType,
         toUserId: currentUserId,    // INVERTIDO: hacia el usuario actual
         toUserType: currentUserType,
         amount: Math.abs(amount),
         transactionType: 'TRANSFER',
         idempotencyKey: `withdrawal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         description: description || 'Retiro de fondos'
      };

      return transactionsApi.createTransaction(transactionData);
   },

   /**
    * TRANSFERENCIA EXPLÍCITA
    * Transferir fondos entre usuarios específicos
    */
   transferBetweenUsers: async (
      fromUserId: string,
      fromUserType: 'BACKOFFICE' | 'PLAYER',
      toUserId: string,
      toUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description?: string
   ): Promise<TransactionResponse> => {
      const transactionData: CreateTransactionRequest = {
         fromUserId,
         fromUserType,
         toUserId,
         toUserType,
         amount: Math.abs(amount),
         transactionType: 'TRANSFER',
         idempotencyKey: `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         description: description || 'Transferencia entre usuarios'
      };

      return transactionsApi.createTransaction(transactionData);
   },
};