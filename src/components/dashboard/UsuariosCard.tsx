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
      <div className="bg-secondary rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-default h-full flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="bg-gradient-to-br from-brand-primary to-brand-primary-hover p-2 sm:p-3 rounded-xl shadow-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
               </div>
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-text-secondary">Usuarios</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mt-0.5 sm:mt-1">
                     {totalPlayers.toLocaleString()}
                  </p>
               </div>
            </div>
            {onRefresh && (
               <button
                  onClick={onRefresh}
                  className="p-1.5 sm:p-2 hover:bg-surface-hover rounded-lg transition-colors"
                  aria-label="Actualizar"
               >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-text-tertiary hover:text-text-secondary" />
               </button>
            )}
         </div>

         {/* Active Players Badge */}
         <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 self-start bg-status-success-bg text-status-success-text">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-sm">
               {activePercent.toFixed(1)}% activos
            </span>
         </div>

         {/* Players Stats */}
         <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-status-success-bg p-3 sm:p-4 rounded-lg">
               <div className="flex items-center gap-1.5 mb-2">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-status-success-text" />
                  <span className="text-[10px] sm:text-xs text-text-secondary">Activos</span>
               </div>
               <p className="text-xl sm:text-2xl font-bold text-status-success-text">
                  {breakdown.jugadoresActivos.toLocaleString()}
               </p>
               <div className="mt-2 w-full bg-status-success-border rounded-full h-1.5">
                  <div
                     className="bg-status-success-text rounded-full h-1.5 transition-all duration-500"
                     style={{ width: `${activePercent}%` }}
                  />
               </div>
            </div>

            <div className="bg-tertiary p-3 sm:p-4 rounded-lg">
               <div className="flex items-center gap-1.5 mb-2">
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
                  <span className="text-[10px] sm:text-xs text-text-secondary">Inactivos</span>
               </div>
               <p className="text-xl sm:text-2xl font-bold text-text-secondary">
                  {breakdown.jugadoresInactivos.toLocaleString()}
               </p>
               <div className="mt-2 w-full bg-border-subtle rounded-full h-1.5">
                  <div
                     className="bg-text-secondary rounded-full h-1.5 transition-all duration-500"
                     style={{ width: `${100 - activePercent}%` }}
                  />
               </div>
            </div>
         </div>

         {/* Agents Section */}
         <div className="pt-3 sm:pt-4 border-t border-default mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
               <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
               <h4 className="text-xs sm:text-sm font-semibold text-text-primary">
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
         <div className="pt-3 sm:pt-4 border-t border-border-primary mt-auto">
            <div className="grid grid-cols-2 gap-2">
               <div className="bg-brand-bg-muted p-2 sm:p-3 rounded-lg text-center">
                  <p className="text-[10px] sm:text-xs text-secondary mb-1">Total Agentes</p>
                  <p className="text-base sm:text-lg font-bold text-brand-primary">
                     {data.totalAgentes.toLocaleString()}
                  </p>
               </div>
               <div className="bg-brand-bg-muted p-2 sm:p-3 rounded-lg text-center">
                  <p className="text-[10px] sm:text-xs text-secondary mb-1">Niveles</p>
                  <p className="text-base sm:text-lg font-bold text-brand-primary">
                     {agentData.length}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
