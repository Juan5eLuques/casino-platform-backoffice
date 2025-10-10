// Configuración Multi-Tenant Dinámica
// El backend resuelve automáticamente la marca basándose en la URL de la API

// Función para extraer el dominio base de la URL actual
const getCurrentDomain = (): string => {
   if (typeof window === 'undefined') return 'admin.bet30.local'; // SSR fallback

   const hostname = window.location.hostname;

   // Si es admin.algo.com, extraer solo "algo.com"
   if (hostname.startsWith('admin.')) {
      return hostname.replace('admin.', '');
   }

   return hostname;
};

// Función para construir la URL de la API basándose en el dominio actual
const getApiBaseUrl = (): string => {
   const currentDomain = getCurrentDomain();
   const protocol = window.location.protocol;

   // En desarrollo local
   if (currentDomain.includes('.local')) {
      return `${protocol}//${currentDomain}:5000/api/v1`;
   }

   // En producción
   return `${protocol}//${currentDomain}/api/v1`;
};

// Configuración dinámica del brand
export const getDynamicBrandConfig = () => {
   const currentDomain = getCurrentDomain();
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || getApiBaseUrl();

   return {
      // Configuración dinámica - se resolverá desde el backend
      domain: currentDomain,
      apiBaseUrl,

      // URLs calculadas dinámicamente
      urls: {
         api: apiBaseUrl,
         site: `${window.location.protocol}//${currentDomain}${window.location.port ? ':' + window.location.port : ''}`,
         admin: window.location.origin,
      },

      // Configuración de la API
      api: {
         baseURL: apiBaseUrl,
         timeout: 10000,
         withCredentials: true, // Para cookies HttpOnly
      },

      // Configuración de desarrollo
      dev: {
         enableApiLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true',
         isDevelopment: import.meta.env.DEV,
      }
   };
};

// Store para mantener información dinámica del brand (se carga desde el backend)
interface BrandInfo {
   id: string;
   operatorId: string;
   code: string;
   name: string;
   domain: string;
   adminDomain: string;
   locale: string;
   status: string;
   theme?: {
      colors?: Record<string, string>;
      logo?: string;
   };
}

// Estado global del brand actual (se poblará desde la API)
let currentBrandInfo: BrandInfo | null = null;

export const setBrandInfo = (brandInfo: BrandInfo) => {
   currentBrandInfo = brandInfo;
};

export const getBrandInfo = (): BrandInfo | null => {
   return currentBrandInfo;
};

// Configuración por defecto para fallback
export const defaultBrandConfig = {
   name: 'Casino Backoffice',
   code: 'default',
   locale: 'es',
   theme: {
      primary: {
         50: '#fef2f2',
         500: '#dc2626',
         900: '#7f1d1d',
      },
      secondary: {
         50: '#f8fafc',
         500: '#1e40af',
         900: '#1e3a8a',
      },
      success: {
         500: '#10b981',
      },
      warning: {
         500: '#f59e0b',
      },
      danger: {
         500: '#ef4444',
      }
   }
};