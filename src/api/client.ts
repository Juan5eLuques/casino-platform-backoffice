import axios from 'axios';
import toast from 'react-hot-toast';

// ✅ Configuración según especificaciones para JWT cookie HttpOnly + CORS
// 🔥 IMPORTANTE: En producción usa PROXY de Netlify - ver NETLIFY-PROXY-GUIDE.md
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const IS_DEVELOPMENT = import.meta.env.DEV;
const ENABLE_LOGGING = import.meta.env.VITE_ENABLE_API_LOGGING === 'true';

// Create axios instance con withCredentials OBLIGATORIO para cookies HttpOnly
export const apiClient = axios.create({
   baseURL: API_BASE_URL,
   withCredentials: true, // ✅ OBLIGATORIO: para enviar cookies HttpOnly automáticamente
   headers: {
      'Content-Type': 'application/json'
   },
   timeout: 10000,
});

// Request interceptor para logging
apiClient.interceptors.request.use(
   (config) => {
      // Logging en desarrollo si está habilitado
      if (IS_DEVELOPMENT && ENABLE_LOGGING) {
         console.log('🔗 API Request:', config.method?.toUpperCase(), config.url, {
            baseURL: config.baseURL,
            withCredentials: config.withCredentials,
            data: config.data
         });
      }
      return config;
   },
   (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
   }
);

// Response interceptor para logging y manejo de errores
apiClient.interceptors.response.use(
   (response) => {
      // Logging en desarrollo si está habilitado
      if (IS_DEVELOPMENT && ENABLE_LOGGING) {
         console.log('✅ API Response:', response.status, response.config.url, response.data);
      }
      return response;
   },
   (error) => {
      // Logging detallado de errores en desarrollo
      if (IS_DEVELOPMENT) {
         console.error('❌ Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            url: error.config?.url,
            data: error.response?.data
         });
      }

      // Handle common HTTP errors
      if (error.response) {
         const { status, data } = error.response;

         switch (status) {
            case 401:
               // Unauthorized - solo redirect si no es login o /me
               const isLoginEndpoint = error.config?.url?.includes('/auth/login');
               const isMeEndpoint = error.config?.url?.includes('/auth/me');

               if (!isLoginEndpoint && !isMeEndpoint && window.location.pathname !== '/login') {
                  console.warn('🔒 Unauthorized - JWT cookie issue detected');
                  console.warn('Request URL:', error.config?.url);
                  console.warn('Request Headers:', error.config?.headers);
                  console.warn('Response Data:', error.response?.data);

                  // NO hacer redirect automático - dejar que el componente maneje el error
                  // toast.error('Error de autenticación. Verifica tu sesión.');

                  // Solo redirigir si es un endpoint crítico
                  if (error.config?.url?.includes('/me') || error.config?.url?.includes('/profile')) {
                     console.warn('Critical auth endpoint failed - redirecting to login');
                     toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                     window.location.href = '/login';
                  }
               }
               break;
            case 403:
               toast.error('No tienes permisos para realizar esta acción.');
               break;
            case 404:
               toast.error('Recurso no encontrado.');
               break;
            case 422:
               // Validation errors
               const errorMessage = data?.message || 'Error de validación';
               toast.error(errorMessage);
               break;
            case 500:
               toast.error('Error interno del servidor. Intenta nuevamente.');
               break;
            default:
               toast.error('Ha ocurrido un error inesperado.');
         }
      } else if (error.request) {
         // Network error
         toast.error('Error de conexión. Verifica tu conexión a internet.');
      } else {
         // Other error
         toast.error('Ha ocurrido un error inesperado.');
      }

      return Promise.reject(error);
   }
);

// Helper function to handle API errors
export const handleApiError = (error: any): never => {
   if (error.response) {
      throw new Error(error.response.data?.message || 'API Error');
   } else if (error.request) {
      throw new Error('Network Error');
   } else {
      throw new Error(error.message || 'Unknown Error');
   }
};

// Helper function to wrap API calls with consistent error handling
export const handleApiCall = async <T>(apiCall: () => Promise<any>): Promise<T> => {
   try {
      const response = await apiCall();
      return response.data;
   } catch (error) {
      return handleApiError(error);
   }
};

// Backward compatibility - just extract data from response
export const handleApiResponse = <T>(response: any): T => {
   return response.data;
};

// Export configuration for debugging
export const getApiConfig = () => ({
   baseURL: API_BASE_URL,
   isDevelopment: IS_DEVELOPMENT,
   loggingEnabled: ENABLE_LOGGING,
   withCredentials: true,
});

// Helper para debugging en consola
if (IS_DEVELOPMENT && typeof window !== 'undefined') {
   (window as any).apiDebug = {
      config: getApiConfig(),
      testConnection: async () => {
         try {
            console.log('🧪 Testing API connection...');
            const response = await apiClient.get('/health');
            console.log('✅ API is reachable:', response.data);
            return response.data;
         } catch (error) {
            console.error('❌ API connection failed:', error);
            throw error;
         }
      }
   };
   console.log('💡 API Debug available: window.apiDebug');
}