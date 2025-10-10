import { apiClient, handleApiResponse } from './client';
import type {
   LoginCredentials,
   AuthResponse,
   BackofficeUser
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

   // Logout
   logout: async (): Promise<void> => {
      await apiClient.post('/admin/auth/logout');
   },
};