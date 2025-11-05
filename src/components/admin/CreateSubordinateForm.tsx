import { useState } from 'react';
import { useAuthStore } from '@/store';
import { apiClient } from '@/api/client';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import toast from 'react-hot-toast';
import { Modal } from '@/components/Modal';

interface FormData {
   username: string;
   password: string;
   commissionRate: number;
}

interface CreateSubordinateFormProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
}

export const CreateSubordinateForm = ({ isOpen, onClose, onSuccess }: CreateSubordinateFormProps) => {
   const { user } = useAuthStore();
   const { handleFormError } = useApiErrorHandler();
   const [formData, setFormData] = useState<FormData>({
      username: '',
      password: '',
      commissionRate: 0
   });
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});

   const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      if (!formData.username.trim()) {
         newErrors.username = 'El username es requerido';
      } else if (formData.username.length < 3) {
         newErrors.username = 'El username debe tener al menos 3 caracteres';
      } else if (formData.username.length > 50) {
         newErrors.username = 'El username no puede tener más de 50 caracteres';
      } else if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
         newErrors.username = 'El username solo puede contener letras, números, guiones y puntos';
      }

      if (!formData.password.trim()) {
         newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
         newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (formData.commissionRate < 0 || formData.commissionRate > 100) {
         newErrors.commissionRate = 'La comisión debe estar entre 0 y 100%';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      if (!user) {
         toast.error('No hay usuario autenticado');
         return;
      }

      setLoading(true);

      try {
         // Con la nueva API transparente, no necesitamos enviar operatorId
         // Se resuelve automáticamente del contexto
         const response = await apiClient.post('/admin/users', {
            username: formData.username,
            password: formData.password,
            role: 'CASHIER',
            parentCashierId: user.id,
            commissionRate: formData.commissionRate
         });

         toast.success(`Cashier "${response.data.username}" creado exitosamente`);
         onSuccess();
         handleClose();
      } catch (err: any) {
         handleFormError(err, 'Create Subordinate');

         // Si es error de username duplicado, marcarlo en el campo específico
         const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || '';
         if (errorMessage.toLowerCase().includes('username') || errorMessage.toLowerCase().includes('already exists')) {
            setErrors({ username: 'Este username ya está en uso' });
         }
      } finally {
         setLoading(false);
      }
   };

   const handleClose = () => {
      setFormData({ username: '', password: '', commissionRate: 0 });
      setErrors({});
      onClose();
   };

   return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Crear Cashier Subordinado">
         <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
               <strong>Jerarquía:</strong> El nuevo cashier será subordinado tuyo y podrá crear sus propios subordinados.
            </p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="username" className="block text-sm font-medium text-secondary">
                  Username *
               </label>
               <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-tertiary text-primary ${errors.username ? 'border-status-error-border' : 'border-default'
                     }`}
                  placeholder="ej: cashier_juan"
                  disabled={loading}
               />
               {errors.username && (
                  <p className="mt-1 text-sm text-status-error-text">{errors.username}</p>
               )}
            </div>

            <div>
               <label htmlFor="password" className="block text-sm font-medium text-secondary">
                  Contraseña *
               </label>
               <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-tertiary text-primary ${errors.password ? 'border-status-error-border' : 'border-default'
                     }`}
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
               />
               {errors.password && (
                  <p className="mt-1 text-sm text-status-error-text">{errors.password}</p>
               )}
            </div>

            <div>
               <label htmlFor="commissionRate" className="block text-sm font-medium text-secondary">
                  Comisión (%) - Opcional
               </label>
               <input
                  id="commissionRate"
                  type="number"
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm bg-tertiary text-primary ${errors.commissionRate ? 'border-status-error-border' : 'border-default'
                     }`}
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="0.0"
                  disabled={loading}
               />
               <p className="mt-1 text-xs text-tertiary">
                  Porcentaje de comisión que recibirás de las operaciones de este subordinado (0-100%)
               </p>
               {errors.commissionRate && (
                  <p className="mt-1 text-sm text-status-error">{errors.commissionRate}</p>
               )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
               <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-secondary hover:text-primary disabled:opacity-50"
               >
                  Cancelar
               </button>
               <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-brand-secondary hover:opacity-90 disabled:opacity-50 text-white rounded-lg flex items-center transition-all"
               >
                  {loading ? (
                     <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creando...
                     </>
                  ) : (
                     '🏗️ Crear Cashier'
                  )}
               </button>
            </div>
         </form>
      </Modal>
   );
};