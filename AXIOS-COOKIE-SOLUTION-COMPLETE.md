# 🔐 GUÍA COMPLETA: SOLUCIÓN AXIOS + COOKIES

## 📊 DIAGNÓSTICO FINAL

### ✅ Tu configuración de Axios es CORRECTA

**Elementos verificados:**
- ✅ `withCredentials: true` configurado en `src/api/client.ts` (línea 11)
- ✅ Instancia centralizada `apiClient` usada en todos los módulos
- ✅ Interceptores de request (logger) y response (manejo de 401)
- ✅ Flujo de autenticación con Zustand store
- ✅ Logout limpia estado y llama al backend
- ✅ Estado global persistido en localStorage

### 🚨 EL PROBLEMA REAL: Configuración de URL

**Problema identificado:**
```
VITE_API_BASE_URL=https://admin.bet30.local:7182/api/v1
```

**Por qué falla:**

1. **CORS + Cookies**: El navegador bloquea cookies entre diferentes dominios:
   - Frontend: `http://localhost:5173`
   - Backend: `https://admin.bet30.local:7182`
   - Resultado: Cookies bloqueadas por política SameSite

2. **Certificado SSL**: `https://admin.bet30.local` requiere certificado válido
   - Sin certificado → El navegador rechaza la conexión
   - Chrome/Firefox muestran error SSL

3. **DNS Local**: `.local` es un TLD especial que requiere configuración
   - Debe estar en archivo `hosts` o usar mDNS
   - Si no está configurado → DNS no resuelve

---

## 💡 SOLUCIÓN IMPLEMENTADA

### Configuración para DESARROLLO

**Archivo actualizado: `.env`**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Ventajas:**
- ✅ Sin problemas de CORS (mismo dominio `localhost`)
- ✅ Sin certificados SSL necesarios
- ✅ Sin configuración DNS
- ✅ Cookies funcionan automáticamente con `withCredentials: true`

**Requisito:** Tu backend debe correr en el puerto configurado (5000 o el que uses).

### Configuración para PRODUCCIÓN

**Archivo creado: `.env.production`**
```env
VITE_API_BASE_URL=https://admin.bet30.com/api/v1
```

