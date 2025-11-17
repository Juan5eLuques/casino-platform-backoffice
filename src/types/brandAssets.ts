// Brand Assets types
export interface BrandAssetSettings {
   brandId: string;
   brandName: string;
   brandCode: string;
   colors: ColorPalette;
   banners: BannersBySection;
   media: MediaAssets;
   configUrl: string | null;
   lastUpdated: string;
}

export interface ColorPalette {
   '--color-primary'?: string;
   '--color-secondary'?: string;
   '--color-accent'?: string;
   '--color-background'?: string;
   '--color-surface'?: string;
   '--color-text'?: string;
   '--color-text-secondary'?: string;
   '--color-success'?: string;
   '--color-error'?: string;
   '--color-warning'?: string;
   [key: string]: string | undefined;
}

export interface BannersBySection {
   home: string[];
   slots: string[];
   liveCasino: string[];
}

export interface MediaAssets {
   logo: string | null;
   favicon: string | null;
   others: string[];
}

export interface UploadMediaResponse {
   success: boolean;
   url: string;
   type: 'logo' | 'favicon';
   fileName: string;
}

export interface UploadBannerResponse {
   success: boolean;
   url: string;
   section: BannerSection;
   fileName: string;
   totalBannersInSection: number;
}

export interface PublishConfigResponse {
   success: boolean;
   configUrl: string;
   publishedAt: string;
}

export interface DeleteAssetResponse {
   success: boolean;
   message: string;
}

export type BannerSection = 'home' | 'slots' | 'live-casino';
export type MediaType = 'logo' | 'favicon';
