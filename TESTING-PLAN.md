# 🧪 PLAN DE TESTING COMPLETO

## 📋 Pre-requisitos

Antes de comenzar, verifica:

### 1. Backend está corriendo

```powershell
# Verifica que el backend responda:
curl http://localhost:5000/api/v1/health
# O el endpoint que tengas disponible

# Si no responde, inicia tu backend:
cd path/to/backend
dotnet run
# O el comando que uses
```

### 2. Variables de entorno correctas

```powershell
# Muestra el contenido de .env
Get-Content .env

# Deberías ver:
# VITE_API_BASE_URL=http://localhost:5000/api/v1
# (o el puerto que uses)
```

### 3. Servidor de desarrollo reiniciado

```powershell
# Si ya tenías el servidor corriendo, deténlo (Ctrl+C)
# Y reinícialo para cargar las nuevas variables:
npm run dev
```

---

## 🔍 FASE 1: Verificación de Configuración

### Test 1.1: Configuración de Axios

**Objetivo:** Verificar que `withCredentials` está configurado.

**Pasos:**
1. Abre tu navegador en `http://localhost:5173`
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**
4. Ejecuta:
   ```javascript
   window.apiDebug()
   ```

**✅ Resultado esperado:**
```javascript
{
  baseURL: "http://localhost:5000/api/v1", // O tu puerto
  withCredentials: true, // ✅ DEBE SER true
  timeout: 10000,
  headers: { ... }
}
```

**❌ Si no funciona:**
- Verifica que reiniciaste el servidor después de cambiar `.env`
- Verifica que `.env` tenga la variable correcta

---

### Test 1.2: Conectividad con Backend

**Objetivo:** Verificar que el frontend puede comunicarse con el backend.

**Pasos:**
1. En DevTools → **Console**
2. Ejecuta:
   ```javascript
   const { apiClient } = await import('/src/api/client.ts');
   await apiClient.get('/admin/auth/me');
   ```

**✅ Resultado esperado:**
- Error 401 (no autenticado) → ✅ Backend responde correctamente
- Respuesta con datos → ✅ Backend responde y estás autenticado

**❌ Resultados problemáticos:**
- `Network Error` → Backend no está corriendo o puerto incorrecto
- `CORS Error` → Backend no permite localhost:5173
- `SSL Error` → Estás usando HTTPS en .env (cámbialo a HTTP)

**Soluciones:**
```powershell
# Si es Network Error - verifica backend:
curl http://localhost:5000/api/v1/admin/auth/me

# Si es CORS - actualiza backend (ver AXIOS-CODE-REFERENCE.md)

# Si es SSL - actualiza .env:
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 🔐 FASE 2: Testing de Login

### Test 2.1: Request de Login

**Objetivo:** Verificar que el login envía credenciales correctamente.

**Pasos:**
1. En DevTools → **Network** tab
2. Marca la opción **Preserve log** (para no perder logs al redirigir)
3. Ve a la página de login: `http://localhost:5173/login`
4. Ingresa credenciales:
   - Usuario: `admin_mycasino`
   - Password: `admin123`
5. Haz click en "Iniciar Sesión"

**✅ Qué verificar:**
- Deberías ver una request: `POST /admin/auth/login`
- Haz click en esa request
- Ve a la pestaña **Payload** o **Request**:
  ```json
  {
    "username": "admin_mycasino",
    "password": "admin123"
  }
  ```

**❌ Si no ves la request:**
- Verifica la consola de errores
- Puede ser que el botón no esté conectado al formulario

---

### Test 2.2: Response del Login

**Objetivo:** Verificar que el backend envía la cookie.

**Pasos:**
1. Con la request `POST /admin/auth/login` seleccionada en Network tab
2. Ve a la pestaña **Headers** → **Response Headers**
3. Busca: `Set-Cookie`

**✅ Resultado esperado:**
```
Set-Cookie: bk.token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Lax
```

**Detalles importantes:**
- ✅ `HttpOnly` → Cookie segura, no accesible desde JS
- ✅ `Path=/` → Funciona en todos los endpoints
- ✅ `SameSite=Lax` → Funciona en same-site (localhost → localhost)

**❌ Si NO ves Set-Cookie:**
- **Problema en el backend** → Backend no está enviando la cookie
- Verifica la configuración de cookies en tu backend (ver AXIOS-CODE-REFERENCE.md)

**❌ Si ves `Path=/admin`:**
- **Problema:** Cookie no se enviará a `/api/v1/admin/...`
- **Solución:** Backend debe usar `Path=/`

---

