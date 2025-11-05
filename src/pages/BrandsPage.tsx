import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export function BrandsPage() {
   return (
      <div className="space-y-6">
         <div className="pb-4 border-b border-default">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
               Gestión de Brands
            </h1>
            <p className="text-sm md:text-base text-secondary mt-1">
               Administra las marcas de casino y sus configuraciones
            </p>
         </div>

         <Card>
            <CardHeader>
               <h2 className="text-xl font-semibold text-primary">
                  Lista de Brands
               </h2>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12">
                  <p className="text-secondary">
                     Página en desarrollo. Aquí se mostrará la gestión completa de brands con configuración de temas y juegos.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}