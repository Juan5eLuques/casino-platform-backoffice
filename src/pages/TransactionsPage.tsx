import { useState } from 'react';
import { Search, Filter, DollarSign, ArrowUpRight, ArrowDownLeft, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterButtonGroup } from '@/components/FilterButtonGroup';
import { DatePicker } from '@/components/ui';

import { DataTable, Column } from '@/components/DataTable';
import {
   useTransactions,
} from '@/hooks';
import type { TransactionType } from '@/types';


const getTransactionIcon = (type: string) => {
   switch (type) {
      case 'DEPOSIT':
         return <ArrowDownLeft className="h-4 w-4 text-status-success-text" />;
      case 'WITHDRAWAL':
         return <ArrowUpRight className="h-4 w-4 text-status-error-text" />;
      case 'TRANSFER':
         return <DollarSign className="h-4 w-4 text-brand-secondary" />;
      case 'ADJUSTMENT':
         return <FileText className="h-4 w-4 text-status-warning-text" />;
      default:
         return <DollarSign className="h-4 w-4 text-tertiary" />;
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

   const { data: transactionsData, isLoading } = useTransactions({
      fromDate: dateFromFilter || undefined,
      toDate: dateToFilter || undefined,
      externalRef: search || undefined,
      transactionType: transactionTypeFilter || undefined,
   });

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
               <label className="block text-xs sm:text-sm font-medium text-secondary">
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
         <div className="bg-secondary rounded-lg shadow-sm border border-default overflow-hidden">
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

      </div>
   );
}
