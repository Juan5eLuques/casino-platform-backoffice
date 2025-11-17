import { apiClient, handleApiResponse, handleApiError } from './client';
import type {
   BrandAssetSettings,
   ColorPalette,
   UploadMediaResponse,
   UploadBannerResponse,
   PublishConfigResponse,
   DeleteAssetResponse,
   BannerSection,
   MediaType,
} from '@/types';

export const brandAssetsApi = {
   /**
    * Get current brand asset settings
    */
   getSettings: async (): Promise<BrandAssetSettings> => {
      try {
         const response = await apiClient.get('/admin/brands/assets/settings');
         return handleApiResponse<BrandAssetSettings>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Initialize brand assets structure (one-time setup)
    */
   initialize: async (): Promise<{ success: boolean; message: string; foldersCreated: string[] }> => {
      try {
         const response = await apiClient.post('/admin/brands/assets/initialize');
         return handleApiResponse(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Upload logo or favicon
    */
   uploadMedia: async (type: MediaType, file: File): Promise<UploadMediaResponse> => {
      try {
         const formData = new FormData();
         formData.append('file', file);

         const response = await apiClient.post(
            `/admin/brands/assets/upload/media/${type}`,
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );

         return handleApiResponse<UploadMediaResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Delete logo or favicon
    */
   deleteMedia: async (type: MediaType): Promise<DeleteAssetResponse> => {
      try {
         const response = await apiClient.delete(`/admin/brands/assets/media/${type}`);
         return handleApiResponse<DeleteAssetResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Upload banner for specific section
    */
   uploadBanner: async (section: BannerSection, file: File): Promise<UploadBannerResponse> => {
      try {
         const formData = new FormData();
         formData.append('file', file);

         const response = await apiClient.post(
            `/admin/brands/assets/upload/banner/${section}`,
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );

         return handleApiResponse<UploadBannerResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Delete banner
    */
   deleteBanner: async (section: BannerSection, fileName: string): Promise<DeleteAssetResponse> => {
      try {
         const response = await apiClient.delete(
            `/admin/brands/assets/banner/${section}/${fileName}`
         );
         return handleApiResponse<DeleteAssetResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Update color palette
    */
   updateColors: async (colors: ColorPalette): Promise<BrandAssetSettings> => {
      try {
         const response = await apiClient.put('/admin/brands/assets/colors', { colors });
         return handleApiResponse<BrandAssetSettings>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },

   /**
    * Publish configuration to S3
    */
   publishConfig: async (): Promise<PublishConfigResponse> => {
      try {
         const response = await apiClient.post('/admin/brands/assets/publish-config');
         return handleApiResponse<PublishConfigResponse>(response);
      } catch (error) {
         return handleApiError(error);
      }
   },
};
