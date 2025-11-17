import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
         // Navegar al dashboard después del login exitoso
         navigate('/dashboard', { replace: true });
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