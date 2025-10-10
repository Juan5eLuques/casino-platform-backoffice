import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook para manejar errores específicos de la API transparente
 * Maneja los nuevos códigos de error y proporciona mensajes apropiados
 */
export function useApiErrorHandler() {
   const handleError = useCallback((error: any) => {
      console.error('API Error:', error);

      // Errores específicos de la nueva API transparente
      if (error.status === 400) {
         if (error.detail?.includes('Brand Not Resolved')) {
            toast.error('Error de contexto de marca. Por favor recarga la página.');
            setTimeout(() => window.location.reload(), 2000);
            return;
         }
      }

      if (error.status === 403) {
         toast.error('No tienes permisos para realizar esta acción.');
         return;
      }

      if (error.status === 404) {
         if (error.detail?.includes('access denied')) {
            toast.error('Recurso no encontrado o acceso denegado.');
            return;
         }
         toast.error('Recurso no encontrado.');
         return;
      }

      if (error.status === 401) {
         toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
         // Redirigir al login después de un breve delay
         setTimeout(() => {
            window.location.href = '/login';
         }, 2000);
         return;
      }

      // Errores de validación (422)
      if (error.status === 422) {
         if (error.errors && Array.isArray(error.errors)) {
            error.errors.forEach((err: any) => {
               toast.error(err.message || 'Error de validación');
            });
         } else {
            toast.error('Error de validación en los datos enviados.');
         }
         return;
      }

      // Errores de servidor
      if (error.status >= 500) {
         toast.error('Error interno del servidor. Por favor intenta más tarde.');
         return;
      }

      // Errores de red
      if (!error.status && error.message?.includes('fetch')) {
         toast.error('Error de conexión. Verifica tu conexión a internet.');
         return;
      }

      // Error genérico
      toast.error(error.message || 'Ha ocurrido un error inesperado.');
   }, []);

   /**
    * Wrapper para mutations que incluye manejo automático de errores
    */
   const withErrorHandling = useCallback(<T extends any[], R>(
      asyncFn: (...args: T) => Promise<R>
   ) => {
      return async (...args: T): Promise<R> => {
         try {
            return await asyncFn(...args);
         } catch (error) {
            handleError(error);
            throw error; // Re-throw para que el componente pueda manejar el estado de error
         }
      };
   }, [handleError]);

   /**
    * Maneja errores de formularios específicos
    */
   const handleFormError = useCallback((error: any, formType: string) => {
      console.error(`${formType} Form Error:`, error);

      if (error.status === 400) {
         if (error.detail?.includes('Username already exists')) {
            toast.error('El nombre de usuario ya está en uso.');
            return;
         }
         if (error.detail?.includes('Email already exists')) {
            toast.error('El email ya está registrado.');
            return;
         }
         if (error.detail?.includes('Brand Not Resolved')) {
            toast.error('Error al resolver la marca. Verifica el contexto de la aplicación.');
            return;
         }
      }

      // Usar el manejo de errores genérico para otros casos
      handleError(error);
   }, [handleError]);

   return {
      handleError,
      withErrorHandling,
      handleFormError,
   };
}

export default useApiErrorHandler;