import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

import { auditApi } from '@/api/audit';
import { DataTable, Column } from '@/components/DataTable';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Permission } from '@/lib/permissions';
import type { AuditLog } from '@/types';

export function AuditPage() {
   const [activeTab, setActiveTab] = useState<'backoffice' | 'provider'>('backoffice');
   const [search, setSearch] = useState('');
   const [actionFilter, setActionFilter] = useState('');
   const [page, setPage] = useState(1);

   // Query para logs de backoffice
   const { data: backofficeData, isLoading: isLoadingBackoffice } = useQuery({
      queryKey: ['audit', 'backoffice', search, actionFilter, page],
      queryFn: () =>
         auditApi.getBackofficeLogs({
            action: actionFilter || undefined,
            page,
            pageSize: 50,
         }),
      enabled: activeTab === 'backoffice',
   });

   // Query para logs de providers
   const { data: providerData, isLoading: isLoadingProvider } = useQuery({
      queryKey: ['audit', 'provider', search, actionFilter, page],
      queryFn: () =>
         auditApi.getProviderLogs({
            action: actionFilter || undefined,
            page,
            pageSize: 50,
         }),
      enabled: activeTab === 'provider',
   });

   const backofficeColumns: Column<AuditLog>[] = [
      {
         key: 'createdAt',
         header: 'Fecha',
         sortable: true,
         render: (log) => (
            <div className="text-sm">
               <div>{format(new Date(log.createdAt), 'dd/MM/yyyy')}</div>
               <div className="text-gray-500">{format(new Date(log.createdAt), 'HH:mm:ss')}</div>
            </div>
         ),
      },
      {
         key: 'user',
         header: 'Usuario',
         render: (log) => (
            <div>
               <div className="font-medium">{log.user.username}</div>
               <div className="text-xs text-gray-500">{log.user.role}</div>
            </div>
         ),
      },
      {
         key: 'action',
         header: 'Acción',
         sortable: true,
         render: (log) => (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
               {log.action}
            </span>
         ),
      },
      {
         key: 'targetType',
         header: 'Tipo',
         render: (log) => log.targetType,
      },
      {
         key: 'targetId',
         header: 'Target ID',
         render: (log) => (
            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
               {log.targetId.substring(0, 8)}...
            </span>
         ),
      },
      {
         key: 'meta',
         header: 'Detalles',
         render: (log) => (
            <div className="text-xs text-gray-600 dark:text-gray-400">
               {log.meta ? JSON.stringify(log.meta).substring(0, 50) + '...' : '-'}
            </div>
         ),
      },
   ];

   return (
      <PermissionGuard permission={Permission.AUDIT_READ}>
         <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                     <FileText className="w-8 h-8 mr-3" />
                     Auditoría
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Visualiza el historial de acciones del sistema
                  </p>
               </div>
               <PermissionGuard permission={Permission.AUDIT_EXPORT}>
                  <button
                     onClick={() => {
                        // TODO: Implementar exportación
                        alert('Exportación en desarrollo');
                     }}
                     className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                     <Download className="w-5 h-5 mr-2" />
                     Exportar CSV
                  </button>
               </PermissionGuard>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
               <nav className="-mb-px flex space-x-8">
                  <button
                     onClick={() => {
                        setActiveTab('backoffice');
                        setPage(1);
                     }}
                     className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'backoffice'
                           ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                           : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                  >
                     Backoffice
                  </button>
                  <button
                     onClick={() => {
                        setActiveTab('provider');
                        setPage(1);
                     }}
                     className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'provider'
                           ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                           : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                  >
                     Providers
                  </button>
               </nav>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                     type="text"
                     placeholder="Buscar en logs..."
                     value={search}
                     onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                     }}
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
               </div>
               <input
                  type="text"
                  placeholder="Filtrar por acción..."
                  value={actionFilter}
                  onChange={(e) => {
                     setActionFilter(e.target.value);
                     setPage(1);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
               />
            </div>

            {/* Table */}
            {activeTab === 'backoffice' && (
               <DataTable
                  data={(backofficeData?.data as AuditLog[]) || []}
                  columns={backofficeColumns}
                  keyExtractor={(log) => log.id}
                  isLoading={isLoadingBackoffice}
                  emptyMessage="No se encontraron registros de auditoría"
                  pagination={
                     backofficeData?.pagination
                        ? {
                           page,
                           pageSize: backofficeData.pagination.limit,
                           totalCount: backofficeData.pagination.total,
                           totalPages: backofficeData.pagination.pages,
                           onPageChange: setPage,
                        }
                        : undefined
                  }
               />
            )}
            {activeTab === 'provider' && (
               <DataTable
                  data={(providerData?.data as any) || []}
                  columns={backofficeColumns as any}
                  keyExtractor={(log: any) => log.id}
                  isLoading={isLoadingProvider}
                  emptyMessage="No se encontraron registros de providers"
                  pagination={
                     providerData?.pagination
                        ? {
                           page,
                           pageSize: providerData.pagination.limit,
                           totalCount: providerData.pagination.total,
                           totalPages: providerData.pagination.pages,
                           onPageChange: setPage,
                        }
                        : undefined
                  }
               />
            )}
         </div>
      </PermissionGuard>
   );
}
