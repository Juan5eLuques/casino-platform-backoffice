import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BackofficeUser, Brand, LoginCredentials } from '@/types';
import { authApi, brandsApi } from '@/api';

interface AuthState {
   user: BackofficeUser | null;
   isAuthenticated: boolean;
   currentBrand: Brand | null;
   availableBrands: Brand[];
   isLoading: boolean;
   error: string | null;
}

interface AuthActions {
   login: (credentials: LoginCredentials) => Promise<void>;
   logout: () => Promise<void>;
   loadUser: () => Promise<void>;
   loadBrands: () => Promise<void>;
   switchBrand: (brand: Brand) => void;
   clearError: () => void;
   checkSession: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
   persist(
      (set, get) => ({
         // State
         user: null,
         isAuthenticated: false,
         currentBrand: null,
         availableBrands: [],
         isLoading: false,
         error: null,

         // Actions
         login: async (credentials: LoginCredentials) => {
            try {
               set({ isLoading: true, error: null });

               // authApi.login(credentials) solo hace POST y no usa el body de respuesta
               // La cookie la maneja el navegador automáticamente
               await authApi.login(credentials);

               // Después del login, llamar a /admin/auth/me para poblar el usuario
               const user = await authApi.getMe();

               set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
               });

               // Load available brands after successful login
               await get().loadBrands();
            } catch (error) {
               const errorMessage = error instanceof Error ? error.message : 'Error de login';
               set({
                  error: errorMessage,
                  isLoading: false,
                  isAuthenticated: false,
                  user: null,
               });
               throw error;
            }
         },

         logout: async () => {
            try {
               await authApi.logout();
            } catch (error) {
               console.error('Logout error:', error);
            } finally {
               set({
                  user: null,
                  isAuthenticated: false,
                  currentBrand: null,
                  availableBrands: [],
                  error: null,
               });
            }
         },

         loadUser: async () => {
            try {
               set({ isLoading: true, error: null });

               const user = await authApi.getMe();

               set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
               });

               // Load brands after loading user
               await get().loadBrands();
            } catch (error: any) {
               // Solo mostrar error si no es 401 (no autenticado es esperado)
               if (error.response?.status !== 401) {
                  console.error('Load user error:', error);
               }
               set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  error: error.response?.status === 401 ? null : 'Error al cargar usuario',
               });
            }
         },

         loadBrands: async () => {
            try {
               const response = await brandsApi.getBrands({ page: 1, limit: 100 });
               const brands = response.data;

               set({
                  availableBrands: brands,
                  currentBrand: brands.length > 0 ? brands[0] : null,
               });
            } catch (error) {
               console.error('Load brands error:', error);
            }
         },

         switchBrand: (brand: Brand) => {
            set({ currentBrand: brand });
         },

         clearError: () => {
            set({ error: null });
         },

         checkSession: async () => {
            try {
               set({ isLoading: true });

               // Intentar obtener el usuario actual con la cookie existente
               const user = await authApi.getMe();

               set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
               });

               // Load available brands after successful session check
               await get().loadBrands();
            } catch (error) {
               // Si falla, limpiar el estado de autenticación
               set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                  currentBrand: null,
                  availableBrands: [],
               });
            }
         },
      }),
      {
         name: 'auth-store',
         partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            currentBrand: state.currentBrand,
         }),
      }
   )
);