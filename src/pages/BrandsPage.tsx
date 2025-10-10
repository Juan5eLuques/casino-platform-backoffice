import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function BrandsPage() {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
               Gestión de Brands
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
               Administra las marcas de casino y sus configuraciones
            </p>
         </div>

         <Card>
            <CardHeader>
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Lista de Brands
               </h2>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                     Página en desarrollo. Aquí se mostrará la gestión completa de brands con configuración de temas y juegos.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}