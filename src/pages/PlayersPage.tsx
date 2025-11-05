import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function PlayersPage() {
   return (
      <div className="space-y-6">
         <div className="pb-4 border-b border-default">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
               Gestión de Jugadores
            </h1>
            <p className="text-sm md:text-base text-secondary mt-1">
               Administra todos los jugadores registrados en la plataforma
            </p>
         </div>

         <Card>
            <CardHeader>
               <h2 className="text-xl font-semibold text-primary">
                  Lista de Jugadores
               </h2>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12">
                  <p className="text-secondary">
                     Página en desarrollo. Aquí se mostrará la lista completa de jugadores con filtros, búsqueda y gestión de saldos.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}