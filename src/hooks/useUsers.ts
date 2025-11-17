import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users';
import type { UserFilters, CreateUserForm, UpdateUserForm } from '@/types';

// Query keys para todos los usuarios (unificado)
export const usersKeys = {
   all: ['users'] as const,
   lists: () => [...usersKeys.all, 'list'] as const,
   list: (filters: UserFilters) => [...usersKeys.lists(), filters] as const,
   details: () => [...usersKeys.all, 'detail'] as const,
   detail: (id: string) => [...usersKeys.details(), id] as const,
   balance: (id: string) => [...usersKeys.detail(id), 'balance'] as const,
   search: (username: string) => [...usersKeys.all, 'search', username] as const,
};

/**
 * Hook unificado para listar todos los usuarios (backoffice + players)
 * sin filtros iniciales
 */
export const useUsers = (filters: UserFilters = {}) => {
   return useQuery({
      queryKey: usersKeys.list(filters),
      queryFn: () => usersApi.getUsers(filters),
      staleTime: 1000 * 60 * 2, // 2 minutes
   });
};

/**
 * Hook para obtener un usuario específico por ID
 */
export const useUser = (userId: string) => {
   return useQuery({
      queryKey: usersKeys.detail(userId),
      queryFn: () => usersApi.getUser(userId),
      enabled: !!userId,
      staleTime: 1000 * 60 * 5, // 5 minutes
   });
};

/**
 * Hook para buscar usuario por username exacto
 */
export const useSearchUserByUsername = (username: string) => {
   return useQuery({
      queryKey: usersKeys.search(username),
      queryFn: () => usersApi.searchUserByUsername(username),
      enabled: !!username && username.length >= 3,
      staleTime: 1000 * 60, // 1 minute
   });
};

/**
 * Hook para obtener el balance de un usuario
 */
export const useUserBalance = (userId: string, userType: 'BACKOFFICE' | 'PLAYER') => {
   return useQuery({
      queryKey: usersKeys.balance(userId),
      queryFn: () => usersApi.getUserBalance(userId, userType),
      enabled: !!userId && !!userType,
      staleTime: 1000 * 30, // 30 seconds
   });
};

/**
 * Hook para crear un nuevo usuario (backoffice o player según role)
 */
export const useCreateUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (userData: CreateUserForm) => usersApi.createUser(userData),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      },
   });
};

/**
 * Hook para actualizar un usuario existente
 */
export const useUpdateUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ userId, userData }: {
         userId: string;
         userData: UpdateUserForm;
      }) => usersApi.updateUser(userId, userData),
      onSuccess: (_, variables) => {
         queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.userId) });
         queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      },
   });
};

/**
 * Hook para eliminar un usuario
 */
export const useDeleteUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (userId: string) => usersApi.deleteUser(userId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      },
   });
};

/**
 * Hook para cambiar contraseña de usuario
 */
export const useChangeUserPassword = () => {
   return useMutation({
      mutationFn: ({ userId, currentPassword, newPassword }: {
         userId: string;
         currentPassword: string;
         newPassword: string;
      }) => usersApi.changeUserPassword(userId, currentPassword, newPassword),
   });
};

/**
 * Hook para resetear contraseña de usuario (admin)
 */
export const useResetUserPassword = () => {
   return useMutation({
      mutationFn: ({ userId, newPassword }: {
         userId: string;
         newPassword: string;
      }) => usersApi.resetUserPassword(userId, newPassword, true),
   });
};
