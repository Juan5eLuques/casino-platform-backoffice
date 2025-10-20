import { apiClient, handleApiResponse } from './client';
import type { UserTreeResponse, UserTreeParams } from '@/types';

export const treeApi = {
   // Get user tree
   getUserTree: async (params: UserTreeParams): Promise<UserTreeResponse> => {
      const { userId, maxDepth = 1, includeInactive = false } = params;
      
      const response = await apiClient.get(`/admin/tree/${userId}`, {
         params: {
            maxDepth,
            includeInactive,
         },
      });
      
      return handleApiResponse<UserTreeResponse>(response);
   },
};
