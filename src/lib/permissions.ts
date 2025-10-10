/**
 * Sistema de Permisos del Backoffice
 * Define qué roles pueden realizar qué acciones
 */

export enum Permission {
   // Operadores
   OPERATOR_CREATE = 'operator:create',
   OPERATOR_READ = 'operator:read',
   OPERATOR_UPDATE = 'operator:update',
   OPERATOR_DELETE = 'operator:delete',

   // Brands
   BRAND_CREATE = 'brand:create',
   BRAND_READ = 'brand:read',
   BRAND_UPDATE = 'brand:update',
   BRAND_DELETE = 'brand:delete',
   BRAND_SETTINGS = 'brand:settings',
   BRAND_PROVIDERS = 'brand:providers',

   // Usuarios Backoffice
   USER_CREATE = 'user:create',
   USER_READ = 'user:read',
   USER_UPDATE = 'user:update',
   USER_DELETE = 'user:delete',

   // Jugadores
   PLAYER_CREATE = 'player:create',
   PLAYER_READ = 'player:read',
   PLAYER_UPDATE = 'player:update',
   PLAYER_DELETE = 'player:delete',
   PLAYER_WALLET_ADJUST = 'player:wallet_adjust',
   PLAYER_ASSIGN_CASHIER = 'player:assign_cashier',

   // Auditoría
   AUDIT_READ = 'audit:read',
   AUDIT_EXPORT = 'audit:export',

   // Dashboard
   DASHBOARD_VIEW = 'dashboard:view',
}

export type BackofficeRole = 'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER';

/**
 * Matriz de permisos por rol
 */
export const rolePermissions: Record<BackofficeRole, Permission[]> = {
   SUPER_ADMIN: [
      // Todos los permisos
      ...Object.values(Permission),
   ],

   BRAND_ADMIN: [
      // Operadores (solo lectura de su propio operador)
      Permission.OPERATOR_READ,

      // Brands (CRUD completo de sus brands)
      Permission.BRAND_CREATE,
      Permission.BRAND_READ,
      Permission.BRAND_UPDATE,
      Permission.BRAND_DELETE,
      Permission.BRAND_SETTINGS,
      Permission.BRAND_PROVIDERS,

      // Usuarios (CRUD de usuarios de su operador)
      Permission.USER_CREATE,
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,

      // Jugadores (CRUD + wallet de jugadores de sus brands)
      Permission.PLAYER_CREATE,
      Permission.PLAYER_READ,
      Permission.PLAYER_UPDATE,
      Permission.PLAYER_DELETE,
      Permission.PLAYER_WALLET_ADJUST,
      Permission.PLAYER_ASSIGN_CASHIER,

      // Auditoría
      Permission.AUDIT_READ,
      Permission.AUDIT_EXPORT,

      // Dashboard
      Permission.DASHBOARD_VIEW,
   ],

   CASHIER: [
      // Brands (solo lectura)
      Permission.BRAND_READ,

      // Usuarios (crear subordinados)
      Permission.USER_CREATE,
      Permission.USER_READ,

      // Jugadores (crear jugadores + wallet de asignados)
      Permission.PLAYER_CREATE,
      Permission.PLAYER_READ,
      Permission.PLAYER_WALLET_ADJUST,

      // Dashboard
      Permission.DASHBOARD_VIEW,
   ],
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(
   role: BackofficeRole | undefined,
   permission: Permission
): boolean {
   if (!role) return false;
   return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Verifica si un rol tiene TODOS los permisos especificados
 */
export function hasAllPermissions(
   role: BackofficeRole | undefined,
   permissions: Permission[]
): boolean {
   if (!role) return false;
   return permissions.every((p) => hasPermission(role, p));
}

/**
 * Verifica si un rol tiene AL MENOS UNO de los permisos especificados
 */
export function hasAnyPermission(
   role: BackofficeRole | undefined,
   permissions: Permission[]
): boolean {
   if (!role) return false;
   return permissions.some((p) => hasPermission(role, p));
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: BackofficeRole): Permission[] {
   return rolePermissions[role] || [];
}

/**
 * Verifica si un usuario puede gestionar otro usuario
 * Reglas:
 * - SUPER_ADMIN puede gestionar a todos
 * - OPERATOR_ADMIN puede gestionar usuarios de su mismo operador
 * - CASHIER no puede gestionar usuarios
 */
export function canManageUser(
   currentUserRole: BackofficeRole,
   currentUserOperatorId: string | null | undefined,
   targetUserOperatorId: string | null | undefined
): boolean {
   if (currentUserRole === 'SUPER_ADMIN') return true;

   if (currentUserRole === 'BRAND_ADMIN') {
      return currentUserOperatorId === targetUserOperatorId;
   }

   return false;
}

/**
 * Verifica si un usuario puede gestionar un jugador
 * Reglas:
 * - SUPER_ADMIN puede gestionar a todos
 * - OPERATOR_ADMIN puede gestionar jugadores de sus brands
 * - CASHIER solo puede gestionar jugadores asignados
 */
export function canManagePlayer(
   currentUserRole: BackofficeRole,
   currentUserOperatorId: string | null | undefined,
   playerBrandOperatorId: string | null | undefined,
   isPlayerAssignedToCashier?: boolean
): boolean {
   if (currentUserRole === 'SUPER_ADMIN') return true;

   if (currentUserRole === 'BRAND_ADMIN') {
      return currentUserOperatorId === playerBrandOperatorId;
   }

   if (currentUserRole === 'CASHIER') {
      return isPlayerAssignedToCashier === true;
   }

   return false;
}
