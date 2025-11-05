import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download } from 'lucide-react';
import { format, startOfMonth } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';

import { auditApi } from '@/api/audit';
import { DataTable, Column } from '@/components/DataTable';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { DatePicker } from '@/components/ui';
import type { AuditLog } from '@/types';

export function AuditPage() {
   const { userId: userIdParam } = useParams<{ userId: string }>();
   const navigate = useNavigate();

   const [activeTab, setActiveTab] = useState<'backoffice' | 'provider'>('backoffice');
   const [actionFilter, setActionFilter] = useState('');
   const [page, setPage] = useState(1);

   // Filtros de fecha: primer día del mes hasta hoy
   const [fromDate, setFromDate] = useState<string>(
      format(startOfMonth(new Date()), 'yyyy-MM-dd')
   );
   const [toDate, setToDate] = useState<string>(
      format(new Date(), 'yyyy-MM-dd')
   );

   // Query para logs de backoffice
   const { data: backofficeData, isLoading: isLoadingBackoffice } = useQuery({
      queryKey: ['audit', 'backoffice', actionFilter, page, fromDate, toDate, userIdParam],
      queryFn: () =>
         auditApi.getBackofficeLogs({
            userId: userIdParam,
            action: actionFilter || undefined,
            startDate: fromDate ? `${fromDate}T00:00:00Z` : undefined,
            endDate: toDate ? `${toDate}T23:59:59Z` : undefined,
            page,
            pageSize: 50,
         }),
      enabled: activeTab === 'backoffice',
   });

   // Query para logs de providers
   const { data: providerData, isLoading: isLoadingProvider } = useQuery({
      queryKey: ['audit', 'provider', actionFilter, page],
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
               <div className="text-gray-500 dark:text-gray-400">{format(new Date(log.createdAt), 'HH:mm:ss')}</div>
            </div>
         ),
      },
      {
         key: 'username',
         header: 'Usuario',
         render: (log) => (
            <div>
               <button
                  onClick={() => navigate(`/audit/${log.userId}`)}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
               >
                  {log.username}
               </button>
               <div className="text-xs text-gray-500 dark:text-gray-400">{log.userRole}</div>
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
         render: (log) => (
            <span className="text-sm text-gray-700 dark:text-gray-300">{log.targetType}</span>
         ),
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
            <div className="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
               {log.meta ? JSON.stringify(log.meta).substring(0, 60) + '...' : '-'}
            </div>
         ),
      },
   ];

   return (
      <PermissionGuard permission={Permission.AUDIT_READ}>
         <div className="space-y-6">
            {/* Header */}
            <div className="pb-4 border-b border-default">
               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                     <div className="flex items-center">
                        <FileText className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-brand-primary flex-shrink-0" />
                        <h1 className="text-2xl md:text-3xl font-bold text-primary">
                           Auditoría {userIdParam && '- Usuario Específico'}
                        </h1>
                     </div>
                     <p className="text-sm md:text-base text-secondary mt-1">
                        {userIdParam
                           ? `Mostrando registros del usuario: ${userIdParam}`
                           : 'Visualiza el historial de acciones del sistema'}
                     </p>
                     {userIdParam && (
                        <button
                           onClick={() => navigate('/audit')}
                           className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center"
                        >
                           ← Volver a todos los registros
                        </button>
                     )}
                  </div>
                  <PermissionGuard permission={Permission.AUDIT_EXPORT}>
                     <button
                        onClick={() => {
                           // TODO: Implementar exportación
                           alert('Exportación en desarrollo');
                        }}
                        className="flex items-center justify-center px-4 py-2 bg-status-success text-white rounded-lg hover:opacity-90 transition-all whitespace-nowrap"
                     >
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Exportar CSV
                     </button>
                  </PermissionGuard>
               </div>
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
            <div className="bg-secondary p-4 rounded-lg border border-default space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Filtro de acción */}
                  <div>
                     <label className="block text-sm font-medium text-secondary mb-1">
                        Acción
                     </label>
                     <input
                        type="text"
                        placeholder="Ej: CREATE_USER"
                        value={actionFilter}
                        onChange={(e) => {
                           setActionFilter(e.target.value);
                           setPage(1);
                        }}
                        className="w-full px-4 py-2 border border-default rounded-lg bg-tertiary text-primary focus:ring-2 focus:ring-brand-primary"
                     />
                  </div>

                  {/* Fecha desde */}
                  <DatePicker
                     label="Desde"
                     value={fromDate}
                     onChange={(value) => {
                        setFromDate(value);
                        setPage(1);
                     }}
                     placeholder="Fecha inicio"
                     maxDate={toDate || undefined}
                  />

                  {/* Fecha hasta */}
                  <DatePicker
                     label="Hasta"
                     value={toDate}
                     onChange={(value) => {
                        setToDate(value);
                        setPage(1);
                     }}
                     placeholder="Fecha fin"
                     minDate={fromDate || undefined}
                  />

                  {/* Botón limpiar filtros */}
                  <div className="flex items-end">
                     <button
                        onClick={() => {
                           setActionFilter('');
                           setFromDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
                           setToDate(format(new Date(), 'yyyy-MM-dd'));
                           setPage(1);
                        }}
                        className="w-full px-4 py-2 border border-default rounded-lg bg-tertiary text-secondary hover:bg-surface-hover transition-colors"
                     >
                        Limpiar Filtros
                     </button>
                  </div>
               </div>
            </div>

            {/* Table */}
            {activeTab === 'backoffice' && (
               <DataTable
                  data={backofficeData?.data || []}
                  columns={backofficeColumns}
                  keyExtractor={(log) => log.id}
                  isLoading={isLoadingBackoffice}
                  emptyMessage="No se encontraron registros de auditoría"
                  pagination={
                     backofficeData
                        ? {
                           page: backofficeData.page,
                           pageSize: backofficeData.pageSize,
                           totalCount: backofficeData.totalCount,
                           totalPages: backofficeData.totalPages,
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
