import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/store';
import { cn } from '@/utils';

export function DashboardLayout() {
   const { sidebarCollapsed } = useUIStore();

   return (
      <div className="h-screen flex bg-primary">
         {/* Sidebar */}
         <Sidebar />

         {/* Main Content */}
         <div
            className={cn(
               "flex-1 flex flex-col overflow-hidden transition-all duration-300",
               // Ajustar margen según el estado del sidebar en desktop
               sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
            )}
         >
            {/* Header */}
            <Header />

            {/* Main Content Area - Padding reducido en mobile */}
            <main className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
}