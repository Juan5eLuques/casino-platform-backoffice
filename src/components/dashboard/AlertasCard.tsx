import { RefreshCw, AlertTriangle, AlertCircle, Bell, CheckCircle, XCircle, Activity } from 'lucide-react';
import type { AlertsSummary } from '../../types/dashboard';

interface AlertasCardProps {
   data: AlertsSummary;
   onRefresh?: () => void;
}

const getSeverityConfig = (severity: string) => {
   switch (severity) {
      case 'CRITICAL':
         return { color: 'red', icon: XCircle, bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' };
      case 'HIGH':
         return { color: 'orange', icon: AlertTriangle, bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' };
      case 'MEDIUM':
         return { color: 'yellow', icon: AlertCircle, bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' };
      case 'LOW':
         return { color: 'blue', icon: Bell, bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' };
      default:
         return { color: 'gray', icon: Bell, bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400' };
   }
};

export function AlertasCard({ data, onRefresh }: AlertasCardProps) {
   const { alertas, estadoOperativo } = data;

   const criticalAlerts = alertas.filter(a => a.severidad === 'CRITICAL').reduce((sum, a) => sum + a.count, 0);
   const highAlerts = alertas.filter(a => a.severidad === 'HIGH').reduce((sum, a) => sum + a.count, 0);
   const totalAlerts = alertas.reduce((sum, a) => sum + a.count, 0);

   const sortedAlerts = [...alertas].sort((a, b) => {
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return severityOrder[a.severidad] - severityOrder[b.severidad];
   });

   return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
         {/* Header */}
         <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="bg-gradient-to-br from-red-500 to-pink-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
               </div>
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Alertas</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5 sm:mt-1">
                     {totalAlerts}
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

         {/* Critical & High Alerts */}
         <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-lg">
               <div className="flex items-center gap-1.5 mb-2">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                  <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Críticas</span>
               </div>
               <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                  {criticalAlerts}
               </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 sm:p-4 rounded-lg">
               <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Altas</span>
               </div>
               <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {highAlerts}
               </p>
            </div>
         </div>

         {/* Alerts List */}
         <div className="flex-1 overflow-y-auto mb-4 space-y-2 max-h-48">
            {sortedAlerts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <CheckCircle className="w-12 h-12 mb-2" />
                  <p className="text-sm">No hay alertas activas</p>
               </div>
            ) : (
               sortedAlerts.slice(0, 5).map((alert, index) => {
                  const config = getSeverityConfig(alert.severidad);
                  const Icon = config.icon;

                  return (
                     <div
                        key={index}
                        className={`${config.bg} p-2 sm:p-3 rounded-lg flex items-start gap-2 sm:gap-3`}
                     >
                        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.text} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1 min-w-0">
                           <p className={`text-xs sm:text-sm font-semibold ${config.text} mb-0.5`}>
                              {alert.tipo.replace(/_/g, ' ')}
                           </p>
                           <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                              {alert.mensaje}
                           </p>
                        </div>
                        <span className={`text-xs sm:text-sm font-bold ${config.text} flex-shrink-0`}>
                           {alert.count}
                        </span>
                     </div>
                  );
               })
            )}
         </div>

         {/* Operational Status */}
         <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="flex items-center gap-2 mb-3">
               <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
               <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                  Estado Operativo
               </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div className="bg-green-50 dark:bg-green-900/20 p-2 sm:p-3 rounded-lg">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">Cajeros Activos</p>
                  <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                     {estadoOperativo.cajerosActivos}
                  </p>
               </div>

               <div className="bg-blue-50 dark:bg-blue-900/20 p-2 sm:p-3 rounded-lg">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">Jugadores Online</p>
                  <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                     {estadoOperativo.jugadoresOnline}
                  </p>
               </div>

               <div className="bg-purple-50 dark:bg-purple-900/20 p-2 sm:p-3 rounded-lg col-span-2">
                  <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1">Transacciones Pendientes</p>
                  <p className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                     {estadoOperativo.transaccionesPendientes}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
