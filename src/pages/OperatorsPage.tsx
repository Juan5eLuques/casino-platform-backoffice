import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { operatorsApi } from '@/api/operators';
import { DataTable, Column } from '@/components/DataTable';
import { Modal } from '@/components/Modal';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Permission } from '@/lib/permissions';
import type { Operator } from '@/types';

const operatorSchema = z.object({
   name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
   taxId: z.string().optional(),
   status: z.enum(['ACTIVE', 'INACTIVE']),
});

type OperatorFormData = {
   name: string;
   taxId?: string;
   status: 'ACTIVE' | 'INACTIVE';
};

export function OperatorsPage() {
   const queryClient = useQueryClient();

   const [search, setSearch] = useState('');
   const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | 'ALL'>('ALL');
   const [page, setPage] = useState(1);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

   // Query para listar operadores
   const { data, isLoading } = useQuery({
      queryKey: ['operators', search, statusFilter, page],
      queryFn: () =>
         operatorsApi.getOperators({
            name: search || undefined,
            status: statusFilter === 'ALL' ? undefined : statusFilter,
            page,
            limit: 20,
         }),
   });

   // Mutation para crear
   const createMutation = useMutation({
      mutationFn: operatorsApi.createOperator,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['operators'] });
         toast.success('Operador creado exitosamente');
         setIsCreateModalOpen(false);
      },
      onError: () => {
         toast.error('Error al crear operador');
      },
   });

   // Mutation para actualizar
   const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
         operatorsApi.updateOperator(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['operators'] });
         toast.success('Operador actualizado exitosamente');
         setEditingOperator(null);
      },
      onError: () => {
         toast.error('Error al actualizar operador');
      },
   });

   // Mutation para eliminar
   const deleteMutation = useMutation({
      mutationFn: operatorsApi.deleteOperator,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['operators'] });
         toast.success('Operador eliminado exitosamente');
      },
      onError: () => {
         toast.error('Error al eliminar operador');
      },
   });

   const handleDelete = (id: string, name: string) => {
      if (window.confirm(`¿Estás seguro de eliminar el operador "${name}"?`)) {
         deleteMutation.mutate(id);
      }
   };

   const columns: Column<Operator>[] = [
      {
         key: 'name',
         header: 'Nombre',
         sortable: true,
         render: (operator) => (
            <div className="flex items-center">
               <Building2 className="w-5 h-5 text-gray-400 mr-2" />
               <span className="font-medium">{operator.name}</span>
            </div>
         ),
      },
      {
         key: 'taxId',
         header: 'Tax ID',
         render: (operator) => operator.taxId || '-',
      },
      {
         key: 'status',
         header: 'Estado',
         sortable: true,
         render: (operator) => (
            <span
               className={`px-2 py-1 rounded-full text-xs font-medium ${operator.status === 'ACTIVE'
                     ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                     : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
            >
               {operator.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
         ),
      },
      {
         key: 'brandsCount',
         header: 'Brands',
         render: (operator) => (
            <span className="text-gray-600 dark:text-gray-400">
               {operator.brandsCount || 0}
            </span>
         ),
      },
      {
         key: 'usersCount',
         header: 'Usuarios',
         render: (operator) => (
            <span className="text-gray-600 dark:text-gray-400">
               {operator.usersCount || 0}
            </span>
         ),
      },
      {
         key: 'createdAt',
         header: 'Creado',
         sortable: true,
         render: (operator) => new Date(operator.createdAt).toLocaleDateString(),
      },
   ];

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Operadores</h1>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                     Gestiona los operadores de la plataforma
                  </p>
               </div>
               <PermissionGuard permission={Permission.OPERATOR_CREATE}>
                  <button
                     onClick={() => setIsCreateModalOpen(true)}
                     className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                     <Plus className="w-5 h-5 mr-2" />
                     Crear Operador
                  </button>
               </PermissionGuard>
            </div>
         </div>

         {/* Filters */}
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
               <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={search}
                  onChange={(e) => {
                     setSearch(e.target.value);
                     setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
               />
            </div>
            <select
               value={statusFilter}
               onChange={(e) => {
                  setStatusFilter(e.target.value as 'ACTIVE' | 'INACTIVE' | 'ALL');
                  setPage(1);
               }}
               className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
               <option value="ALL">Todos los estados</option>
               <option value="ACTIVE">Activo</option>
               <option value="INACTIVE">Inactivo</option>
            </select>
         </div>

         {/* Table */}
         <DataTable
            data={data?.data || []}
            columns={columns}
            keyExtractor={(operator) => operator.id}
            isLoading={isLoading}
            emptyMessage="No se encontraron operadores"
            pagination={
               data?.pagination
                  ? {
                     page,
                     pageSize: data.pagination.limit,
                     totalCount: data.pagination.total,
                     totalPages: data.pagination.pages,
                     onPageChange: setPage,
                  }
                  : undefined
            }
            actions={(operator) => (
               <>
                  <PermissionGuard permission={Permission.OPERATOR_UPDATE}>
                     <button
                        onClick={() => setEditingOperator(operator)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Editar"
                     >
                        <Edit className="w-5 h-5" />
                     </button>
                  </PermissionGuard>
                  <PermissionGuard permission={Permission.OPERATOR_DELETE}>
                     <button
                        onClick={() => handleDelete(operator.id, operator.name)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </PermissionGuard>
               </>
            )}
         />

         {/* Create Modal */}
         <OperatorModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
         />

         {/* Edit Modal */}
         {editingOperator && (
            <OperatorModal
               isOpen={true}
               onClose={() => setEditingOperator(null)}
               onSubmit={(data) =>
                  updateMutation.mutate({ id: editingOperator.id, data })
               }
               isLoading={updateMutation.isPending}
               initialData={editingOperator}
               isEdit
            />
         )}
      </div>
   );
}

// Componente Modal de Formulario
interface OperatorModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: OperatorFormData) => void;
   isLoading: boolean;
   initialData?: Operator;
   isEdit?: boolean;
}

function OperatorModal({
   isOpen,
   onClose,
   onSubmit,
   isLoading,
   initialData,
   isEdit = false,
}: OperatorModalProps) {
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<OperatorFormData>({
      resolver: zodResolver(operatorSchema),
      defaultValues: initialData ? {
         name: initialData.name,
         taxId: initialData.taxId || '',
         status: (initialData.status as any) || 'ACTIVE',
      } : {
         name: '',
         taxId: '',
         status: 'ACTIVE',
      },
   });

   const handleFormSubmit = (data: OperatorFormData) => {
      onSubmit(data);
      reset();
   };

   const handleClose = () => {
      reset();
      onClose();
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={handleClose}
         title={isEdit ? 'Editar Operador' : 'Crear Operador'}
         size="md"
      >
         <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-4">
            {/* Name */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre <span className="text-red-500">*</span>
               </label>
               <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre del operador"
               />
               {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
               )}
            </div>

            {/* Tax ID */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax ID (opcional)
               </label>
               <input
                  {...register('taxId')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="123456789"
               />
            </div>

            {/* Status */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado <span className="text-red-500">*</span>
               </label>
               <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
               >
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
               </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
               <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={isLoading}
               >
                  Cancelar
               </button>
               <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
               >
                  {isLoading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
               </button>
            </div>
         </form>
      </Modal>
   );
}
