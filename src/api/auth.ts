import { apiClient, handleApiResponse } from './client';
import type {
   LoginCredentials,
   AuthResponse,
   BackofficeUser,
   UserBalanceResponse
} from '@/types';

export const authApi = {
   // Login
   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiClient.post('/admin/auth/login', credentials);
      return handleApiResponse<AuthResponse>(response);
   },

   // Get current user profile
   getMe: async (): Promise<BackofficeUser> => {
      const response = await apiClient.get('/admin/auth/me');
      return handleApiResponse<BackofficeUser>(response);
   },

   // Get current user balance
   getBalance: async (): Promise<UserBalanceResponse> => {
      const response = await apiClient.get('/balance');
      return handleApiResponse<UserBalanceResponse>(response);
   },

   // Logout
   logout: async (): Promise<void> => {
      await apiClient.post('/admin/auth/logout');
   },
};