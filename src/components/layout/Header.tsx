
import {
   MagnifyingGlassIcon,
   BellIcon,
   SunIcon,
   MoonIcon,
   ChevronDownIcon,
   ArrowRightOnRectangleIcon,
   UserIcon,
   WalletIcon,
   Bars3Icon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuthStore, useUIStore } from '@/store';
import { useLogout } from '@/hooks/useAuth';
import { getInitials, getRoleBadgeClass } from '@/utils';
import { useUserBalance } from '@/hooks/useTransactions';
import { cn } from '@/utils';

export function Header() {
   const { user, currentBrand, availableBrands, switchBrand } = useAuthStore();
   const { darkMode, toggleDarkMode, toggleSidebar } = useUIStore();
   const logoutMutation = useLogout();
   const { data: balanceData, isLoading: isLoadingBalance } = useUserBalance(
      user?.id || '',
      'BACKOFFICE'
   );

   const handleLogout = async () => {
      try {
         await logoutMutation.mutateAsync();
      } catch (error) {
         // Error handled by mutation
      }
   };

   const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('es-ES', {
         style: 'currency',
         currency: 'USD',
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
      }).format(amount);
   };

   return (
      <header className="bg-white dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6">
         {/* Left side - Hamburger + Search */}
         <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Botón Hamburguesa - Solo visible en mobile y tablet */}
            <button
               onClick={toggleSidebar}
               className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
               <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="relative hidden lg:block">
               <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input
                  type="text"
                  placeholder="Buscar jugadores, usuarios..."
                  className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-dark-bg-tertiary border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
               />
            </div>
         </div>

         {/* Right side - Balance, Actions and User Menu */}
         <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Balance Display - Compacto */}
            {user && (
               <div className={cn(
                  'hidden sm:flex items-center space-x-1.5 px-2 py-1 rounded-md',
                  'border border-primary-400 dark:border-primary-600',
                  'shadow-sm'
               )}>
                  <WalletIcon className="w-4 h-4 text-white flex-shrink-0" />
                  {isLoadingBalance ? (
                     <div className="animate-pulse">
                        <div className="h-3 w-16 bg-white/30 rounded" />
                     </div>
                  ) : (
                     <span className="text-xs font-bold text-white whitespace-nowrap">
                        {formatCurrency(balanceData?.balance || 0)}
                     </span>
                  )}
               </div>
            )}
            {/* Brand Selector */}
            {availableBrands.length > 1 && (
               <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-dark-bg-tertiary border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {currentBrand?.name || 'Seleccionar Brand'}
                     </span>
                     <ChevronDownIcon className="w-4 h-4 text-gray-400" />
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
                     <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none z-50">
                        <div className="py-1">
                           {availableBrands.map((brand) => (
                              <Menu.Item key={brand.id}>
                                 {({ active }) => (
                                    <button
                                       onClick={() => switchBrand(brand)}
                                       className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                          } ${currentBrand?.id === brand.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                                    >
                                       <div className="flex items-center justify-between">
                                          <span>{brand.name}</span>
                                          {currentBrand?.id === brand.id && (
                                             <span className="text-primary-600 dark:text-primary-400">✓</span>
                                          )}
                                       </div>
                                       <span className="text-xs text-gray-500 dark:text-gray-400">
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

            {/* Dark Mode Toggle */}
            <button
               onClick={toggleDarkMode}
               className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
               {darkMode ? (
                  <SunIcon className="w-5 h-5" />
               ) : (
                  <MoonIcon className="w-5 h-5" />
               )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
               <BellIcon className="w-5 h-5" />
               <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <Menu as="div" className="relative">
               <Menu.Button className="flex items-center space-x-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                     <span className="text-white text-sm font-medium">
                        {user ? getInitials(user.username) : 'U'}
                     </span>
                  </div>
                  <div className="hidden md:block text-left">
                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.username}
                     </p>
                     {user?.role && (
                        <span className={getRoleBadgeClass(user.role)}>
                           {user.role.replace('_', ' ')}
                        </span>
                     )}
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
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
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none z-50">
                     <div className="py-1">
                        <Menu.Item>
                           {({ active }) => (
                              <a
                                 href="#"
                                 className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                    } flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                              >
                                 <UserIcon className="w-4 h-4 mr-3" />
                                 Mi Perfil
                              </a>
                           )}
                        </Menu.Item>
                        <Menu.Item>
                           {({ active }) => (
                              <button
                                 onClick={handleLogout}
                                 disabled={logoutMutation.isPending}
                                 className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                    } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50`}
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