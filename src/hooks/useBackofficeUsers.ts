import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import { transactionsApi } from '@/api/transactions';
import toast from 'react-hot-toast';
import type { UserFilters, CreateUserForm } from '@/types';

// Query keys
export const backofficeUsersKeys = {
   all: ['backofficeUsers'] as const,
   lists: () => [...backofficeUsersKeys.all, 'list'] as const,
   list: (filters: UserFilters) => [...backofficeUsersKeys.lists(), filters] as const,
   details: () => [...backofficeUsersKeys.all, 'detail'] as const,
   detail: (id: string) => [...backofficeUsersKeys.details(), id] as const,
   wallet: (id: string) => [...backofficeUsersKeys.detail(id), 'wallet'] as const,
   transactions: (id: string, filters?: any) => [...backofficeUsersKeys.detail(id), 'transactions', filters] as const,
};

// Backoffice users list hook - using unified users API with userType filter
export const useBackofficeUsers = (filters: UserFilters = {}) => {
   const backofficeFilters = {
      ...filters,
      userType: 'BACKOFFICE' as const,
   };
   
   return useQuery({
      queryKey: backofficeUsersKeys.list(backofficeFilters),
      queryFn: () => usersApi.getUsers(backofficeFilters),
      staleTime: 1000 * 60 * 2, // 2 minutes
   });
};

// Single backoffice user hook
export const useBackofficeUser = (userId: string) => {
   return useQuery({
      queryKey: backofficeUsersKeys.detail(userId),
      queryFn: () => usersApi.getUser(userId),
      enabled: !!userId,
      staleTime: 1000 * 60 * 5, // 5 minutes
   });
};

// Backoffice user wallet hook
export const useBackofficeUserWallet = (userId: string) => {
   return useQuery({
      queryKey: backofficeUsersKeys.wallet(userId),
      queryFn: () => transactionsApi.getUserBalance(userId, 'BACKOFFICE'),
      enabled: !!userId,
      staleTime: 1000 * 30, // 30 seconds (more frequent updates for balance)
   });
};

// Backoffice user transactions hook
export const useBackofficeUserTransactions = (userId: string, filters: any = {}) => {
   const transactionFilters = {
      ...filters,
      userId: userId,
      userType: 'BACKOFFICE' as const,
   };
   
   return useQuery({
      queryKey: backofficeUsersKeys.transactions(userId, filters),
      queryFn: () => transactionsApi.getTransactions(transactionFilters),
      enabled: !!userId,
      staleTime: 1000 * 60 * 2, // 2 minutes
   });
};

// Create backoffice user mutation
export const useCreateBackofficeUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (userData: CreateUserForm) => usersApi.createUser({
         ...userData,
         // El role ya viene en userData (1=BRAND_ADMIN, 2=CASHIER, 3=SUPER_ADMIN)
      }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: backofficeUsersKeys.lists() });
         toast.success('Usuario de backoffice creado exitosamente');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al crear usuario de backoffice');
      },
   });
};

// Update backoffice user mutation
export const useUpdateBackofficeUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ userId, userData }: {
         userId: string;
         userData: {
            username?: string;
            password?: string;
            status?: string;
            role?: 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER';
            commissionRate?: number;
            email?: string;
         };
      }) => usersApi.updateUser(userId, userData),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: backofficeUsersKeys.detail(variables.userId) });
         queryClient.invalidateQueries({ queryKey: backofficeUsersKeys.lists() });
         toast.success('Usuario de backoffice actualizado');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al actualizar usuario de backoffice');
      },
   });
};

// Send balance between backoffice users mutation
export const useSendBalanceBetweenBackoffice = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ 
         fromUserId, 
         toUserId, 
         amount, 
         description 
      }: {
         fromUserId: string;
         toUserId: string;
         amount: number;
         description: string;
      }) => transactionsApi.sendBalance(
         fromUserId,
         'BACKOFFICE',
         toUserId,
         'BACKOFFICE',
         amount,
         description
      ),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: backofficeUsersKeys.wallet(variables.fromUserId) });
         queryClient.invalidateQueries({ queryKey: backofficeUsersKeys.wallet(variables.toUserId) });
         queryClient.invalidateQueries({ queryKey: backofficeUsersKeys.transactions(variables.fromUserId) });
         queryClient.invalidateQueries({ queryKey: backofficeUsersKeys.transactions(variables.toUserId) });
         toast.success('Saldo transferido exitosamente');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al transferir saldo');
      },
   });
};

// Change backoffice user password mutation
export const useChangeBackofficeUserPassword = () => {
   return useMutation({
      mutationFn: ({ userId, newPassword }: {
         userId: string;
         newPassword: string
      }) => usersApi.updateUser(userId, { password: newPassword }),
      onSuccess: () => {
         toast.success('Contraseña del usuario actualizada');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al cambiar contraseña');
      },
   });
};

// Reset user password mutation
export const useResetBackofficeUserPassword = () => {
   return useMutation({
      mutationFn: ({ userId, newPassword }: {
         userId: string;
         newPassword: string;
      }) => usersApi.resetUserPassword(userId, newPassword, true),
      onSuccess: () => {
         toast.success('Contraseña del usuario reseteada. El usuario deberá cambiarla en el próximo login.');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al resetear contraseña');
      },
   });
};