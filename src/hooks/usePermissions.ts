import { useAuthStore } from '@/store/auth';
import {
   Permission,
   hasPermission,
   hasAllPermissions,
   hasAnyPermission,
   canManageUser,
   canManagePlayer,
   type BackofficeRole,
} from '@/lib/permissions';

/**
 * Hook para verificar permisos del usuario actual
 */
export function usePermissions() {
   const { user } = useAuthStore();

   return {
      /**
       * Verifica si el usuario tiene un permiso específico
       */
      can: (permission: Permission): boolean => {
         return hasPermission(user?.role as BackofficeRole, permission);
      },

      /**
       * Verifica si el usuario tiene TODOS los permisos especificados
       */
      canAll: (permissions: Permission[]): boolean => {
         return hasAllPermissions(user?.role as BackofficeRole, permissions);
      },

      /**
       * Verifica si el usuario tiene AL MENOS UNO de los permisos
       */
      canAny: (permissions: Permission[]): boolean => {
         return hasAnyPermission(user?.role as BackofficeRole, permissions);
      },

      /**
       * Verifica si el usuario puede gestionar otro usuario
       */
      canManageUser: (targetUserOperatorId: string | null | undefined): boolean => {
         return canManageUser(
            user?.role as BackofficeRole,
            user?.operatorId,
            targetUserOperatorId
         );
      },

      /**
       * Verifica si el usuario puede gestionar un jugador
       */
      canManagePlayer: (
         playerBrandOperatorId: string | null | undefined,
         isPlayerAssignedToCashier?: boolean
      ): boolean => {
         return canManagePlayer(
            user?.role as BackofficeRole,
            user?.operatorId,
            playerBrandOperatorId,
            isPlayerAssignedToCashier
         );
      },

      /**
       * Verifica si el usuario puede crear un tipo específico de usuario
       */
      canCreateUserType: (userType: 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER'): boolean => {
         const currentRole = user?.role as BackofficeRole;

         switch (currentRole) {
            case 'SUPER_ADMIN':
               return true; // Puede crear cualquier tipo
            case 'BRAND_ADMIN':
               return userType !== 'SUPER_ADMIN'; // No puede crear SUPER_ADMIN
            case 'CASHIER':
               return userType === 'CASHIER' || userType === 'PLAYER'; // Solo cajeros subordinados y jugadores
            default:
               return false;
         }
      },

      /**
       * Verifica si el usuario puede usar globalScope en búsquedas
       */
      canUseGlobalScope: (): boolean => {
         return user?.role === 'SUPER_ADMIN';
      },

      /**
       * Verifica si el usuario puede ajustar wallets de jugadores
       */
      canAdjustWallet: (): boolean => {
         const currentRole = user?.role as BackofficeRole;

         switch (currentRole) {
            case 'SUPER_ADMIN':
               return true; // Puede ajustar cualquier wallet
            case 'BRAND_ADMIN':
               return true; // Puede ajustar wallets en su brand
            case 'CASHIER':
               // Solo puede ajustar wallets de jugadores creados por él
               return true; // La verificación específica se hace en el backend
            default:
               return false;
         }
      },

      /**
       * Información del usuario actual
       */
      user,
      role: user?.role,
      isSuperAdmin: user?.role === 'SUPER_ADMIN',
      isBrandAdmin: user?.role === 'BRAND_ADMIN',
      isCashier: user?.role === 'CASHIER',
   };
}
