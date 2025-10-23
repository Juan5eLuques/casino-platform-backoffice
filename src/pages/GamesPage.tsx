import { useState } from 'react';
import { Loader2, AlertCircle, Gamepad2, LayoutGrid, List } from 'lucide-react';
import { useGames } from '../hooks/useGames';
import { GameCard } from '../components/games/GameCard';
import { GameFilters } from '../components/games/GameFilters';
import { GamesPagination } from '../components/games/GamesPagination';
import type { GameFilters as GameFiltersType, Game } from '../types';

export function GamesPage() {
   const [filters, setFilters] = useState<GameFiltersType>({
      page: 1,
      pageSize: 24,
      type: undefined,
   });

   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

   const { data, isLoading, error, refetch } = useGames(filters);

   const handleFiltersChange = (newFilters: GameFiltersType) => {
      setFilters(newFilters);
   };

   const handleResetFilters = () => {
      setFilters({
         page: 1,
         pageSize: 24,
      });
   };

   const handlePageChange = (page: number) => {
      setFilters((prev) => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handlePageSizeChange = (pageSize: number) => {
      setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
   };

   const handleGameClick = (game: Game) => {
      console.log('Game clicked:', game);
      // TODO: Implementar modal o navegación a detalle del juego
   };

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 sm:p-4 md:p-6">
         {/* Header */}
         <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
               <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
               </div>
               <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                     Catálogo de Juegos
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                     Explora el catálogo de juegos
                  </p>
               </div>
            </div>
         </div>

         {/* Filters Section - Arriba */}
         <div className="mb-4 sm:mb-6">
            <GameFilters
               filters={filters}
               onFiltersChange={handleFiltersChange}
               onReset={handleResetFilters}
            />
         </div>

         {/* Stats Bar + View Toggle */}
         {data && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total de Juegos</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                           {data.totalCount.toLocaleString()}
                        </p>
                     </div>
                     {filters.type && (
                        <>
                           <div className="h-10 sm:h-12 w-px bg-gray-300 dark:bg-gray-600" />
                           <div>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tipo</p>
                              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                                 {filters.type === 'SLOT' ? 'Slots' : 'Live Casino'}
                              </p>
                           </div>
                        </>
                     )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg self-start sm:self-auto">
                     <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                           ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                           }`}
                        aria-label="Vista de cuadrícula"
                     >
                        <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                     </button>
                     <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'list'
                           ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                           }`}
                        aria-label="Vista de lista"
                     >
                        <List className="w-4 h-4 sm:w-5 sm:h-5" />
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Loading State */}
         {isLoading && (
            <div className="flex items-center justify-center py-12 sm:py-20">
               <div className="text-center">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Cargando juegos...</p>
               </div>
            </div>
         )}

         {/* Error State */}
         {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 sm:p-6">
               <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                     <h3 className="text-base sm:text-lg font-semibold text-red-900 dark:text-red-200 mb-1">
                        Error al cargar juegos
                     </h3>
                     <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 mb-3">
                        {error.message || 'Ocurrió un error desconocido'}
                     </p>
                     <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                     >
                        Reintentar
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Games Grid/List */}
         {data && data.games.length > 0 && (
            <div className="space-y-4 sm:space-y-6">
               {viewMode === 'list' && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                     {/* Table Header - Hidden en mobile */}
                     <div className="hidden md:block bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                        <div className="px-4 py-3 grid grid-cols-12 gap-4 items-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                           <div className="col-span-4">Juego</div>
                           <div className="col-span-1">Tipo</div>
                           <div className="col-span-2">Categoría</div>
                           <div className="col-span-1 text-center">RTP</div>
                           <div className="col-span-1 text-center">Volatilidad</div>
                           <div className="col-span-2">Badges</div>
                           <div className="col-span-1 text-right">Estado</div>
                        </div>
                     </div>
                     {/* Table Body */}
                     <div>
                        {data.games.map((game) => (
                           <GameCard
                              key={game.gameId}
                              game={game}
                              onGameClick={handleGameClick}
                              viewMode="list"
                           />
                        ))}
                     </div>
                  </div>
               )}

               {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                     {data.games.map((game) => (
                        <GameCard
                           key={game.gameId}
                           game={game}
                           onGameClick={handleGameClick}
                           viewMode="grid"
                        />
                     ))}
                  </div>
               )}

               {/* Pagination */}
               <GamesPagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  pageSize={data.pageSize}
                  totalCount={data.totalCount}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
               />
            </div>
         )}

         {/* Empty State */}
         {data && data.games.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-12 border border-gray-100 dark:border-gray-700">
               <div className="text-center">
                  <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                     No se encontraron juegos
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                     No hay juegos que coincidan con los filtros seleccionados.
                  </p>
                  <button
                     onClick={handleResetFilters}
                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                     Limpiar filtros
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}