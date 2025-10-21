import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Crown, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserTreeNode, UserType, BackofficeRole } from '@/types';

// Utility function for classnames
const cn = (...classes: (string | boolean | undefined)[]) => {
   return classes.filter(Boolean).join(' ');
};

// Utility function to format currency
const formatCurrency = (amount: number): string => {
   return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
   }).format(amount);
};

interface TreeNodeProps {
   node: UserTreeNode;
   onNodeClick: (userId: string) => void;
   isLoading?: boolean;
   expandedNodes: Set<string>;
   onToggleExpand: (nodeId: string) => void;
}

const TreeNodeComponent = ({
   node,
   onNodeClick,
   isLoading,
   expandedNodes,
   onToggleExpand
}: TreeNodeProps) => {
   const isExpanded = expandedNodes.has(node.id);
   const hasLoadedChildren = node.children !== null;

   const handleToggle = () => {
      if (node.hasChildren) {
         onToggleExpand(node.id);
         if (!hasLoadedChildren) {
            onNodeClick(node.id);
         }
      }
   };

   const getRoleColor = (role: BackofficeRole | null) => {
      switch (role) {
         case 'SUPER_ADMIN':
            return 'text-purple-600 dark:text-purple-400';
         case 'BRAND_ADMIN':
            return 'text-blue-600 dark:text-blue-400';
         case 'CASHIER':
            return 'text-green-600 dark:text-green-400';
         default:
            return 'text-gray-600 dark:text-gray-400';
      }
   };

   const getRoleLabel = (role: BackofficeRole | null) => {
      if (!role) return 'Player';
      return role.replace('_', ' ');
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'ACTIVE':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
         case 'INACTIVE':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
         case 'SUSPENDED':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
         default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      }
   };

   const UserIcon = node.userType === UserType.BACKOFFICE ? Crown : Wallet;

   return (
      <div className="relative">
         {/* Nodo principal */}
         <div
            className={cn(
               'group relative flex items-center gap-2 p-2.5 rounded-md border transition-all',
               'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
               'hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm',
               isLoading && 'opacity-50 cursor-wait'
            )}
         >
            {/* Botón de expansión */}
            {node.hasChildren && (
               <button
                  onClick={handleToggle}
                  disabled={isLoading}
                  className={cn(
                     'flex items-center justify-center w-5 h-5 rounded',
                     'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600',
                     'transition-colors disabled:cursor-wait'
                  )}
                  aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
               >
                  {isExpanded ? (
                     <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                  ) : (
                     <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                  )}
               </button>
            )}

            {/* Espaciador cuando no tiene hijos */}
            {!node.hasChildren && <div className="w-5" />}

            {/* Icono de tipo de usuario */}
            <div
               className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-full',
                  node.userType === UserType.BACKOFFICE
                     ? 'bg-blue-100 dark:bg-blue-900/30'
                     : 'bg-purple-100 dark:bg-purple-900/30'
               )}
            >
               <UserIcon
                  className={cn(
                     'h-3.5 w-3.5',
                     node.userType === UserType.BACKOFFICE
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-purple-600 dark:text-purple-400'
                  )}
               />
            </div>

            {/* Información del usuario */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-1.5 flex-wrap">
                  <Link
                     to={`/users/${node.id}`}
                     className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline truncate"
                  >
                     {node.username}
                  </Link>
                  <span
                     className={cn(
                        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium',
                        getStatusColor(node.status)
                     )}
                  >
                     {node.status}
                  </span>
               </div>
               <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-500 dark:text-gray-400 flex-wrap">
                  <span className={getRoleColor(node.role)}>{getRoleLabel(node.role)}</span>

                  {/* Balance */}
                  <span>•</span>
                  <span className="flex items-center gap-0.5 font-medium text-green-600 dark:text-green-400">
                     {formatCurrency(node.balance)}
                  </span>

                  {/* Commission Percent si existe */}
                  {node.commissionPercent !== null && (
                     <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400">
                           {node.commissionPercent}% com
                        </span>
                     </>
                  )}

                  {/* Contador de hijos */}
                  {node.hasChildren && (
                     <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                           <Users className="h-2.5 w-2.5" />
                           {node.directChildrenCount}
                        </span>
                     </>
                  )}
               </div>
            </div>

            {/* Indicador de carga */}
            {isLoading && (
               <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
               </div>
            )}
         </div>

         {/* Hijos expandidos */}
         {isExpanded && node.children && node.children.length > 0 && (
            <div className="ml-4 mt-2 pl-3 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
               {node.children.map((child) => (
                  <TreeNodeComponent
                     key={child.id}
                     node={child}
                     onNodeClick={onNodeClick}
                     expandedNodes={expandedNodes}
                     onToggleExpand={onToggleExpand}
                  />
               ))}
            </div>
         )}
      </div>
   );
};

interface UserTreeProps {
   rootNode: UserTreeNode;
   onLoadChildren: (userId: string) => Promise<void>;
   isLoading?: boolean;
}

export const UserTree = ({ rootNode, onLoadChildren, isLoading }: UserTreeProps) => {
   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

   const handleToggleExpand = (nodeId: string) => {
      setExpandedNodes((prev) => {
         const newSet = new Set(prev);
         if (newSet.has(nodeId)) {
            newSet.delete(nodeId);
         } else {
            newSet.add(nodeId);
         }
         return newSet;
      });
   };

   const handleNodeClick = async (userId: string) => {
      await onLoadChildren(userId);
   };

   return (
      <div className="w-full">
         <TreeNodeComponent
            node={rootNode}
            onNodeClick={handleNodeClick}
            isLoading={isLoading}
            expandedNodes={expandedNodes}
            onToggleExpand={handleToggleExpand}
         />
      </div>
   );
};
