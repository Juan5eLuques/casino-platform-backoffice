import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface GamesPaginationProps {
   currentPage: number;
   totalPages: number;
   pageSize: number;
   totalCount: number;
   onPageChange: (page: number) => void;
   onPageSizeChange: (pageSize: number) => void;
}

export function GamesPagination({
   currentPage,
   totalPages,
   pageSize,
   totalCount,
   onPageChange,
   onPageSizeChange,
}: GamesPaginationProps) {
   const startItem = (currentPage - 1) * pageSize + 1;
   const endItem = Math.min(currentPage * pageSize, totalCount);

   const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
         // Mostrar todas las páginas si son pocas
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
         }
      } else {
         // Siempre mostrar primera página
         pages.push(1);

         if (currentPage > 3) {
            pages.push('...');
         }

         // Páginas alrededor de la actual
         const start = Math.max(2, currentPage - 1);
         const end = Math.min(totalPages - 1, currentPage + 1);

         for (let i = start; i <= end; i++) {
            pages.push(i);
         }

         if (currentPage < totalPages - 2) {
            pages.push('...');
         }

         // Siempre mostrar última página
         if (totalPages > 1) {
            pages.push(totalPages);
         }
      }

      return pages;
   };

   return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
               Mostrando <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> a{' '}
               <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> de{' '}
               <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> juegos
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
               {/* First Page */}
               <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Primera página"
               >
                  <ChevronsLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>

               {/* Previous Page */}
               <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página anterior"
               >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>

               {/* Page Numbers */}
               <div className="hidden sm:flex items-center gap-1">
                  {getPageNumbers().map((page, index) =>
                     typeof page === 'number' ? (
                        <button
                           key={index}
                           onClick={() => onPageChange(page)}
                           className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                 ? 'bg-blue-600 text-white shadow-lg'
                                 : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                        >
                           {page}
                        </button>
                     ) : (
                        <span
                           key={index}
                           className="px-2 py-2 text-gray-400 dark:text-gray-600"
                        >
                           {page}
                        </span>
                     )
                  )}
               </div>

               {/* Mobile: Current Page Indicator */}
               <div className="sm:hidden px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                     {currentPage} / {totalPages}
                  </span>
               </div>

               {/* Next Page */}
               <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Página siguiente"
               >
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>

               {/* Last Page */}
               <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Última página"
               >
                  <ChevronsRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
               <label className="text-sm text-gray-600 dark:text-gray-400">
                  Por página:
               </label>
               <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
               >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
               </select>
            </div>
         </div>
      </div>
   );
}
