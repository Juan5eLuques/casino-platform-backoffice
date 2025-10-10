import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions';
import { useApiErrorHandler } from './useApiErrorHandler';
import type { 
   TransactionFilters, 
   CreateTransactionRequest
} from '@/types';

export function useTransactions(filters: TransactionFilters = {}) {
   return useQuery({
      queryKey: ['transactions', filters],
      queryFn: () => transactionsApi.getTransactions(filters),
   });
}

export function useUserBalance(userId: string, userType: 'BACKOFFICE' | 'PLAYER') {
   return useQuery({
      queryKey: ['userBalance', userId, userType],
      queryFn: () => transactionsApi.getUserBalance(userId, userType),
      enabled: !!userId && !!userType,
   });
}

export function useCreateTransaction() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: (transactionData: CreateTransactionRequest) => 
         transactionsApi.createTransaction(transactionData),
      onSuccess: () => {
         // Invalidar las queries relacionadas
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}

export function useSendBalance() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: ({
         fromUserId,
         fromUserType,
         toUserId,
         toUserType,
         amount,
         description,
         idempotencyKey
      }: {
         fromUserId: string;
         fromUserType: 'BACKOFFICE' | 'PLAYER';
         toUserId: string;
         toUserType: 'BACKOFFICE' | 'PLAYER';
         amount: number;
         description: string;
         idempotencyKey?: string;
      }) => transactionsApi.sendBalance(
         fromUserId,
         fromUserType,
         toUserId,
         toUserType,
         amount,
         description,
         idempotencyKey
      ),
      onSuccess: () => {
         // Invalidar las queries relacionadas
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}

export function useRemoveBalance() {
   const queryClient = useQueryClient();
   const { handleError } = useApiErrorHandler();

   return useMutation({
      mutationFn: ({
         fromUserId,
         fromUserType,
         targetUserId,
         targetUserType,
         amount,
         description,
         idempotencyKey
      }: {
         fromUserId: string;
         fromUserType: 'BACKOFFICE' | 'PLAYER';
         targetUserId: string;
         targetUserType: 'BACKOFFICE' | 'PLAYER';
         amount: number;
         description: string;
         idempotencyKey?: string;
      }) => transactionsApi.removeBalance(
         fromUserId,
         fromUserType,
         targetUserId,
         targetUserType,
         amount,
         description,
         idempotencyKey
      ),
      onSuccess: () => {
         // Invalidar las queries relacionadas
         queryClient.invalidateQueries({ queryKey: ['transactions'] });
         queryClient.invalidateQueries({ queryKey: ['userBalance'] });
         queryClient.invalidateQueries({ queryKey: ['users'] });
      },
      onError: (error: Error) => handleError(error),
   });
}