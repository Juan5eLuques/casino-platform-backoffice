import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User, Crown, Shield, UserCheck, Edit, Trash2, Minus, Network, ChevronDown } from 'lucide-react';
import { FilterButtonGroup } from '@/components/FilterButtonGroup';
import { UserTree } from '@/components/UserTree';
import { AnimatedBalance } from '@/components/AnimatedBalance';
import { DatePicker, Button } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';

import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { useAuthStore } from '@/store';
import {
   useUsers,
   useCreateUser,
   useDeleteUser,
   useDepositFunds,
   useWithdrawFunds,
   useBalance
} from '@/hooks';
import { treeApi } from '@/api';
import type { CreateUserForm, UserTreeNode } from '@/types';// Schema para crear usuarios según API unificada
const createUserSchema = z.object({
   username: z.string().min(3, 'El username debe tener al menos 3 caracteres'),
   password: z.string().optional(),
   role: z.number().min(0).max(2, 'Role inválido').optional().nullable(),
   email: z.string().email('Email inválido').optional().or(z.literal('')),
   externalId: z.string().optional().or(z.literal('')),
   parentCashierId: z.string().optional().or(z.literal('')),
   commissionPercent: z.number().min(0).max(100).optional().nullable(),
}).superRefine((data, ctx) => {


   const isPlayer = data.role === undefined || data.role === null;


   // Email es siempre opcional, no hacer validación obligatoria

   // Si es backoffice, password es requerida y debe tener mínimo 6 caracteres
   if (!isPlayer) {
      if (!data.password) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Contraseña es requerida para usuarios de backoffice',
            path: ['password'],
         });
      } else if (data.password.length < 6) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'La contraseña debe tener al menos 6 caracteres',
            path: ['password'],
         });
      }
   }

});

type CreateUserFormData = z.infer<typeof createUserSchema>;

