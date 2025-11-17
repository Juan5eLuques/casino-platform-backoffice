import { NavLink, useLocation } from 'react-router-dom';
import {
   HomeIcon,
   UserGroupIcon,
   PuzzlePieceIcon,
   ClipboardDocumentListIcon,
   XMarkIcon,
   Bars3Icon,
   CurrencyDollarIcon,
   RectangleGroupIcon,
   SwatchIcon,
   GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useUIStore } from '@/store';
import { useBrandAssets } from '@/hooks';
import { cn } from '@/utils';

const navigationSections = [
   {
      title: 'Gestión',
      items: [
         { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
         { name: 'Usuarios', href: '/users', icon: UserGroupIcon },
         { name: 'Transacciones', href: '/transactions', icon: CurrencyDollarIcon },
         { name: 'Juegos', href: '/games', icon: PuzzlePieceIcon },
         { name: 'Auditoría', href: '/audit', icon: ClipboardDocumentListIcon },
      ]
   },
   {
      title: 'Personalización',
      items: [
         { name: 'Público', href: '/public', icon: GlobeAltIcon },
         { name: 'Banners', href: '/banners', icon: RectangleGroupIcon },
         { name: 'Colores', href: '/colors', icon: SwatchIcon },
      ]
   }
];



export function Sidebar() {
   const location = useLocation();
   const { sidebarCollapsed, toggleSidebar } = useUIStore();
   const { data: assets } = useBrandAssets();

   const logo = assets?.media?.logo;

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
               'fixed inset-y-0 left-0 bg-secondary border-r border-default transition-all duration-300 z-50',
               // En mobile: ocultar completamente con transform
               // En desktop: mantener visible pero con ancho dinámico
               sidebarCollapsed
                  ? '-translate-x-full lg:translate-x-0 lg:w-16'
                  : 'translate-x-0 w-64'
            )}
         >
            {/* Logo y botón */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-default">
               {/* Logo - siempre visible */}
               <div className="flex items-center space-x-2 min-w-0 flex-1">
                  {logo ? (
                     <img 
                        src={logo} 
                        alt="Logo" 
                        className={cn(
                           "h-8 object-contain transition-all duration-300",
                           sidebarCollapsed ? "lg:w-8" : "max-w-[180px]"
                        )}
                     />
                  ) : (
                     <>
                        <div className="w-8 h-8 bg-brand-secondary rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                           <span className="text-white font-bold text-sm">🎰</span>
                        </div>
                        <span className={cn(
                           "text-lg font-bold text-primary whitespace-nowrap transition-all duration-300",
                           sidebarCollapsed ? "lg:hidden" : "block"
                        )}>
                           Casino BO
                        </span>
                     </>
                  )}
               </div>
               
               {/* Botón toggle */}
               <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-tertiary transition-colors flex-shrink-0 ml-2"
                  title={sidebarCollapsed ? "Abrir menú" : "Cerrar menú"}
               >
                  {sidebarCollapsed ? (
                     <Bars3Icon className="w-5 h-5" />
                  ) : (
                     <XMarkIcon className="w-5 h-5" />
                  )}
               </button>
            </div>

            {/* Navigation */}
            <nav className="mt-8 px-3 overflow-y-auto flex-1">
               {navigationSections.map((section) => (
                  <div key={section.title} className="mb-6">
                     {/* Section Title */}
                     {!sidebarCollapsed && (
                        <h3 className="px-3 mb-2 text-xs font-semibold text-tertiary uppercase tracking-wider">
                           {section.title}
                        </h3>
                     )}
                     {sidebarCollapsed && (
                        <div className="hidden lg:block mb-2 px-3">
                           <div className="h-px bg-default"></div>
                        </div>
                     )}
                     
                     {/* Section Items */}
                     <div className="space-y-1">
                        {section.items.map((item) => {
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
                                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                                    isActive
                                       ? 'bg-brand-secondary text-white shadow-sm'
                                       : 'text-secondary hover:bg-tertiary hover:text-primary',
                                    sidebarCollapsed && 'lg:justify-center'
                                 )}
                                 title={sidebarCollapsed ? item.name : undefined}
                              >
                                 <item.icon
                                    className={cn(
                                       'flex-shrink-0 w-5 h-5 transition-colors',
                                       !sidebarCollapsed && 'mr-3',
                                       isActive
                                          ? 'text-white'
                                          : 'text-tertiary group-hover:text-brand-secondary'
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
                  </div>
               ))}
            </nav>

            {/* Footer */}
            <div className={cn(
               "absolute bottom-0 left-0 right-0 p-4 border-t border-default transition-opacity duration-300",
               sidebarCollapsed ? "lg:opacity-0 lg:pointer-events-none" : "opacity-100"
            )}>
               <div className="text-xs text-tertiary text-center">
                  <p>Casino Platform v1.0</p>
                  <p className="mt-1">© 2024</p>
               </div>
            </div>
         </div>
      </>
   );
}