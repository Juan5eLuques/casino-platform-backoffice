import { NavLink, useLocation } from 'react-router-dom';
import {
   HomeIcon,
   UsersIcon,
   UserGroupIcon,
   PuzzlePieceIcon,
   ClipboardDocumentListIcon,
   CogIcon,
   XMarkIcon,
   CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useUIStore, useAuthStore } from '@/store';
import { cn } from '@/utils';

const navigation = [
   { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
   // { name: 'Operadores', href: '/operators', icon: BuildingLibraryIcon },
   // { name: 'Brands', href: '/brands', icon: BuildingOfficeIcon },
   { name: 'Usuarios', href: '/users', icon: UserGroupIcon },
   { name: 'Jugadores', href: '/players', icon: UsersIcon },
   { name: 'Transacciones', href: '/transactions', icon: CurrencyDollarIcon },
   { name: 'Juegos', href: '/games', icon: PuzzlePieceIcon },
   { name: 'Auditoría', href: '/audit', icon: ClipboardDocumentListIcon },
   { name: 'Configuración', href: '/settings', icon: CogIcon },
];



export function Sidebar() {
   const location = useLocation();
   const { sidebarCollapsed, toggleSidebar } = useUIStore();
   const { user } = useAuthStore();

   // Filtrar navegación según roles
   const getFilteredNavigation = () => {
      const allNavigation = [...navigation];

      // Agregar navegación de cashier si el usuario tiene el rol apropiado
      if (user && ['CASHIER', 'OPERATOR_ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
         allNavigation.splice(1, 0);
      }

      return allNavigation;
   };

   const filteredNavigation = getFilteredNavigation();

   return (
      <>
         {/* Overlay para mobile */}
         {!sidebarCollapsed && (
            <div
               className="fixed inset-0 bg-black/50 z-40 lg:hidden"
               onClick={toggleSidebar}
            />
         )}

         {/* Sidebar */}
         <div
            className={cn(
               'fixed inset-y-0 left-0 bg-white dark:bg-dark-bg-secondary border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50',
               // En mobile: ocultar completamente con transform
               // En desktop: mantener visible pero con ancho dinámico
               sidebarCollapsed
                  ? '-translate-x-full lg:translate-x-0 lg:w-16'
                  : 'translate-x-0 w-64'
            )}
         >
            {/* Logo y botón cerrar */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
               <div className={cn(
                  "flex items-center space-x-2 transition-opacity duration-300",
                  sidebarCollapsed ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"
               )}>
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                     <span className="text-white font-bold text-sm">🎰</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                     Casino BO
                  </span>
               </div>
               {/* Botón para mobile y desktop */}
               <button
                  onClick={toggleSidebar}
                  className={cn(
                     "p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                     sidebarCollapsed && "lg:mx-auto"
                  )}
                  title={sidebarCollapsed ? "Abrir menú" : "Cerrar menú"}
               >
                  <XMarkIcon className="w-5 h-5" />
               </button>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-3 overflow-y-auto flex-1">
               <div className="space-y-1">
                  {filteredNavigation.map((item) => {
                     const isActive = location.pathname === item.href;
                     return (
                        <NavLink
                           key={item.name}
                           to={item.href}
                           onClick={() => {
                              // Cerrar sidebar en mobile al navegar
                              if (window.innerWidth < 1024) {
                                 toggleSidebar();
                              }
                           }}
                           className={cn(
                              'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200',
                              isActive
                                 ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                 : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
                              sidebarCollapsed && 'lg:justify-center'
                           )}
                           title={sidebarCollapsed ? item.name : undefined}
                        >
                           <item.icon
                              className={cn(
                                 'flex-shrink-0 w-5 h-5',
                                 !sidebarCollapsed && 'mr-3',
                                 isActive
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                              )}
                           />
                           <span className={cn(
                              "flex-1 transition-opacity duration-300",
                              sidebarCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"
                           )}>
                              {item.name}
                           </span>
                        </NavLink>
                     );
                  })}
               </div>
            </nav>

            {/* Footer */}
            <div className={cn(
               "absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 transition-opacity duration-300",
               sidebarCollapsed ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"
            )}>
               <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  <p>Casino Platform v1.0</p>
                  <p className="mt-1">© 2024</p>
               </div>
            </div>
         </div>
      </>
   );
}