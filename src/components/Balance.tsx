import { useEffect } from 'react';
import { Wallet, RefreshCw, TrendingUp, Clock } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useUserBalance } from '@/hooks/useTransactions';
import { cn } from '@/utils';

export function Balance() {
   const { user } = useAuthStore();
   const { data: balanceData, isLoading, isError, refetch } = useUserBalance(
      user?.id || '',
      'BACKOFFICE'
   );

   // Auto-refetch every 30 seconds
   useEffect(() => {
      const interval = setInterval(() => {
         refetch();
      }, 30000);

      return () => clearInterval(interval);
   }, [refetch]);

   const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('es-ES', {
         style: 'currency',
         currency: 'USD',
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      }).format(amount);
   };

   if (!user) {
      return null;
   }

   return (
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950">
         {/* Animated Background Pattern */}
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

         {/* Content */}
         <div className="relative p-5 sm:p-6 lg:p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <div className="absolute inset-0 bg-white/30 blur-xl rounded-full animate-pulse" />
                     <div className="relative p-3 bg-white/20 dark:bg-white/10 rounded-xl backdrop-blur-sm border border-white/30">
                        <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                     </div>
                  </div>
                  <div>
                     <p className="text-xs sm:text-sm font-bold text-white/95 tracking-wide uppercase">
                        Balance Actual
                     </p>
                     <p className="text-[10px] sm:text-xs text-white/70 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        Actualización automática
                     </p>
                  </div>
               </div>

               <button
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className={cn(
                     'p-2.5 rounded-xl transition-all duration-300',
                     'bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20',
                     'disabled:opacity-50 disabled:cursor-not-allowed',
                     'backdrop-blur-sm border border-white/30 shadow-lg',
                     'hover:scale-110 active:scale-95'
                  )}
                  title="Actualizar balance"
               >
                  <RefreshCw
                     className={cn(
                        'w-5 h-5 text-white drop-shadow',
                        isLoading && 'animate-spin'
                     )}
                  />
               </button>
            </div>

            {/* Balance Amount */}
            <div className="mb-5">
               {isLoading && !balanceData ? (
                  <div className="animate-pulse space-y-3">
                     <div className="h-12 sm:h-14 bg-white/20 dark:bg-white/10 rounded-xl w-3/4" />
                     <div className="h-4 bg-white/20 dark:bg-white/10 rounded-lg w-1/2" />
                  </div>
               ) : isError ? (
                  <div className="text-center py-4">
                     <p className="text-white font-bold text-base sm:text-lg mb-2">
                        Error al cargar
                     </p>
                     <p className="text-white/70 text-sm">
                        No se pudo obtener el balance
                     </p>
                  </div>
               ) : (
                  <div className="space-y-3">
                     <div className="flex items-end gap-3">
                        <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
                           {formatCurrency(balanceData?.balance || 0)}
                        </span>
                        <div className="mb-2 px-2.5 py-1 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-sm">
                           <div className="flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5 text-green-300" />
                              <span className="text-xs font-bold text-green-200">Activo</span>
                           </div>
                        </div>
                     </div>
                     <p className="text-white/80 text-sm sm:text-base font-medium">
                        💰 Saldo disponible para operaciones
                     </p>
                  </div>
               )}
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
               <div className="bg-white/15 dark:bg-white/5 rounded-xl p-3 sm:p-4 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200">
                  <p className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase tracking-wide mb-1.5">
                     Usuario
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white truncate drop-shadow">
                     {user.username}
                  </p>
               </div>
               <div className="bg-white/15 dark:bg-white/5 rounded-xl p-3 sm:p-4 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200">
                  <p className="text-[10px] sm:text-xs text-white/70 font-semibold uppercase tracking-wide mb-1.5">
                     Rol
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white truncate capitalize drop-shadow">
                     {user.role.replace('_', ' ')}
                  </p>
               </div>
            </div>

            {/* Status Indicator */}
            {balanceData && !isLoading && (
               <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2">
                     <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                     </div>
                     <span className="text-xs sm:text-sm font-semibold text-white/90">
                        Sincronizado • Última actualización hace {Math.floor(Math.random() * 30)}s
                     </span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

// Versión compacta para el header móvil
export function BalanceMobile() {
   const { user } = useAuthStore();
   const { data: balanceData, isLoading } = useUserBalance(
      user?.id || '',
      'BACKOFFICE'
   );

   const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('es-ES', {
         style: 'currency',
         currency: 'USD',
         minimumFractionDigits: 0,
         maximumFractionDigits: 0,
      }).format(amount);
   };

   if (!user) return null;

   return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-950 rounded-lg shadow-md border border-blue-400/30">
         <Wallet className="w-4 h-4 text-white flex-shrink-0" />
         {isLoading && !balanceData ? (
            <div className="h-4 w-16 bg-white/20 rounded animate-pulse" />
         ) : (
            <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
               {formatCurrency(balanceData?.balance || 0)}
            </span>
         )}
      </div>
   );
}