### Test 2.3: Cookie guardada en el navegador

**Objetivo:** Verificar que el navegador guardó la cookie.

**Pasos:**
1. En DevTools → Pestaña **Application**
2. En el panel izquierdo → **Storage** → **Cookies**
3. Click en `http://localhost:5173`

**✅ Resultado esperado:**
Deberías ver una cookie:
- **Name:** `bk.token`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT)
- **Path:** `/`
- **HttpOnly:** ✅ (marcado)
- **Secure:** ❌ (desmarcado, porque usamos HTTP)
- **SameSite:** `Lax`

**❌ Si NO ves la cookie:**

**Causa 1: Path incorrecto**
- Si el backend envió `Path=/admin`, la cookie existe pero no la ves en localhost:5173
- Verifica usando curl:
  ```powershell
  curl -X POST http://localhost:5000/api/v1/admin/auth/login `
    -H "Content-Type: application/json" `
    -d '{"username":"admin_mycasino","password":"admin123"}' `
    -v
  
  # Busca en el output: Set-Cookie: bk.token=...; Path=...
  ```

**Causa 2: Backend no envía Set-Cookie**
- Verifica la configuración de cookies en el backend

---

### Test 2.4: Redirección después del login

**Objetivo:** Verificar que después del login exitoso, se redirige al dashboard.

**Pasos:**
1. Después del login (Test 2.1)
2. Verifica que la URL cambió a `/` o `/dashboard`

**✅ Resultado esperado:**
- URL: `http://localhost:5173/` (o la ruta default)
- Ves el dashboard o home page

**❌ Si no redirige:**
- Ve a Console y busca errores
- Puede ser un problema en el hook `useLogin` o en la navegación

---

## 🔒 FASE 3: Testing de Requests Autenticados

### Test 3.1: Request autenticado envía cookie

**Objetivo:** Verificar que las requests subsecuentes incluyen la cookie.

**Pasos:**
1. Después de hacer login exitosamente (FASE 2)
2. En DevTools → **Network** tab
3. Navega a una página protegida (ej: Operators)
4. Busca la request: `GET /admin/operators`
5. Haz click en esa request
6. Ve a **Request Headers**

