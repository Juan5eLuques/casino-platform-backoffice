# 🚀 Guía Rápida - Configuración del Backoffice

## ⚡ Setup Rápido (5 minutos)

### 1. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env y verificar que apunte al backend correcto
# Por defecto usa: http://localhost:5000/api/v1
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Verificar Backend

**El backend DEBE estar corriendo ANTES de iniciar el frontend.**

```bash
# En otra terminal, correr el backend
cd ../casino-backend
dotnet run --project apps/api/Casino.Api

# Debe mostrar:
# Now listening on: http://localhost:5000
```

### 4. Iniciar Frontend

```bash
npm run dev

# Debe abrir en: http://localhost:5173
```

### 5. Login

```
URL: http://localhost:5173/login
Usuario: superadmin (o el que tengas configurado)
Password: (tu password)
```

---

## 🔧 Configuración Actual

### ✅ Lo que está configurado:

```typescript
// src/api/client.ts
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // ✅ HTTP localhost
  withCredentials: true, // ✅ Envía cookies
  headers: {
    'Content-Type': 'application/json', // ✅ JSON
    // NO incluye 'Host' header              ✅ Browser lo maneja
  },
  timeout: 10000,
});
```

### ✅ CORS en Backend:

El backend debe tener esto configurado:

```csharp
// DynamicCorsMiddleware.cs
var adminOrigins = new[] {
    "http://localhost:5173",              // ✅ Frontend dev
    "http://admin.bet30.local:5173",      // ✅ Dominio custom
    "https://admin.bet30.local:5173",     // ✅ HTTPS custom
};
```

---

## 🧪 Testing de Conexión

### Método 1: Desde el Browser

1. Abrir DevTools Console (F12)
2. Ejecutar:

```javascript
// Ver configuración actual
window.apiDebug.config;

// Testar conexión (si el backend tiene /health endpoint)
await window.apiDebug.testConnection();

// Hacer login manual
await fetch('http://localhost:5000/api/v1/admin/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'superadmin', password: 'tu_password' }),
});
```

### Método 2: Verificar Cookies

Después del login, en DevTools:

1. Ir a **Application** tab
2. Expandir **Cookies** > `http://localhost:5173`
3. Debe existir: `bk.token` con valor JWT
4. Verificar:
   - ✅ **HttpOnly**: true
   - ✅ **Path**: /admin
   - ✅ **SameSite**: Lax

### Método 3: Ver Network Requests

1. Ir a **Network** tab en DevTools
2. Hacer una request (ej: ir a /operators)
3. Click en la request
4. Ver **Headers** tab:
   - ✅ **Request Headers** debe incluir: `Cookie: bk.token=...`
   - ✅ **Response Headers** debe incluir: `Access-Control-Allow-Credentials: true`

---

## 🐛 Troubleshooting Común

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Causa:** Backend no está enviando headers CORS correctos

**Solución:**

1. Verificar que el backend esté corriendo: `http://localhost:5000`
2. Verificar logs del backend para ver qué origin recibe
3. Verificar que `http://localhost:5173` esté en la whitelist CORS del backend

```bash
# En los logs del backend debes ver:
# [CORS] Request from origin: http://localhost:5173
# [CORS] Origin allowed: true
```

### Error: "401 Unauthorized"

**Causa:** No estás autenticado o la cookie no se está enviando

**Solución:**

1. Verificar que hiciste login primero
2. Verificar en DevTools > Application > Cookies que existe `bk.token`
3. Verificar que `withCredentials: true` en axios config
4. Si la cookie existe pero no se envía, verificar que el `Path` sea `/admin`

### Error: "Network Error" o "ERR_FAILED"

**Causa:** Backend no está corriendo o puerto incorrecto

**Solución:**

1. Verificar que el backend esté corriendo:
   ```bash
   curl http://localhost:5000/health
   # o
   curl http://localhost:5000/api/v1/health
   ```
2. Verificar que `VITE_API_BASE_URL` en `.env` coincida con el backend
3. Si usas HTTPS, verificar que el certificado sea válido

### Error: "Cookie blocked" o "Third-party cookie"

**Causa:** Browser bloqueando cookies de terceros

**Solución:**

1. Usar el **mismo dominio** para frontend y backend (localhost)
2. Verificar que `SameSite=Lax` en la cookie del backend
3. NO usar dominios diferentes en desarrollo (ej: frontend en `localhost` y backend en `127.0.0.1`)

---

## 📋 Checklist de Verificación

Antes de reportar un error, verifica:

### Backend:

- [ ] Backend está corriendo en `http://localhost:5000`
- [ ] Puedes hacer `curl http://localhost:5000/health` y obtienes respuesta
- [ ] Logs del backend muestran requests entrantes
- [ ] CORS middleware está configurado correctamente

### Frontend:

- [ ] `.env` tiene `VITE_API_BASE_URL=http://localhost:5000/api/v1`
- [ ] `npm run dev` corre sin errores
- [ ] Frontend está en `http://localhost:5173`
- [ ] `withCredentials: true` en axios config
- [ ] NO hay header `Host` manual en axios config

### Browser:

- [ ] Console no muestra errores de CORS
- [ ] Después del login, cookie `bk.token` existe en Application > Cookies
- [ ] Network tab muestra requests con Cookie header
- [ ] No hay adblockers o extensiones bloqueando requests

---

## 🎯 Configuraciones Alternativas

### Opción A: Desarrollo Local Simple (Actual - RECOMENDADO)

```env
# .env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Pros:**

- ✅ Simple y directo
- ✅ No requiere configuración extra
- ✅ CORS fácil de configurar

**Contras:**

- ❌ No simula dominios reales

### Opción B: Dominios Custom con /etc/hosts

```env
# .env
VITE_API_BASE_URL=http://admin.bet30.local:5000/api/v1
```

**Requiere configurar** `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 admin.bet30.local
127.0.0.1 bet30.local
```

**Pros:**

- ✅ Simula entorno de producción
- ✅ Puede probar multi-tenant

**Contras:**

- ❌ Más complejo de configurar
- ❌ Puede tener problemas de CORS

### Opción C: Proxy en Vite (NO RECOMENDADO)

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**Pros:**

- ✅ Evita CORS en desarrollo

**Contras:**

- ❌ Comportamiento diferente a producción
- ❌ No prueba CORS real
- ❌ Problemas con cookies

---

## 📚 Recursos Adicionales

### Documentación:

- [Axios withCredentials](https://axios-http.com/docs/req_config)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors)

### Archivos de Configuración:

- `src/api/client.ts` - Cliente Axios
- `.env` - Variables de entorno
- `vite.config.ts` - Configuración de Vite

### Testing:

- DevTools > Network - Ver requests
- DevTools > Application > Cookies - Ver cookies
- DevTools > Console - `window.apiDebug` para debugging

---

## ✅ Resumen

**Configuración Actual (Simplificada):**

- ✅ Frontend: `http://localhost:5173`
- ✅ Backend: `http://localhost:5000`
- ✅ API Base: `http://localhost:5000/api/v1`
- ✅ Same origin: HTTP + localhost
- ✅ CORS: Permitido
- ✅ Cookies: HttpOnly con withCredentials

**Para usar:**

1. Correr backend: `dotnet run`
2. Correr frontend: `npm run dev`
3. Login en: `http://localhost:5173/login`
4. Navegar por el backoffice

**¡Listo para producción!** 🚀
