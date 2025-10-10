import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   Brand,
   BrandFilters,
   PaginatedResponse,
   CreateBrandForm,
   BrandGame
} from '@/types';

export const brandsApi = {
   // Get brands with filters and pagination
   getBrands: async (filters: BrandFilters = {}): Promise<PaginatedResponse<Brand>> => {
      try {
         const params = new URLSearchParams();
         Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
               params.append(key, value.toString());
            }
         });

         const response = await apiClient.get(`/admin/brands?${params.toString()}`);
         return {
            data: response.data.brands,
            pagination: response.data.pagination,
         };
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get brand by ID
   getBrand: async (brandId: string): Promise<Brand> => {
      try {
         const response = await apiClient.get(`/admin/brands/${brandId}`);
         return handleApiResponse<Brand>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Create new brand
   createBrand: async (brandData: CreateBrandForm): Promise<Brand> => {
      try {
         const response = await apiClient.post('/admin/brands', brandData);
         return handleApiResponse<Brand>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Update brand
   updateBrand: async (brandId: string, updates: Partial<Brand>): Promise<Brand> => {
      try {
         const response = await apiClient.patch(`/admin/brands/${brandId}`, updates);
         return handleApiResponse<Brand>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Get brand games
   getBrandGames: async (brandId: string): Promise<BrandGame[]> => {
      try {
         const response = await apiClient.get(`/admin/brands/${brandId}/games`);
         return response.data.games;
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Configure game for brand
   configureBrandGame: async (
      brandId: string,
      gameId: string,
      config: { enabled: boolean; displayOrder: number; tags: string[] }
   ): Promise<BrandGame> => {
      try {
         const response = await apiClient.put(`/admin/brands/${brandId}/games/${gameId}`, config);
         return handleApiResponse<BrandGame>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   // Configure provider for brand
   configureProvider: async (
      brandId: string,
      providerCode: string,
      config: {
         secret: string;
         allowNegativeOnRollback: boolean;
         meta: {
            webhookUrl: string;
            timeout: number;
         };
      }
   ): Promise<void> => {
      try {
         await apiClient.put(`/admin/brands/${brandId}/providers/${providerCode}`, config);
      } catch (error) {
         return handleApiError(error);
      }
   },
};