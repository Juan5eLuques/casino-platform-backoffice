import { WalletIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store';
import { useBalance } from '@/hooks';
import { cn } from '@/utils';

interface BalanceCompactProps {
   className?: string;
}

export function BalanceCompact({ className }: BalanceCompactProps) {
   const { user } = useAuthStore();
   const { data: balanceData, isLoading } = useBalance();

   const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('es-ES', {
         style: 'currency',
         currency: 'USD',
         minimumFractionDigits: 0,
         maximumFractionDigits: 0,
      }).format(amount);
   };

   if (!user) {
      return null;
   }

   return (
      <div className={cn(
         'flex items-center space-x-2 px-3 py-2 rounded-lg',
         'bg-primary-50 dark:bg-primary-900/20',
         'border border-primary-200 dark:border-primary-800',
         'transition-colors duration-200',
         className
      )}>
         <div className="p-1.5 bg-primary-100 dark:bg-primary-800/50 rounded-md">
            <WalletIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
         </div>

         {isLoading ? (
            <div className="animate-pulse">
               <div className="h-4 w-16 bg-primary-200 dark:bg-primary-800 rounded" />
            </div>
         ) : (
            <div className="flex flex-col min-w-0">
               <span className="text-xs text-primary-600 dark:text-primary-400 font-medium truncate">
                  {formatCurrency(balanceData?.balance || 0)}
               </span>
            </div>
         )}
      </div>
   );
}
