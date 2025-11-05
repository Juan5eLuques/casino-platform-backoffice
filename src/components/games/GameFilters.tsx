import { Search, Filter, X, Star, Zap } from 'lucide-react';
import type { GameFilters as GameFiltersType } from '../../types';

interface GameFiltersProps {
   filters: GameFiltersType;
   onFiltersChange: (filters: GameFiltersType) => void;
   onReset: () => void;
}

const PROVIDERS = [
   { value: 'pragmatic', label: 'Pragmatic Play' },
   { value: 'evolution', label: 'Evolution' },
   { value: 'netent', label: 'NetEnt' },
   { value: 'playtech', label: 'Playtech' },
   { value: 'microgaming', label: 'Microgaming' },
   { value: 'novomatic', label: 'Novomatic' },
];

const CATEGORIES = [
   { value: 'video-slots', label: 'Video Slots' },
   { value: 'classic-slots', label: 'Classic Slots' },
   { value: 'jackpot-slots', label: 'Jackpot Slots' },
   { value: 'roulette', label: 'Roulette' },
   { value: 'blackjack', label: 'Blackjack' },
   { value: 'baccarat', label: 'Baccarat' },
   { value: 'poker', label: 'Poker' },
   { value: 'game-shows', label: 'Game Shows' },
];

export function GameFilters({ filters, onFiltersChange, onReset }: GameFiltersProps) {
   const hasActiveFilters =
      filters.type ||
      filters.category ||
      filters.provider ||
      filters.featured !== undefined ||
      filters.enabled !== undefined ||
      filters.search;

   const handleSearchChange = (search: string) => {
      onFiltersChange({ ...filters, search, page: 1 });
   };

   const handleTypeChange = (type: 'SLOT' | 'LIVE_CASINO' | undefined) => {
      onFiltersChange({ ...filters, type, category: undefined, page: 1 });
   };

   const handleCategoryChange = (category: string) => {
      onFiltersChange({ ...filters, category, page: 1 });
   };

   const handleProviderChange = (provider: string) => {
      onFiltersChange({ ...filters, provider, page: 1 });
   };

   const handleFeaturedToggle = () => {
      onFiltersChange({
         ...filters,
         featured: filters.featured === true ? undefined : true,
         page: 1,
      });
   };

   const handleEnabledChange = (enabled: boolean | undefined) => {
      onFiltersChange({ ...filters, enabled, page: 1 });
   };

   return (
      <div className="bg-secondary rounded-xl shadow-lg border border-default overflow-hidden">
         {/* Header compacto */}
         <div className="px-3 sm:px-4 py-2.5 border-b border-default">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-brand-secondary" />
                  <h3 className="text-sm sm:text-base font-semibold text-primary">Filtros</h3>
                  {hasActiveFilters && (
                     <span className="px-2 py-0.5 bg-brand-secondary text-white text-[10px] sm:text-xs font-bold rounded-full">
                        Activos
                     </span>
                  )}
               </div>
               {hasActiveFilters && (
                  <button
                     onClick={onReset}
                     className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-secondary hover:bg-surface-hover rounded-lg transition-colors border border-default"
                  >
                     <X className="w-3 h-3 sm:w-4 sm:h-4" />
                     <span className="hidden sm:inline">Limpiar</span>
                  </button>
               )}
            </div>
         </div>

         {/* Filtros en layout horizontal/responsive */}
         <div className="p-3 sm:p-4 space-y-3">
            {/* Fila 1: Search + Type Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {/* Search */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                  <input
                     type="text"
                     placeholder="Buscar juegos..."
                     value={filters.search || ''}
                     onChange={(e) => handleSearchChange(e.target.value)}
                     className="w-full pl-9 pr-3 py-2 text-sm border border-default rounded-lg bg-tertiary text-primary placeholder-tertiary focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                  />
               </div>

               {/* Type Tabs */}
               <div className="flex gap-1.5 sm:gap-2 bg-tertiary p-1 rounded-lg">
                  <button
                     onClick={() => handleTypeChange(undefined)}
                     className={`flex-1 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${!filters.type
                        ? 'bg-brand-secondary text-white shadow-sm'
                        : 'text-secondary hover:bg-surface-hover'
                        }`}
                  >
                     Todos
                  </button>
                  <button
                     onClick={() => handleTypeChange('SLOT')}
                     className={`flex-1 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${filters.type === 'SLOT'
                        ? 'bg-brand-secondary text-white shadow-sm'
                        : 'text-secondary hover:bg-surface-hover'
                        }`}
                  >
                     Slots
                  </button>
                  <button
                     onClick={() => handleTypeChange('LIVE_CASINO')}
                     className={`flex-1 px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${filters.type === 'LIVE_CASINO'
                        ? 'bg-brand-secondary text-white shadow-sm'
                        : 'text-secondary hover:bg-surface-hover'
                        }`}
                  >
                     Live
                  </button>
               </div>
            </div>

            {/* Fila 2: Provider + Category + Quick Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
               {/* Provider */}
               <select
                  value={filters.provider || ''}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="px-3 py-2 text-sm border border-default rounded-lg bg-tertiary text-primary focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
               >
                  <option value="">Todos los proveedores</option>
                  {PROVIDERS.map((provider) => (
                     <option key={provider.value} value={provider.value}>
                        {provider.label}
                     </option>
                  ))}
               </select>

               {/* Category */}
               <select
                  value={filters.category || ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-3 py-2 text-sm border border-default rounded-lg bg-tertiary text-primary focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                  disabled={!filters.type}
               >
                  <option value="">Todas las categorías</option>
                  {CATEGORIES.filter((cat) => {
                     if (filters.type === 'SLOT') {
                        return cat.value.includes('slot');
                     } else if (filters.type === 'LIVE_CASINO') {
                        return !cat.value.includes('slot');
                     }
                     return true;
                  }).map((category) => (
                     <option key={category.value} value={category.value}>
                        {category.label}
                     </option>
                  ))}
               </select>

               {/* Quick Filters */}
               <div className="sm:col-span-2 lg:col-span-2 flex flex-wrap gap-2">
                  <button
                     onClick={handleFeaturedToggle}
                     className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${filters.featured === true
                        ? 'bg-status-warning-text text-white shadow-md'
                        : 'bg-tertiary text-secondary hover:bg-surface-hover border border-default'
                        }`}
                  >
                     <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                     <span className="hidden sm:inline">Destacados</span>
                     <span className="sm:hidden">⭐</span>
                  </button>

                  <button
                     onClick={() => handleEnabledChange(filters.enabled === true ? undefined : true)}
                     className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${filters.enabled === true
                        ? 'bg-status-success text-white shadow-md'
                        : 'bg-tertiary text-secondary hover:bg-surface-hover border border-default'
                        }`}
                  >
                     <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                     <span className="hidden sm:inline">Activos</span>
                     <span className="sm:hidden">⚡</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
