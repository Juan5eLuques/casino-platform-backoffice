import { useState } from 'react';
import { Search, Filter, DollarSign, ArrowUpRight, ArrowDownLeft, FileText, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { FilterButtonGroup } from '@/components/FilterButtonGroup';
import { DatePicker } from '@/components/ui';

import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
// import { useAuthStore } from '@/store'; // TODO: Descomentar para quick actions
import {
   useTransactions,
   useCreateTransaction,
   // useDepositFunds, // TODO: Descomentar para quick actions
   // useWithdrawFunds, // TODO: Descomentar para quick actions
   useBackofficeUsers,
   usePlayers
} from '@/hooks';
import type { CreateTransactionRequest, TransactionType } from '@/types';

// Schema para crear transacción
const createTransactionSchema = z.object({
   fromUserId: z.string().min(1, 'Usuario origen es requerido'),
   fromUserType: z.enum(['BACKOFFICE', 'PLAYER']),
   toUserId: z.string().min(1, 'Usuario destino es requerido'),
   toUserType: z.enum(['BACKOFFICE', 'PLAYER']),
   amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
   description: z.string().min(1, 'La descripción es requerida'),
   transactionType: z.enum(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'ADJUSTMENT']),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

const getTransactionIcon = (type: string) => {
   switch (type) {
      case 'DEPOSIT':
         return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'WITHDRAWAL':
         return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'TRANSFER':
         return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'ADJUSTMENT':
         return <FileText className="h-4 w-4 text-orange-500" />;
      default:
         return <DollarSign className="h-4 w-4 text-gray-500" />;
   }
};

const getTransactionTypeText = (type: string) => {
   switch (type) {
      case 'DEPOSIT': return 'Depósito';
      case 'WITHDRAWAL': return 'Retiro';
      case 'TRANSFER': return 'Transferencia';
      case 'ADJUSTMENT': return 'Ajuste';
      default: return type;
   }
};

export function TransactionsPage() {
   // const { user: currentUser } = useAuthStore(); // TODO: Descomentar para quick actions
   const [search, setSearch] = useState('');
   const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionType | ''>('');
   const [userTypeFilter, setUserTypeFilter] = useState<'BACKOFFICE' | 'PLAYER' | ''>('');

   // Fechas por defecto: primer día del mes hasta hoy
   const today = new Date();
   const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
   const formatDate = (date: Date) => date.toISOString().split('T')[0];

   const [dateFromFilter, setDateFromFilter] = useState(formatDate(firstDayOfMonth));
   const [dateToFilter, setDateToFilter] = useState(formatDate(today));

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   // const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);

   // Query para transacciones con filtros
   const { data: transactionsData, isLoading } = useTransactions({
      fromDate: dateFromFilter || undefined,
      toDate: dateToFilter || undefined,
      externalRef: search || undefined,
      transactionType: transactionTypeFilter || undefined,
   });

   // Queries para usuarios (para seleccionar en formularios)
   const { data: backofficeUsers } = useBackofficeUsers();
   const { data: players } = usePlayers();

   // Mutations
   const createTransactionMutation = useCreateTransaction();
   // const depositFundsMutation = useDepositFunds(); // TODO: Descomentar para quick actions
   // const withdrawFundsMutation = useWithdrawFunds(); // TODO: Descomentar para quick actions

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch
   } = useForm<CreateTransactionFormData>({
      resolver: zodResolver(createTransactionSchema),
      defaultValues: {
         fromUserType: 'BACKOFFICE',
         toUserType: 'PLAYER',
         transactionType: 'TRANSFER',
      }
   });

   const selectedFromUserType = watch('fromUserType');
   const selectedToUserType = watch('toUserType');

   const handleCreateTransaction = async (data: CreateTransactionFormData) => {
      const transactionData: CreateTransactionRequest = {
         fromUserId: data.fromUserId,
         fromUserType: data.fromUserType,
         toUserId: data.toUserId,
         toUserType: data.toUserType,
         amount: data.amount,
         transactionType: data.transactionType,
         description: data.description,
         idempotencyKey: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      await createTransactionMutation.mutateAsync(transactionData);
      reset();
      setIsCreateModalOpen(false);
   };

   /* TODO: Descomentar cuando se agreguen botones de quick actions
   const handleQuickSend = async (data: { toUserId: string; toUserType: 'BACKOFFICE' | 'PLAYER'; amount: number; description: string }) => {
      if (!currentUser) return;

      await depositFundsMutation.mutateAsync({
         currentUserId: currentUser.id,
         currentUserType: 'BACKOFFICE',
         isSuperAdmin: currentUser.role === 'SUPER_ADMIN',
         toUserId: data.toUserId,
         toUserType: data.toUserType,
         amount: data.amount,
         description: data.description,
      });

      // setIsQuickActionModalOpen(false);
   };

   const handleQuickRemove = async (data: { targetUserId: string; targetUserType: 'BACKOFFICE' | 'PLAYER'; amount: number; description: string }) => {
      if (!currentUser) return;

      await withdrawFundsMutation.mutateAsync({
         fromUserId: data.targetUserId,
         fromUserType: data.targetUserType,
         amount: data.amount,
         description: data.description,
      });

      // setIsQuickActionModalOpen(false);
   };
   */

   const columns: Column<Record<string, any>>[] = [
      {
         key: 'transactionType',
         header: 'Tipo',
         render: (transaction: any) => (
            <div className="flex items-center space-x-2 min-w-[120px]">
               {getTransactionIcon(transaction.transactionType)}
               <span className="font-medium text-primary text-xs sm:text-sm">
                  {getTransactionTypeText(transaction.transactionType)}
               </span>
            </div>
         ),
      },
      {
         key: 'fromUsername',
         header: 'Desde',
         render: (transaction: any) => (
            <div className="text-xs sm:text-sm min-w-[100px]">
               {transaction.fromUsername ? (
                  <Link 
                     to={`/users/${transaction.fromUserId}`}
                     className="font-medium text-brand-secondary hover:underline truncate block"
                  >
                     {transaction.fromUsername}
                  </Link>
               ) : (
                  <span className="font-medium text-tertiary truncate block">Sistema</span>
               )}
               <div className="text-tertiary text-[10px] sm:text-xs">{transaction.fromUserType}</div>
            </div>
         ),
      },
      {
         key: 'toUsername',
         header: 'Hacia',
         render: (transaction: any) => (
            <div className="text-xs sm:text-sm min-w-[100px]">
               {transaction.toUsername ? (
                  <Link 
                     to={`/users/${transaction.toUserId}`}
                     className="font-medium text-brand-secondary hover:underline truncate block"
                  >
                     {transaction.toUsername}
                  </Link>
               ) : (
                  <span className="font-medium text-tertiary truncate block">Sistema</span>
               )}
               <div className="text-tertiary text-[10px] sm:text-xs">{transaction.toUserType}</div>
            </div>
         ),
      },
      {
         key: 'amount',
         header: 'Monto',
         render: (transaction: any) => (
            <span className={`font-mono font-semibold text-sm sm:text-base whitespace-nowrap ${
               transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'TRANSFER'
                  ? 'text-status-success-text'
                  : 'text-status-error-text'
               }`}>
               {transaction.transactionType === 'WITHDRAWAL' ? '-' : '+'}${transaction.amount?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
         ),
      },
      {
         key: 'balanceChange',
         header: 'Cambio de Saldo',
         render: (transaction: any) => {
            // Para MINT (desde superadmin), mostrar el balance del destinatario (To)
            // Para otros tipos, mostrar el balance del origen (From)
            const showToBalance = transaction.transactionType === 'MINT' || !transaction.fromUserId;
            const prevBalance = showToBalance ? transaction.previousBalanceTo : transaction.previousBalanceFrom;
            const newBalance = showToBalance ? transaction.newBalanceTo : transaction.newBalanceFrom;
            
            return (
               <div className="text-xs sm:text-sm min-w-[150px]">
                  <div className="flex items-center gap-2">
                     <span className="font-mono text-tertiary">
                        ${prevBalance?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </span>
                     <ArrowRight className="h-3 w-3 text-brand-secondary" />
                     <span className="font-mono font-semibold text-primary">
                        ${newBalance?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                     </span>
                  </div>
               </div>
            );
         },
      },
      {
         key: 'createdAt',
         header: 'Fecha',
         render: (transaction: any) => (
            <div className="text-xs sm:text-sm min-w-[100px]">
               <div className="text-primary font-medium">{new Date(transaction.createdAt).toLocaleDateString('es-ES')}</div>
               <div className="text-tertiary text-[10px] sm:text-xs">{new Date(transaction.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
         ),
      },
   ];

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header - Responsive */}
         <div className="pb-4 border-b border-default">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
               Gestión de Transacciones
            </h1>
            <p className="text-sm md:text-base text-secondary mt-1">
               Visualiza y administra todas las transacciones del sistema
            </p>
         </div>

         {/* Filtros avanzados - Responsive */}
         <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-sm border border-default space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-2">
               <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-tertiary" />
               <h3 className="text-sm sm:text-base font-medium text-primary">Filtros</h3>
            </div>

            {/* Búsqueda */}
            <div className="space-y-2">
               <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  Buscar por descripción
               </label>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary h-4 w-4" />
                  <input
                     type="text"
                     placeholder="Descripción..."
                     className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-default bg-tertiary text-primary rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>

            {/* Tipo de Transacción - Botones */}
            <div className="space-y-3">
               <label className="block text-xs sm:text-sm font-medium text-secondary">
                  Tipo de Transacción
               </label>
               <FilterButtonGroup
                  value={transactionTypeFilter}
                  onChange={setTransactionTypeFilter}
                  options={[
                     { value: '', label: 'Todas', icon: <Filter className="w-4 h-4" /> },
                     { value: 'MINT', label: 'Deposito', icon: <DollarSign className="w-4 h-4" /> },
                     { value: 'TRANSFER', label: 'Transferencia', icon: <DollarSign className="w-4 h-4" /> },
                     // { value: 'BET', label: 'Bet', icon: <ArrowUpRight className="w-4 h-4" /> },
                     // { value: 'WIN', label: 'Win', icon: <ArrowDownLeft className="w-4 h-4" /> },
                     // { value: 'ROLLBACK', label: 'RollBack', icon: <FileText className="w-4 h-4" /> },
                     // { value: 'DEPOSIT', label: 'Deposito', icon: <ArrowDownLeft className="w-4 h-4" /> },
                     { value: 'WITHDRAWAL', label: 'Retirado', icon: <ArrowUpRight className="w-4 h-4" /> },
                     // { value: 'BONUS', label: 'Bonus', icon: <DollarSign className="w-4 h-4" /> },
                     // { value: 'ADJUSTMENT', label: 'Ajuste', icon: <FileText className="w-4 h-4" /> },
                  ]}
               />
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

            {/* Rango de Fechas - Responsive */}
            <div className="space-y-2">
               <label className="block text-xs sm:text-sm font-medium text-primary">
                  Rango de Fechas
               </label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <DatePicker
                     label="Desde"
                     value={dateFromFilter}
                     onChange={setDateFromFilter}
                     placeholder="Fecha inicio"
                     maxDate={dateToFilter || undefined}
                  />
                  <DatePicker
                     label="Hasta"
                     value={dateToFilter}
                     onChange={setDateToFilter}
                     placeholder="Fecha fin"
                     minDate={dateFromFilter || undefined}
                  />
               </div>
            </div>

            {/* Botón para limpiar filtros */}
            {(search || transactionTypeFilter || userTypeFilter) && (
               <button
                  onClick={() => {
                     setSearch('');
                     setTransactionTypeFilter('');
                     setUserTypeFilter('');
                     setDateFromFilter(formatDate(firstDayOfMonth));
                     setDateToFilter(formatDate(today));
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-secondary bg-tertiary hover:bg-surface-hover rounded-lg transition-colors border border-default"
               >
                  Limpiar filtros
               </button>
            )}
         </div>

         {/* Tabla de transacciones - Responsive */}
         <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
               <DataTable
                  data={transactionsData?.data || []}
                  columns={columns}
                  isLoading={isLoading}
                  pagination={{
                     page: transactionsData?.pagination?.page || 1,
                     pageSize: transactionsData?.pagination?.limit || 20,
                     totalCount: transactionsData?.pagination?.total || 0,
                     totalPages: transactionsData?.pagination?.pages || 1,
                     onPageChange: () => { },
                  }}
                  keyExtractor={(transaction) => transaction.id}
               />
            </div>
         </div>

         {/* Modal para crear transacción */}
         <Modal
            isOpen={isCreateModalOpen}
            onClose={() => {
               setIsCreateModalOpen(false);
               reset();
            }}
            title="Nueva Transacción"
         >
            <form onSubmit={handleSubmit(handleCreateTransaction)} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Usuario Origen
                     </label>
                     <select
                        {...register('fromUserType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                        <option value="BACKOFFICE">Backoffice</option>
                        <option value="PLAYER">Jugador</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usuario Origen
                     </label>
                     <select
                        {...register('fromUserId')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                        <option value="">Seleccionar usuario</option>
                        {selectedFromUserType === 'BACKOFFICE'
                           ? backofficeUsers?.data.map(user => (
                              <option key={user.id} value={user.id}>{user.username}</option>
                           ))
                           : players?.data.map(user => (
                              <option key={user.id} value={user.id}>{user.username}</option>
                           ))
                        }
                     </select>
                     {errors.fromUserId && (
                        <p className="text-red-500 text-sm mt-1">{errors.fromUserId.message}</p>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Usuario Destino
                     </label>
                     <select
                        {...register('toUserType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                        <option value="BACKOFFICE">Backoffice</option>
                        <option value="PLAYER">Jugador</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usuario Destino
                     </label>
                     <select
                        {...register('toUserId')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                        <option value="">Seleccionar usuario</option>
                        {selectedToUserType === 'BACKOFFICE'
                           ? backofficeUsers?.data.map(user => (
                              <option key={user.id} value={user.id}>{user.username}</option>
                           ))
                           : players?.data.map(user => (
                              <option key={user.id} value={user.id}>{user.username}</option>
                           ))
                        }
                     </select>
                     {errors.toUserId && (
                        <p className="text-red-500 text-sm mt-1">{errors.toUserId.message}</p>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Transacción
                     </label>
                     <select
                        {...register('transactionType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     >
                        <option value="TRANSFER">Transferencia</option>
                        <option value="DEPOSIT">Depósito</option>
                        <option value="WITHDRAWAL">Retiro</option>
                        <option value="ADJUSTMENT">Ajuste</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto
                     </label>
                     <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                           type="number"
                           step="0.01"
                           min="0.01"
                           {...register('amount', { valueAsNumber: true })}
                           className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="0.00"
                        />
                     </div>
                     {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                     )}
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Descripción
                  </label>
                  <textarea
                     {...register('description')}
                     rows={3}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="Descripción de la transacción..."
                  />
                  {errors.description && (
                     <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
               </div>

               <div className="flex justify-end space-x-3 pt-4">
                  <button
                     type="button"
                     onClick={() => {
                        setIsCreateModalOpen(false);
                        reset();
                     }}
                     className="px-4 py-2 text-secondary border border-default rounded-lg hover:bg-tertiary transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={createTransactionMutation.isPending}
                     className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary hover:opacity-90 transition-all disabled:opacity-50"
                  >
                     {createTransactionMutation.isPending ? 'Creando...' : 'Crear Transacción'}
                  </button>
               </div>
            </form>
         </Modal>

         {/* TODO: Modal para acciones rápidas - Descomentar cuando se agreguen botones de quick actions
         <Modal
            isOpen={isQuickActionModalOpen}
            onClose={() => setIsQuickActionModalOpen(false)}
            title="Acción Rápida"
         >
            <QuickActionModal
               action="send"
               onConfirm={handleQuickSend}
               onCancel={() => setIsQuickActionModalOpen(false)}
               backofficeUsers={backofficeUsers?.data || []}
               players={players?.data || []}
            />
         </Modal>
         */}
      </div>
   );
}

/* TODO: Descomentar cuando se agreguen botones de quick actions
// Componente para modal de acciones rápidas
const QuickActionModal = ({ action, onConfirm, onCancel, backofficeUsers, players }: {
   action: 'send' | 'remove';
   onConfirm: (data: any) => void;
   onCancel: () => void;
   backofficeUsers: any[];
   players: any[];
}) => {
   const [userType, setUserType] = useState<'BACKOFFICE' | 'PLAYER'>('PLAYER');
   const [userId, setUserId] = useState('');
   const [amount, setAmount] = useState('');
   const [description, setDescription] = useState('');

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const numAmount = parseFloat(amount);
      if (numAmount > 0 && userId && description) {
         if (action === 'send') {
            onConfirm({
               toUserId: userId,
               toUserType: userType,
               amount: numAmount,
               description,
            });
         } else {
            onConfirm({
               targetUserId: userId,
               targetUserType: userType,
               amount: numAmount,
               description,
            });
         }
      }
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Tipo de Usuario
            </label>
            <select
               value={userType}
               onChange={(e) => {
                  setUserType(e.target.value as typeof userType);
                  setUserId(''); // Reset user selection
               }}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
               <option value="PLAYER">Jugador</option>
               <option value="BACKOFFICE">Backoffice</option>
            </select>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Usuario {action === 'send' ? 'Destino' : 'Origen'}
            </label>
            <select
               value={userId}
               onChange={(e) => setUserId(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               required
            >
               <option value="">Seleccionar usuario</option>
               {(userType === 'BACKOFFICE' ? backofficeUsers : players).map(user => (
                  <option key={user.id} value={user.id}>
                     {user.username} {user.walletBalance ? `($${user.walletBalance.toLocaleString()})` : ''}
                  </option>
               ))}
            </select>
         </div>

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Monto
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

         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
               Descripción
            </label>
            <input
               type="text"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder={`Motivo del ${action === 'send' ? 'envío' : 'retiro'}...`}
               required
            />
         </div>

         <div className="flex justify-end space-x-3 pt-4">
            <button
               type="button"
               onClick={onCancel}
               className="px-4 py-2 text-secondary border border-default rounded-lg hover:bg-tertiary transition-colors"
            >
               Cancelar
            </button>
            <button
               type="submit"
               className={`px-4 py-2 text-white rounded-lg transition-all ${action === 'send'
                  ? 'bg-status-success hover:opacity-90'
                  : 'bg-btn-danger-bg hover:bg-btn-danger-bg-hover'
                  }`}
            >
               {action === 'send' ? 'Enviar Fondos' : 'Retirar Fondos'}
            </button>
         </div>
      </form>
   );
};
*/