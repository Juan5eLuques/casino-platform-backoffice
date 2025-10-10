import { useState } from 'react';
import { Search, Filter, DollarSign, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { useAuthStore } from '@/store';
import { 
  useTransactions, 
  useCreateTransaction,
  useSendBalance,
  useRemoveBalance,
  useBackofficeUsers,
  usePlayers
} from '@/hooks';
import type { CreateTransactionRequest } from '@/types';

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
   const { user: currentUser } = useAuthStore();
   const [search, setSearch] = useState('');
   const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>('');
   const [userTypeFilter, setUserTypeFilter] = useState<'BACKOFFICE' | 'PLAYER' | ''>('');
   const [dateFromFilter, setDateFromFilter] = useState('');
   const [dateToFilter, setDateToFilter] = useState('');
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);
   const [quickActionType, setQuickActionType] = useState<'send' | 'remove'>('send');

   // Query para transacciones con filtros
   const { data: transactionsData, isLoading } = useTransactions({
      userType: userTypeFilter || undefined,
      fromDate: dateFromFilter || undefined,
      toDate: dateToFilter || undefined,
      description: search || undefined,
   });

   // Queries para usuarios (para seleccionar en formularios)
   const { data: backofficeUsers } = useBackofficeUsers();
   const { data: players } = usePlayers();

   // Mutations
   const createTransactionMutation = useCreateTransaction();
   const sendBalanceMutation = useSendBalance();
   const removeBalanceMutation = useRemoveBalance();

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
         description: data.description,
         idempotencyKey: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      await createTransactionMutation.mutateAsync(transactionData);
      reset();
      setIsCreateModalOpen(false);
   };

   const handleQuickSend = async (data: { toUserId: string; toUserType: 'BACKOFFICE' | 'PLAYER'; amount: number; description: string }) => {
      if (!currentUser) return;

      await sendBalanceMutation.mutateAsync({
         fromUserId: currentUser.id,
         fromUserType: 'BACKOFFICE',
         toUserId: data.toUserId,
         toUserType: data.toUserType,
         amount: data.amount,
         description: data.description,
      });

      setIsQuickActionModalOpen(false);
   };

   const handleQuickRemove = async (data: { targetUserId: string; targetUserType: 'BACKOFFICE' | 'PLAYER'; amount: number; description: string }) => {
      if (!currentUser) return;

      await removeBalanceMutation.mutateAsync({
         fromUserId: currentUser.id,
         fromUserType: 'BACKOFFICE',
         targetUserId: data.targetUserId,
         targetUserType: data.targetUserType,
         amount: data.amount,
         description: data.description,
      });

      setIsQuickActionModalOpen(false);
   };

   const columns: Column<Record<string, any>>[] = [
      {
         key: 'transactionType',
         header: 'Tipo',
         render: (transaction: any) => (
            <div className="flex items-center space-x-2">
               {getTransactionIcon(transaction.transactionType)}
               <span className="font-medium">
                  {getTransactionTypeText(transaction.transactionType)}
               </span>
            </div>
         ),
      },
      {
         key: 'amount',
         header: 'Monto',
         render: (transaction: any) => (
            <span className={`font-mono font-semibold ${
               transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'TRANSFER'
                  ? 'text-green-600'
                  : 'text-red-600'
            }`}>
               {transaction.transactionType === 'WITHDRAWAL' ? '-' : '+'}${transaction.amount?.toLocaleString()}
            </span>
         ),
      },
      {
         key: 'fromUser',
         header: 'Desde',
         render: (transaction: any) => (
            <div className="text-sm">
               <div className="font-medium">{transaction.fromUsername || 'Sistema'}</div>
               <div className="text-gray-500">{transaction.fromUserType}</div>
            </div>
         ),
      },
      {
         key: 'toUser',
         header: 'Hacia',
         render: (transaction: any) => (
            <div className="text-sm">
               <div className="font-medium">{transaction.toUsername || 'Sistema'}</div>
               <div className="text-gray-500">{transaction.toUserType}</div>
            </div>
         ),
      },
      {
         key: 'description',
         header: 'Descripción',
         render: (transaction: any) => (
            <span className="text-sm text-gray-600">{transaction.description}</span>
         ),
      },
      {
         key: 'status',
         header: 'Estado',
         render: (transaction: any) => (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
               transaction.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : transaction.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
               {transaction.status === 'COMPLETED' ? 'Completada' : 
                transaction.status === 'PENDING' ? 'Pendiente' : 'Fallida'}
            </span>
         ),
      },
      {
         key: 'createdAt',
         header: 'Fecha',
         render: (transaction: any) => (
            <div className="text-sm">
               <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
               <div className="text-gray-500">{new Date(transaction.createdAt).toLocaleTimeString()}</div>
            </div>
         ),
      },
   ];

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Transacciones</h1>
            <div className="flex space-x-2">
               <PermissionGuard permission={Permission.PLAYER_WALLET_ADJUST}>
                  <button
                     onClick={() => {
                        setQuickActionType('send');
                        setIsQuickActionModalOpen(true);
                     }}
                     className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                     <ArrowDownLeft className="h-4 w-4" />
                     <span>Envío Rápido</span>
                  </button>
               </PermissionGuard>
               <PermissionGuard permission={Permission.PLAYER_WALLET_ADJUST}>
                  <button
                     onClick={() => {
                        setQuickActionType('remove');
                        setIsQuickActionModalOpen(true);
                     }}
                     className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                     <ArrowUpRight className="h-4 w-4" />
                     <span>Retiro Rápido</span>
                  </button>
               </PermissionGuard>
               <PermissionGuard permission={Permission.PLAYER_WALLET_ADJUST}>
                  <button
                     onClick={() => setIsCreateModalOpen(true)}
                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                     <DollarSign className="h-4 w-4" />
                     <span>Nueva Transacción</span>
                  </button>
               </PermissionGuard>
            </div>
         </div>

         {/* Filtros avanzados */}
         <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <div className="flex items-center space-x-2 mb-4">
               <Filter className="h-5 w-5 text-gray-400" />
               <h3 className="font-medium text-gray-900">Filtros</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Buscar
                  </label>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                     <input
                        type="text"
                        placeholder="Descripción..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Tipo de Transacción
                  </label>
                  <select
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     value={transactionTypeFilter}
                     onChange={(e) => setTransactionTypeFilter(e.target.value)}
                  >
                     <option value="">Todos los tipos</option>
                     <option value="TRANSFER">Transferencia</option>
                     <option value="DEPOSIT">Depósito</option>
                     <option value="WITHDRAWAL">Retiro</option>
                     <option value="ADJUSTMENT">Ajuste</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Tipo de Usuario
                  </label>
                  <select
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     value={userTypeFilter}
                     onChange={(e) => setUserTypeFilter(e.target.value as typeof userTypeFilter)}
                  >
                     <option value="">Todos los usuarios</option>
                     <option value="BACKOFFICE">Backoffice</option>
                     <option value="PLAYER">Jugadores</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Rango de Fechas
                  </label>
                  <div className="flex space-x-2">
                     <input
                        type="date"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                     />
                     <input
                        type="date"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Tabla de transacciones */}
         <div className="bg-white rounded-lg shadow">
            <DataTable
               data={transactionsData?.data || []}
               columns={columns}
               isLoading={isLoading}
               pagination={{
                  page: transactionsData?.pagination?.page || 1,
                  pageSize: transactionsData?.pagination?.limit || 20,
                  totalCount: transactionsData?.pagination?.total || 0,
                  totalPages: transactionsData?.pagination?.pages || 1,
                  onPageChange: () => {},
               }}
               keyExtractor={(transaction) => transaction.id}
            />
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
                     className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     disabled={createTransactionMutation.isPending}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                     {createTransactionMutation.isPending ? 'Creando...' : 'Crear Transacción'}
                  </button>
               </div>
            </form>
         </Modal>

         {/* Modal para acciones rápidas */}
         <Modal
            isOpen={isQuickActionModalOpen}
            onClose={() => setIsQuickActionModalOpen(false)}
            title={quickActionType === 'send' ? 'Envío Rápido' : 'Retiro Rápido'}
         >
            <QuickActionModal
               action={quickActionType}
               onConfirm={quickActionType === 'send' ? handleQuickSend : handleQuickRemove}
               onCancel={() => setIsQuickActionModalOpen(false)}
               backofficeUsers={backofficeUsers?.data || []}
               players={players?.data || []}
            />
         </Modal>
      </div>
   );
}

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