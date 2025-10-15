import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, User, Crown, Shield, UserCheck, Edit, Trash2, Minus } from 'lucide-react';
import { FilterButtonGroup } from '@/components/FilterButtonGroup';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
   useWithdrawFunds
} from '@/hooks';
import type { CreateUserForm } from '@/types';// Schema para crear usuarios según API unificada
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


   // Si es Player, email es requerido
   if (isPlayer && !data.email) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: 'Email es requerido para jugadores',
         path: ['email'],
      });
   }

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
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
               {action === 'send' ? 'Enviar fondos a' : 'Retirar fondos de'} <strong className="text-gray-900 dark:text-white">{user?.username}</strong>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
               Balance actual: <span className="font-mono font-semibold text-gray-900 dark:text-white">${user?.walletBalance?.toLocaleString() || '0.00'}</span>
            </p>
         </div>

         <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Cantidad
            </label>
            <div className="relative">
               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
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
               className={`px-4 py-2 text-white rounded-lg transition-colors ${action === 'send'
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
      case 'BRAND_ADMIN': return 'Admin';
      case 'CASHIER': return 'Cajero';
      default: return 'Usuario';
   }
};

export function UsersPage() {
   const { user: currentUser } = useAuthStore();
   const [search, setSearch] = useState('');
   const [userTypeFilter, setUserTypeFilter] = useState<'BACKOFFICE' | 'PLAYER' | ''>('');
   const [roleFilter, setRoleFilter] = useState<'SUPER_ADMIN' | 'BRAND_ADMIN' | 'CASHIER' | 'PLAYER' | ''>('');
   const [createdFrom, setCreatedFrom] = useState('');
   const [createdTo, setCreatedTo] = useState('');
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [balanceAction, setBalanceAction] = useState<'send' | 'remove'>('send');
   const [page, setPage] = useState(1);
   const [pageSize] = useState(20);

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
         } else {
            await withdrawFundsMutation.mutateAsync({
               currentUserId: currentUser.id,
               currentUserType: 'BACKOFFICE' as const,
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
            <Link
               to={`/users/${user.id}`}
               className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors min-w-[150px]"
            >
               {getRoleIcon(user.userType, user.role)}
               <div className="min-w-0">
                  <div className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-xs sm:text-sm truncate">{user.username}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
               </div>
            </Link>
         ),
      },
      {
         key: 'walletBalance',
         header: 'Balance',
         render: (user: any) => (
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-[140px]">
               <span className="font-mono font-semibold text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  ${user.walletBalance?.toLocaleString() || '0.00'}
               </span>
               <div className="flex space-x-1">
                  <button
                     onClick={() => {
                        setSelectedUser(user);
                        setBalanceAction('send');
                        setIsBalanceModalOpen(true);
                     }}
                     className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
                     title="Enviar fondos"
                  >
                     <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                     onClick={() => {
                        setSelectedUser(user);
                        setBalanceAction('remove');
                        setIsBalanceModalOpen(true);
                     }}
                     className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                     title="Retirar fondos"
                  >
                     <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
               </div>
            </div>
         ),
      },
      {
         key: 'userType',
         header: 'Tipo',
         render: (user: any) => (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 whitespace-nowrap">
               {getRoleText(user.userType, user.role)}
            </span>
         ),
      },
      {
         key: 'createdBy',
         header: 'Creado por',
         render: (user: any) => (
            <div className="text-xs sm:text-sm min-w-[100px]">
               <div className="font-medium text-gray-900 dark:text-white truncate">
                  {user.createdByUsername || 'Sistema'}
               </div>
               <div className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
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
               className={`inline-flex px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${user.status === 'ACTIVE'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
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
            <div className="flex space-x-1 sm:space-x-2">
               <PermissionGuard permission={Permission.USER_UPDATE}>
                  <button
                     onClick={() => {
                        // TODO: Implementar edición
                        console.log('Editar usuario:', user.id);
                     }}
                     className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded transition-colors"
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
                     className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
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
         <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
               <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                     Gestión de Usuarios
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                     Administra los usuarios del backoffice
                  </p>
               </div>
               <PermissionGuard permission={Permission.USER_CREATE}>
                  <button
                     onClick={() => setIsCreateModalOpen(true)}
                     className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base shadow-md whitespace-nowrap"
                  >
                     <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                     <span>Nuevo Usuario</span>
                  </button>
               </PermissionGuard>
            </div>
         </div>

         {/* Filtros - Responsive y con Dark Mode */}
         <div className="bg-white dark:bg-dark-bg-secondary p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4 sm:space-y-6">
            {/* Búsqueda */}
            <div className="space-y-2">
               <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buscar usuario
               </label>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <input
                     type="text"
                     placeholder="Buscar por username..."
                     className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>

            {/* Tipo de Usuario - Botones */}
            <div className="space-y-3">
               <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
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
               <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
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
               <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fecha de Creación
               </label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                     <label className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Desde
                     </label>
                     <input
                        type="date"
                        className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={createdFrom}
                        onChange={(e) => setCreatedFrom(e.target.value)}
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Hasta
                     </label>
                     <input
                        type="date"
                        className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={createdTo}
                        onChange={(e) => setCreatedTo(e.target.value)}
                     />
                  </div>
               </div>
            </div>

            {/* Botón para limpiar filtros */}
            {(search || userTypeFilter || roleFilter || createdFrom || createdTo) && (
               <button
                  onClick={() => {
                     setSearch('');
                     setUserTypeFilter('');
                     setRoleFilter('');
                     setCreatedFrom('');
                     setCreatedTo('');
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
               >
                  Limpiar filtros
               </button>
            )}
         </div>

         {/* Tabla - Responsive */}
         <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
               className="space-y-4"
            >
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     Username
                  </label>
                  <input
                     type="text"
                     {...register('username')}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {errors.username && (
                     <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.username.message}</p>
                  )}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     Contraseña
                     {(selectedRole !== undefined && selectedRole !== null) && <span className="text-red-500 dark:text-red-400"> *</span>}
                  </label>
                  <input
                     type="password"
                     {...register('password')}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                     placeholder={
                        (selectedRole === undefined || selectedRole === null)
                           ? 'Opcional para jugadores'
                           : 'Requerida'
                     }
                  />
                  {errors.password && (
                     <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     Tipo de Usuario (Rol)
                  </label>
                  <select
                     {...register('role', {
                        setValueAs: (v) => v === '' ? undefined : parseInt(v)
                     })}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                     <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.role.message}</p>
                  )}
               </div>

               {/* Email para jugadores (cuando role es undefined/null = PLAYER) */}
               {(selectedRole === undefined || selectedRole === null) && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email <span className="text-red-500 dark:text-red-400">*</span>
                     </label>
                     <input
                        type="email"
                        {...register('email')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="email@ejemplo.com"
                        required
                     />
                     {errors.email && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>
                     )}
                  </div>
               )}

               {/* Comisión solo para cashiers cuando el usuario logueado es CASHIER */}
               {selectedRole === 2 && currentUser?.role === 'CASHIER' && (
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Comisión (%)
                     </label>
                     <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        {...register('commissionPercent', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="0.00"
                     />
                     {errors.commissionPercent && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.commissionPercent.message}</p>
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
                     className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={createUserMutation.isPending}
                     className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                     {createUserMutation.isPending
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