// Componente para modal de balance
const BalanceModal = ({ user, action, onConfirm, onCancel, currentUserBalance }: {
   user: any;
   action: 'send' | 'remove';
   onConfirm: (user: any, action: 'send' | 'remove', amount: number) => void;
   onCancel: () => void;
   currentUserBalance: number;
}) => {
   const [amount, setAmount] = useState('');
   
   // Determinar el máximo según la acción
   const maxAmount = action === 'send' ? currentUserBalance : (user?.walletBalance || 0);

   const handleAmountChange = (value: string) => {
      const numValue = parseFloat(value);
      
      // Si el valor excede el máximo, establecer el máximo
      if (!isNaN(numValue) && numValue > maxAmount) {
         setAmount(maxAmount.toString());
      } else {
         setAmount(value);
      }
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const numAmount = parseFloat(amount);
      if (numAmount > 0 && numAmount <= maxAmount) {
         onConfirm(user, action, numAmount);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Header con icono */}
         <div className="text-center pb-4 border-b border-default">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
               action === 'send' 
                  ? 'bg-status-success-bg' 
                  : 'bg-status-error-bg'
            }`}>
               {action === 'send' ? (
                  <Plus className="w-8 h-8 text-status-success-text" />
               ) : (
                  <Minus className="w-8 h-8 text-status-error-text" />
               )}
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
               {action === 'send' ? 'Enviar Fondos' : 'Retirar Fondos'}
            </h3>
            <p className="text-secondary text-sm">
               {action === 'send' ? 'Transferir fondos a' : 'Retirar fondos de'}{' '}
               <span className="font-semibold text-primary">{user?.username}</span>
            </p>
         </div>

         {/* Balance info */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-tertiary rounded-lg p-4">
               <p className="text-xs text-secondary mb-1">
                  {action === 'send' ? 'Tu Balance' : 'Balance del Usuario'}
               </p>
               <p className="text-2xl font-bold text-primary font-mono">
                  ${(action === 'send' ? currentUserBalance : user?.walletBalance || 0).toLocaleString()}
               </p>
            </div>
            <div className="bg-tertiary rounded-lg p-4">
               <p className="text-xs text-secondary mb-1">Disponible</p>
               <p className="text-2xl font-bold text-brand-secondary font-mono">
                  ${maxAmount.toLocaleString()}
               </p>
            </div>
         </div>

         {/* Input de cantidad */}
         <div>
            <label className="block text-sm font-semibold text-primary mb-2">
               Cantidad a {action === 'send' ? 'enviar' : 'retirar'}
            </label>
            <div className="relative">
               <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary text-lg font-semibold">
                  $
               </span>
               <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={maxAmount}
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 text-lg font-mono font-semibold border-2 border-default rounded-xl focus:border-brand-secondary focus:outline-none bg-tertiary text-primary transition-colors"
                  placeholder="0.00"
                  required
                  autoFocus
               />
            </div>
            {parseFloat(amount) > maxAmount && (
               <p className="text-status-error-text text-xs mt-2">
                  El monto máximo disponible es ${maxAmount.toLocaleString()}
               </p>
            )}
         </div>

         {/* Quick amount buttons */}
         <div className="grid grid-cols-4 gap-2">
            {[0.25, 0.5, 0.75, 1].map((percentage) => (
               <button
                  key={percentage}
                  type="button"
                  onClick={() => setAmount((maxAmount * percentage).toFixed(2))}
                  className="py-2 px-3 text-xs font-medium border-2 border-default rounded-lg hover:border-brand-secondary hover:bg-surface-hover transition-colors text-secondary"
               >
                  {percentage * 100}%
               </button>
            ))}
         </div>

         {/* Actions */}
         <div className="flex gap-3 pt-4">
            <Button
               type="button"
               onClick={onCancel}
               variant="secondary"
               className="flex-1"
            >
               Cancelar
            </Button>
            <Button
               type="submit"
               variant={action === 'send' ? 'success' : 'danger'}
               className="flex-1"
               disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
            >
               {action === 'send' ? 'Enviar' : 'Retirar'} ${parseFloat(amount || '0').toLocaleString()}
            </Button>
         </div>
      </form>
   );
};

const getRoleIcon = (userType: string, role?: string) => {
   if (userType === 'PLAYER') {
      return <User className="h-4 w-4 text-brand-primary" />;
   }

   switch (role) {
      case 'SUPER_ADMIN':
         return <Crown className="h-4 w-4 text-brand-primary" />;
      case 'BRAND_ADMIN':
         return <Shield className="h-4 w-4 text-status-success-text" />;
      case 'CASHIER':
         return <UserCheck className="h-4 w-4 text-status-warning-text" />;
      default:
         return <User className="h-4 w-4 text-tertiary" />;
   }
};

const getRoleText = (userType: string, role?: string) => {
   if (userType === 'PLAYER') return 'Jugador';

   switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'BRAND_ADMIN': return 'Admin';
      case 'CASHIER': return 'Cajero';
      default: return 'Usuario';
   }
};

export function UsersPage() {
   const { user: currentUser } = useAuthStore();
   const queryClient = useQueryClient();
   
   // Obtener balance del usuario actual usando el nuevo endpoint
   const { data: balanceData } = useBalance();
   const currentUserWalletBalance = balanceData?.balance || 0;
   
   const [search, setSearch] = useState('');
   const [userTypeFilter, setUserTypeFilter] = useState<'BACKOFFICE' | 'PLAYER' | ''>('');
   const [roleFilter, setRoleFilter] = useState<'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER' | ''>('');

   // Fechas iniciales como null - el usuario debe seleccionarlas explícitamente
   const [createdFrom, setCreatedFrom] = useState<string>('');
   const [createdTo, setCreatedTo] = useState<string>('');

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [balanceAction, setBalanceAction] = useState<'send' | 'remove'>('send');
   const [page, setPage] = useState(1);
   const [pageSize] = useState(20);

   // Estados para el árbol genealógico
   const [showTree, setShowTree] = useState(false);
   const [treeData, setTreeData] = useState<UserTreeNode | null>(null);
   const [isLoadingTree, setIsLoadingTree] = useState(false);
   const [treeCache, setTreeCache] = useState<Map<string, UserTreeNode>>(new Map());

   // Estado para trackear los balances animados
   const [balanceAnimations, setBalanceAnimations] = useState<Map<string, number>>(new Map());

   // Query unificada para todos los usuarios - Sin filtros iniciales
   const { data: usersData, isLoading } = useUsers({
      username: search || undefined,
      userType: userTypeFilter || undefined,
      role: roleFilter || undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      page,
      pageSize,
   });

   // Sincronizar balances animados con los datos reales cuando se actualizan
   useEffect(() => {
      if (usersData?.data) {
         setBalanceAnimations(prev => {
            const newMap = new Map(prev);
            usersData.data.forEach((user: any) => {
               // Solo actualizar si el balance cambió y no tenemos una animación pendiente
               const currentAnimated = newMap.get(user.id);
               if (currentAnimated === undefined || currentAnimated === user.walletBalance) {
                  newMap.set(user.id, user.walletBalance);
               }
            });
            return newMap;
         });
      }
   }, [usersData?.data]);

   // Mutations
   const createUserMutation = useCreateUser();
   const deleteUserMutation = useDeleteUser();
   const depositFundsMutation = useDepositFunds();
   const withdrawFundsMutation = useWithdrawFunds();

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch
   } = useForm<CreateUserFormData>({
      resolver: zodResolver(createUserSchema),
      defaultValues: {
         // Sin rol por defecto, será PLAYER si no se especifica según API
      }
   });

   const selectedRole = watch('role');

   // DEBUG: Ver errores de validación

   const handleCreateUser = async (data: CreateUserFormData) => {

      try {
         const userData: CreateUserForm = {
            username: data.username,
            password: data.password || undefined,
            role: data.role ?? undefined,
            email: data.email || undefined,
            commissionPercent: data.commissionPercent ?? undefined,
         };

         await createUserMutation.mutateAsync(userData);
         reset();
         setIsCreateModalOpen(false);
      } catch (error) {
         console.error('Error al crear usuario:', error);
      }
   };

   const handleBalanceAction = async (user: any, action: 'send' | 'remove', amount: number) => {
      if (!currentUser) return;

      try {
         if (action === 'send') {
            await depositFundsMutation.mutateAsync({
               currentUserId: currentUser.id,
               currentUserType: 'BACKOFFICE' as const,
               isSuperAdmin: currentUser.role === 'SUPER_ADMIN',
               toUserId: user.id,
               toUserType: user.userType,
               amount,
               description: `Envío de fondos desde ${currentUser.username}`,
            });

            // Actualizar balances animados
            setBalanceAnimations(prev => {
               const newMap = new Map(prev);
               // El usuario actual pierde dinero
               if (currentUserWalletBalance > 0) {
                  newMap.set(currentUser.id, currentUserWalletBalance - amount);
               }
               // El usuario destino recibe dinero
               newMap.set(user.id, user.walletBalance + amount);
               return newMap;
            });
         } else {
            await withdrawFundsMutation.mutateAsync({
               currentUserId: currentUser.id,
               currentUserType: 'BACKOFFICE' as const,
               targetUserId: user.id,
               targetUserType: user.userType,
               amount,
               description: `Retiro de fondos por ${currentUser.username}`,
            });

            // Actualizar balances animados
            setBalanceAnimations(prev => {
               const newMap = new Map(prev);
               // El usuario actual gana dinero
               if (currentUserWalletBalance > 0) {
                  newMap.set(currentUser.id, currentUserWalletBalance + amount);
               }
               // El usuario destino pierde dinero
               newMap.set(user.id, user.walletBalance - amount);
               return newMap;
            });
         }
         setIsBalanceModalOpen(false);
         setSelectedUser(null);
         
         // Invalidar el cache del balance para refrescar automáticamente
         queryClient.invalidateQueries({ queryKey: ['balance'] });
      } catch (error) {
         console.error('Error in balance operation:', error);
      }
   };

   // Funciones para manejar el árbol genealógico
   const loadUserTree = async (userId: string) => {
      setIsLoadingTree(true);
      try {
         const response = await treeApi.getUserTree({
            userId,
            maxDepth: 1,
            includeInactive: false,
         });

         if (response && response.tree) {
            setTreeData(response.tree);
            // Cachear el nodo raíz
            setTreeCache(prev => new Map(prev).set(userId, response.tree));
         }
      } catch (error) {
         console.error('Error loading user tree:', error);
      } finally {
         setIsLoadingTree(false);
      }
   };

   const loadChildren = async (userId: string) => {
      // Si ya está en caché, no hacemos nada
      if (treeCache.has(userId)) {
         return;
      }

      setIsLoadingTree(true);
      try {
         const response = await treeApi.getUserTree({
            userId,
            maxDepth: 1,
            includeInactive: false,
         });

         if (response && response.tree) {
            // Actualizar el árbol existente con los nuevos hijos
            setTreeData(prevTree => {
               if (!prevTree) return prevTree;
               return updateTreeNode(prevTree, userId, response.tree.children || []);
            });

            // Cachear el nodo
            setTreeCache(prev => new Map(prev).set(userId, response.tree));
         }
      } catch (error) {
         console.error('Error loading children:', error);
      } finally {
         setIsLoadingTree(false);
      }
   };

   // Función recursiva para actualizar un nodo en el árbol
   const updateTreeNode = (
      node: UserTreeNode,
      targetId: string,
      newChildren: UserTreeNode[]
   ): UserTreeNode => {
      if (node.id === targetId) {
         return { ...node, children: newChildren };
      }

      if (node.children) {
         return {
            ...node,
            children: node.children.map(child => updateTreeNode(child, targetId, newChildren)),
         };
      }

      return node;
   };

   // Cargar el árbol del usuario actual al montar el componente
   const handleToggleTree = async () => {
      const newShowState = !showTree;
      setShowTree(newShowState);

      // Si se está mostrando y no hay datos, cargar automáticamente
      if (newShowState && !treeData && currentUser) {
         await loadUserTree(currentUser.id);
      }
   };

   const columns: Column<Record<string, any>>[] = [
      {
         key: 'username',
         header: 'Usuario',
         className: 'w-[250px]',
         render: (user: any) => (
            <Link
               to={`/users/${user.id}`}
               className="flex items-center space-x-2 sm:space-x-3 hover:bg-surface-hover rounded-lg p-2 -m-2 transition-colors"
            >
               {getRoleIcon(user.userType, user.role)}
               <div className="min-w-0 flex-1">
                  <div className="font-medium text-brand-secondary hover:text-brand-primary text-xs sm:text-sm truncate">{user.username}</div>
                  <div className="text-[10px] sm:text-xs text-tertiary truncate">{user.email}</div>
               </div>
            </Link>
         ),
      },
      {
         key: 'walletBalance',
         header: 'Balance',
         className: 'w-[140px]',
         render: (user: any) => {
            // Usar el balance animado si existe, sino el balance real
            const animatedBalance = balanceAnimations.get(user.id);
            const displayBalance = animatedBalance !== undefined ? animatedBalance : user.walletBalance;
            
            return (
               <AnimatedBalance
                  value={displayBalance || 0}
                  className="font-mono font-semibold text-sm text-primary whitespace-nowrap inline-block"
               />
            );
         },
      },
      {
         key: 'balanceActions',
         header: 'Fondos',
         className: 'w-[100px] text-center',
         render: (user: any) => (
            <div className="flex items-center justify-center space-x-2">
               <button
                  onClick={() => {
                     setSelectedUser(user);
                     setBalanceAction('send');
                     setIsBalanceModalOpen(true);
                  }}
                  className="p-2 text-status-success-text hover:bg-status-success-bg rounded-lg transition-colors"
                  title="Enviar fondos"
               >
                  <Plus className="h-4 w-4" />
               </button>
               <button
                  onClick={() => {
                     setSelectedUser(user);
                     setBalanceAction('remove');
                     setIsBalanceModalOpen(true);
                  }}
                  className="p-2 text-status-error-text hover:bg-status-error-bg rounded-lg transition-colors"
                  title="Retirar fondos"
               >
                  <Minus className="h-4 w-4" />
               </button>
            </div>
         ),
      },
      {
         key: 'userType',
         header: 'Tipo',
         className: 'w-[120px]',
         render: (user: any) => (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-status-info-bg text-status-info-text whitespace-nowrap">
               {getRoleText(user.userType, user.role)}
            </span>
         ),
      },
      {
         key: 'createdBy',
         header: 'Creado por',
         className: 'w-[150px]',
         render: (user: any) => (
            <div className="text-xs sm:text-sm">
               <div className="font-medium text-primary truncate">
                  {user.createdByUsername || 'Sistema'}
               </div>
               <div className="text-tertiary text-[10px] sm:text-xs truncate">
                  {user.createdByRole || 'Sistema'}
               </div>
            </div>
         ),
      },
      {
         key: 'status',
         header: 'Estado',
         className: 'w-[100px]',
         render: (user: any) => (
            <span
               className={`inline-flex px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${user.status === 'ACTIVE'
                  ? 'bg-status-success-bg text-status-success-text'
                  : 'bg-status-error-bg text-status-error-text'
                  }`}
            >
               {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
         ),
      },
      {
         key: 'actions',
         header: 'Operaciones',
         className: 'w-[120px] text-center',
         render: (user: any) => (
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
               <PermissionGuard permission={Permission.USER_UPDATE}>
                  <button
                     onClick={() => {
                        // TODO: Implementar edición
                        console.log('Editar usuario:', user.id);
                     }}
                     className="p-1 text-brand-secondary hover:bg-surface-hover rounded transition-colors"
                     title="Editar usuario"
                  >
                     <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
               </PermissionGuard>
               <PermissionGuard permission={Permission.USER_DELETE}>
                  <button
                     onClick={async () => {
                        if (window.confirm(`¿Estás seguro de eliminar el usuario "${user.username}"?`)) {
                           await deleteUserMutation.mutateAsync(user.id);
                        }
                     }}
                     className="p-1 text-status-error-text hover:bg-status-error-bg rounded transition-colors"
                     title="Eliminar usuario"
                  >
                     <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
               </PermissionGuard>
            </div>
         ),
      },
   ];

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header - Responsive */}
         <div className="pb-4 border-b border-default">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
               <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
                     Gestión de Usuarios
                  </h1>
                  <p className="text-sm md:text-base text-secondary mt-1">
                     Administra los usuarios del backoffice
                  </p>
               </div>
               <PermissionGuard permission={Permission.USER_CREATE}>
                  <Button
                     onClick={() => setIsCreateModalOpen(true)}
                     variant="secondary"
                     className="flex items-center space-x-2 shadow-md whitespace-nowrap"
                  >
                     <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                     <span>Nuevo Usuario</span>
                  </Button>
               </PermissionGuard>
            </div>
         </div>

         {/* Árbol Genealógico - Sección colapsable más compacta */}
         <div className="bg-secondary p-3 sm:p-4 rounded-lg shadow-sm border border-default">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-status-info-bg">
                     <Network className="h-3.5 w-3.5 text-status-info-text" />
                  </div>
                  <div>
                     <h3 className="text-sm font-semibold text-primary">
                        Árbol Genealógico
                     </h3>
                     <p className="text-xs text-secondary">
                        Tu red de usuarios
                     </p>
                  </div>
               </div>
               <button
                  onClick={handleToggleTree}
                  className="px-3 py-1.5 text-xs font-medium text-brand-secondary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-1.5"
               >
                  {showTree ? 'Ocultar' : 'Mostrar'}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showTree ? 'rotate-180' : ''}`} />
               </button>
            </div>

            {showTree && (
               <div className="mt-3 pt-3 border-t border-default">
                  {isLoadingTree && !treeData && (
                     <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-subtle border-t-brand-secondary"></div>
                     </div>
                  )}

                  {treeData && (
                     <UserTree
                        rootNode={treeData}
                        onLoadChildren={loadChildren}
                        isLoading={isLoadingTree}
                     />
                  )}

                  {!treeData && !isLoadingTree && (
                     <div className="text-center py-6">
                        <p className="text-tertiary text-xs">
                           No se pudo cargar el árbol genealógico
                        </p>
                     </div>
                  )}
               </div>
            )}
         </div>

         {/* Filtros - Responsive y con Dark Mode */}
         <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-sm border border-default space-y-4 sm:space-y-6">
            {/* Búsqueda */}
            <div className="space-y-2">
               <label className="block text-xs sm:text-sm font-medium text-secondary">
                  Buscar usuario
               </label>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary h-4 w-4" />
                  <input
                     type="text"
                     placeholder="Buscar por username..."
                     className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border-2 border-default bg-tertiary text-primary rounded-lg focus:border-brand-secondary focus:outline-none transition-colors"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>

            {/* Tipo de Usuario - Botones */}
            <div className="space-y-3">
               <label className="block text-xs sm:text-sm font-medium text-secondary">
                  Tipo de Usuario
               </label>
               <FilterButtonGroup
                  value={userTypeFilter}
                  onChange={setUserTypeFilter}
                  options={[
                     { value: '', label: 'Todos' },
                     { value: 'BACKOFFICE', label: 'Backoffice' },
                     { value: 'PLAYER', label: 'Jugadores' },
                  ]}
               />
            </div>

            {/* Rol - Botones */}
            <div className="space-y-3">
               <label className="block text-xs sm:text-sm font-medium text-secondary">
                  Rol
               </label>
               <FilterButtonGroup
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                     { value: '', label: 'Todos', icon: <User className="w-4 h-4" /> },
                     { value: 'SUPER_ADMIN', label: 'Super Admin', icon: <Crown className="w-4 h-4" /> },
                     { value: 'BRAND_ADMIN', label: 'Admin', icon: <Shield className="w-4 h-4" /> },
                     { value: 'CASHIER', label: 'Cajero', icon: <UserCheck className="w-4 h-4" /> },
                     { value: 'PLAYER', label: 'Jugador', icon: <User className="w-4 h-4" /> },
                  ]}
               />
            </div>

            {/* Filtros de fecha - Responsive */}
            <div className="space-y-3">
               <label className="block text-xs sm:text-sm font-medium text-primary">
                  Fecha de Creación
               </label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <DatePicker
                     label="Desde"
                     value={createdFrom}
                     onChange={setCreatedFrom}
                     placeholder="Seleccionar fecha"
                     maxDate={createdTo || undefined}
                  />
                  <DatePicker
                     label="Hasta"
                     value={createdTo}
                     onChange={setCreatedTo}
                     placeholder="Seleccionar fecha"
                     minDate={createdFrom || undefined}
                  />
               </div>
            </div>

            {/* Botón para limpiar filtros */}
            {(search || userTypeFilter || roleFilter || createdFrom || createdTo) && (
               <Button
                  onClick={() => {
                     setSearch('');
                     setUserTypeFilter('');
                     setRoleFilter('');
                     setCreatedFrom('');
                     setCreatedTo('');
                  }}
                  variant="secondary"
                  className="w-full sm:w-auto"
               >
                  Limpiar filtros
               </Button>
            )}
         </div>

         {/* Tabla - Responsive */}
         <div className="bg-secondary rounded-lg shadow-sm border border-default overflow-hidden">
            <div className="overflow-x-auto">
               <DataTable
                  data={usersData?.data || []}
                  columns={columns}
                  isLoading={isLoading}
                  pagination={{
                     page: usersData?.pagination.page || 1,
                     pageSize: usersData?.pagination.limit || 20,
                     totalCount: usersData?.pagination.total || 0,
                     totalPages: usersData?.pagination.pages || 1,
                     onPageChange: (newPage) => setPage(newPage),
                  }}
                  keyExtractor={(user) => user.id}
               />
            </div>
         </div>

         {/* Modal para crear usuario */}
         <Modal
            isOpen={isCreateModalOpen}
            onClose={() => {
               setIsCreateModalOpen(false);
               reset();
            }}
            title="Crear Nuevo Usuario"
         >
            <form
               onSubmit={(e) => {
                  handleSubmit(handleCreateUser)(e);
               }}
               className="space-y-5"
            >
               <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                     Username
                  </label>
                  <input
                     type="text"
                     {...register('username')}
                     className="w-full px-4 py-3 border-2 border-default rounded-xl focus:border-brand-secondary focus:outline-none bg-tertiary text-primary placeholder-tertiary transition-colors"
                     placeholder="Ingrese el nombre de usuario"
                  />
                  {errors.username && (
                     <p className="text-status-error-text text-xs mt-2">{errors.username.message}</p>
                  )}
               </div>

               <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                     Contraseña
                     {(selectedRole !== undefined && selectedRole !== null) && <span className="text-status-error-text"> *</span>}
                  </label>
                  <input
                     type="password"
                     {...register('password')}
                     className="w-full px-4 py-3 border-2 border-default rounded-xl focus:border-brand-secondary focus:outline-none bg-tertiary text-primary placeholder-tertiary transition-colors"
                     placeholder="Ingrese la contraseña"
                  />
                  {errors.password && (
                     <p className="text-status-error-text text-xs mt-2">{errors.password.message}</p>
                  )}
               </div>

               <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                     Tipo de Usuario (Rol)
                  </label>
                  <select
                     {...register('role', {
                        setValueAs: (v) => v === '' ? undefined : parseInt(v)
                     })}
                     className="w-full px-4 py-3 border-2 border-default rounded-xl focus:border-brand-secondary focus:outline-none bg-tertiary text-primary transition-colors"
                     defaultValue=""
                  >
                     <option value="">Jugador (PLAYER)</option>
                     {currentUser?.role === 'SUPER_ADMIN' && (
                        <>
                           <option value="0">Super Admin</option>
                           <option value="1">Admin</option>
                           <option value="2">Cajero</option>
                        </>
                     )}
                     {currentUser?.role === 'BRAND_ADMIN' && (
                        <>
                           <option value="1">Admin</option>
                           <option value="2">Cajero</option>
                        </>
                     )}
                     {currentUser?.role === 'CASHIER' && (

                        <option value="2">Cajero</option>

                     )}
                  </select>
                  {errors.role && (
                     <p className="text-status-error-text text-xs mt-2">{errors.role.message}</p>
                  )}
               </div>

               {/* Email para jugadores (cuando role es undefined/null = PLAYER) - OPCIONAL */}
               {(selectedRole === undefined || selectedRole === null) && (
                  <div>
                     <label className="block text-sm font-semibold text-primary mb-2">
                        Email <span className="text-xs text-secondary font-normal">(Opcional)</span>
                     </label>
                     <input
                        type="email"
                        {...register('email')}
                        className="w-full px-4 py-3 border-2 border-default rounded-xl focus:border-brand-secondary focus:outline-none bg-tertiary text-primary placeholder-tertiary transition-colors"
                        placeholder="email@ejemplo.com"
                     />
                     {errors.email && (
                        <p className="text-status-error-text text-xs mt-2">{errors.email.message}</p>
                     )}
                  </div>
               )}

               {/* Comisión solo para cashiers cuando el usuario logueado es CASHIER */}
               {selectedRole === 2 && currentUser?.role === 'CASHIER' && (
                  <div>
                     <label className="block text-sm font-semibold text-primary mb-2">
                        Comisión (%)
                     </label>
                     <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...register('commissionPercent', { valueAsNumber: true })}
                        className="w-full px-4 py-3 border-2 border-default rounded-xl focus:border-brand-secondary focus:outline-none bg-tertiary text-primary placeholder-tertiary transition-colors"
                        placeholder="Ej: 15.50"
                     />
                     {errors.commissionPercent && (
                        <p className="text-status-error-text text-xs mt-2">{errors.commissionPercent.message}</p>
                     )}
                  </div>
               )}

               <div className="flex gap-3 pt-4 border-t border-default">
                  <Button
                     type="button"
                     onClick={() => {
                        setIsCreateModalOpen(false);
                        reset();
                     }}
                     variant="secondary"
                     className="flex-1"
                  >
                     Cancelar
                  </Button>
                  <Button
                     type="submit"
                     variant="primary"
                     disabled={createUserMutation.isPending}
                     loading={createUserMutation.isPending}
                     className="flex-1"
                  >
                     {createUserMutation.isPending ? 'Creando...' : 'Crear Usuario'}
                  </Button>
               </div>
            </form>
         </Modal>

         {/* Modal para gestionar balance */}
         <Modal
            isOpen={isBalanceModalOpen}
            onClose={() => {
               setIsBalanceModalOpen(false);
               setSelectedUser(null);
            }}
            title=""
         >
            <BalanceModal
               user={selectedUser}
               action={balanceAction}
               onConfirm={handleBalanceAction}
               onCancel={() => {
                  setIsBalanceModalOpen(false);
                  setSelectedUser(null);
               }}
               currentUserBalance={currentUserWalletBalance}
            />
         </Modal>
      </div>
   );
}