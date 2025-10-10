import { useState } from 'react';
import { Plus, Search, User, Crown, Shield, UserCheck, Edit, Trash2, Minus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { useAuthStore } from '@/store';
import { 
  useBackofficeUsers, 
  useCreateBackofficeUser,
  usePlayers,
  useSendBalance,
  useRemoveBalance
} from '@/hooks';
import type { CreateUserForm } from '@/types';// Schema para crear usuarios
const createUserSchema = z.object({
   username: z.string().min(3, 'El username debe tener al menos 3 caracteres'),
   password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
   role: z.number().min(0).max(3, 'Role inválido'),
   email: z.string().email('Email inválido').optional(),
   commissionPercent: z.number().min(0).max(100).optional(),
}).refine((data) => {
   // Si es Player (role 0), email es requerido
   if (data.role === 0 && !data.email) {
      return false;
   }
   return true;
}, {
   message: 'Email es requerido para jugadores',
   path: ['email'],
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

// Componente para modal de balance
const BalanceModal = ({ user, action, onConfirm, onCancel }: {
   user: any;
   action: 'send' | 'remove';
   onConfirm: (user: any, action: 'send' | 'remove', amount: number) => void;
   onCancel: () => void;
}) => {
   const [amount, setAmount] = useState('');

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const numAmount = parseFloat(amount);
      if (numAmount > 0) {
         onConfirm(user, action, numAmount);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div className="text-center">
            <p className="text-gray-600">
               {action === 'send' ? 'Enviar fondos a' : 'Retirar fondos de'} <strong>{user?.username}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-1">
               Balance actual: <span className="font-mono">${user?.walletBalance?.toLocaleString() || '0.00'}</span>
            </p>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Cantidad
            </label>
            <div className="relative">
               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
               <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
               />
            </div>
         </div>

         <div className="flex justify-end space-x-3 pt-4">
            <button
               type="button"
               onClick={onCancel}
               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
               Cancelar
            </button>
            <button
               type="submit"
               className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  action === 'send'
                     ? 'bg-green-600 hover:bg-green-700'
                     : 'bg-red-600 hover:bg-red-700'
               }`}
            >
               {action === 'send' ? 'Enviar Fondos' : 'Retirar Fondos'}
            </button>
         </div>
      </form>
   );
};

const getRoleIcon = (userType: string, role?: string) => {
   if (userType === 'PLAYER') {
      return <User className="h-4 w-4 text-blue-500" />;
   }

   switch (role) {
      case 'SUPER_ADMIN':
         return <Crown className="h-4 w-4 text-purple-500" />;
      case 'BRAND_ADMIN':
         return <Shield className="h-4 w-4 text-green-500" />;
      case 'CASHIER':
         return <UserCheck className="h-4 w-4 text-orange-500" />;
      default:
         return <User className="h-4 w-4 text-gray-500" />;
   }
};

const getRoleText = (userType: string, role?: string) => {
   if (userType === 'PLAYER') return 'Jugador';

   switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'BRAND_ADMIN': return 'Brand Admin';
      case 'CASHIER': return 'Cashier';
      default: return 'Usuario';
   }
};

export function UsersPage() {
   const { user: currentUser } = useAuthStore();
   const [search, setSearch] = useState('');
   const [userTypeFilter, setUserTypeFilter] = useState<'BACKOFFICE' | 'PLAYER' | ''>('');
   const [roleFilter, setRoleFilter] = useState<'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER' | ''>('');
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [balanceAction, setBalanceAction] = useState<'send' | 'remove'>('send');

   // Queries para usuarios de backoffice y jugadores
   const { data: backofficeData, isLoading: isLoadingBackoffice } = useBackofficeUsers(
      userTypeFilter === 'BACKOFFICE' || userTypeFilter === ''
         ? { 
            username: search || undefined,
            role: roleFilter || undefined
          }
         : { role: undefined } // Empty query to avoid loading when not needed
   );

   const { data: playersData, isLoading: isLoadingPlayers } = usePlayers(
      userTypeFilter === 'PLAYER' || userTypeFilter === ''
         ? { 
            username: search || undefined,
            role: roleFilter === 'PLAYER' ? roleFilter : undefined
          }
         : { role: undefined } // Empty query to avoid loading when not needed
   );

   // Mutations
   const createBackofficeUserMutation = useCreateBackofficeUser();
   const createPlayerMutation = useCreateBackofficeUser(); // Usar el mismo hook
   const sendBalanceMutation = useSendBalance();
   const removeBalanceMutation = useRemoveBalance();

   // Combinar datos si mostramos todos los tipos
   const combinedData = {
      data: [
         ...(userTypeFilter === '' || userTypeFilter === 'BACKOFFICE' ? backofficeData?.data || [] : []),
         ...(userTypeFilter === '' || userTypeFilter === 'PLAYER' ? playersData?.data || [] : [])
      ],
      pagination: {
         page: 1,
         pageSize: 20,
         totalCount: (backofficeData?.pagination.total || 0) + (playersData?.pagination.total || 0),
         totalPages: 1,
         onPageChange: () => { },
      }
   };

   const isLoading = isLoadingBackoffice || isLoadingPlayers;

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch
   } = useForm<CreateUserFormData>({
      resolver: zodResolver(createUserSchema),
      defaultValues: {
         role: 0, // Player por defecto
      }
   });

   const selectedRole = watch('role');

   const handleCreateUser = async (data: CreateUserFormData) => {
      const userData: CreateUserForm = {
         username: data.username,
         password: data.password,
         role: data.role,
         email: data.email,
         commissionPercent: data.commissionPercent,
      };

      if (data.role === 0) {
         // Crear jugador
         await createPlayerMutation.mutateAsync(userData);
      } else {
         // Crear usuario de backoffice
         await createBackofficeUserMutation.mutateAsync(userData);
      }

      reset();
      setIsCreateModalOpen(false);
   };

   const handleBalanceAction = async (user: any, action: 'send' | 'remove', amount: number) => {
      if (!currentUser) return;

      try {
         if (action === 'send') {
            await sendBalanceMutation.mutateAsync({
               fromUserId: currentUser.id,
               fromUserType: 'BACKOFFICE' as const,
               toUserId: user.id,
               toUserType: user.userType,
               amount,
               description: `Envío de fondos desde ${currentUser.username}`,
            });
         } else {
            await removeBalanceMutation.mutateAsync({
               fromUserId: currentUser.id,
               fromUserType: 'BACKOFFICE' as const,
               targetUserId: user.id,
               targetUserType: user.userType,
               amount,
               description: `Retiro de fondos por ${currentUser.username}`,
            });
         }
         setIsBalanceModalOpen(false);
         setSelectedUser(null);
      } catch (error) {
         console.error('Error in balance operation:', error);
      }
   };

   const columns: Column<Record<string, any>>[] = [
      {
         key: 'username',
         header: 'Usuario',
         render: (user: any) => (
            <div className="flex items-center space-x-3">
               {getRoleIcon(user.userType, user.role)}
               <div>
                  <div className="font-medium text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
               </div>
            </div>
         ),
      },
      {
         key: 'walletBalance',
         header: 'Balance',
         render: (user: any) => (
            <div className="flex items-center space-x-2">
               <span className="font-mono font-semibold">
                  ${user.walletBalance?.toLocaleString() || '0.00'}
               </span>
               <div className="flex space-x-1">
                  <button
                     onClick={() => {
                        setSelectedUser(user);
                        setBalanceAction('send');
                        setIsBalanceModalOpen(true);
                     }}
                     className="p-1 text-green-600 hover:bg-green-100 rounded"
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
                     className="p-1 text-red-600 hover:bg-red-100 rounded"
                     title="Retirar fondos"
                  >
                     <Minus className="h-4 w-4" />
                  </button>
               </div>
            </div>
         ),
      },
      {
         key: 'userType',
         header: 'Tipo',
         render: (user: any) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
               {getRoleText(user.userType, user.role)}
            </span>
         ),
      },
      {
         key: 'createdBy',
         header: 'Creado por',
         render: (user: any) => (
            <div className="text-sm">
               <div className="font-medium text-gray-900">
                  {user.createdByUsername || 'Sistema'}
               </div>
               <div className="text-gray-500">
                  {user.createdByRole || 'Sistema'}
               </div>
            </div>
         ),
      },
      {
         key: 'status',
         header: 'Estado',
         render: (user: any) => (
            <span
               className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}
            >
               {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
         ),
      },
      {
         key: 'actions',
         header: 'Operaciones',
         render: (user: any) => (
            <div className="flex space-x-2">
               <PermissionGuard permission={Permission.USER_UPDATE}>
                  <button
                     onClick={() => {
                        // TODO: Implementar edición
                        console.log('Editar usuario:', user.id);
                     }}
                     className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                     title="Editar usuario"
                  >
                     <Edit className="h-4 w-4" />
                  </button>
               </PermissionGuard>
               <PermissionGuard permission={Permission.USER_DELETE}>
                  <button
                     onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar el usuario "${user.username}"?`)) {
                           // TODO: Implementar eliminación
                           console.log('Eliminar usuario:', user.id);
                        }
                     }}
                     className="p-1 text-red-600 hover:bg-red-100 rounded"
                     title="Eliminar usuario"
                  >
                     <Trash2 className="h-4 w-4" />
                  </button>
               </PermissionGuard>
            </div>
         ),
      },
   ];

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <PermissionGuard permission={Permission.USER_CREATE}>
               <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
               >
                  <Plus className="h-4 w-4" />
                  <span>Nuevo Usuario</span>
               </button>
            </PermissionGuard>
         </div>

         {/* Filtros */}
         <div className="bg-white p-4 rounded-lg shadow space-y-4 md:space-y-0 md:flex md:space-x-4 md:items-center">
            <div className="flex-1">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                     type="text"
                     placeholder="Buscar por username..."
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>
            <div className="md:w-48">
               <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value as typeof userTypeFilter)}
               >
                  <option value="">Todos los tipos</option>
                  <option value="BACKOFFICE">Backoffice</option>
                  <option value="PLAYER">Jugadores</option>
               </select>
            </div>
            <div className="md:w-48">
               <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
               >
                  <option value="">Todos los roles</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="BRAND_ADMIN">Brand Admin</option>
                  <option value="CASHIER">Cashier</option>
                  <option value="PLAYER">Player</option>
               </select>
            </div>
         </div>

         {/* Tabla */}
         <div className="bg-white rounded-lg shadow">
            <DataTable
               data={combinedData.data}
               columns={columns}
               isLoading={isLoading}
               pagination={combinedData.pagination}
               keyExtractor={(user) => user.id}
            />
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
            <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Username
                  </label>
                  <input
                     type="text"
                     {...register('username')}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.username && (
                     <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Contraseña
                  </label>
                  <input
                     type="password"
                     {...register('password')}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.password && (
                     <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Tipo de Usuario
                  </label>
                  <select
                     {...register('role', { valueAsNumber: true })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                     <option value={0}>Jugador</option>
                     {currentUser?.role === 'SUPER_ADMIN' && (
                        <>
                           <option value={2}>Cashier</option>
                           <option value={1}>Brand Admin</option>
                           <option value={3}>Super Admin</option>
                        </>
                     )}
                     {currentUser?.role === 'BRAND_ADMIN' && (
                        <option value={2}>Cashier</option>
                     )}
                  </select>
                  {errors.role && (
                     <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
               </div>

               {/* Email para jugadores */}
               {selectedRole === 0 && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                     </label>
                     <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                     )}
                  </div>
               )}

               {/* Comisión para cashiers */}
               {selectedRole === 2 && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comisión (%)
                     </label>
                     <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...register('commissionPercent', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                     {errors.commissionPercent && (
                        <p className="text-red-500 text-sm mt-1">{errors.commissionPercent.message}</p>
                     )}
                  </div>
               )}

               <div className="flex justify-end space-x-3 pt-4">
                  <button
                     type="button"
                     onClick={() => {
                        setIsCreateModalOpen(false);
                        reset();
                     }}
                     className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={createBackofficeUserMutation.isPending || createPlayerMutation.isPending}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                     {createBackofficeUserMutation.isPending || createPlayerMutation.isPending
                        ? 'Creando...'
                        : 'Crear Usuario'
                     }
                  </button>
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
            title={`${balanceAction === 'send' ? 'Enviar' : 'Retirar'} Fondos - ${selectedUser?.username || ''}`}
         >
            <BalanceModal
               user={selectedUser}
               action={balanceAction}
               onConfirm={handleBalanceAction}
               onCancel={() => {
                  setIsBalanceModalOpen(false);
                  setSelectedUser(null);
               }}
            />
         </Modal>
      </div>
   );
}