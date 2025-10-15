import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function PlayersPage() {
   return (
      <div className="space-y-6">
         <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
               Gestión de Jugadores
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
               Administra todos los jugadores registrados en la plataforma
            </p>
         </div>

         <Card>
            <CardHeader>
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Lista de Jugadores
               </h2>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                     Página en desarrollo. Aquí se mostrará la lista completa de jugadores con filtros, búsqueda y gestión de saldos.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}