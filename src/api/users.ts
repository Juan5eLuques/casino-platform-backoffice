import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   UserFilters,
   PaginatedResponse,
   CreateUserForm,
   UserResponse,
   UpdateUserForm,
   UserBalanceResponse
} from '@/types';

export const usersApi = {
   // Get users with filters and pagination - Unified API
   getUsers: async (filters: UserFilters = {}): Promise<PaginatedResponse<UserResponse>> => {
      try {
         const params = new URLSearchParams();

         // Agregar todos los parámetros de filtro válidos
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
               params.append(key, value.toString());
            }
         });

         const response = await apiClient.get(`/admin/users?${params.toString()}`);
         return {
            data: response.data.data,
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

   // Get user by ID - Unified API
   getUser: async (userId: string): Promise<UserResponse> => {
      try {
         const response = await apiClient.get(`/admin/users/${userId}`);
         return handleApiResponse<UserResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Create new user - Unified API (backoffice or player)
   createUser: async (userData: CreateUserForm): Promise<UserResponse> => {
      try {
         const response = await apiClient.post('/admin/users', userData);
         return handleApiResponse<UserResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Update user - Unified API
   updateUser: async (userId: string, updates: UpdateUserForm): Promise<UserResponse> => {
      try {
         const response = await apiClient.patch(`/admin/users/${userId}`, updates);
         return handleApiResponse<UserResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Delete user - Unified API
   deleteUser: async (userId: string): Promise<void> => {
      try {
         await apiClient.delete(`/admin/users/${userId}`);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Search user by username - New endpoint
   searchUserByUsername: async (username: string): Promise<UserResponse[]> => {
      try {
         const response = await apiClient.get(`/admin/users/search?username=${encodeURIComponent(username)}`);
         return handleApiResponse<UserResponse[]>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get user balance - New endpoint
   getUserBalance: async (userId: string, userType: 'BACKOFFICE' | 'PLAYER'): Promise<UserBalanceResponse> => {
      try {
         const response = await apiClient.get(`/admin/users/${userId}/balance?userType=${userType}`);
         return handleApiResponse<UserBalanceResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Change user password
   changeUserPassword: async (
      userId: string,
      currentPassword: string,
      newPassword: string
   ): Promise<void> => {
      try {
         await apiClient.post(`/admin/users/${userId}/password`, {
            currentPassword,
            newPassword,
         });
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Reset user password (admin only)
   resetUserPassword: async (
      userId: string,
      newPassword: string,
      forceChangeOnNextLogin = true
   ): Promise<void> => {
      try {
         await apiClient.post(`/admin/users/${userId}/reset-password`, {
            newPassword,
            forceChangeOnNextLogin,
         });
      } catch (error) {
         return handleApiError(error);
      }
   },
};