# 🔧 CÓDIGO DE REFERENCIA: AXIOS + COOKIES

## 📌 Tu configuración actual (YA CORRECTA)

### src/api/client.ts - Instancia Global de Axios

```typescript
import axios from 'axios';

// ✅ Configuración correcta con withCredentials
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // ✅ Envía cookies automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor de Request (logging)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_ENABLE_API_LOGGING === 'true') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ✅ Interceptor de Response (manejo de errores)
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_ENABLE_API_LOGGING === 'true') {
      console.log(`[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // ✅ Manejo inteligente de 401
    if (status === 401) {
      // No redirigir si estamos en login o consultando /me
      if (!url.includes('/auth/login') && !url.includes('/auth/me')) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }

    // ✅ Notificaciones de error
    if (status === 403) {
      toast.error('No tienes permisos para realizar esta acción');
    } else if (status === 500) {
      toast.error('Error del servidor. Intenta nuevamente.');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Error de conexión. Verifica tu red.');
    }

    return Promise.reject(error);
  }
);

// ✅ Helper para debugging
if (import.meta.env.DEV) {
  window.apiDebug = () => {
    console.log('API Client Configuration:', {
      baseURL: apiClient.defaults.baseURL,
      withCredentials: apiClient.defaults.withCredentials,
      timeout: apiClient.defaults.timeout,
      headers: apiClient.defaults.headers,
    });
  };
}
```

**✅ NO CAMBIES NADA EN ESTE ARCHIVO - ESTÁ PERFECTO**

---

## 📌 src/api/auth.ts - Endpoints de Autenticación

```typescript
import { apiClient } from './client';

// ✅ Login - Backend responde con Set-Cookie
export const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.post('/admin/auth/login', credentials);
  return response.data; // Backend envía cookie automáticamente
};

// ✅ GetMe - Usa cookie automáticamente
export const getMe = async () => {
  const response = await apiClient.get('/admin/auth/me');
  return response.data;
};

// ✅ Logout - Backend elimina cookie
export const logout = async () => {
  await apiClient.post('/admin/auth/logout');
};
```

**✅ NO CAMBIES NADA - USA LA COOKIE AUTOMÁTICAMENTE**

---

## 📌 src/store/auth.ts - Estado Global con Zustand

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '@/api/auth';

interface AuthState {
  // Estado
  user: AuthUser | null;
  isAuthenticated: boolean;
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

// ✅ Store con persist
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      // ✅ Login: Backend envía cookie automáticamente
      login: async (credentials) => {
        const response = await authApi.login(credentials);
        
        set({
          user: response.user,
          isAuthenticated: true,
        });
        
        // Cargar marcas disponibles
        await get().loadBrands();
      },

      // ✅ Logout: Backend elimina cookie
      logout: async () => {
        try {
          await authApi.logout(); // Backend borra cookie
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            currentBrand: null,
            availableBrands: [],
          });
        }
      },

      // ✅ LoadUser: Usa cookie automáticamente
      loadUser: async () => {
        try {
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true });
        } catch (error) {
          // Si falla (401), limpia estado
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-store', // LocalStorage key
      // ✅ Solo persiste info de UI (NO el token)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**✅ ARQUITECTURA CORRECTA:**
- Cookie HttpOnly → Seguridad (backend maneja auth)
- Zustand + persist → UI (nombre, avatar, permisos)

---

## 📌 Ejemplo de uso en componentes

### LoginPage.tsx

```typescript
import { useLogin } from '@/hooks/useAuth';

export function LoginPage() {
  const loginMutation = useLogin();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      // ✅ Cookie ya fue seteada por el backend
      // ✅ Estado global actualizado automáticamente
      // ✅ Usuario será redirigido por React Router
    } catch (error) {
      // Error ya manejado por el mutation
    }
  };
  
  // ...
}
```

### OperatorsPage.tsx

```typescript
import { useQuery } from '@tanstack/react-query';
import { operatorsApi } from '@/api';

