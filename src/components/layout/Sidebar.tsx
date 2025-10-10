import { NavLink, useLocation } from 'react-router-dom';
import {
   HomeIcon,
   UsersIcon,
   UserGroupIcon,
   BuildingOfficeIcon,
   BuildingLibraryIcon,
   PuzzlePieceIcon,
   ClipboardDocumentListIcon,
   CogIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
   CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { TreePine } from 'lucide-react';
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

// Navegación específica para cashiers
const cashierNavigation = [
   {
      name: 'Dashboard Cashier',
      href: '/cashier-dashboard',
      icon: TreePine,
      roles: ['CASHIER', 'OPERATOR_ADMIN', 'SUPER_ADMIN']
   },
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
         allNavigation.splice(1, 0, ...cashierNavigation);
      }

      return allNavigation;
   };

   const filteredNavigation = getFilteredNavigation();

   return (
      <div
         className={cn(
            'fixed inset-y-0 left-0 bg-white dark:bg-dark-bg-secondary border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50',
            sidebarCollapsed ? 'w-16' : 'w-64'
         )}
      >
         {/* Logo */}
         <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed && (
               <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                     <span className="text-white font-bold text-sm">🎰</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                     Casino BO
                  </span>
               </div>
            )}
            <button
               onClick={toggleSidebar}
               className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
               {sidebarCollapsed ? (
                  <ChevronRightIcon className="w-5 h-5" />
               ) : (
                  <ChevronLeftIcon className="w-5 h-5" />
               )}
            </button>
         </div>

         {/* Navigation */}
         <nav className="mt-8 px-3">
            <div className="space-y-1">
               {filteredNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                     <NavLink
                        key={item.name}
                        to={item.href}
                        className={cn(
                           'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                           isActive
                              ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        )}
                     >
                        <item.icon
                           className={cn(
                              'flex-shrink-0 w-5 h-5',
                              sidebarCollapsed ? 'mr-0' : 'mr-3',
                              isActive
                                 ? 'text-primary-600 dark:text-primary-400'
                                 : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                           )}
                        />
                        {!sidebarCollapsed && (
                           <span className="flex-1">{item.name}</span>
                        )}
                        {sidebarCollapsed && (
                           <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                              {item.name}
                           </div>
                        )}
                     </NavLink>
                  );
               })}
            </div>
         </nav>

         {/* Footer */}
         {!sidebarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
               <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  <p>Casino Platform v1.0</p>
                  <p className="mt-1">© 2024</p>
               </div>
            </div>
         )}
      </div>
   );
}