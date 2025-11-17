import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandAssetsApi } from '@/api';
import type {
   ColorPalette,
   BannerSection,
   MediaType,
} from '@/types';

/**
 * Hook to get brand asset settings
 */
export function useBrandAssets() {
   return useQuery({
      queryKey: ['brandAssets', 'settings'],
      queryFn: () => brandAssetsApi.getSettings(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
   });
}

/**
 * Hook to initialize brand assets
 */
export function useInitializeBrandAssets() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: () => brandAssetsApi.initialize(),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandAssets'] });
      },
   });
}

/**
 * Hook to upload media (logo/favicon)
 */
export function useUploadMedia() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ type, file }: { type: MediaType; file: File }) =>
         brandAssetsApi.uploadMedia(type, file),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandAssets'] });
      },
   });
}

/**
 * Hook to delete media (logo/favicon)
 */
export function useDeleteMedia() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (type: MediaType) => brandAssetsApi.deleteMedia(type),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandAssets'] });
      },
   });
}

/**
 * Hook to upload banner
 */
export function useUploadBanner() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ section, file }: { section: BannerSection; file: File }) =>
         brandAssetsApi.uploadBanner(section, file),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandAssets'] });
      },
   });
}

/**
 * Hook to delete banner
 */
export function useDeleteBanner() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ section, fileName }: { section: BannerSection; fileName: string }) =>
         brandAssetsApi.deleteBanner(section, fileName),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandAssets'] });
      },
   });
}

/**
 * Hook to update colors
 */
export function useUpdateColors() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (colors: ColorPalette) => brandAssetsApi.updateColors(colors),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandAssets'] });
      },
   });
}

/**
 * Hook to publish configuration
 */
export function usePublishConfig() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: () => brandAssetsApi.publishConfig(),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['brandAssets'] });
      },
   });
}