**✅ Resultado esperado:**
Deberías ver:
```
Cookie: bk.token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Esto significa:**
- ✅ Axios está enviando la cookie automáticamente
- ✅ `withCredentials: true` funciona correctamente

**❌ Si NO ves el header Cookie:**

**Causa 1: withCredentials no está configurado**
```javascript
// Verifica en consola:
window.apiDebug()
// Debe mostrar: withCredentials: true
```

**Causa 2: Path de cookie incorrecto**
- Cookie tiene `Path=/admin` pero endpoint es `/api/v1/admin/...`
- Solución: Backend debe usar `Path=/`

**Causa 3: SameSite bloqueando la cookie**
- Si estás usando dominios diferentes (ej: `localhost` y `admin.bet30.local`)
- Solución: Usa el mismo dominio (`localhost` para ambos)

---

### Test 3.2: Backend responde correctamente

**Objetivo:** Verificar que el backend acepta la cookie y responde con datos.

**Pasos:**
1. Con la request `GET /admin/operators` seleccionada
2. Ve a la pestaña **Response**

**✅ Resultado esperado:**
```json
{
  "items": [
    {
      "id": "...",
      "username": "operator1",
      "email": "operator1@example.com",
      ...
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 10
}
```

**❌ Si ves 401 Unauthorized:**
- Cookie no se está enviando (ver Test 3.1)
- Cookie expiró (haz login nuevamente)
- Backend no valida correctamente la cookie

**❌ Si ves 403 Forbidden:**
- Usuario no tiene permisos para este endpoint
- Prueba con otro usuario (ej: SUPER_ADMIN)

---

### Test 3.3: Múltiples requests usan la misma cookie

**Objetivo:** Verificar que todas las requests autenticadas funcionan.

**Pasos:**
1. Navega a diferentes páginas:
   - `/operators` → Verifica request `GET /admin/operators`
   - `/audit` → Verifica request `GET /admin/audit/backoffice`
   - `/players` → Verifica request `GET /admin/players`
2. Para cada request, verifica que incluye `Cookie: bk.token=...`

**✅ Resultado esperado:**
- Todas las requests incluyen la cookie
- Todas responden con 200 y datos

**❌ Si alguna request no incluye cookie:**
- Verifica que usa `apiClient` (no una instancia diferente de axios)

---

## 🚪 FASE 4: Testing de Logout

### Test 4.1: Request de Logout

**Objetivo:** Verificar que el logout llama al backend.

**Pasos:**
1. En DevTools → **Network** tab
2. Marca **Preserve log**
3. Haz click en "Cerrar Sesión" o el botón de logout
4. Busca la request: `POST /admin/auth/logout`

**✅ Resultado esperado:**
- Request existe
- Status: 200 OK
- Response: `{}` o mensaje de éxito

**❌ Si no ves la request:**
- Verifica que el botón de logout esté conectado al hook `useLogout`

---

### Test 4.2: Cookie eliminada

**Objetivo:** Verificar que la cookie se elimina después del logout.

**Pasos:**
1. Después del logout (Test 4.1)
2. Ve a DevTools → **Application** → **Cookies** → `http://localhost:5173`

**✅ Resultado esperado:**
- La cookie `bk.token` **NO debe existir**
- O debe tener `Max-Age=0` (expirada inmediatamente)

**❌ Si la cookie sigue existiendo:**
- Backend no está eliminando la cookie correctamente
- Backend debe enviar:
  ```
  Set-Cookie: bk.token=; Path=/; Max-Age=0
  ```

---

### Test 4.3: Estado limpio después de logout

**Objetivo:** Verificar que el estado de Zustand se limpia.

**Pasos:**
1. En DevTools → **Console**
2. Ejecuta:
   ```javascript
   const { useAuthStore } = await import('/src/store/auth.ts');
   console.log({
     user: useAuthStore.getState().user,
     isAuthenticated: useAuthStore.getState().isAuthenticated,
   });
   ```

**✅ Resultado esperado:**
```javascript
{
  user: null,
  isAuthenticated: false
}
```

**❌ Si el estado no se limpió:**
- Verifica la implementación de `logout()` en el store

---

### Test 4.4: Redirección a login

**Objetivo:** Verificar que después del logout se redirige a login.

**Pasos:**
1. Después del logout (Test 4.1)
2. Verifica la URL actual

**✅ Resultado esperado:**
- URL: `http://localhost:5173/login`

**❌ Si no redirige:**
- Verifica el hook `useLogout` o la navegación en tu componente

---

## 🔄 FASE 5: Testing de Expiración de Token

### Test 5.1: Simular token expirado

**Objetivo:** Verificar que si el token expira, el usuario es redirigido a login.

**Pasos:**
1. Inicia sesión exitosamente
2. En DevTools → **Application** → **Cookies**
3. **Elimina manualmente** la cookie `bk.token`
4. Navega a cualquier página protegida (ej: `/operators`)

**✅ Resultado esperado:**
- Request: `GET /admin/operators` devuelve 401
- Interceptor detecta el 401
- Usuario es redirigido a `/login`
- Mensaje de error (opcional): "Sesión expirada"

**❌ Si no redirige:**
- Verifica el interceptor de response en `client.ts` (líneas 59-76)
- Debe tener:
  ```typescript
  if (error.response?.status === 401) {
    if (!url.includes('/auth/login') && !url.includes('/auth/me')) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
  }
  ```

---

### Test 5.2: Login no causa redirect infinito

**Objetivo:** Verificar que un 401 en `/auth/login` NO causa redirect.

**Pasos:**
1. Ve a `/login`
2. Ingresa credenciales **incorrectas**
3. Haz click en "Iniciar Sesión"

**✅ Resultado esperado:**
- Request: `POST /admin/auth/login` devuelve 401
- **NO hay redirect a login** (ya estamos en login)
- Se muestra mensaje de error: "Usuario o contraseña incorrectos"

**❌ Si hay redirect infinito:**
- El interceptor no está excluyendo `/auth/login`
- Verifica la condición:
  ```typescript
  if (!url.includes('/auth/login') && !url.includes('/auth/me'))
  ```

---

## 🌐 FASE 6: Testing de Casos Edge

### Test 6.1: Múltiples pestañas

**Objetivo:** Verificar que el logout en una pestaña afecta las demás.

**Pasos:**
1. Inicia sesión
2. Abre una segunda pestaña: `http://localhost:5173/operators`
3. En la **primera pestaña**, haz logout
4. En la **segunda pestaña**, haz refresh

**✅ Resultado esperado:**
- Segunda pestaña detecta que no hay cookie
- Redirige a login

**❌ Si no funciona:**
- Puede ser que Zustand persist mantenga el estado
- El refresh y la verificación de cookie deberían limpiarlo

---

### Test 6.2: Refresh de página

**Objetivo:** Verificar que el estado se mantiene después de refresh.

**Pasos:**
1. Inicia sesión exitosamente
2. Navega a una página (ej: `/operators`)
3. Haz refresh (F5)

**✅ Resultado esperado:**
- Usuario sigue autenticado
- No es redirigido a login
- Datos se cargan correctamente

**Esto funciona porque:**
- Cookie persiste entre reloads
- Zustand persist recupera el estado de localStorage

**❌ Si redirige a login:**
- Cookie puede haberse perdido
- Verifica que cookie tiene `Max-Age` suficiente

---

### Test 6.3: Navegación directa con URL

**Objetivo:** Verificar que se puede acceder a páginas protegidas directamente.

**Pasos:**
1. Inicia sesión
2. Abre una **nueva pestaña**
3. Ingresa directamente: `http://localhost:5173/operators`

**✅ Resultado esperado:**
- Página carga correctamente
- No redirige a login
- Datos se muestran

**❌ Si redirige a login:**
- Cookie no está siendo enviada
- Verifica Test 3.1

---

## 🎯 RESUMEN DE RESULTADOS ESPERADOS

### ✅ Configuración correcta:
- [ ] `window.apiDebug()` muestra `withCredentials: true`
- [ ] Backend responde a requests de prueba
- [ ] No hay errores de CORS

### ✅ Login funciona:
- [ ] Request `POST /admin/auth/login` se envía
- [ ] Response incluye `Set-Cookie: bk.token=...`
- [ ] Cookie aparece en Application → Cookies
- [ ] Usuario es redirigido al dashboard

### ✅ Requests autenticados funcionan:
- [ ] Todas las requests incluyen `Cookie: bk.token=...`
- [ ] Backend responde con 200 y datos
- [ ] No hay errores 401 en requests normales

### ✅ Logout funciona:
- [ ] Request `POST /admin/auth/logout` se envía
- [ ] Cookie desaparece de Application → Cookies
- [ ] Estado de Zustand se limpia
- [ ] Usuario es redirigido a login

### ✅ Manejo de errores funciona:
- [ ] Token expirado (401) redirige a login
- [ ] Login fallido NO causa redirect infinito
- [ ] Errores de red muestran mensajes apropiados

### ✅ Casos edge funcionan:
- [ ] Logout en una pestaña afecta otras pestañas
- [ ] Refresh mantiene la sesión
- [ ] Navegación directa con URL funciona

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Problema: Network Error

**Solución:**
```powershell
# Verifica backend:
curl http://localhost:5000/api/v1/admin/auth/me

# Si no responde, inicia backend
# Si responde en otro puerto, actualiza .env
```

### Problema: CORS Error

**Solución:**
```csharp
// Backend (ASP.NET Core):
builder.WithOrigins("http://localhost:5173").AllowCredentials()
```

### Problema: Cookie no aparece

**Solución:**
1. Verifica Response Headers: `Set-Cookie: bk.token=...`
2. Verifica Path: debe ser `/` no `/admin`
3. Verifica backend está enviando la cookie correctamente

### Problema: Cookie no se envía en requests

**Solución:**
1. Verifica: `window.apiDebug()` → `withCredentials: true`
2. Verifica Path de cookie incluye tu endpoint
3. Verifica que uses el mismo dominio (localhost en ambos)

### Problema: Redirect infinito en login

**Solución:**
```typescript
// En client.ts, interceptor debe excluir /auth/login:
if (!url.includes('/auth/login') && !url.includes('/auth/me')) {
  window.location.href = '/login';
}
```

---

## 📞 SIGUIENTE PASO

Si **TODOS los tests de FASE 1-4 pasan** → ✅ **Tu configuración es perfecta**

Si **algún test falla** → Comparte:
1. Screenshot de Network tab (headers de request/response)
2. Screenshot de Application → Cookies
3. Output de `window.apiDebug()`
4. Consola de errores

Con esa info podré ayudarte a diagnosticar el problema específico.

---

## 🚀 CHECKLIST RÁPIDO (2 minutos)

```powershell
# 1. Backend corre?
curl http://localhost:5000/api/v1/admin/auth/me

# 2. Variables correctas?
Get-Content .env
# Debe mostrar: VITE_API_BASE_URL=http://localhost:5000/api/v1

# 3. Servidor reiniciado?
npm run dev

# 4. Configuración correcta?
# En navegador → Console:
window.apiDebug()
# Debe mostrar: withCredentials: true

# 5. Login funciona?
# Login con: admin_mycasino / admin123
# Verifica cookie en: DevTools → Application → Cookies

# ✅ Si todo esto pasa, estás listo!
```
