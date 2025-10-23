import { RefreshCw, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { FinancesSummary } from '../../types/dashboard';
import { formatCurrency } from '../../utils/formatters';

interface FichasCardProps {
   data: FinancesSummary;
   onRefresh?: () => void;
}

const COLORS = {
   house: '#10b981',
   cajeros: '#3b82f6',
   jugadores: '#8b5cf6',
};

export function FichasCard({ data, onRefresh }: FichasCardProps) {
   const { fichas, cargas, depositosA, retiros } = data;

   const pieData = [
      { name: 'House', value: fichas.breakdown.houseBalance, color: COLORS.house },
      { name: 'Cajeros', value: fichas.breakdown.cashiersBalance, color: COLORS.cajeros },
      { name: 'Jugadores', value: fichas.breakdown.playersBalance, color: COLORS.jugadores },
   ];

   const netChange = fichas.deltaDelDia;
   const isPositive = netChange >= 0;

   return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
               </div>
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Balance de Fichas</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">
                     {formatCurrency(fichas.balanceActual)}
                  </p>
               </div>
            </div>
            {onRefresh && (
               <button
                  onClick={onRefresh}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Actualizar"
               >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
               </button>
            )}
         </div>

         {/* Delta Badge */}
         <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 self-start ${isPositive
               ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
               : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
            {isPositive ? (
               <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
               <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="font-semibold text-xs sm:text-sm">
               {isPositive ? '+' : ''}{formatCurrency(netChange)} hoy
            </span>
         </div>

         {/* Pie Chart */}
         <div className="h-40 sm:h-48 mb-4 sm:mb-6 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={50}
                     outerRadius={70}
                     paddingAngle={2}
                     dataKey="value"
                  >
                     {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                  </Pie>
                  <Tooltip
                     formatter={(value: number) => formatCurrency(value)}
                     contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                     }}
                  />
               </PieChart>
            </ResponsiveContainer>
         </div>

         {/* Legend */}
         <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-6">
            {pieData.map((item) => (
               <div key={item.name} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                     <div
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                     />
                     <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{item.name}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                     {formatCurrency(item.value)}
                  </p>
               </div>
            ))}
         </div>

         {/* Transactions */}
         <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 mt-auto">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
               <div className="flex items-center gap-1.5 sm:gap-2">
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Cargas</span>
               </div>
               <div className="text-right">
                  <div className="font-semibold text-green-600 dark:text-green-400 text-xs sm:text-sm">
                     {formatCurrency(cargas.total)}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{cargas.count} trans.</div>
               </div>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
               <div className="flex items-center gap-1.5 sm:gap-2">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Depósitos</span>
               </div>
               <div className="text-right">
                  <div className="font-semibold text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                     {formatCurrency(depositosA.total)}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{depositosA.count} trans.</div>
               </div>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
               <div className="flex items-center gap-1.5 sm:gap-2">
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Retiros</span>
               </div>
               <div className="text-right">
                  <div className="font-semibold text-red-600 dark:text-red-400 text-xs sm:text-sm">
                     {formatCurrency(retiros.total)}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{retiros.count} trans.</div>
               </div>
            </div>
         </div>
      </div>
   );
}
