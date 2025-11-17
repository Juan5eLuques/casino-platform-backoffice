
import {
   MagnifyingGlassIcon,
   BellIcon,
   SunIcon,
   MoonIcon,
   ChevronDownIcon,
   ArrowRightOnRectangleIcon,
   UserIcon,
   Bars3Icon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useAuthStore, useUIStore } from '@/store';
import { useLogout } from '@/hooks/useAuth';
import { useBrandAssets } from '@/hooks';
import { getInitials, getRoleBadgeClass } from '@/utils';
import { BalanceMobile } from '@/components/Balance';

export function Header() {
   const { user, currentBrand, availableBrands, switchBrand } = useAuthStore();
   const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
   const { data: assets } = useBrandAssets();
   const logoutMutation = useLogout();

   // Update favicon dynamically
   useEffect(() => {
      if (assets?.media?.favicon) {
         const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
         if (link) {
            link.href = assets.media.favicon;
         } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = assets.media.favicon;
            document.head.appendChild(newLink);
         }
      }
   }, [assets?.media?.favicon]);

   const handleLogout = async () => {
      try {
         await logoutMutation.mutateAsync();
      } catch (error) {
         // Error handled by mutation
      }
   };

   return (
      <header className="bg-secondary border-b border-default h-16 flex items-center justify-between px-4 sm:px-6">
         {/* Left side - Hamburger + Search */}
         <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Botón Hamburguesa - Solo visible en mobile y tablet */}
            <button
               onClick={toggleSidebar}
               className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary rounded-lg transition-colors"
            >
               <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="relative hidden lg:block">
               <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
               <input
                  type="text"
                  placeholder="Buscar jugadores, usuarios..."
                  className="pl-10 pr-4 py-2 w-80 bg-tertiary border border-default rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-text-primary"
               />
            </div>
         </div>

         {/* Right side - Balance, Actions and User Menu */}
         <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Balance - Siempre visible en mobile (compacto), desktop normal */}
            {user && <BalanceMobile />}
            {/* Brand Selector */}
            {availableBrands.length > 1 && (
               <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 px-3 py-2 bg-tertiary border border-default rounded-lg hover:bg-surface-hover transition-colors">
                     <span className="text-sm font-medium text-text-primary">
                        {currentBrand?.name || 'Seleccionar Brand'}
                     </span>
                     <ChevronDownIcon className="w-4 h-4 text-text-tertiary" />
                  </Menu.Button>
                  <Transition
                     as={Fragment}
                     enter="transition ease-out duration-100"
                     enterFrom="transform opacity-0 scale-95"
                     enterTo="transform opacity-100 scale-100"
                     leave="transition ease-in duration-75"
                     leaveFrom="transform opacity-100 scale-100"
                     leaveTo="transform opacity-0 scale-95"
                  >
                     <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-secondary rounded-lg shadow-lg border border-default focus:outline-none z-50">
                        <div className="py-1">
                           {availableBrands.map((brand) => (
                              <Menu.Item key={brand.id}>
                                 {({ active }) => (
                                    <button
                                       onClick={() => switchBrand(brand)}
                                       className={`${active ? 'bg-surface-hover' : ''
                                          } ${currentBrand?.id === brand.id ? 'bg-brand-accent bg-opacity-10' : ''
                                          } block w-full text-left px-4 py-2 text-sm text-text-primary`}
                                    >
                                       <div className="flex items-center justify-between">
                                          <span>{brand.name}</span>
                                          {currentBrand?.id === brand.id && (
                                             <span className="text-brand-primary">✓</span>
                                          )}
                                       </div>
                                       <span className="text-xs text-text-tertiary">
                                          {brand.domain}
                                       </span>
                                    </button>
                                 )}
                              </Menu.Item>
                           ))}
                        </div>
                     </Menu.Items>
                  </Transition>
               </Menu>
            )}

            {/* Dark Mode Toggle - Solo visible en desktop */}
            <button
               onClick={toggleDarkMode}
               className="hidden md:flex p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary rounded-lg transition-colors"
            >
               {darkMode ? (
                  <SunIcon className="w-5 h-5" />
               ) : (
                  <MoonIcon className="w-5 h-5" />
               )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary rounded-lg transition-colors">
               <BellIcon className="w-5 h-5" />
               <span className="absolute top-1 right-1 w-2 h-2 bg-status-error-text rounded-full"></span>
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
               <Menu.Button className="flex items-center space-x-3 p-1 hover:bg-tertiary rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                     <span className="text-white text-sm font-medium">
                        {user ? getInitials(user.username) : 'U'}
                     </span>
                  </div>
                  <div className="hidden md:block text-left">
                     <p className="text-sm font-medium text-text-primary">
                        {user?.username}
                     </p>
                     {user?.role && (
                        <span className={getRoleBadgeClass(user.role)}>
                           {user.role.replace('_', ' ')}
                        </span>
                     )}
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-text-tertiary" />
               </Menu.Button>

               <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
               >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-secondary rounded-lg shadow-lg border border-default focus:outline-none z-50">
                     <div className="py-1">
                        <Menu.Item>
                           {({ active }) => (
                              <a
                                 href="#"
                                 className={`${active ? 'bg-surface-hover' : ''
                                    } flex items-center px-4 py-2 text-sm text-text-primary`}
                              >
                                 <UserIcon className="w-4 h-4 mr-3" />
                                 Mi Perfil
                              </a>
                           )}
                        </Menu.Item>

                        {/* Dark Mode Toggle - Solo visible en mobile */}
                        <Menu.Item>
                           {({ active }) => (
                              <button
                                 onClick={toggleDarkMode}
                                 className={`${active ? 'bg-surface-hover' : ''
                                    } md:hidden flex items-center w-full px-4 py-2 text-sm text-text-primary`}
                              >
                                 {darkMode ? (
                                    <>
                                       <SunIcon className="w-4 h-4 mr-3" />
                                       Modo Claro
                                    </>
                                 ) : (
                                    <>
                                       <MoonIcon className="w-4 h-4 mr-3" />
                                       Modo Oscuro
                                    </>
                                 )}
                              </button>
                           )}
                        </Menu.Item>

                        <div className="md:hidden border-t border-default my-1" />

                        <Menu.Item>
                           {({ active }) => (
                              <button
                                 onClick={handleLogout}
                                 disabled={logoutMutation.isPending}
                                 className={`${active ? 'bg-surface-hover' : ''
                                    } flex items-center w-full px-4 py-2 text-sm text-text-primary disabled:opacity-50`}
                              >
                                 <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                                 {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
                              </button>
                           )}
                        </Menu.Item>
                     </div>
                  </Menu.Items>
               </Transition>
            </Menu>
         </div>
      </header>
   );
}