import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   Player,
   PlayerFilters,
   PaginatedResponse,
   WalletInfo,
   WalletAdjustment,
   Transaction
} from '@/types';

export const playersApi = {
   // Get players with filters and pagination
   // Filtrado automático por rol y contexto de marca
   getPlayers: async (filters: PlayerFilters = {}): Promise<PaginatedResponse<Player>> => {
      try {
         const params = new URLSearchParams();
         // Solo incluir filtros de búsqueda reales - no brandId/operatorId
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && key !== 'brandId' && key !== 'operatorId') {
               params.append(key, value.toString());
            }
         });

         const response = await apiClient.get(`/admin/players?${params.toString()}`);
         return {
            data: response.data.players,
            pagination: response.data.pagination,
         };
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get player by ID
   getPlayer: async (playerId: string): Promise<Player> => {
      try {
         const response = await apiClient.get(`/admin/players/${playerId}`);
         return handleApiResponse<Player>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // DEPRECATED: Use usersApi.createUser instead - ahora los jugadores se crean vía API unificada
   createPlayer: async (playerData: any): Promise<Player> => {
      try {
         // Convertir al formato unificado de usuarios
         const userData = {
            username: playerData.username,
            password: playerData.password,
            email: playerData.email,
            externalId: playerData.externalId,
            initialBalance: playerData.initialBalance,
            playerStatus: playerData.status || 'ACTIVE'
            // No incluir role para que se detecte como jugador
         };
         const response = await apiClient.post('/admin/users', userData);
         return handleApiResponse<Player>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Update player status
   updatePlayerStatus: async (playerId: string, status: Player['status'], reason?: string): Promise<Player> => {
      try {
         const response = await apiClient.patch(`/admin/players/${playerId}/status`, {
            status,
            reason,
         });
         return handleApiResponse<Player>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get player wallet info
   getPlayerWallet: async (playerId: string): Promise<WalletInfo> => {
      try {
         const response = await apiClient.get(`/admin/players/${playerId}/wallet`);
         return handleApiResponse<WalletInfo>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Adjust player balance
   adjustPlayerBalance: async (playerId: string, adjustment: WalletAdjustment) => {
      try {
         const response = await apiClient.post(`/admin/players/${playerId}/wallet/adjust`, adjustment);
         return handleApiResponse(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get player transactions
   getPlayerTransactions: async (
      playerId: string,
      filters: {
         reason?: string;
         fromDate?: string;
         toDate?: string;
         page?: number;
         limit?: number;
      } = {}
   ): Promise<PaginatedResponse<Transaction>> => {
      try {
         const params = new URLSearchParams();
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
               params.append(key, value.toString());
            }
         });

         const response = await apiClient.get(`/admin/players/${playerId}/transactions?${params.toString()}`);
         return {
            data: response.data.transactions,
            pagination: response.data.pagination,
         };
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Change player password
   changePlayerPassword: async (playerId: string, newPassword: string): Promise<void> => {
      try {
         await apiClient.post(`/admin/players/${playerId}/password`, {
            newPassword,
         });
      } catch (error) {
         return handleApiError(error);
      }
   },
};