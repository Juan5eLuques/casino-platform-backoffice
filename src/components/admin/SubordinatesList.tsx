import { useState } from 'react';
import { useSubordinates } from '@/hooks/useCashierHierarchy';
import { useAuthStore } from '@/store';
import { Users, Calendar, Eye, TreePine, UserCheck, UserX } from 'lucide-react';

interface SubordinatesListProps {
   onViewHierarchy?: (userId: string, username: string) => void;
}

export const SubordinatesList = ({ onViewHierarchy }: SubordinatesListProps) => {
   const { user } = useAuthStore();
   const [currentPage, setCurrentPage] = useState(1);
   const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

   const { subordinates, loading, error, refetch } = useSubordinates(
      user?.id || '',
      currentPage,
      20
   );

   const filteredUsers = subordinates?.users.filter(subordinate => {
      if (statusFilter === 'ALL') return true;
      return subordinate.status === statusFilter;
   }) || [];

   const formatDate = (dateString: string | null) => {
      if (!dateString) return 'Nunca';
      return new Date(dateString).toLocaleDateString('es-ES', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric'
      });
   };

   const getStatusBadge = (status: 'ACTIVE' | 'INACTIVE') => {
      if (status === 'ACTIVE') {
         return (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
               <UserCheck className="h-3 w-3 mr-1" />
               Activo
            </span>
         );
      } else {
         return (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
               <UserX className="h-3 w-3 mr-1" />
               Inactivo
            </span>
         );
      }
   };

   if (loading) {
      return (
         <div className="bg-secondary rounded-lg shadow p-6">
            <div className="animate-pulse">
               <div className="h-4 bg-tertiary rounded w-1/4 mb-4"></div>
               <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                     <div key={i} className="h-16 bg-tertiary rounded"></div>
                  ))}
               </div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="bg-secondary rounded-lg shadow p-6">
            <div className="text-center">
               <div className="text-status-error-text mb-2">
                  <Users className="h-8 w-8 mx-auto" />
               </div>
               <h3 className="text-lg font-medium text-primary mb-2">
                  Error al cargar subordinados
               </h3>
               <p className="text-secondary mb-4">{error}</p>
               <button
                  onClick={refetch}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover"
               >
                  Reintentar
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-secondary rounded-lg shadow">
         {/* Header */}
         <div className="px-6 py-4 border-b border-default">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                  <Users className="h-5 w-5 text-tertiary mr-2" />
                  <h3 className="text-lg font-medium text-primary">
                     Mis Subordinados Directos
                  </h3>
                  {subordinates && (
                     <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                        {subordinates.totalCount}
                     </span>
                  )}
               </div>

               {/* Filtro de estado */}
               <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-1 text-sm border border-default rounded-md bg-tertiary text-primary"
               >
                  <option value="ALL">Todos</option>
                  <option value="ACTIVE">Activos</option>
                  <option value="INACTIVE">Inactivos</option>
               </select>
            </div>
         </div>

         {/* Content */}
         <div className="p-6">
            {filteredUsers.length === 0 ? (
               <div className="text-center py-8">
                  <Users className="h-12 w-12 text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary mb-2">
                     {subordinates?.totalCount === 0 ? 'No tienes subordinados aún' : 'No hay subordinados que coincidan con el filtro'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                     {subordinates?.totalCount === 0
                        ? 'Crea tu primer cashier subordinado para comenzar a construir tu equipo'
                        : 'Intenta cambiar el filtro de estado'
                     }
                  </p>
               </div>
            ) : (
               <div className="space-y-4">
                  {filteredUsers.map((subordinate) => (
                     <div
                        key={subordinate.id}
                        className="flex items-center justify-between p-4 border border-default rounded-lg hover:bg-surface-hover transition-colors"
                     >
                        <div className="flex-1">
                           <div className="flex items-center space-x-4">
                              <div className="flex-1">
                                 <div className="flex items-center">
                                    <h4 className="text-sm font-medium text-primary">
                                       {subordinate.username}
                                    </h4>
                                    <div className="ml-3">
                                       {getStatusBadge(subordinate.status)}
                                    </div>
                                 </div>
                                 <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span>ID: {subordinate.id.slice(0, 8)}...</span>
                                    <span className="flex items-center">
                                       <Calendar className="h-3 w-3 mr-1" />
                                       Creado: {formatDate(subordinate.createdAt)}
                                    </span>
                                    <span>
                                       Último login: {formatDate(subordinate.lastLoginAt)}
                                    </span>
                                 </div>
                              </div>

                              <div className="text-center">
                                 <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {subordinate.commissionRate}%
                                 </div>
                                 <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Comisión
                                 </div>
                              </div>

                              <div className="text-center">
                                 <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {subordinate.subordinatesCount}
                                 </div>
                                 <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Subordinados
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                           {subordinate.subordinatesCount > 0 && onViewHierarchy && (
                              <button
                                 onClick={() => onViewHierarchy(subordinate.id, subordinate.username)}
                                 className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
                                 title="Ver jerarquía"
                              >
                                 <TreePine className="h-4 w-4" />
                              </button>
                           )}
                           <button
                              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                              title="Ver detalles"
                           >
                              <Eye className="h-4 w-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Paginación */}
            {subordinates && subordinates.totalPages > 1 && (
               <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                     Mostrando {((currentPage - 1) * 20) + 1} a {Math.min(currentPage * 20, subordinates.totalCount)} de {subordinates.totalCount} subordinados
                  </div>
                  <div className="flex space-x-2">
                     <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Anterior
                     </button>
                     <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                        Página {currentPage} de {subordinates.totalPages}
                     </span>
                     <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === subordinates.totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Siguiente
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};