import { useState } from 'react';
import { useCashierHierarchy, CashierNode } from '@/hooks/useCashierHierarchy';
import { useAuthStore } from '@/store';
import { Modal } from '@/components/Modal';
import { TreePine, Users, ChevronDown, ChevronRight, Crown, Key, User, Coins } from 'lucide-react';

interface TreeNodeProps {
   node: CashierNode;
   level: number;
   currentUserId?: string;
}

const TreeNode = ({ node, level, currentUserId }: TreeNodeProps) => {
   const [expanded, setExpanded] = useState(level < 2); // Expandir automáticamente los primeros 2 niveles

   const getRoleIcon = (role: string) => {
      switch (role) {
         case 'SUPER_ADMIN':
            return <Crown className="h-4 w-4 text-yellow-500" />;
         case 'OPERATOR_ADMIN':
            return <Key className="h-4 w-4 text-blue-500" />;
         case 'CASHIER':
            return <User className="h-4 w-4 text-green-500" />;
         default:
            return <User className="h-4 w-4 text-gray-500" />;
      }
   };

   const getRoleText = (role: string) => {
      switch (role) {
         case 'SUPER_ADMIN':
            return 'Super Admin';
         case 'OPERATOR_ADMIN':
            return 'Admin Operador';
         case 'CASHIER':
            return 'Cajero';
         default:
            return role;
      }
   };

   const isCurrentUser = node.id === currentUserId;
   const hasSubordinates = node.subordinates.length > 0;

   return (
      <div className="relative">
         {/* Líneas de conexión del árbol */}
         {level > 0 && (
            <>
               {/* Línea vertical del padre */}
               <div
                  className="absolute left-0 top-0 w-px bg-gray-300 dark:bg-gray-600"
                  style={{
                     left: `${(level - 1) * 24 + 12}px`,
                     height: '20px'
                  }}
               />
               {/* Línea horizontal hacia el nodo */}
               <div
                  className="absolute top-5 w-3 h-px bg-gray-300 dark:bg-gray-600"
                  style={{
                     left: `${(level - 1) * 24 + 12}px`
                  }}
               />
            </>
         )}

         <div
            className="flex items-center gap-2 p-3 rounded-lg mb-2 transition-colors"
            style={{ marginLeft: `${level * 24}px` }}
         >
            {/* Botón de expandir/colapsar */}
            {hasSubordinates ? (
               <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
               >
                  {expanded ? (
                     <ChevronDown className="h-4 w-4" />
                  ) : (
                     <ChevronRight className="h-4 w-4" />
                  )}
               </button>
            ) : (
               <div className="w-6 h-6 flex-shrink-0" /> // Espaciador para alineación
            )}

            {/* Información del nodo */}
            <div
               className={`flex-1 flex items-center justify-between p-3 rounded-lg border transition-all ${isCurrentUser
                     ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-md'
                     : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-sm'
                  }`}
            >
               <div className="flex items-center space-x-3">
                  {/* Icono de rol */}
                  <div className="flex-shrink-0">
                     {getRoleIcon(node.role)}
                  </div>

                  {/* Información principal */}
                  <div className="flex-1">
                     <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${isCurrentUser ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                           {node.username}
                        </span>
                        {isCurrentUser && (
                           <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full">
                              Tú
                           </span>
                        )}
                        <span className={`text-sm ${isCurrentUser ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                           ({getRoleText(node.role)})
                        </span>
                     </div>

                     <div className="flex items-center space-x-4 mt-1">
                        <span className={`text-xs ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                           ID: {node.id.slice(0, 8)}...
                        </span>
                        <span className={`text-xs ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                           Estado: {node.status === 'ACTIVE' ? '✅ Activo' : '❌ Inactivo'}
                        </span>
                        <span className={`text-xs ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                           Creado: {new Date(node.createdAt).toLocaleDateString('es-ES')}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Métricas del lado derecho */}
               <div className="flex items-center space-x-4 text-sm">
                  {/* Comisión */}
                  {node.commissionRate > 0 && (
                     <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <Coins className="h-4 w-4" />
                        <span className="font-medium">{node.commissionRate}%</span>
                     </div>
                  )}

                  {/* Número de subordinados */}
                  {hasSubordinates && (
                     <div className={`flex items-center space-x-1 ${isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{node.subordinates.length}</span>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Subordinados (recursivo) */}
         {expanded && hasSubordinates && (
            <div className="relative">
               {/* Línea vertical que conecta con los hijos */}
               <div
                  className="absolute w-px bg-gray-300 dark:bg-gray-600"
                  style={{
                     left: `${level * 24 + 12}px`,
                     top: '0px',
                     height: `${node.subordinates.length * 80}px` // Aproximado basado en altura del nodo
                  }}
               />

               {node.subordinates.map((child) => (
                  <TreeNode
                     key={child.id}
                     node={child}
                     level={level + 1}
                     currentUserId={currentUserId}
                  />
               ))}
            </div>
         )}
      </div>
   );
};

interface HierarchyTreeViewProps {
   isOpen: boolean;
   onClose: () => void;
   userId?: string;
   userName?: string;
}

export const HierarchyTreeView = ({ isOpen, onClose, userId, userName }: HierarchyTreeViewProps) => {
   const { user } = useAuthStore();
   const targetUserId = userId || user?.id || '';

   const { hierarchy, loading, error } = useCashierHierarchy(targetUserId);

   const getModalTitle = () => {
      if (userName && userId !== user?.id) {
         return `🌳 Jerarquía de ${userName}`;
      }
      return '🌳 Mi Jerarquía de Cashiers';
   };

   const getTotalSubordinates = (node: CashierNode): number => {
      let total = node.subordinates.length;
      node.subordinates.forEach(child => {
         total += getTotalSubordinates(child);
      });
      return total;
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title={getModalTitle()}
      >
         <div className="space-y-4">
            {loading && (
               <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando jerarquía...</span>
               </div>
            )}

            {error && (
               <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  <div className="flex items-center">
                     <div className="text-red-400 mr-3">
                        <TreePine className="h-5 w-5" />
                     </div>
                     <div>
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                           Error al cargar la jerarquía
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                     </div>
                  </div>
               </div>
            )}

            {hierarchy && (
               <>
                  {/* Estadísticas resumidas */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                     <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        📊 Resumen de la jerarquía
                     </h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                           <span className="text-gray-500 dark:text-gray-400">Subordinados directos:</span>
                           <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {hierarchy.subordinates.length}
                           </span>
                        </div>
                        <div>
                           <span className="text-gray-500 dark:text-gray-400">Total en la red:</span>
                           <span className="ml-2 font-medium text-gray-900 dark:text-white">
                              {getTotalSubordinates(hierarchy)}
                           </span>
                        </div>
                        <div>
                           <span className="text-gray-500 dark:text-gray-400">Comisión:</span>
                           <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                              {hierarchy.commissionRate}%
                           </span>
                        </div>
                        <div>
                           <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                           <span className={`ml-2 font-medium ${hierarchy.status === 'ACTIVE' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {hierarchy.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Árbol jerárquico */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto">
                     <TreeNode
                        node={hierarchy}
                        level={0}
                        currentUserId={user?.id}
                     />
                  </div>

                  {/* Leyenda */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                     <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        💡 Leyenda
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                           <Crown className="h-4 w-4 text-yellow-500" />
                           <span className="text-blue-800 dark:text-blue-200">Super Admin</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Key className="h-4 w-4 text-blue-500" />
                           <span className="text-blue-800 dark:text-blue-200">Admin Operador</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <User className="h-4 w-4 text-green-500" />
                           <span className="text-blue-800 dark:text-blue-200">Cajero</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Coins className="h-4 w-4 text-green-600" />
                           <span className="text-blue-800 dark:text-blue-200">Porcentaje de comisión</span>
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
      </Modal>
   );
};