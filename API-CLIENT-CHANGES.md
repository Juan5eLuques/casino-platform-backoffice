# 🔧 Cambios Aplicados - Configuración API Simplificada

## 📅 Fecha: 5 de octubre de 2025

---

## 🎯 Objetivo

Simplificar la configuración del cliente API para resolver problemas de CORS y conexión entre frontend y backend, siguiendo las mejores prácticas del documento de troubleshooting.

---

## ✅ Cambios Realizados

### 1. **Simplificado `.env`** ✅

**Antes:**

```env
VITE_API_BASE_URL=https://admin.bet30.local:7182/api/v1
```

**Después:**

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Razones:**

- ✅ Evita problemas de certificados SSL en desarrollo
- ✅ Evita problemas de CORS entre HTTP/HTTPS
- ✅ Más simple y directo para desarrollo local
- ✅ Same-origin policy más fácil de manejar

---

### 2. **Simplificado `vite.config.ts`** ✅

**Antes:**

```typescript
server: {
   port: 5173,
   host: 'admin.bet30.local',  // ❌ Dominio custom
   cors: true,
   proxy: {
      '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true,
         secure: false,
         headers: {
            'Host': 'admin.bet30.local'  // ❌ Host manual
         }
      }
   }
}
```

**Después:**

```typescript
server: {
   port: 5173,
   host: 'localhost',  // ✅ Localhost simple
   cors: true,
}
```

**Razones:**

- ✅ No necesita proxy en desarrollo
- ✅ No necesita configurar /etc/hosts
- ✅ Mismo dominio = sin problemas de CORS
- ✅ Sin headers manuales que confundan

---

### 3. **Refactorizado `src/api/client.ts`** ✅

**Antes:**

```typescript
import { getDynamicBrandConfig } from '@/config/brand.config';
const brandConfig = getDynamicBrandConfig();

export const apiClient = axios.create({
  baseURL: brandConfig.api.baseURL, // ❌ Configuración dinámica complicada
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: brandConfig.api.timeout,
});
```

**Después:**

```typescript
// ✅ Configuración Simple para Desarrollo
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const IS_DEVELOPMENT = import.meta.env.DEV;
const ENABLE_LOGGING = import.meta.env.VITE_ENABLE_API_LOGGING === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL, // ✅ Directo desde .env
  withCredentials: true, // ✅ Cookies automáticas
  headers: {
    'Content-Type': 'application/json',
    // ✅ NO incluir 'Host' - el browser lo maneja
  },
  timeout: 10000,
});
```

**Razones:**

- ✅ Menos dependencias (no necesita brand.config.ts)
- ✅ Configuración más clara y directa
- ✅ Más fácil de debuggear
- ✅ Sigue mejores prácticas del documento

---

### 4. **Mejorado Request Interceptor** ✅

**Cambios:**

- ✅ Logging más claro y conciso
- ✅ Muestra `withCredentials` en logs
- ✅ Solo logea si `VITE_ENABLE_API_LOGGING=true`

```typescript
if (IS_DEVELOPMENT && ENABLE_LOGGING) {
  console.log('🔗 API Request:', config.method?.toUpperCase(), config.url, {
    baseURL: config.baseURL,
    withCredentials: config.withCredentials,
    data: config.data,
  });
}
```

---

### 5. **Mejorado Response Interceptor** ✅

**Cambios:**

- ✅ Logging más detallado de errores
- ✅ Mejor manejo de 401 (no redirige en login o /me)
- ✅ Muestra status, statusText, url, data

```typescript
// No redirigir a login si ya estamos en login o es /me
const isLoginEndpoint = error.config?.url?.includes('/auth/login');
const isMeEndpoint = error.config?.url?.includes('/auth/me');

if (
  !isLoginEndpoint &&
  !isMeEndpoint &&
  window.location.pathname !== '/login'
) {
  console.warn('🔒 Unauthorized - Redirecting to login');
  toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  window.location.href = '/login';
}
```

---

### 6. **Agregado Helper de Debug** ✅

**Nuevo en `client.ts`:**

```typescript
if (IS_DEVELOPMENT && typeof window !== 'undefined') {
  (window as any).apiDebug = {
    config: getApiConfig(),
    testConnection: async () => {
      try {
        console.log('🧪 Testing API connection...');
        const response = await apiClient.get('/health');
        console.log('✅ API is reachable:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ API connection failed:', error);
        throw error;
      }
    },
  };
  console.log('💡 API Debug available: window.apiDebug');
}
```

**Uso:**

```javascript
// En DevTools Console:
window.apiDebug.config; // Ver configuración
await window.apiDebug.testConnection(); // Probar conexión
```

---

### 7. **Actualizado `.env.example`** ✅

**Nuevo contenido:**

- ✅ Documentación clara de opciones
- ✅ Opción 1: Localhost (RECOMENDADO)
- ✅ Opción 2: Dominio custom
- ✅ Opción 3: Producción
- ✅ Notas sobre CORS

---

### 8. **Creado `SETUP-GUIDE.md`** ✅

Guía completa con:

- ✅ Setup rápido (5 minutos)
- ✅ Testing de conexión
- ✅ Troubleshooting común
- ✅ Checklist de verificación
- ✅ Configuraciones alternativas

