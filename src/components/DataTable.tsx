import { ReactNode, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface Column<T> {
   key: string;
   header: string;
   render?: (item: T) => ReactNode;
   sortable?: boolean;
   className?: string;
}

interface DataTableProps<T> {
   data: T[];
   columns: Column<T>[];
   keyExtractor: (item: T) => string;
   isLoading?: boolean;
   emptyMessage?: string;
   pagination?: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      onPageChange: (page: number) => void;
      onPageSizeChange?: (pageSize: number) => void;
   };
   actions?: (item: T) => ReactNode;
   onRowClick?: (item: T) => void;
}

export function DataTable<T extends Record<string, any>>({
   data,
   columns,
   keyExtractor,
   isLoading = false,
   emptyMessage = 'No hay datos disponibles',
   pagination,
   actions,
   onRowClick,
}: DataTableProps<T>) {
   const [sortColumn, setSortColumn] = useState<string | null>(null);
   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

   const handleSort = (columnKey: string) => {
      if (sortColumn === columnKey) {
         setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
         setSortColumn(columnKey);
         setSortDirection('asc');
      }
   };

   const sortedData = [...data].sort((a, b) => {
      if (!sortColumn) return 0;

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
   });

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
         </div>
      );
   }

   if (data.length === 0) {
      return (
         <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">{emptyMessage}</p>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         {/* Table */}
         <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                     {columns.map((column) => (
                        <th
                           key={column.key}
                           className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''
                              } ${column.className || ''}`}
                           onClick={() => column.sortable && handleSort(column.key)}
                        >
                           <div className="flex items-center space-x-1">
                              <span>{column.header}</span>
                              {column.sortable && sortColumn === column.key && (
                                 <span className="text-indigo-600 dark:text-indigo-400">
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                 </span>
                              )}
                           </div>
                        </th>
                     ))}
                     {actions && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Acciones
                        </th>
                     )}
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedData.map((item) => (
                     <tr
                        key={keyExtractor(item)}
                        className={`${onRowClick
                              ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                              : ''
                           }`}
                        onClick={() => onRowClick?.(item)}
                     >
                        {columns.map((column) => (
                           <td
                              key={column.key}
                              className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${column.className || ''
                                 }`}
                           >
                              {column.render ? column.render(item) : item[column.key]}
                           </td>
                        ))}
                        {actions && (
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                 {actions(item)}
                              </div>
                           </td>
                        )}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         {pagination && (
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
               <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                     Mostrando{' '}
                     <span className="font-medium">
                        {(pagination.page - 1) * pagination.pageSize + 1}
                     </span>{' '}
                     a{' '}
                     <span className="font-medium">
                        {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
                     </span>{' '}
                     de <span className="font-medium">{pagination.totalCount}</span> resultados
                  </span>
               </div>

               <div className="flex items-center space-x-2">
                  {/* First Page */}
                  <button
                     onClick={() => pagination.onPageChange(1)}
                     disabled={pagination.page === 1}
                     className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                     title="Primera página"
                  >
                     <ChevronsLeft className="w-5 h-5" />
                  </button>

                  {/* Previous Page */}
                  <button
                     onClick={() => pagination.onPageChange(pagination.page - 1)}
                     disabled={pagination.page === 1}
                     className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                     title="Página anterior"
                  >
                     <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                     {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (pagination.totalPages <= 5) {
                           pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                           pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                           pageNum = pagination.totalPages - 4 + i;
                        } else {
                           pageNum = pagination.page - 2 + i;
                        }

                        return (
                           <button
                              key={pageNum}
                              onClick={() => pagination.onPageChange(pageNum)}
                              className={`px-3 py-1 rounded ${pagination.page === pageNum
                                    ? 'bg-indigo-600 text-white'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                 }`}
                           >
                              {pageNum}
                           </button>
                        );
                     })}
                  </div>

                  {/* Next Page */}
                  <button
                     onClick={() => pagination.onPageChange(pagination.page + 1)}
                     disabled={pagination.page === pagination.totalPages}
                     className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                     title="Página siguiente"
                  >
                     <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Last Page */}
                  <button
                     onClick={() => pagination.onPageChange(pagination.totalPages)}
                     disabled={pagination.page === pagination.totalPages}
                     className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                     title="Última página"
                  >
                     <ChevronsRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
