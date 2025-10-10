import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function SettingsPage() {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
               Configuración
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
               Configuraciones generales del sistema y preferencias
            </p>
         </div>

         <Card>
            <CardHeader>
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configuraciones del Sistema
               </h2>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                     Página en desarrollo. Aquí se mostrarán las configuraciones generales del sistema.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}