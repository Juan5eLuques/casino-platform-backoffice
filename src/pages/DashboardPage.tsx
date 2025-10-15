
import {
   UsersIcon,
   CurrencyEuroIcon,
   ArrowTrendingUpIcon,
   ClockIcon,
   ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/utils';

// Mock data - in a real app this would come from API
const metrics = {
   totalPlayersActive: 1245,
   totalBalance: 1850000, // in cents
   transactionsToday: 324,
   usersOnline: 8,
   revenueMonth: 285000, // in cents
};

const recentActivity = [
   {
      id: 1,
      type: 'player_register',
      player: 'jugador_nuevo_123',
      amount: null,
      time: '2 min ago',
   },
   {
      id: 2,
      type: 'balance_adjustment',
      player: 'jugador1',
      amount: 5000, // in cents
      time: '5 min ago',
   },
   {
      id: 3,
      type: 'large_win',
      player: 'jugador_lucky',
      amount: 25000, // in cents
      time: '12 min ago',
   },
   {
      id: 4,
      type: 'user_login',
      player: 'cajero2_mycasino',
      amount: null,
      time: '18 min ago',
   },
];

const chartData = [
   { name: 'Lun', players: 65, revenue: 28000 },
   { name: 'Mar', players: 75, revenue: 32000 },
   { name: 'Mié', players: 85, revenue: 29000 },
   { name: 'Jue', players: 92, revenue: 35000 },
   { name: 'Vie', players: 105, revenue: 42000 },
   { name: 'Sáb', players: 120, revenue: 48000 },
   { name: 'Dom', players: 95, revenue: 38000 },
];

export function DashboardPage() {
   return (
      <div className="space-y-6">
         {/* Page Header */}
         <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
               Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
               Resumen general de la plataforma de casino
            </p>
         </div>

         {/* Metrics Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center">
                     <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                           <UsersIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                           Jugadores Activos
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                           {formatNumber(metrics.totalPlayersActive)}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center">
                     <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-success-100 dark:bg-success-900/50 rounded-lg flex items-center justify-center">
                           <CurrencyEuroIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
                        </div>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                           Balance Total
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                           {formatCurrency(metrics.totalBalance)}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center">
                     <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-warning-100 dark:bg-warning-900/50 rounded-lg flex items-center justify-center">
                           <ArrowTrendingUpIcon className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                        </div>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                           Transacciones Hoy
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                           {formatNumber(metrics.transactionsToday)}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-6">
                  <div className="flex items-center">
                     <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center">
                           <ClockIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                        </div>
                     </div>
                     <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                           Usuarios Online
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                           {formatNumber(metrics.usersOnline)}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Charts and Activity */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
               <CardHeader>
                  <div className="flex items-center">
                     <ChartBarIcon className="w-5 h-5 text-gray-400 mr-2" />
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Revenue Semanal
                     </h3>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="h-64 flex items-end justify-between space-x-2">
                     {chartData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                           <div
                              className="w-full bg-primary-600 rounded-t"
                              style={{
                                 height: `${(day.revenue / 50000) * 100}%`,
                                 minHeight: '4px',
                              }}
                           ></div>
                           <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                              {day.name}
                           </div>
                           <div className="text-xs font-medium text-gray-900 dark:text-white">
                              {formatCurrency(day.revenue)}
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
               <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                     Actividad Reciente
                  </h3>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3">
                           <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                 <p className="text-sm text-gray-900 dark:text-white truncate">
                                    {activity.type === 'player_register' && `Nuevo jugador: ${activity.player}`}
                                    {activity.type === 'balance_adjustment' && `Ajuste de saldo: ${activity.player}`}
                                    {activity.type === 'large_win' && `Gran ganancia: ${activity.player}`}
                                    {activity.type === 'user_login' && `Login usuario: ${activity.player}`}
                                 </p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {activity.time}
                                 </p>
                              </div>
                              {activity.amount && (
                                 <p className="text-sm text-success-600 dark:text-success-400">
                                    {formatCurrency(activity.amount)}
                                 </p>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Quick Actions */}
         <Card>
            <CardHeader>
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Acciones Rápidas
               </h3>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                     <div className="text-center">
                        <UsersIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                           Crear Jugador
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           Registrar nuevo jugador
                        </p>
                     </div>
                  </button>

                  <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                     <div className="text-center">
                        <CurrencyEuroIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                           Ajustar Saldo
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           Modificar balance de jugador
                        </p>
                     </div>
                  </button>

                  <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                     <div className="text-center">
                        <ChartBarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                           Ver Reportes
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           Generar reportes detallados
                        </p>
                     </div>
                  </button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}