import { useEffect } from 'react';
import { WalletIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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
      <div className={cn(
         'rounded-lg shadow-lg p-4 sm:p-6',
         'transition-all duration-200 hover:shadow-xl',
         'border border-primary-400 dark:border-primary-700'
      )}>
         {/* Header */}
         <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
               <div className="p-2 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                  <WalletIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
               </div>
               <div>
                  <p className="text-xs sm:text-sm font-medium text-white/90">
                     Balance Actual
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/70">
                     {balanceData?.username || user.username}
                  </p>
               </div>
            </div>

            <button
               onClick={() => refetch()}
               disabled={isLoading}
               className={cn(
                  'p-2 rounded-lg transition-all duration-200',
                  'bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'backdrop-blur-sm'
               )}
               title="Actualizar balance"
            >
               <ArrowPathIcon
                  className={cn(
                     'w-4 h-4 sm:w-5 sm:h-5 text-white',
                     isLoading && 'animate-spin'
                  )}
               />
            </button>
         </div>

         {/* Balance Amount */}
         <div className="mt-4">
            {isLoading && !balanceData ? (
               <div className="animate-pulse">
                  <div className="h-8 sm:h-10 bg-white/20 dark:bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 sm:h-4 bg-white/20 dark:bg-white/10 rounded w-1/2" />
               </div>
            ) : isError ? (
               <div className="text-center py-2">
                  <p className="text-white/90 text-sm sm:text-base font-semibold mb-1">
                     Error al cargar
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm">
                     No se pudo obtener el balance
                  </p>
               </div>
            ) : (
               <>
                  <div className="flex items-baseline space-x-2">
                     <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {formatCurrency(balanceData?.balance || 0)}
                     </span>
                  </div>
                  <p className="text-white/70 text-xs sm:text-sm mt-2">
                     Saldo disponible para operaciones
                  </p>
               </>
            )}
         </div>

         {/* User Info (Mobile Optimized) */}
         <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
               <div className="bg-white/10 dark:bg-white/5 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <p className="text-[10px] sm:text-xs text-white/70 mb-1">
                     Usuario
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                     {user.username}
                  </p>
               </div>
               <div className="bg-white/10 dark:bg-white/5 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
                  <p className="text-[10px] sm:text-xs text-white/70 mb-1">
                     Rol
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                     {user.role.replace('_', ' ')}
                  </p>
               </div>
            </div>
         </div>

         {/* Last Update Indicator */}
         {balanceData && !isLoading && (
            <div className="mt-3 flex items-center justify-center">
               <div className="flex items-center space-x-1 text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs">
                     Actualizado
                  </span>
               </div>
            </div>
         )}
      </div>
   );
}
