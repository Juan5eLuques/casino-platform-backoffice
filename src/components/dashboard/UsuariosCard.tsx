import { RefreshCw, Users, UserCheck, UserX, Shield, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import type { UsersCountsResponse } from '../../types/dashboard';

interface UsuariosCardProps {
   data: UsersCountsResponse;
   onRefresh?: () => void;
}

const LEVEL_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function UsuariosCard({ data, onRefresh }: UsuariosCardProps) {
   const { totalJugadores, breakdown } = data;

   const totalPlayers = totalJugadores;
   const activePercent = (breakdown.jugadoresActivos / totalPlayers) * 100;

   const agentData = Object.entries(breakdown.agentesPorNivel).map(([nivel, total], index) => ({
      name: nivel.replace('nivel', 'Nivel '),
      value: total,
      color: LEVEL_COLORS[index % LEVEL_COLORS.length],
   }));

   return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
               </div>
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">
                     {totalPlayers.toLocaleString()}
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

         {/* Active Players Badge */}
         <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 self-start bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-sm">
               {activePercent.toFixed(1)}% activos
            </span>
         </div>

         {/* Players Stats */}
         <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 sm:p-4 rounded-lg">
               <div className="flex items-center gap-1.5 mb-2">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Activos</span>
               </div>
               <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {breakdown.jugadoresActivos.toLocaleString()}
               </p>
               <div className="mt-2 w-full bg-green-200 dark:bg-green-900/40 rounded-full h-1.5">
                  <div
                     className="bg-green-600 dark:bg-green-400 rounded-full h-1.5 transition-all duration-500"
                     style={{ width: `${activePercent}%` }}
                  />
               </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
               <div className="flex items-center gap-1.5 mb-2">
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Inactivos</span>
               </div>
               <p className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {breakdown.jugadoresInactivos.toLocaleString()}
               </p>
               <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600/40 rounded-full h-1.5">
                  <div
                     className="bg-gray-600 dark:bg-gray-400 rounded-full h-1.5 transition-all duration-500"
                     style={{ width: `${100 - activePercent}%` }}
                  />
               </div>
            </div>
         </div>

         {/* Agents Section */}
         <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
               <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
               <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  Agentes por Nivel
               </h4>
            </div>

            {/* Agents Chart */}
            <div className="h-32 sm:h-40">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentData} layout="vertical">
                     <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} />
                     <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        axisLine={false}
                        width={50}
                     />
                     <Tooltip
                        formatter={(value: number) => value.toLocaleString()}
                        contentStyle={{
                           backgroundColor: 'rgba(0, 0, 0, 0.8)',
                           border: 'none',
                           borderRadius: '8px',
                           color: 'white',
                           fontSize: '12px',
                        }}
                     />
                     <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {agentData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Agents Summary */}
         <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="grid grid-cols-2 gap-2">
               <div className="bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3 rounded-lg text-center">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">Total Agentes</p>
                  <p className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                     {data.totalAgentes.toLocaleString()}
                  </p>
               </div>
               <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 sm:p-3 rounded-lg text-center">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">Niveles</p>
                  <p className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
                     {agentData.length}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