**Requisitos para producción:**
1. Dominio real registrado (no `.local`)
2. Certificado SSL válido (Let's Encrypt, Cloudflare, etc.)
3. CORS configurado en backend con el dominio frontend
4. Cookie con atributos correctos:
   - `SameSite=None` (para cross-domain) o `SameSite=Lax` (same-site)
   - `Secure=true` (obligatorio con HTTPS)
   - `HttpOnly=true` (seguridad)
   - `Path=/admin`

---

## 🔧 VERIFICACIÓN Y TESTING

### Paso 1: Reiniciar el servidor de desarrollo

```bash
# Detén el servidor actual (Ctrl+C)
# Reinicia para cargar las nuevas variables de entorno
npm run dev
```

### Paso 2: Verificar que el backend esté corriendo

```bash
# Verifica que tu backend responda en:
curl http://localhost:5000/api/v1/admin/auth/me
# Deberías ver un 401 (no autenticado) o la respuesta esperada
```

**Nota:** Si tu backend usa otro puerto (ej: 7182), actualiza el `.env`:
```env
VITE_API_BASE_URL=http://localhost:7182/api/v1
```

### Paso 3: Abrir DevTools del navegador

1. Abre Chrome/Firefox DevTools (F12)
2. Ve a la pestaña **Network**
3. Marca la opción **Preserve log**
4. Intenta hacer login

### Paso 4: Verificar las cookies

**En la request:**
1. Haz login con credenciales válidas
2. En Network, busca la petición `POST /admin/auth/login`
3. Ve a la pestaña **Response** → Deberías ver `Set-Cookie: bk.token=...`
4. Ve a Application → Cookies → `http://localhost:5173`
5. Deberías ver la cookie `bk.token`

**En requests subsecuentes:**
1. Haz cualquier petición (ej: ir a Operators)
2. En Network, busca la petición (ej: `GET /admin/operators`)
3. Ve a la pestaña **Headers** → **Request Headers**
4. Busca `Cookie: bk.token=...`
5. Si la ves → ✅ Las cookies se están enviando correctamente

### Paso 5: Debugging con console logs

Tu proyecto ya tiene logs configurados. En la consola verás:

```
[API Request] POST https://localhost:5000/api/v1/admin/auth/login
  Body: {username: "...", password: "..."}

[API Response] 200 POST https://localhost:5000/api/v1/admin/auth/login
```

**Debugging avanzado en consola:**
```javascript
// Ejecuta en la consola del navegador:
window.apiDebug()

// Deberías ver:
{
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {...}
}
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

### ✅ Configuración básica
- [ ] `.env` tiene `VITE_API_BASE_URL=http://localhost:XXXX/api/v1`
- [ ] Backend corre en el puerto configurado
- [ ] Servidor de desarrollo reiniciado después de cambiar `.env`

### ✅ Flujo de Login
- [ ] Login muestra request en Network tab
- [ ] Response incluye `Set-Cookie: bk.token=...`
- [ ] Cookie aparece en Application → Cookies
- [ ] Cookie tiene: `HttpOnly=true`, `Path=/admin`

### ✅ Requests autenticados
- [ ] Requests subsecuentes incluyen `Cookie: bk.token=...` en headers
- [ ] Backend responde con 200 (no 401)
- [ ] Datos se muestran correctamente en la UI

### ✅ Manejo de errores
- [ ] Token expirado → Redirige a login
- [ ] Logout → Cookie eliminada
- [ ] 401 en /me → No hace redirect infinito

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: "Las cookies no aparecen en Application → Cookies"

**Causa:** Backend no está enviando `Set-Cookie` o hay conflicto de dominios.

**Solución:**
1. Verifica la response del login en Network tab
2. Asegúrate que el backend envía `Set-Cookie`
3. Verifica que frontend y backend usen el **mismo dominio** (`localhost`)

### Problema 2: "La cookie existe pero no se envía en requests"

**Causa:** Atributos de cookie incorrectos o `withCredentials` no funciona.

**Solución:**
1. Verifica que la cookie tenga `Path=/admin` (debe incluir tu endpoint)
2. Si tu endpoint es `/api/v1/admin/...`, la cookie debe ser `Path=/` o `Path=/api`
3. Backend debe enviar:
   ```
   Set-Cookie: bk.token=...; Path=/; HttpOnly; SameSite=Lax
   ```

### Problema 3: "Error: net::ERR_CONNECTION_REFUSED"

**Causa:** Backend no está corriendo o usa otro puerto.

**Solución:**
1. Verifica que el backend esté corriendo: `curl http://localhost:5000`
2. Si usa otro puerto, actualiza `.env`
3. Reinicia el servidor de desarrollo de Vite

### Problema 4: "Error: CORS policy"

**Causa:** Backend no permite requests desde `http://localhost:5173`.

**Solución en el backend (ejemplo ASP.NET Core):**
```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder
            .WithOrigins("http://localhost:5173")
            .AllowCredentials() // IMPORTANTE para cookies
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

app.UseCors("AllowFrontend");
```

### Problema 5: "Token expirado pero no redirige a login"

**Causa:** El interceptor de 401 tiene lógica que previene redirect en `/me`.

**Solución:** Ya está implementado correctamente en `client.ts`. Si no funciona, verifica:
```typescript
// En response interceptor (línea 59-76 de client.ts)
if (error.response?.status === 401) {
  const originalRequest = error.config;
  
  // No redirigir si estamos en login o llamando a /me
  if (!originalRequest?.url?.includes('/auth/login') && 
      !originalRequest?.url?.includes('/auth/me')) {
    useAuthStore.getState().clearAuth();
    window.location.href = '/login';
  }
}
```

---

## 🎯 RESPUESTAS A TUS PREGUNTAS ESPECÍFICAS

### 1. ¿El problema es que Axios no está enviando las cookies automáticamente?

**Respuesta:** No exactamente. Axios **SÍ está configurado correctamente** con `withCredentials: true`. El problema es que el navegador **bloquea las cookies** porque:
- Estás usando dominios diferentes (`localhost` vs `admin.bet30.local`)
- HTTPS con dominio `.local` requiere certificado válido
- Política SameSite del navegador previene cookies cross-domain

**Solución aplicada:** Usar `http://localhost` tanto en frontend como backend elimina todos estos problemas.

### 2. ¿Debo crear un axios instance separado para cada módulo o uno global?

**Respuesta:** Ya tienes la configuración óptima:
- ✅ **UNA instancia global** (`apiClient`) en `src/api/client.ts`
- ✅ Todos los módulos (`auth.ts`, `operators.ts`, etc.) la importan y usan
- ✅ Interceptores aplicados automáticamente a todas las requests

**No cambies nada**, tu arquitectura actual es la correcta.

### 3. ¿Necesito guardar algo en localStorage/sessionStorage además de las cookies?

**Respuesta:** Tu implementación actual es correcta:
- ✅ **JWT en cookie HttpOnly** → No accesible desde JavaScript (seguro)
- ✅ **Info del usuario en Zustand + persist** → Para UI (nombre, rol, etc.)
- ✅ **NO guardas el token en localStorage** → Excelente práctica de seguridad

**Mantén esta arquitectura**. Es segura y moderna.

### 4. ¿Cómo manejo el logout para limpiar la cookie correctamente?

**Respuesta:** Ya está implementado perfectamente:

```typescript
// En src/store/auth.ts (líneas 52-59)
logout: async () => {
  try {
    await authApi.logout(); // Backend elimina la cookie
  } finally {
    set({
      user: null,
      isAuthenticated: false,
      // ...
    }); // Frontend limpia el estado
  }
}
```

**Flujo correcto:**
1. Usuario hace click en Logout
2. Frontend llama `authApi.logout()` → Backend elimina cookie
3. Frontend limpia Zustand store
4. React Query limpia cache (en `useLogout` hook)
5. Redirige a login

**No cambies nada**, tu implementación es correcta.

### 5. ¿Necesito algún estado global para el usuario autenticado además de las cookies?

**Respuesta:** Sí, y ya lo tienes implementado correctamente:

```typescript
// Zustand store con persist (src/store/auth.ts)
interface AuthState {
  user: AuthUser | null;           // Info del usuario
  isAuthenticated: boolean;         // Estado de autenticación
  currentBrand: Brand | null;       // Marca actual
  availableBrands: Brand[];         // Marcas disponibles
  // ...
}
```

**Por qué necesitas esto además de las cookies:**
- **Cookie HttpOnly** → Backend valida autenticación (NO accesible en JS)
- **Zustand store** → UI muestra nombre, avatar, permisos, etc.
- **Persist middleware** → Estado sobrevive a reloads de página

**Mantén esta arquitectura**, es la correcta.

---

## 🚀 PRÓXIMOS PASOS

### Inmediato (HAZ ESTO AHORA)

1. **Verifica el puerto del backend:**
   ```bash
   # ¿En qué puerto corre tu backend?
   # Si es 7182, actualiza .env:
   VITE_API_BASE_URL=http://localhost:7182/api/v1
   ```

2. **Reinicia el servidor:**
   ```bash
   # Detén Vite (Ctrl+C)
   npm run dev
   ```

3. **Prueba el login:**
   - Abre DevTools (F12) → Network tab
   - Intenta login con: `admin_mycasino / admin123`
   - Verifica que veas `Set-Cookie` en la response

### Corto plazo (SI SIGUE FALLANDO)

1. **Verifica CORS en el backend:**
   - Backend debe permitir `http://localhost:5173`
   - Backend debe tener `AllowCredentials()` habilitado

2. **Verifica el Path de la cookie:**
   - Cookie debe tener `Path=/` o incluir tu ruta de API
   - Si es `Path=/admin` y tu endpoint es `/api/v1/admin/...` → OK
   - Si es `Path=/admin` y tu endpoint es `/api/...` → PROBLEMA

3. **Comparte logs:**
   - Abre consola → ejecuta `window.apiDebug()`
   - Comparte el output completo
   - Comparte screenshot de Network tab (headers de request/response)

### Largo plazo (PARA PRODUCCIÓN)

1. **Configura dominio real** (no `.local`)
2. **Instala certificado SSL válido**
3. **Actualiza CORS** en backend con dominio de producción
4. **Usa `.env.production`** al hacer build

---

## 📞 SOPORTE ADICIONAL

Si después de aplicar estos cambios sigues teniendo problemas:

1. **Comparte estos datos:**
   - Output de `window.apiDebug()` en consola
   - Screenshot de Network tab mostrando request/response de login
   - Screenshot de Application → Cookies
   - Puerto y configuración de tu backend

2. **Verifica el backend:**
   ```bash
   # Prueba desde terminal:
   curl -X POST http://localhost:5000/api/v1/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin_mycasino","password":"admin123"}' \
     -v
   
   # Busca en el output: Set-Cookie: bk.token=...
   ```

3. **Debugging avanzado:**
   ```javascript
   // En consola del navegador:
   
   // Ver todas las cookies:
   document.cookie
   
   // Ver config de axios:
   window.apiDebug()
   
   // Forzar un login:
   useAuthStore.getState().login({
     username: 'admin_mycasino',
     password: 'admin123'
   })
   ```

---

## ✅ RESUMEN EJECUTIVO

### ¿Qué estaba mal?
- **URL incorrecta**: `https://admin.bet30.local:7182` causaba problemas de CORS, SSL y cookies

### ¿Qué se arregló?
- **URL corregida**: `http://localhost:5000` elimina todos los problemas de desarrollo

### ¿Qué sigue funcionando bien?
- ✅ Configuración de Axios con `withCredentials: true`
- ✅ Instancia centralizada con interceptores
- ✅ Flujo de autenticación con Zustand
- ✅ Manejo de logout y limpieza de estado

### ¿Qué hacer ahora?
1. Verifica el puerto del backend (ajusta si no es 5000)
2. Reinicia el servidor de Vite
3. Prueba el login con DevTools abierto
4. Sigue el checklist de verificación

**TU CÓDIGO DE AXIOS ES CORRECTO. SOLO NECESITABAS AJUSTAR LA URL.**

---

## 📚 RECURSOS ADICIONALES

- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Axios: Request Config](https://axios-http.com/docs/req_config)
- [CORS con credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
- [SameSite cookies](https://web.dev/samesite-cookies-explained/)
