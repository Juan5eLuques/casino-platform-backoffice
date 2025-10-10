import { useAuthStore } from '@/store/auth';
import type { BackofficeRole } from '@/types';

/**
 * Hook para gestionar permisos y capacidades basadas en roles
 * Implementa la lógica de resolución transparente del OperatorId
 */
export function useUserPermissions() {
   const { user } = useAuthStore();

   // Verificar si el usuario puede especificar brand/operator en formularios
   const canSpecifyBrand = user?.role === 'SUPER_ADMIN';
   const canSpecifyOperator = user?.role === 'SUPER_ADMIN';

   // Permisos de creación
   const canCreateUsers = user?.role && ['SUPER_ADMIN', 'OPERATOR_ADMIN', 'CASHIER'].includes(user.role) || false;
   const canCreatePlayers = user?.role && ['SUPER_ADMIN', 'OPERATOR_ADMIN', 'CASHIER'].includes(user.role) || false;
   const canCreateCashiers = user?.role && ['SUPER_ADMIN', 'OPERATOR_ADMIN', 'CASHIER'].includes(user.role) || false;

   // Permisos de gestión
   const canAdjustWallets = user?.role && ['SUPER_ADMIN', 'OPERATOR_ADMIN', 'CASHIER'].includes(user.role) || false;
   const canManageOperators = user?.role === 'SUPER_ADMIN';
   const canManageBrands = user?.role === 'SUPER_ADMIN';
   const canViewAudit = user?.role && ['SUPER_ADMIN', 'OPERATOR_ADMIN'].includes(user.role) || false;

   // Permisos de jerarquía de cashiers
   const canAccessCashierDashboard = user?.role && ['CASHIER', 'OPERATOR_ADMIN', 'SUPER_ADMIN'].includes(user.role) || false;
   const canCreateSubordinates = user?.role === 'CASHIER';
   const canViewHierarchy = user?.role && ['CASHIER', 'OPERATOR_ADMIN', 'SUPER_ADMIN'].includes(user.role) || false;

   /**
    * Limpia datos de formulario según permisos del usuario
    * Elimina campos que no debe especificar (brandId, operatorId) excepto SUPER_ADMIN
    */
   const cleanFormData = <T extends Record<string, any>>(data: T): Partial<T> => {
      const cleanedData = { ...data };

      // Solo SUPER_ADMIN puede especificar brandId
      if (!canSpecifyBrand && 'brandId' in cleanedData) {
         delete cleanedData.brandId;
      }

      // Solo SUPER_ADMIN puede especificar operatorId
      if (!canSpecifyOperator && 'operatorId' in cleanedData) {
         delete cleanedData.operatorId;
      }

      return cleanedData;
   };

   /**
    * Verifica si el usuario puede realizar una acción específica
    */
   const can = (action: string): boolean => {
      if (!user) return false;

      switch (action) {
         case 'create:users':
            return canCreateUsers;
         case 'create:players':
            return canCreatePlayers;
         case 'create:cashiers':
            return canCreateCashiers;
         case 'manage:operators':
            return canManageOperators;
         case 'manage:brands':
            return canManageBrands;
         case 'adjust:wallets':
            return canAdjustWallets;
         case 'view:audit':
            return canViewAudit;
         case 'access:cashier-dashboard':
            return canAccessCashierDashboard;
         case 'create:subordinates':
            return canCreateSubordinates;
         case 'view:hierarchy':
            return canViewHierarchy;
         case 'specify:brand':
            return canSpecifyBrand;
         case 'specify:operator':
            return canSpecifyOperator;
         default:
            return false;
      }
   };

   /**
    * Obtiene el contexto del usuario actual
    */
   const getUserContext = () => {
      return {
         role: user?.role as BackofficeRole,
         operatorId: user?.operator?.id,
         canSpecifyBrand,
         canSpecifyOperator,
      };
   };

   /**
    * Maneja errores específicos de la nueva API transparente
    */
   const handleApiError = (error: any) => {
      if (error.status === 400 && error.detail?.includes('Brand Not Resolved')) {
         throw new Error('Error de contexto de marca. Por favor recarga la página.');
      } else if (error.status === 403) {
         throw new Error('No tienes permisos para realizar esta acción.');
      } else if (error.status === 404 && error.detail?.includes('access denied')) {
         throw new Error('Recurso no encontrado o acceso denegado.');
      }
      throw error;
   };

   return {
      // Permisos booleanos
      canSpecifyBrand,
      canSpecifyOperator,
      canCreateUsers,
      canCreatePlayers,
      canCreateCashiers,
      canAdjustWallets,
      canManageOperators,
      canManageBrands,
      canViewAudit,
      canAccessCashierDashboard,
      canCreateSubordinates,
      canViewHierarchy,

      // Funciones utilitarias
      can,
      cleanFormData,
      getUserContext,
      handleApiError,

      // Información del usuario
      user,
      userRole: user?.role as BackofficeRole,
      isAuthenticated: !!user,
   };
}

export default useUserPermissions;