import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   Game,
   GameFilters,
   CatalogGamesResponse
} from '@/types';

export const gamesApi = {
   // Get catalog games with filters and pagination
   getCatalogGames: async (filters: GameFilters = {}): Promise<CatalogGamesResponse> => {
      try {
         const params = new URLSearchParams();

         // Solo agregar parámetros que tengan valor
         if (filters.page) params.append('page', filters.page.toString());
         if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
         if (filters.type) params.append('type', filters.type);
         if (filters.category) params.append('category', filters.category);
         if (filters.provider) params.append('provider', filters.provider);
         if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
         if (filters.enabled !== undefined) params.append('enabled', filters.enabled.toString());

         const response = await apiClient.get(`/catalog/games?${params.toString()}`);
         return handleApiResponse<CatalogGamesResponse>(response);
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

   // Create new game (Admin)
   createGame: async (gameData: Partial<Game>): Promise<Game> => {
      try {
         const response = await apiClient.post('/admin/games', gameData);
         return handleApiResponse<Game>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Update game (Admin)
   updateGame: async (gameId: string, updates: Partial<Game>): Promise<Game> => {
      try {
         const response = await apiClient.patch(`/admin/games/${gameId}`, updates);
         return handleApiResponse<Game>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Delete game (Admin)
   deleteGame: async (gameId: string): Promise<void> => {
      try {
         const response = await apiClient.delete(`/admin/games/${gameId}`);
         return handleApiResponse<void>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },
};