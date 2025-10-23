import { RefreshCw, Gamepad2, TrendingUp, Target, DollarSign, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import type { CasinoSummary } from '../../types/dashboard';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface CasinoCardProps {
   data: CasinoSummary;
   onRefresh?: () => void;
}

export function CasinoCard({ data, onRefresh }: CasinoCardProps) {
   const { jugado, pagado, netwin, comision, totalAPagar, kpIs } = data;

   const chartData = [
      { name: 'Jugado', value: jugado, color: '#3b82f6' },
      { name: 'Pagado', value: pagado, color: '#ef4444' },
      { name: 'NetWin', value: netwin, color: '#10b981' },
   ];

   const holdPercentage = (netwin / jugado) * 100;

   return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
               </div>
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Casino</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">
                     {formatCurrency(netwin)}
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

         {/* Hold Percentage Badge */}
         <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 self-start bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-sm">
               Hold: {formatPercent(holdPercentage)}
            </span>
         </div>

         {/* Bar Chart */}
         <div className="h-40 sm:h-48 mb-4 sm:mb-6 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                  <XAxis
                     dataKey="name"
                     tick={{ fontSize: 12, fill: '#6b7280' }}
                     axisLine={false}
                  />
                  <YAxis
                     tick={{ fontSize: 12, fill: '#6b7280' }}
                     axisLine={false}
                     tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                     formatter={(value: number) => formatCurrency(value)}
                     contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                     }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>

         {/* Metrics Grid */}
         <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg">
               <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Jugado</span>
               </div>
               <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(jugado)}
               </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-lg">
               <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                  <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Pagado</span>
               </div>
               <p className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(pagado)}
               </p>
            </div>
         </div>

         {/* KPIs */}
         <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 mt-auto">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
               <div className="flex items-center gap-1.5 sm:gap-2">
                  <Percent className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Comisión</span>
               </div>
               <div className="text-right">
                  <div className="font-semibold text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                     {formatCurrency(comision)}
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
               <div className="flex items-center gap-1.5 sm:gap-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total a Pagar</span>
               </div>
               <div className="text-right">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                     {formatCurrency(totalAPagar)}
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
               <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Rondas</span>
               <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                  {kpIs.rondasTotales.toLocaleString()}
               </span>
            </div>

            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
               <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Apuesta Promedio</span>
               <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                  {formatCurrency(kpIs.apuestaPromedio)}
               </span>
            </div>
         </div>
      </div>
   );
}
