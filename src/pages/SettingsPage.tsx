import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function SettingsPage() {
   return (
      <div className="space-y-6">
         <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
               Configuración
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
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