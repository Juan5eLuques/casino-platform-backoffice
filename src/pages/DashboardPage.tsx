import { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import type { DashboardScope } from '../types/dashboard';
import { AlertCircle } from 'lucide-react';
import { UsuariosCard } from '../components/dashboard/UsuariosCard';
import { AlertasCard } from '../components/dashboard/AlertasCard';
import { CasinoCard } from '../components/dashboard/CasinoCard';
import { FichasCard } from '../components/dashboard/FichasCard';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';

export function DashboardPage() {
   const [scope, setScope] = useState<DashboardScope>('TREE');
   const [from, setFrom] = useState<Date | undefined>();
   const [to, setTo] = useState<Date | undefined>();
   const [autoRefresh, setAutoRefresh] = useState(false);

   const { data, isLoading, error, dataUpdatedAt, refetch } = useDashboard({
      scope,
      from,
      to,
      autoRefresh,
   });

   const handleRefresh = () => {
      refetch();
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-primary p-6">
            <div className="text-center">
               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
               <p className="mt-4 text-text-secondary">Cargando dashboard...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-primary p-6">
            <div className="bg-status-error-bg border border-status-error-border text-status-error-text px-6 py-4 rounded-lg max-w-md">
               <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="w-6 h-6" />
                  <p className="font-bold text-lg">Error al cargar el dashboard</p>
               </div>
               <p className="text-sm">{error instanceof Error ? error.message : 'Error desconocido'}</p>
               <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-btn-danger-bg text-btn-danger-text rounded-md hover:bg-btn-danger-bg-hover transition-colors text-sm font-medium"
               >
                  Reintentar
               </button>
            </div>
         </div>
      );
   }

   if (!data) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="text-center text-text-secondary">
               <p>No hay datos disponibles</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-primary md:p-6">
         <DashboardHeader
            scope={scope}
            onScopeChange={setScope}
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
            autoRefresh={autoRefresh}
            onAutoRefreshChange={setAutoRefresh}
            lastUpdate={dataUpdatedAt}
            onRefresh={handleRefresh}
         />

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FichasCard data={data.finanzas} onRefresh={handleRefresh} />
            <CasinoCard data={data.casino} onRefresh={handleRefresh} />
            <UsuariosCard data={data.usuarios} onRefresh={handleRefresh} />
            <AlertasCard data={data.alertas} onRefresh={handleRefresh} />
         </div>
      </div>
   );
}

export default DashboardPage;
