# 🔧 Configuración de Proxy Local

## Resumen

Para desarrollo local, usa **Vite Proxy** en lugar del proxy de Netlify. Esto permite que tu frontend en `http://localhost:5173` se comunique con tu backend en `https://localhost:7182` sin problemas de CORS.

---

## 📋 Archivos Configurados

### 1. ✅ `vite.config.ts` - Proxy de Vite

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'https://localhost:7182', // 🔥 Tu backend local
      changeOrigin: true,
      secure: false, // Para certificados self-signed
      rewrite: (path) => path,
    }
  }
}
```

**Qué hace:**

- Redirige todas las peticiones de `/api/*` a `https://localhost:7182/api/*`
- Evita problemas de CORS en desarrollo
- Soporta HTTPS con certificados self-signed

### 2. ✅ `.env.local` - Variables de Desarrollo

```bash
VITE_API_BASE_URL=/api/v1
VITE_NODE_ENV=development
VITE_ENABLE_API_LOGGING=true
```

**Qué hace:**

- Frontend usa rutas relativas (`/api/v1/auth/login`)
- Vite intercepta `/api/*` y lo redirige al backend local
- Logging habilitado para debugging

### 3. ✅ `.env.production` - Variables de Producción

```bash
VITE_API_BASE_URL=/api/v1
VITE_NODE_ENV=production
VITE_ENABLE_API_LOGGING=false
```

**Qué hace:**

- En Netlify, usa el proxy configurado en `netlify.toml`
- Redirige a Railway backend en producción

---

## 🚀 Cómo Usar

### 1. Iniciar tu backend local

```powershell
# Desde tu proyecto backend
cd tu-proyecto-backend
dotnet run
```

Backend debería estar corriendo en: `https://localhost:7182`

### 2. Iniciar el frontend con Vite

```powershell
# Desde este proyecto (frontend)
npm run dev
```

Frontend correrá en: `http://localhost:5173`

### 3. ¡Listo! El proxy funciona automáticamente

```
Cliente (Browser)  →  Vite Dev Server  →  Backend Local
http://localhost:5173  /api/v1/users   https://localhost:7182/api/v1/users
                       ↑
                       Proxy automático
```

---

## 🔍 Verificación

### En la consola del navegador:

```javascript
// Verifica la configuración del API
window.apiDebug.config;
// Output:
// {
//   baseURL: "/api/v1",
//   isDevelopment: true,
//   loggingEnabled: true,
//   withCredentials: true
// }
```

### En DevTools Network:

1. Abrir DevTools (F12) → Network
2. Hacer login o cualquier request
3. Buscar el request a `/api/v1/auth/login`
4. **Request URL:** `http://localhost:5173/api/v1/auth/login`
5. Vite lo redirige a: `https://localhost:7182/api/v1/auth/login`

### En la consola del terminal (Vite):

```
🔗 API Request: POST /api/v1/auth/login {
  baseURL: '/api/v1',
  withCredentials: true,
  data: { ... }
}

Proxy: /api/v1/auth/login → https://localhost:7182/api/v1/auth/login
✅ API Response: 200 /api/v1/auth/login
```

---

## ⚙️ Configuración Avanzada

### Cambiar el puerto del backend

Si tu backend corre en otro puerto (ej: `5000`):

**vite.config.ts:**

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000', // ← Cambiar aquí
    changeOrigin: true,
    secure: false,
  }
}
```

### Usar HTTP en lugar de HTTPS

Si tu backend local usa HTTP:

**vite.config.ts:**

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000', // HTTP en lugar de HTTPS
    changeOrigin: true,
    secure: false,
  }
}
```

### Múltiples proxies

Si tienes múltiples servicios:

**vite.config.ts:**

```typescript
proxy: {
  '/api': {
    target: 'https://localhost:7182',
    changeOrigin: true,
    secure: false,
  },
  '/auth': {
    target: 'https://localhost:7183',
    changeOrigin: true,
    secure: false,
  }
}
```

---

## 🔧 Troubleshooting

### Error: "ECONNREFUSED" o "Connection refused"

**Causa:** El backend no está corriendo en el puerto especificado.

**Solución:**

1. Verificar que el backend está corriendo: `https://localhost:7182`
2. Probar acceder directamente en el navegador
3. Verificar logs del backend para confirmar el puerto

### Error: "self signed certificate" o "CERT_HAS_EXPIRED"

**Causa:** Certificado SSL self-signed en desarrollo.

**Solución:**
En `vite.config.ts`, asegurar que `secure: false` está configurado:

```typescript
proxy: {
  '/api': {
    target: 'https://localhost:7182',
    secure: false, // ← Importante para certificados self-signed
  }
}
```

### Error: "404 Not Found" en /api/\*

**Causa:** La ruta en el backend es diferente.

**Solución:**
Verificar que tu backend tiene el prefijo `/api`:

- Backend: `https://localhost:7182/api/v1/users` ✅
- NO: `https://localhost:7182/v1/users` ❌

Si tu backend NO tiene `/api`, usar `rewrite`:

```typescript
proxy: {
  '/api': {
    target: 'https://localhost:7182',
    changeOrigin: true,
    secure: false,
    rewrite: (path) => path.replace(/^\/api/, ''), // Quitar /api
  }
}
```

### Cookies no se envían

**Causa:** `withCredentials` no está habilitado.

**Solución:**
Ya está configurado en `src/api/client.ts`:

```typescript
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Ya configurado
});
```

---

## 🌐 Desarrollo Multi-Brand con Proxy Local

Si quieres probar multi-brand localmente con proxy:

### 1. Configurar /etc/hosts

```
127.0.0.1 sitea.local
127.0.0.1 siteb.local
```

### 2. Actualizar vite.config.ts

```typescript
server: {
  port: 5173,
  host: '0.0.0.0', // Permite acceso desde sitea.local
  proxy: {
    '/api': {
      target: 'https://localhost:7182',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### 3. Acceder mediante dominios locales

- ✅ `http://sitea.local:5173`
- ✅ `http://siteb.local:5173`
- ❌ `http://localhost:5173` (no preserva brand)

---

## 📊 Comparación: Desarrollo vs Producción

| Aspecto           | Desarrollo Local     | Producción Netlify       |
| ----------------- | -------------------- | ------------------------ |
| **Proxy**         | Vite Proxy           | Netlify Proxy            |
| **Frontend**      | `localhost:5173`     | `sitea.com`              |
| **Backend**       | `localhost:7182`     | `railway.app`            |
| **Configuración** | `vite.config.ts`     | `netlify.toml`           |
| **Variables**     | `.env.local`         | `.env.production`        |
| **CORS**          | No necesario (proxy) | Configurado en backend   |
| **Host Header**   | `localhost:7182`     | `sitea.com` (preservado) |

---

## 📝 Resumen Rápido

```bash
# 1. Backend corriendo
cd backend
dotnet run
# → https://localhost:7182

# 2. Frontend con proxy
cd frontend
npm run dev
# → http://localhost:5173

# 3. Peticiones automáticas
# Frontend: GET /api/v1/users
# Vite proxy: → https://localhost:7182/api/v1/users
# Backend: ✅ Responde
```

**Archivos clave:**

- `vite.config.ts` → Configuración del proxy
- `.env.local` → Variables de desarrollo (`VITE_API_BASE_URL=/api/v1`)
- `.env.production` → Variables de producción (para Netlify)

¡Listo para desarrollo local! 🎉
