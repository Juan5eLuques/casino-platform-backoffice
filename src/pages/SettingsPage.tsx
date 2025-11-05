import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function SettingsPage() {
   return (
      <div className="space-y-6">
         <div className="pb-4 border-b border-default">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
               Configuración
            </h1>
            <p className="text-sm md:text-base text-secondary mt-1">
               Configuraciones generales del sistema y preferencias
            </p>
         </div>

         <Card>
            <CardHeader>
               <h2 className="text-xl font-semibold text-primary">
                  Configuraciones del Sistema
               </h2>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12">
                  <p className="text-secondary">
                     Página en desarrollo. Aquí se mostrarán las configuraciones generales del sistema.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}