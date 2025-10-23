import { Calendar, Clock, Users, Building2, Globe, RefreshCw } from 'lucide-react';
import type { DashboardScope } from '../../types/dashboard';
import { formatTimeAgo } from '../../utils/formatters';

interface DashboardHeaderProps {
   scope: DashboardScope;
   onScopeChange: (scope: DashboardScope) => void;
   from?: Date;
   to?: Date;
   onFromChange: (date: Date | undefined) => void;
   onToChange: (date: Date | undefined) => void;
   autoRefresh: boolean;
   onAutoRefreshChange: (enabled: boolean) => void;
   lastUpdate?: number;
   onRefresh: () => void;
}

export function DashboardHeader({
   scope,
   onScopeChange,
   from,
   to,
   onFromChange,
   onToChange,
   autoRefresh,
   onAutoRefreshChange,
   lastUpdate,
   onRefresh,
}: DashboardHeaderProps) {
   const scopeButtons: { value: DashboardScope; label: string; icon: typeof Users }[] = [
      { value: 'DIRECT', label: 'Directos', icon: Users },
      { value: 'TREE', label: 'Árbol', icon: Building2 },
      { value: 'GLOBAL', label: 'Global', icon: Globe },
   ];

   const handleQuickPeriod = (period: 'today' | 'week' | 'month') => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (period) {
         case 'today':
            onFromChange(today);
            onToChange(now);
            break;
         case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            onFromChange(weekAgo);
            onToChange(now);
            break;
         case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            onFromChange(monthAgo);
            onToChange(now);
            break;
      }
   };

   return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700">
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title & Last Update */}
            <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  Dashboard
               </h1>
               {lastUpdate && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                     <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                     Actualizado {formatTimeAgo(new Date(lastUpdate))}
                  </p>
               )}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
               {/* Scope Selector */}
               <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
                  {scopeButtons.map(({ value, label, icon: Icon }) => (
                     <button
                        key={value}
                        onClick={() => onScopeChange(value)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${scope === value
                           ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                           : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                           }`}
                     >
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{label}</span>
                     </button>
                  ))}
               </div>

               {/* Quick Period Buttons */}
               <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
                  <button
                     onClick={() => handleQuickPeriod('today')}
                     className="px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                     Hoy
                  </button>
                  <button
                     onClick={() => handleQuickPeriod('week')}
                     className="px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                     7d
                  </button>
                  <button
                     onClick={() => handleQuickPeriod('month')}
                     className="px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all"
                  >
                     30d
                  </button>
               </div>

               {/* Actions */}
               <div className="flex gap-2">
                  <button
                     onClick={onRefresh}
                     className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
                  >
                     <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                     <span className="hidden sm:inline">Actualizar</span>
                  </button>

                  <button
                     onClick={() => onAutoRefreshChange(!autoRefresh)}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${autoRefresh
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                  >
                     <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                     <span className="hidden sm:inline">{autoRefresh ? 'Auto ON' : 'Auto OFF'}</span>
                  </button>
               </div>
            </div>
         </div>

         {/* Date Range (Optional - can be expanded) */}
         {(from || to) && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
               <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                     {from?.toLocaleDateString()} - {to?.toLocaleDateString() || 'Ahora'}
                  </span>
               </div>
            </div>
         )}
      </div>
   );
}
