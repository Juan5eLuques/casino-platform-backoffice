import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api';
import { useAuthStore } from '@/store';
import type { LoginCredentials } from '@/types';

// Query keys
export const authKeys = {
   all: ['auth'] as const,
   user: () => [...authKeys.all, 'user'] as const,
};

// Auth hooks
export const useLogin = () => {
   const login = useAuthStore(state => state.login);
   const navigate = useNavigate();

   return useMutation({
      mutationFn: (credentials: LoginCredentials) => login(credentials),
      onSuccess: () => {
         // Toast de éxito
         toast.success('¡Bienvenido! Iniciando sesión...');

         // Navegar al dashboard después del login exitoso
         navigate('/dashboard', { replace: true });
      },
      onError: (error: any) => {
         // Toast de error
         const errorMessage = error?.response?.data?.message || error?.message || 'Error al iniciar sesión';
         toast.error(errorMessage);
      },
   });
};

export const useLogout = () => {
   const logout = useAuthStore(state => state.logout);
   const queryClient = useQueryClient();
   const navigate = useNavigate();

   return useMutation({
      mutationFn: () => logout(),
      onSuccess: () => {
         // Clear all cached data on logout
         queryClient.clear();

         // Toast de éxito
         toast.success('Sesión cerrada correctamente');

         // Navegar al login después del logout
         navigate('/login', { replace: true });
      },
   });
};

export const useCurrentUser = () => {
   const { user, isAuthenticated } = useAuthStore();

   return useQuery({
      queryKey: authKeys.user(),
      queryFn: authApi.getMe,
      enabled: isAuthenticated && !user,
      staleTime: 1000 * 60 * 5, // 5 minutes
   });
};