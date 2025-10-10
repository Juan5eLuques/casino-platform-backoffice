import { apiClient, handleApiResponse, handleApiError } from './client';
import type { Player, AssignedCashier } from '@/types';

export const assignmentsApi = {
   // Assign player to cashier
   assignPlayerToCashier: async (cashierId: string, playerId: string): Promise<{
      cashierId: string;
      playerId: string;
      cashierUsername: string;
      playerUsername: string;
      assignedAt: string;
   }> => {
      try {
         const response = await apiClient.post(`/admin/cashiers/${cashierId}/players/${playerId}`, {
            assignedAt: new Date().toISOString(),
         });
         return handleApiResponse(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get players assigned to a cashier
   getCashierPlayers: async (cashierId: string): Promise<{
      cashierId: string;
      cashierUsername: string;
      players: Player[];
   }> => {
      try {
         const response = await apiClient.get(`/admin/cashiers/${cashierId}/players`);
         return handleApiResponse(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Unassign player from cashier
   unassignPlayerFromCashier: async (cashierId: string, playerId: string): Promise<void> => {
      try {
         await apiClient.delete(`/admin/cashiers/${cashierId}/players/${playerId}`);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get cashiers assigned to a player
   getPlayerCashiers: async (playerId: string): Promise<{
      playerId: string;
      playerUsername: string;
      assignedCashiers: AssignedCashier[];
   }> => {
      try {
         const response = await apiClient.get(`/admin/players/${playerId}/cashiers`);
         return handleApiResponse(response);
      } catch (error) {
         return handleApiError(error);
      }
   },
};