export function OperatorsPage() {
  // ✅ Esta query usa apiClient que envía cookies automáticamente
  const { data, isLoading } = useQuery({
    queryKey: ['operators'],
    queryFn: operatorsApi.getOperators,
  });
  
  // ✅ Si el token expira (401), el interceptor redirige a login
  // ✅ No necesitas manejar auth aquí
  
  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

---

## 🔐 Configuración del Backend (CORS)

### ASP.NET Core

```csharp
// Startup.cs o Program.cs

services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder
            .WithOrigins("http://localhost:5173") // ✅ Frontend dev
            .AllowCredentials() // ✅ OBLIGATORIO para cookies
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");

// ✅ Para producción, añade el dominio real:
// .WithOrigins("http://localhost:5173", "https://admin.bet30.com")
```

### Node.js + Express

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // ✅ Frontend dev
  credentials: true, // ✅ OBLIGATORIO para cookies
}));

// ✅ Para producción:
// origin: ['http://localhost:5173', 'https://admin.bet30.com']
```

---

## 🍪 Configuración de Cookie en el Backend

### ASP.NET Core

```csharp
// En tu AuthController después de validar credenciales:

var cookieOptions = new CookieOptions
{
    HttpOnly = true,      // ✅ No accesible desde JavaScript
    Secure = false,       // ✅ false para HTTP, true para HTTPS
    SameSite = SameSiteMode.Lax, // ✅ Lax para same-site, None para cross-domain
    Path = "/",           // ✅ "/" para que funcione en todos los endpoints
    Expires = DateTime.UtcNow.AddDays(7),
};

Response.Cookies.Append("bk.token", jwtToken, cookieOptions);

return Ok(new { user = userInfo });
```

**⚠️ IMPORTANTE:**
- **Path debe ser `/`** (no `/admin`) para que funcione con `/api/v1/admin/...`
- **Secure = false** en desarrollo HTTP
- **Secure = true** en producción HTTPS

### Node.js + Express

```javascript
// Después de validar credenciales:

res.cookie('bk.token', jwtToken, {
  httpOnly: true,    // ✅ No accesible desde JavaScript
  secure: false,     // ✅ false para HTTP, true para HTTPS
  sameSite: 'lax',   // ✅ 'lax' para same-site, 'none' para cross-domain
  path: '/',         // ✅ "/" para todos los endpoints
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
});

res.json({ user: userInfo });
```

---

## 🧪 Testing Manual

### Test 1: Verificar configuración de Axios

```javascript
// En consola del navegador:
window.apiDebug()

// ✅ Deberías ver:
{
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {...}
}
```

### Test 2: Verificar login y cookie

```javascript
// 1. Abre DevTools → Network tab
// 2. Intenta login
// 3. Busca la request: POST /admin/auth/login
// 4. Ve a Response Headers → busca:
Set-Cookie: bk.token=eyJ...; Path=/; HttpOnly; SameSite=Lax

// 5. Ve a Application → Cookies → http://localhost:5173
// ✅ Deberías ver la cookie "bk.token"
```

### Test 3: Verificar que la cookie se envía

```javascript
// 1. En DevTools → Network tab
// 2. Haz una request autenticada (ej: ir a Operators)
// 3. Busca la request: GET /admin/operators
// 4. Ve a Request Headers → busca:
Cookie: bk.token=eyJ...

// ✅ Si la ves, las cookies funcionan correctamente
```

### Test 4: Verificar logout

```javascript
// 1. Haz logout desde la UI
// 2. Ve a Application → Cookies
// ✅ La cookie "bk.token" debe desaparecer
// 3. Intenta acceder a una página protegida
// ✅ Deberías ser redirigido a /login
```

---

## 🐛 Debugging Avanzado

### Ver todas las cookies en consola

```javascript
document.cookie
// Esperado: "bk.token=eyJ..."
```

### Forzar login desde consola

```javascript
const { useAuthStore } = await import('@/store');

await useAuthStore.getState().login({
  username: 'admin_mycasino',
  password: 'admin123'
});

console.log('User:', useAuthStore.getState().user);
```

### Ver estado de autenticación

```javascript
const { useAuthStore } = await import('@/store');

