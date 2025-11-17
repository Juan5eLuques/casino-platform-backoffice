import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions';
import { useApiErrorHandler } from './useApiErrorHandler';
import type {
   TransactionFilters,
   CreateTransactionRequest
} from '@/types';

/**
 * Hook para obtener lista de transacciones con filtros
 */
export function useTransactions(filters: TransactionFilters = {}) {
   return useQuery({
      queryKey: ['transactions', filters],
      queryFn: () => transactionsApi.getTransactions(filters),
   });
}

/**
 * Hook para obtener el balance de un usuario
 */
export function useUserBalance(userId: string, userType: 'BACKOFFICE' | 'PLAYER') {
   return useQuery({
      queryKey: ['userBalance', userId, userType],
      queryFn: () => transactionsApi.getUserBalance(userId, userType),
      enabled: !!userId && !!userType,
   });
}

/**
 * Hook genérico para crear transacciones
 */
export function useCreateTransaction() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: (transactionData: CreateTransactionRequest) =>
         transactionsApi.createTransaction(transactionData),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}

/**
 * Hook para DEPÓSITO - Botón [+] en el frontend
 * - SUPER_ADMIN: Usa DEPOSIT (crea dinero desde null)
 * - Otros roles: Usa TRANSFER (desde su wallet)
 */
export function useDepositFunds() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: ({
         currentUserId,
         currentUserType,
         isSuperAdmin,
         toUserId,
         toUserType,
         amount,
         description
      }: {
         currentUserId: string;
         currentUserType: 'BACKOFFICE' | 'PLAYER';
         isSuperAdmin: boolean;
         toUserId: string;
         toUserType: 'BACKOFFICE' | 'PLAYER';
         amount: number;
         description?: string;
      }) => transactionsApi.depositFunds(
         currentUserId,
         currentUserType,
         isSuperAdmin,
         toUserId,
         toUserType,
         amount,
         description
      ),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}

/**
 * Hook para RETIRO - Botón [-] en el frontend
 * Usa TRANSFER invirtiendo los usuarios: del target al current user
 */
export function useWithdrawFunds() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: ({
         currentUserId,
         currentUserType,
         targetUserId,
         targetUserType,
         amount,
         description
      }: {
         currentUserId: string;
         currentUserType: 'BACKOFFICE' | 'PLAYER';
         targetUserId: string;
         targetUserType: 'BACKOFFICE' | 'PLAYER';
         amount: number;
         description?: string;
      }) => transactionsApi.withdrawFunds(
         currentUserId,
         currentUserType,
         targetUserId,
         targetUserType,
         amount,
         description
      ),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}

/**
 * Hook para TRANSFERENCIA EXPLÍCITA
 * Transferir fondos entre usuarios específicos
 */
export function useTransferBetweenUsers() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: ({
         fromUserId,
         fromUserType,
         toUserId,
         toUserType,
         amount,
         description
      }: {
         fromUserId: string;
         fromUserType: 'BACKOFFICE' | 'PLAYER';
         toUserId: string;
         toUserType: 'BACKOFFICE' | 'PLAYER';
         amount: number;
         description?: string;
      }) => transactionsApi.transferBetweenUsers(
         fromUserId,
         fromUserType,
         toUserId,
         toUserType,
         amount,
         description
      ),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}

/**
 * Hook para ROLLBACK
 * Revierte una transacción usando su externalRef
 */
export function useRollbackTransaction() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: (externalRef: string) =>
         transactionsApi.rollbackTransaction(externalRef),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}

// ========== HOOKS LEGACY (mantener compatibilidad) ==========
// Estos hooks usan los nuevos métodos internamente

/**
 * @deprecated Usar useDepositFunds
 */
export function useSendBalance() {
   return useDepositFunds();
}

/**
 * @deprecated Usar useWithdrawFunds
 */
export function useRemoveBalance() {
   return useWithdrawFunds();
}