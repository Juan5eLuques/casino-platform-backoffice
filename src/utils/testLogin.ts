import { apiClient } from '../api/client';

// Función para hacer login automático según especificaciones
export const testAdminLogin = async () => {
   try {
      console.log('🔑 Intentando login automático...');

      // authApi.login(credentials) solo hace POST y no usa el body de respuesta
      // La cookie la maneja el navegador automáticamente
      const response = await apiClient.post('/admin/auth/login', {
         username: 'admin@bet30.local',
         password: 'Admin123!'
      });

      console.log('✅ Login exitoso (cookie manejada por navegador):', response.data);

      // Después del login, llamar a /admin/auth/me para poblar el usuario
      const userResponse = await apiClient.get('/admin/auth/me');
      console.log('👤 Usuario obtenido:', userResponse.data);

      // Verificar que la cookie se estableció
      console.log('🍪 Cookies después del login:', document.cookie);

      return userResponse.data;
   } catch (error: any) {
      console.error('❌ Error en login:', {
         status: error.response?.status,
         data: error.response?.data,
         message: error.message
      });
      throw error;
   }
};

// Función para verificar si hay una sesión activa
export const checkActiveSession = async () => {
   try {
      console.log('🔍 Verificando sesión activa...');
      console.log('🍪 Cookies actuales:', document.cookie);

      const response = await apiClient.get('/admin/operators?page=1&limit=5');
      console.log('✅ Sesión activa confirmada:', response.data);
      return true;
   } catch (error: any) {
      console.error('❌ No hay sesión activa:', {
         status: error.response?.status,
         data: error.response?.data
      });
      return false;
   }
};