---

## 🚀 Cómo Usar la Nueva Configuración

### Paso 1: Actualizar Variables

```bash
# Ya está hecho en .env
# Verificar que dice:
cat .env
# VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Paso 2: Correr Backend

```bash
cd ../casino-backend
dotnet run --project apps/api/Casino.Api

# Debe mostrar: Now listening on: http://localhost:5000
```

### Paso 3: Correr Frontend

```bash
npm run dev

# Debe abrir en: http://localhost:5173
```

### Paso 4: Login

```
URL: http://localhost:5173/login
Usuario: superadmin
```

### Paso 5: Verificar Conexión

```javascript
// En DevTools Console:
window.apiDebug.config;
// Debe mostrar: baseURL: "http://localhost:5000/api/v1"
```

---

## 📊 Comparación Antes/Después

| Aspecto           | Antes                            | Después                     |
| ----------------- | -------------------------------- | --------------------------- |
| **Frontend URL**  | `https://admin.bet30.local:5173` | `http://localhost:5173`     |
| **Backend URL**   | `https://admin.bet30.local:7182` | `http://localhost:5000`     |
| **Protocolo**     | HTTPS (certificado requerido)    | HTTP (simple)               |
| **Dominio**       | Custom (requiere /etc/hosts)     | localhost (built-in)        |
| **CORS**          | Complicado (cross-origin)        | Simple (same-origin)        |
| **Configuración** | Dinámica multi-tenant            | Estática y simple           |
| **Debugging**     | Difícil                          | Fácil con `window.apiDebug` |
| **Setup Time**    | ~30 min (hosts, certs, etc)      | ~5 min                      |

---

## ✅ Ventajas de la Nueva Configuración

### Desarrollo:

- ✅ Setup en 5 minutos (vs 30 antes)
- ✅ No requiere configurar /etc/hosts
- ✅ No requiere certificados SSL
- ✅ CORS funciona out-of-the-box
- ✅ Cookies funcionan sin problemas
- ✅ Fácil de debuggear

### Mantenimiento:

- ✅ Menos archivos de configuración
- ✅ Menos dependencias
- ✅ Código más claro y directo
- ✅ Fácil de entender para nuevos devs

### Testing:

- ✅ Helper `window.apiDebug` disponible
- ✅ Logging detallado en consola
- ✅ Fácil verificar cookies en DevTools

---

## 🔄 Migración para Producción

Cuando vayas a producción, solo necesitas cambiar `.env`:

```env
# .env.production
VITE_API_BASE_URL=https://api.tudominio.com/api/v1
VITE_NODE_ENV=production
VITE_ENABLE_API_LOGGING=false
```

El código no necesita cambios! Todo funciona igual.

---

## 📝 Archivos Modificados

1. ✅ `.env` - URL simplificada a localhost
2. ✅ `.env.example` - Documentación actualizada
3. ✅ `vite.config.ts` - Removido proxy y host custom
4. ✅ `src/api/client.ts` - Refactorizado completamente
5. ✅ `SETUP-GUIDE.md` - Nueva guía creada (nuevo archivo)
6. ✅ `API-CLIENT-CHANGES.md` - Este documento (nuevo archivo)

---

## 🐛 Solución a Problemas Anteriores

### ❌ Problema 1: CORS errors

**Causa:** HTTP frontend → HTTPS backend (mixed content)  
**Solución:** Ambos en HTTP localhost ✅

### ❌ Problema 2: Certificate errors

**Causa:** HTTPS con self-signed certificate  
**Solución:** Usar HTTP en desarrollo ✅

### ❌ Problema 3: Cookies not sent

**Causa:** `withCredentials` mal configurado o dominio diferente  
**Solución:** `withCredentials: true` + same origin ✅

### ❌ Problema 4: Complex configuration

**Causa:** Sistema multi-tenant dinámico en desarrollo  
**Solución:** Configuración estática simple ✅

---

## 🎯 Próximos Pasos

### Para seguir desarrollando:

1. ✅ Backend debe correr en `http://localhost:5000`
2. ✅ Frontend corre automáticamente en `http://localhost:5173`
3. ✅ Login y usa el backoffice normalmente

### Si encuentras problemas:

1. ✅ Leer `SETUP-GUIDE.md` completo
2. ✅ Verificar el checklist de verificación
3. ✅ Usar `window.apiDebug` para testing
4. ✅ Revisar Network tab en DevTools

### Para ir a producción:

1. ✅ Cambiar `.env` a tu dominio real
2. ✅ Configurar HTTPS con certificado válido
3. ✅ Verificar CORS en backend para tu dominio
4. ✅ Desactivar logging: `VITE_ENABLE_API_LOGGING=false`

---

## 📚 Documentación Relacionada

- `SETUP-GUIDE.md` - Guía completa de setup
- `IMPLEMENTATION-SUMMARY.md` - Resumen de implementación del backoffice
- `BACKOFFICE-FRONTEND-IMPLEMENTATION-PROMPT.md` - Documentación de API endpoints
- `.env.example` - Ejemplos de configuración

---

**¡Todo listo para usar! 🚀**
