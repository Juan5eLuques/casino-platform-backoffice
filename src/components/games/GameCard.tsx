import { Star, TrendingUp, Zap, DollarSign, Target } from 'lucide-react';
import type { Game } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';

interface GameCardProps {
   game: Game;
   onGameClick?: (game: Game) => void;
   viewMode?: 'grid' | 'list';
}

export function GameCard({ game, onGameClick, viewMode = 'grid' }: GameCardProps) {
   const getVolatilityColor = (volatility: string | null) => {
      switch (volatility?.toUpperCase()) {
         case 'LOW':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
         case 'MEDIUM':
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
         case 'HIGH':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
         default:
            return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      }
   };

   const getTypeColor = (type: string) => {
      return type === 'SLOT'
         ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
         : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
   };

   // Vista de Lista (Tabla)
   if (viewMode === 'list') {
      return (
         <div
            onClick={() => onGameClick?.(game)}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700 cursor-pointer group"
         >
            {/* Desktop View - Grid de 12 columnas */}
            <div className="hidden md:grid px-4 py-3 grid-cols-12 gap-4 items-center">
               {/* Image + Name (4 cols) */}
               <div className="col-span-4 flex items-center gap-3">
                  <div className="relative w-16 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded overflow-hidden flex-shrink-0">
                     {game.imageUrl ? (
                        <img
                           src={game.imageUrl}
                           alt={game.name}
                           className="w-full h-full object-cover"
                           onError={(e) => {
                              e.currentTarget.src = '/placeholder-game.jpg';
                           }}
                        />
                     ) : (
                        <Zap className="w-4 h-4 text-gray-400 absolute inset-0 m-auto" />
                     )}
                  </div>
                  <div className="min-w-0 flex-1">
                     <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {game.name}
                     </h3>
                     <p className="text-xs text-gray-600 dark:text-gray-400 capitalize truncate">
                        {game.provider.replace(/-/g, ' ')}
                     </p>
                  </div>
               </div>

               {/* Type (1 col) */}
               <div className="col-span-1">
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-semibold ${getTypeColor(game.type)}`}>
                     {game.type === 'SLOT' ? 'Slot' : 'Live'}
                  </span>
               </div>

               {/* Category (2 cols) */}
               <div className="col-span-2">
                  {game.category ? (
                     <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                        {game.category.replace(/-/g, ' ')}
                     </span>
                  ) : (
                     <span className="text-xs text-gray-400">—</span>
                  )}
               </div>

               {/* RTP (1 col) */}
               <div className="col-span-1 text-center">
                  {game.rtp ? (
                     <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {formatPercent(game.rtp)}
                     </span>
                  ) : (
                     <span className="text-xs text-gray-400">—</span>
                  )}
               </div>

               {/* Volatility (1 col) */}
               <div className="col-span-1 text-center">
                  {game.volatility ? (
                     <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${getVolatilityColor(game.volatility)}`}>
                        {game.volatility.toLowerCase()}
                     </span>
                  ) : (
                     <span className="text-xs text-gray-400">—</span>
                  )}
               </div>

               {/* Badges (2 cols) */}
               <div className="col-span-2 flex items-center gap-1">
                  {game.isFeatured && (
                     <span className="inline-flex items-center gap-0.5 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5" />
                     </span>
                  )}
                  {game.isNew && (
                     <span className="inline-flex items-center gap-0.5 bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <TrendingUp className="w-2.5 h-2.5" />
                     </span>
                  )}
                  {!game.isFeatured && !game.isNew && <span className="text-xs text-gray-400">—</span>}
               </div>

               {/* Status (1 col) */}
               <div className="col-span-1 text-right">
                  <span
                     className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${game.enabled
                           ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                           : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                  >
                     <span className={`w-1 h-1 rounded-full ${game.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                     {game.enabled ? 'On' : 'Off'}
                  </span>
               </div>
            </div>

            {/* Mobile View - Layout compacto */}
            <div className="md:hidden p-3 flex items-center gap-3">
               {/* Image */}
               <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {game.imageUrl ? (
                     <img
                        src={game.imageUrl}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                           e.currentTarget.src = '/placeholder-game.jpg';
                        }}
                     />
                  ) : (
                     <Zap className="w-6 h-6 text-gray-400 absolute inset-0 m-auto" />
                  )}
                  {/* Status indicator on image */}
                  <span
                     className={`absolute top-1 right-1 w-2 h-2 rounded-full ${game.enabled ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                  />
               </div>

               {/* Info */}
               <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                     <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                           {game.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize truncate">
                           {game.provider.replace(/-/g, ' ')}
                        </p>
                     </div>
                     <div className="flex gap-1 flex-shrink-0">
                        {game.isFeatured && (
                           <span className="inline-flex items-center bg-yellow-500 text-white p-1 rounded">
                              <Star className="w-3 h-3" />
                           </span>
                        )}
                        {game.isNew && (
                           <span className="inline-flex items-center bg-green-500 text-white p-1 rounded">
                              <TrendingUp className="w-3 h-3" />
                           </span>
                        )}
                     </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                     <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${getTypeColor(game.type)}`}>
                        {game.type === 'SLOT' ? 'Slot' : 'Live'}
                     </span>
                     {game.rtp && (
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                           RTP {formatPercent(game.rtp)}
                        </span>
                     )}
                     {game.volatility && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${getVolatilityColor(game.volatility)}`}>
                           {game.volatility.toLowerCase()}
                        </span>
                     )}
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // Vista de Grid (Original)
   return (
      <div
         onClick={() => onGameClick?.(game)}
         className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer group"
      >
         {/* Image Container */}
         <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
            {game.imageUrl ? (
               <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                     e.currentTarget.src = '/placeholder-game.jpg';
                  }}
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center">
                  <Zap className="w-12 h-12 text-gray-400" />
               </div>
            )}

            {/* Badges en la imagen */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
               {game.isFeatured && (
                  <span className="inline-flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                     <Star className="w-3 h-3" />
                     Featured
                  </span>
               )}
               {game.isNew && (
                  <span className="inline-flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                     <TrendingUp className="w-3 h-3" />
                     New
                  </span>
               )}
            </div>

            {/* Type Badge */}
            <div className="absolute top-2 right-2">
               <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${getTypeColor(game.type)}`}>
                  {game.type.replace('_', ' ')}
               </span>
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
         </div>

         {/* Content */}
         <div className="p-4">
            {/* Game Name & Provider */}
            <div className="mb-3">
               <h3 className="font-bold text-base text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {game.name}
               </h3>
               <p className="text-sm text-gray-600 dark:text-gray-400 capitalize truncate">
                  {game.provider.replace(/-/g, ' ')}
               </p>
            </div>

            {/* Stats Grid */}
            {(game.rtp || game.volatility) && (
               <div className="grid grid-cols-2 gap-2 mb-3">
                  {game.rtp && (
                     <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-1.5 rounded-lg">
                        <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="min-w-0">
                           <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">RTP</p>
                           <p className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">
                              {formatPercent(game.rtp)}
                           </p>
                        </div>
                     </div>
                  )}

                  {game.volatility && (
                     <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${getVolatilityColor(game.volatility)}`}>
                        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                        <div className="min-w-0">
                           <p className="text-[10px] leading-tight opacity-80">Volatility</p>
                           <p className="text-xs font-bold truncate capitalize">
                              {game.volatility.toLowerCase()}
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {/* Bet Range */}
            {(game.minBet !== null || game.maxBet !== null) && (
               <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-2 py-1.5 rounded-lg mb-3">
                  <DollarSign className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">Bet Range</p>
                     <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {game.minBet !== null ? formatCurrency(game.minBet) : '—'} - {game.maxBet !== null ? formatCurrency(game.maxBet) : '—'}
                     </p>
                  </div>
               </div>
            )}

            {/* Category & Tags */}
            {(game.category || game.tags.length > 0) && (
               <div className="flex flex-wrap gap-1.5 mb-3">
                  {game.category && (
                     <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-medium capitalize">
                        {game.category.replace(/-/g, ' ')}
                     </span>
                  )}
                  {game.tags.slice(0, 2).map((tag, index) => (
                     <span
                        key={index}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-medium"
                     >
                        {tag}
                     </span>
                  ))}
                  {game.tags.length > 2 && (
                     <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-medium">
                        +{game.tags.length - 2}
                     </span>
                  )}
               </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
               <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${game.enabled
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                     }`}
               >
                  <span className={`w-1.5 h-1.5 rounded-full ${game.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {game.enabled ? 'Active' : 'Inactive'}
               </span>

               {game.code && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-500 font-mono">
                     {game.code}
                  </span>
               )}
            </div>
         </div>
      </div>
   );
}
