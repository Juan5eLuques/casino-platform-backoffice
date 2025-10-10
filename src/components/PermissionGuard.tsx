import { ReactNode } from 'react';
import { Permission } from '@/lib/permissions';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGuardProps {
   permission?: Permission;
   permissions?: Permission[];
   requireAll?: boolean; // Si es true, requiere todos los permisos; si es false, requiere al menos uno
   fallback?: ReactNode;
   children: ReactNode;
}

/**
 * Componente que renderiza children solo si el usuario tiene los permisos requeridos
 * 
 * Ejemplos de uso:
 * 
 * // Requiere un permiso específico
 * <PermissionGuard permission={Permission.OPERATOR_CREATE}>
 *   <CreateOperatorButton />
 * </PermissionGuard>
 * 
 * // Requiere TODOS los permisos
 * <PermissionGuard permissions={[Permission.BRAND_CREATE, Permission.BRAND_UPDATE]} requireAll>
 *   <EditBrandForm />
 * </PermissionGuard>
 * 
 * // Requiere AL MENOS UNO de los permisos
 * <PermissionGuard permissions={[Permission.PLAYER_READ, Permission.PLAYER_UPDATE]}>
 *   <PlayerDetails />
 * </PermissionGuard>
 * 
 * // Con fallback personalizado
 * <PermissionGuard 
 *   permission={Permission.AUDIT_READ}
 *   fallback={<div>No tienes acceso a auditoría</div>}
 * >
 *   <AuditLog />
 * </PermissionGuard>
 */
export function PermissionGuard({
   permission,
   permissions,
   requireAll = false,
   fallback = null,
   children,
}: PermissionGuardProps) {
   const { can, canAll, canAny } = usePermissions();

   let hasAccess = false;

   if (permission) {
      // Verificar un solo permiso
      hasAccess = can(permission);
   } else if (permissions && permissions.length > 0) {
      // Verificar múltiples permisos
      hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
   } else {
      // Si no se especifica ningún permiso, denegar acceso
      hasAccess = false;
   }

   if (!hasAccess) {
      return <>{fallback}</>;
   }

   return <>{children}</>;
}
