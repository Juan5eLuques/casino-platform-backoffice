import { useState } from 'react';
import { useAuthStore } from '@/store';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useCashierHierarchy, useSubordinates } from '@/hooks/useCashierHierarchy';
import { CreateSubordinateForm } from '@/components/admin/CreateSubordinateForm';
import { SubordinatesList } from '@/components/admin/SubordinatesList';
import { HierarchyTreeView } from '@/components/admin/HierarchyTreeView';
import {
   Users,
   TreePine,
   Plus,
   UserCheck,
   Coins,
   Crown,
   Key,
   User
} from 'lucide-react';

export const CashierDashboard = () => {
   const { user } = useAuthStore();
   const { canAccessCashierDashboard, canCreateSubordinates } = useUserPermissions();
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
   const [selectedHierarchyUser, setSelectedHierarchyUser] = useState<{ id: string, name: string } | null>(null);

   const { hierarchy, loading: hierarchyLoading, refetch: refetchHierarchy } = useCashierHierarchy(user?.id || '');
   const { subordinates, loading: subordinatesLoading, refetch: refetchSubordinates } = useSubordinates(user?.id || '', 1, 20);

   const getTotalSubordinates = (node: any): number => {
      if (!node || !node.subordinates) return 0;
      let total = node.subordinates.length;
      node.subordinates.forEach((child: any) => {
         total += getTotalSubordinates(child);
      });
      return total;
   };

   const getAverageCommission = () => {
      if (!subordinates?.users || subordinates.users.length === 0) return 0;
      const total = subordinates.users.reduce((sum, sub) => sum + sub.commissionRate, 0);
      return (total / subordinates.users.length).toFixed(1);
   };

   const handleCreateSuccess = () => {
      refetchHierarchy();
      refetchSubordinates();
   };

   const handleViewHierarchy = (userId: string, username: string) => {
      setSelectedHierarchyUser({ id: userId, name: username });
      setIsHierarchyModalOpen(true);
   };

   const handleCloseHierarchy = () => {
      setIsHierarchyModalOpen(false);
      setSelectedHierarchyUser(null);
   };

   const getRoleIcon = (role?: string) => {
      switch (role) {
         case 'SUPER_ADMIN':
            return <Crown className="h-5 w-5 text-yellow-500" />;
         case 'OPERATOR_ADMIN':
            return <Key className="h-5 w-5 text-blue-500" />;
         case 'CASHIER':
            return <User className="h-5 w-5 text-green-500" />;
         default:
            return <User className="h-5 w-5 text-gray-500" />;
      }
   };

   const getRoleText = (role?: string) => {
      switch (role) {
         case 'SUPER_ADMIN':
            return 'Super Admin';
         case 'OPERATOR_ADMIN':
            return 'Admin Operador';
         case 'CASHIER':
            return 'Cajero';
         default:
            return role || 'Usuario';
      }
   };

   // Solo mostrar para usuarios con permisos de cashier dashboard
   if (!canAccessCashierDashboard) {
      return (
         <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
               <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
                  Acceso Restringido
               </h3>
               <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Esta sección está disponible solo para Cashiers y usuarios con permisos superiores.
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header con información del usuario */}
         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                     {user && getRoleIcon(user.role)}
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold">
                        {user && `Dashboard de ${getRoleText(user.role)}`}
                     </h1>
                     <p className="text-blue-100 mt-1">
                        {user && <>Bienvenido, <strong>{user.username}</strong></>}
                     </p>
                     {user?.operator && (
                        <p className="text-blue-200 text-sm">
                           Operador: {user.operator.name}
                        </p>
                     )}
                  </div>
               </div>

               {/* Solo cashiers pueden crear subordinados */}
               {canCreateSubordinates && (
                  <button
                     onClick={() => setIsCreateModalOpen(true)}
                     className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  >
                     <Plus className="h-4 w-4 mr-2" />
                     Crear Subordinado
                  </button>
               )}
            </div>
         </div>

         {/* Métricas principales */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
               <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                     <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Subordinados Directos
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {subordinatesLoading ? '...' : subordinates?.users.length || 0}
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
               <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                     <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total en la Red
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {hierarchyLoading ? '...' : getTotalSubordinates(hierarchy)}
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
               <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                     <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Comisión Promedio
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {subordinatesLoading ? '...' : `${getAverageCommission()}%`}
                     </p>
                  </div>
               </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
               <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                     <UserCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Activos
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {subordinatesLoading ? '...' : subordinates?.users.filter(u => u.status === 'ACTIVE').length || 0}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Acciones rápidas */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crear subordinado - Solo para cashiers */}
            {canCreateSubordinates && (
               <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                     <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <Plus className="h-5 w-5 mr-2 text-blue-600" />
                        Crear Nuevo Subordinado
                     </h3>
                     <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Expande tu equipo creando cashiers subordinados
                     </p>
                  </div>
                  <div className="p-6">
                     <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
                     >
                        <Plus className="h-5 w-5 mr-2" />
                        Crear Cashier Subordinado
                     </button>
                  </div>
               </div>
            )}

            {/* Visualizar jerarquía */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
               <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                     <TreePine className="h-5 w-5 mr-2 text-green-600" />
                     Visualizar Jerarquía
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Explora tu red de subordinados en forma de árbol
                  </p>
               </div>
               <div className="p-6">
                  <button
                     onClick={() => setIsHierarchyModalOpen(true)}
                     className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
                  >
                     <TreePine className="h-5 w-5 mr-2" />
                     Ver Mi Jerarquía
                  </button>
               </div>
            </div>
         </div>

         {/* Lista de subordinados */}
         <SubordinatesList onViewHierarchy={handleViewHierarchy} />

         {/* Modales */}
         <CreateSubordinateForm
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateSuccess}
         />

         <HierarchyTreeView
            isOpen={isHierarchyModalOpen}
            onClose={handleCloseHierarchy}
            userId={selectedHierarchyUser?.id}
            userName={selectedHierarchyUser?.name}
         />
      </div>
   );
};