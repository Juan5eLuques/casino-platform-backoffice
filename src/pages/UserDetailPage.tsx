import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   ArrowLeft,
   User,
   Mail,
   Calendar,
   Activity,
   CreditCard,
   TrendingUp,
   TrendingDown,
   RefreshCw
} from 'lucide-react';
import { useUser, useTransactions } from '@/hooks';
import { DataTable, Column } from '@/components/DataTable';
import type { TransactionResponse } from '@/types';

// Función para formatear fechas
const formatDate = (dateString: string) => {
   return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
   });
};

// Función para obtener icono según tipo de transacción
const getTransactionIcon = (type: string) => {
   switch (type) {
      case 'TRANSFER':
         return <RefreshCw className="h-4 w-4" />;
      case 'MINT':
         return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
         return <Activity className="h-4 w-4" />;
   }
};

// Función para determinar si es ingreso o egreso
const getTransactionDirection = (transaction: TransactionResponse, userId: string) => {
   if (transaction.toUserId === userId) {
      return 'income'; // Es un ingreso
   } else if (transaction.fromUserId === userId) {
      return 'expense'; // Es un egreso
   }
   return 'neutral';
};

export function UserDetailPage() {
   const { userId } = useParams<{ userId: string }>();
   const navigate = useNavigate();
   const [page, setPage] = useState(1);
   const [pageSize] = useState(20);

   // Obtener información del usuario
   const { data: user, isLoading: isLoadingUser } = useUser(userId || '');

   // Obtener transacciones del usuario
   const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactions({
      userId,
      page,
      pageSize,
   });

   const isLoading = isLoadingUser || isLoadingTransactions;

   // Columnas para la tabla de transacciones
   const transactionColumns: Column<TransactionResponse>[] = [
      {
         key: 'type',
         header: 'Tipo',
         render: (transaction: TransactionResponse) => (
            <div className="flex items-center space-x-2">
               {getTransactionIcon(transaction.type)}
               <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {transaction.type === 'TRANSFER' ? 'Transferencia' : 'Mint'}
               </span>
            </div>
         ),
      },
      {
         key: 'from',
         header: 'Desde',
         render: (transaction: TransactionResponse) => (
            <div className="text-sm">
               {transaction.fromUserId ? (
                  <div>
                     <div className="font-medium text-gray-900 dark:text-gray-100">
                        {transaction.fromUsername || 'Usuario'}
                     </div>
                     <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {transaction.fromUserType}
                     </div>
                  </div>
               ) : (
                  <span className="text-gray-400 dark:text-gray-500">Sistema</span>
               )}
            </div>
         ),
      },
      {
         key: 'to',
         header: 'Hacia',
         render: (transaction: TransactionResponse) => (
            <div className="text-sm">
               {transaction.toUserId ? (
                  <div>
                     <div className="font-medium text-gray-900 dark:text-gray-100">
                        {transaction.toUsername || 'Usuario'}
                     </div>
                     <div className="text-gray-500 dark:text-gray-400 text-xs">
                        {transaction.toUserType}
                     </div>
                  </div>
               ) : (
                  <span className="text-gray-400 dark:text-gray-500">Sistema</span>
               )}
            </div>
         ),
      },
      {
         key: 'amount',
         header: 'Monto',
         render: (transaction: TransactionResponse) => {
            const direction = getTransactionDirection(transaction, userId || '');
            return (
               <div className="flex items-center space-x-1">
                  {direction === 'income' && (
                     <TrendingUp className="h-4 w-4 text-success-500 dark:text-success-400" />
                  )}
                  {direction === 'expense' && (
                     <TrendingDown className="h-4 w-4 text-danger-500 dark:text-danger-400" />
                  )}
                  <span
                     className={`font-mono font-semibold ${direction === 'income'
                        ? 'text-success-600 dark:text-success-400'
                        : direction === 'expense'
                           ? 'text-danger-600 dark:text-danger-400'
                           : 'text-gray-600 dark:text-gray-400'
                        }`}
                  >
                     {direction === 'income' ? '+' : direction === 'expense' ? '-' : ''}
                     ${transaction.amount.toLocaleString()}
                  </span>
               </div>
            );
         },
      },
      {
         key: 'balances',
         header: 'Balance',
         render: (transaction: TransactionResponse) => {
            const direction = getTransactionDirection(transaction, userId || '');
            const previousBalance = direction === 'income'
               ? transaction.previousBalanceTo
               : transaction.previousBalanceFrom;
            const newBalance = direction === 'income'
               ? transaction.newBalanceTo
               : transaction.newBalanceFrom;

            return (
               <div className="text-sm">
                  {previousBalance != null && newBalance != null && (
                     <>
                        <div className="text-gray-500 dark:text-gray-400">
                           ${previousBalance.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">→</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                           ${newBalance.toLocaleString()}
                        </div>
                     </>
                  )}
               </div>
            );
         },
      },
      {
         key: 'description',
         header: 'Descripción',
         render: (transaction: TransactionResponse) => (
            <span className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</span>
         ),
      },
      {
         key: 'createdBy',
         header: 'Creado por',
         render: (transaction: TransactionResponse) => (
            <div className="text-sm">
               <div className="text-gray-900 dark:text-gray-100">{transaction.createdByUsername}</div>
               <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.createdByRole}</div>
            </div>
         ),
      },
      {
         key: 'createdAt',
         header: 'Fecha',
         render: (transaction: TransactionResponse) => (
            <span className="text-sm text-gray-600 dark:text-gray-400">
               {formatDate(transaction.createdAt)}
            </span>
         ),
      },
   ];

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto"></div>
               <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando información del usuario...</p>
            </div>
         </div>
      );
   }

   if (!user) {
      return (
         <div className="flex items-center justify-center h-96">
            <div className="text-center">
               <User className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Usuario no encontrado</h2>
               <p className="text-gray-600 dark:text-gray-400 mb-4">No se pudo encontrar el usuario solicitado.</p>
               <button
                  onClick={() => navigate('/users')}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
               >
                  Volver a la lista de usuarios
               </button>
            </div>
         </div>
      );
   }

   // Calcular estadísticas de transacciones
   const totalIncome = transactionsData?.data
      .filter((t) => t.toUserId === userId)
      .reduce((sum, t) => sum + t.amount, 0) || 0;

   const totalExpense = transactionsData?.data
      .filter((t) => t.fromUserId === userId)
      .reduce((sum, t) => sum + t.amount, 0) || 0;

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header con botón de volver */}
         <div className="pb-4 border-b border-default mb-6">
            <div className="flex items-center space-x-3">
               <button
                  onClick={() => navigate('/users')}
                  className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
                  title="Volver a usuarios"
               >
                  <ArrowLeft className="h-5 w-5 text-secondary" />
               </button>
               <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">Detalles del Usuario</h1>
                  <p className="text-sm md:text-base text-secondary mt-1">Información completa y transacciones</p>
               </div>
            </div>
         </div>

         {/* Información del Usuario */}
         <div className="bg-secondary rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0 mb-6">
               <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-accent bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                     <User className="h-6 w-6 sm:h-8 sm:w-8 text-brand-primary" />
                  </div>
                  <div>
                     <h2 className="text-lg sm:text-xl font-bold text-primary">{user.username}</h2>
                     <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span
                           className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'ACTIVE'
                              ? 'bg-status-success-bg text-status-success-text'
                              : 'bg-status-error-bg text-status-error-text'
                              }`}
                        >
                           {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                           {user.role || user.userType}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Balance destacado */}
               <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-sm text-secondary">Balance Actual</div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary font-mono">
                     ${user.walletBalance?.toLocaleString() || '0.00'}
                  </div>
               </div>
            </div>

            {/* Grid de información */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
               {user.email && (
                  <div className="flex items-center space-x-3 p-3 bg-tertiary rounded-lg">
                     <Mail className="h-5 w-5 text-tertiary flex-shrink-0" />
                     <div className="min-w-0">
                        <div className="text-xs text-secondary">Email</div>
                        <div className="text-sm font-medium text-primary truncate">{user.email}</div>
                     </div>
                  </div>
               )}

               <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                     <div className="text-xs text-gray-600 dark:text-gray-400">Fecha de Creación</div>
                     <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {formatDate(user.createdAt)}
                     </div>
                  </div>
               </div>

               {user.createdByUsername && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
                     <User className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                     <div className="min-w-0">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Creado por</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                           {user.createdByUsername}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.createdByRole}</div>
                     </div>
                  </div>
               )}

               {user.brandName && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
                     <Activity className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                     <div className="min-w-0">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Brand</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.brandName}</div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Estadísticas de Transacciones */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-secondary rounded-lg shadow p-4 sm:p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-secondary">Total Ingresos</p>
                     <p className="text-xl sm:text-2xl font-bold text-status-success-text font-mono">
                        +${totalIncome.toLocaleString()}
                     </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-status-success-bg rounded-full flex items-center justify-center flex-shrink-0">
                     <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-status-success-text" />
                  </div>
               </div>
            </div>

            <div className="bg-secondary rounded-lg shadow p-4 sm:p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-secondary">Total Egresos</p>
                     <p className="text-xl sm:text-2xl font-bold text-status-error-text font-mono">
                        -${totalExpense.toLocaleString()}
                     </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-status-error-bg rounded-full flex items-center justify-center flex-shrink-0">
                     <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-status-error-text" />
                  </div>
               </div>
            </div>

            <div className="bg-secondary rounded-lg shadow p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-secondary">Total Transacciones</p>
                     <p className="text-xl sm:text-2xl font-bold text-primary">
                        {transactionsData?.pagination.total || 0}
                     </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-accent bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                     <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-brand-primary" />
                  </div>
               </div>
            </div>
         </div>

         {/* Tabla de Transacciones */}
         <div className="bg-secondary rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-default">
               <h2 className="text-base sm:text-lg font-semibold text-primary">
                  Historial de Transacciones
               </h2>
               <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Todas las transacciones relacionadas con este usuario
               </p>
            </div>
            <DataTable
               data={transactionsData?.data || []}
               columns={transactionColumns}
               isLoading={isLoadingTransactions}
               pagination={{
                  page: transactionsData?.pagination.page || 1,
                  pageSize: transactionsData?.pagination.limit || 20,
                  totalCount: transactionsData?.pagination.total || 0,
                  totalPages: transactionsData?.pagination.pages || 1,
                  onPageChange: (newPage) => setPage(newPage),
               }}
               keyExtractor={(transaction) => transaction.id}
            />
         </div>
      </div>
   );
}
