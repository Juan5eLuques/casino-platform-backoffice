import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users'; // API unificada para usuarios/jugadores
import { transactionsApi } from '@/api/transactions'; // API de transacciones
import toast from 'react-hot-toast';
import type { UserFilters, CreateUserForm } from '@/types';

// Query keys
export const playersKeys = {
   all: ['players'] as const,
   lists: () => [...playersKeys.all, 'list'] as const,
   list: (filters: UserFilters) => [...playersKeys.lists(), filters] as const,
   details: () => [...playersKeys.all, 'detail'] as const,
   detail: (id: string) => [...playersKeys.details(), id] as const,
   wallet: (id: string) => [...playersKeys.detail(id), 'wallet'] as const,
   transactions: (id: string, filters?: any) => [...playersKeys.detail(id), 'transactions', filters] as const,
};

// Players list hook - using unified users API with userType filter
export const usePlayers = (filters: UserFilters = {}) => {
   const playerFilters = {
      ...filters,
      userType: 'PLAYER' as const,
   };
   
   return useQuery({
      queryKey: playersKeys.list(playerFilters),
      queryFn: () => usersApi.getUsers(playerFilters),
      staleTime: 1000 * 60 * 2, // 2 minutes
   });
};

// Single player hook
export const usePlayer = (playerId: string) => {
   return useQuery({
      queryKey: playersKeys.detail(playerId),
      queryFn: () => usersApi.getUser(playerId),
      enabled: !!playerId,
      staleTime: 1000 * 60 * 5, // 5 minutes
   });
};

// Player wallet hook
export const usePlayerWallet = (playerId: string) => {
   return useQuery({
      queryKey: playersKeys.wallet(playerId),
      queryFn: () => transactionsApi.getUserBalance(playerId, 'PLAYER'),
      enabled: !!playerId,
      staleTime: 1000 * 30, // 30 seconds (more frequent updates for balance)
   });
};

// Player transactions hook
export const usePlayerTransactions = (playerId: string, filters: any = {}) => {
   const transactionFilters = {
      ...filters,
      userId: playerId,
      userType: 'PLAYER' as const,
   };
   
   return useQuery({
      queryKey: playersKeys.transactions(playerId, filters),
      queryFn: () => transactionsApi.getTransactions(transactionFilters),
      enabled: !!playerId,
      staleTime: 1000 * 60 * 2, // 2 minutes
   });
};

// Create player mutation
export const useCreatePlayer = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (playerData: CreateUserForm) => usersApi.createUser({
         ...playerData,
         role: 0, // Role 0 para Player según la nueva API
      }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: playersKeys.lists() });
         toast.success('Jugador creado exitosamente');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al crear jugador');
      },
   });
};

// Update player status mutation
export const useUpdatePlayerStatus = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ playerId, status }: {
         playerId: string;
         status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
      }) => usersApi.updateUser(playerId, { playerStatus: status }),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: playersKeys.detail(variables.playerId) });
         queryClient.invalidateQueries({ queryKey: playersKeys.lists() });
         toast.success('Estado del jugador actualizado');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al actualizar estado del jugador');
      },
   });
};

// Send balance to player mutation
export const useSendBalanceToPlayer = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ 
         fromUserId, 
         fromUserType, 
         playerId, 
         amount, 
         description 
      }: {
         fromUserId: string;
         fromUserType: 'BACKOFFICE' | 'PLAYER';
         playerId: string;
         amount: number;
         description: string;
      }) => transactionsApi.sendBalance(
         fromUserId,
         fromUserType,
         playerId,
         'PLAYER',
         amount,
         description
      ),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: playersKeys.wallet(variables.playerId) });
         queryClient.invalidateQueries({ queryKey: playersKeys.detail(variables.playerId) });
         queryClient.invalidateQueries({ queryKey: playersKeys.transactions(variables.playerId) });
         toast.success('Saldo enviado exitosamente');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al enviar saldo');
      },
   });
};

// Remove balance from player mutation
export const useRemoveBalanceFromPlayer = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ 
         fromUserId, 
         fromUserType, 
         playerId, 
         amount, 
         description 
      }: {
         fromUserId: string;
         fromUserType: 'BACKOFFICE' | 'PLAYER';
         playerId: string;
         amount: number;
         description: string;
      }) => transactionsApi.removeBalance(
         fromUserId,
         fromUserType,
         playerId,
         'PLAYER',
         amount,
         description
      ),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: playersKeys.wallet(variables.playerId) });
         queryClient.invalidateQueries({ queryKey: playersKeys.detail(variables.playerId) });
         queryClient.invalidateQueries({ queryKey: playersKeys.transactions(variables.playerId) });
         toast.success('Saldo retirado exitosamente');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al retirar saldo');
      },
   });
};

// Change player password mutation
export const useChangePlayerPassword = () => {
   return useMutation({
      mutationFn: ({ playerId, newPassword }: {
         playerId: string;
         newPassword: string
      }) => usersApi.updateUser(playerId, { password: newPassword }),
      onSuccess: () => {
         toast.success('Contraseña del jugador actualizada');
      },
      onError: (error: Error) => {
         toast.error(error.message || 'Error al cambiar contraseña');
      },
   });
};