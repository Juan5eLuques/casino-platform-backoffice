import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   Game,
   GameFilters,
   PaginatedResponse
} from '@/types';

export const gamesApi = {
   // Get games with filters and pagination
   getGames: async (filters: GameFilters = {}): Promise<PaginatedResponse<Game>> => {
      try {
         const params = new URLSearchParams();
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
               params.append(key, value.toString());
            }
         });

         const response = await apiClient.get(`/admin/games?${params.toString()}`);
         return {
            data: response.data.games,
            pagination: response.data.pagination,
         };
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get game by ID
   getGame: async (gameId: string): Promise<Game> => {
      try {
         const response = await apiClient.get(`/admin/games/${gameId}`);
         return handleApiResponse<Game>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Create new game
   createGame: async (gameData: {
      code: string;
      provider: string;
      name: string;
      category: Game['category'];
      enabled: boolean;
      meta?: Game['meta'];
   }): Promise<Game> => {
      try {
         const response = await apiClient.post('/admin/games', gameData);
         return handleApiResponse<Game>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Update game
   updateGame: async (gameId: string, updates: Partial<Game>): Promise<Game> => {
      try {
         const response = await apiClient.patch(`/admin/games/${gameId}`, updates);
         return handleApiResponse<Game>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },
};