console.log({
  isAuthenticated: useAuthStore.getState().isAuthenticated,
  user: useAuthStore.getState().user,
});
```

### Hacer request manual con cookies

```javascript
const { apiClient } = await import('@/api/client');

// GET request
const response = await apiClient.get('/admin/operators');
console.log('Operators:', response.data);

// POST request
const newOperator = await apiClient.post('/admin/operators', {
  username: 'test_operator',
  email: 'test@example.com',
  // ...
});
console.log('Created:', newOperator.data);
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### Error: "Network Error"

```
Error: Network Error
  at createError (createError.js:16)
  at XMLHttpRequest.handleError (xhr.js:117)
```

**Causa:** Backend no está corriendo o puerto incorrecto.

**Solución:**
```bash
# Verifica que el backend responda:
curl http://localhost:5000/api/v1/admin/auth/me

# Si no responde, inicia tu backend
# Si responde en otro puerto, actualiza .env:
VITE_API_BASE_URL=http://localhost:XXXX/api/v1
```

### Error: CORS

```
Access to XMLHttpRequest at 'http://localhost:5000/api/v1/...' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Causa:** Backend no permite requests desde localhost:5173.

**Solución en backend:**
```csharp
// ASP.NET Core
builder.WithOrigins("http://localhost:5173").AllowCredentials()
```

### Cookie no aparece en Application → Cookies

**Causa:** Backend no envía `Set-Cookie` o tiene Path incorrecto.

**Solución:**
1. Verifica Response Headers en Network tab
2. Busca: `Set-Cookie: bk.token=...`
3. Si no existe → problema en backend
4. Si existe pero cookie no aparece → verifica Path:
   ```csharp
   // Backend debe usar:
   Path = "/" // No "/admin"
   ```

### Cookie existe pero no se envía en requests

**Causa:** `withCredentials` no está configurado o Path incorrecto.

**Solución:**
1. Verifica: `window.apiDebug()` → `withCredentials: true`
2. Verifica Path de cookie: debe ser `/` o incluir tu endpoint
3. Si tu endpoint es `/api/v1/admin/operators`:
   - ✅ Path `/` → Funciona
   - ✅ Path `/api` → Funciona
   - ❌ Path `/admin` → NO funciona

---

## ✅ CHECKLIST FINAL

### Configuración Frontend
- [ ] `.env` tiene `VITE_API_BASE_URL=http://localhost:XXXX/api/v1`
- [ ] `apiClient` tiene `withCredentials: true` (línea 11 de client.ts)
- [ ] Interceptores configurados correctamente
- [ ] Zustand store con persist middleware

### Configuración Backend
- [ ] CORS permite `http://localhost:5173`
- [ ] CORS tiene `AllowCredentials()` habilitado
- [ ] Cookie tiene `Path=/` (no `/admin`)
- [ ] Cookie tiene `HttpOnly=true`
- [ ] Cookie tiene `SameSite=Lax` (desarrollo) o `None` (producción cross-domain)
- [ ] Cookie tiene `Secure=false` (HTTP) o `true` (HTTPS)

### Testing
- [ ] Login muestra `Set-Cookie` en Response Headers
- [ ] Cookie aparece en Application → Cookies
- [ ] Requests subsecuentes incluyen `Cookie: bk.token=...`
- [ ] Backend responde 200 (no 401)
- [ ] Logout elimina la cookie
- [ ] Token expirado redirige a login

---

## 📚 Resumen Ejecutivo

**Tu código de Axios está perfecto:**
- ✅ `withCredentials: true` configurado
- ✅ Instancia centralizada
- ✅ Interceptores inteligentes
- ✅ Manejo correcto de 401

**Solo necesitas:**
1. Usar `http://localhost` en `.env` (ya aplicado)
2. Verificar que backend corra en el puerto configurado
3. Asegurar CORS con `AllowCredentials()` en backend
4. Verificar que cookie tenga `Path=/`

**Si sigues estos pasos, las cookies funcionarán perfectamente.**
