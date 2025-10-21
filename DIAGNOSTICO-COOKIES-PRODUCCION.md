# 🔍 Diagnóstico Completo: Cookies Cross-Origin (Netlify → Railway)

## ❌ PROBLEMA IDENTIFICADO

**Las cookies NO se envían desde Netlify (producción) a Railway (API)**

- ✅ En local funciona (porque ambos están en localhost)
- ❌ En producción NO funciona (diferentes dominios)

---

## 🎯 Configuración Actual

### Frontend (Netlify)

- ✅ `withCredentials: true` en axios ✅
- ✅ Variable `VITE_API_BASE_URL` apunta a Railway ✅
- ❌ **FALTA**: Variables de entorno en Netlify

### Backend (Railway)

- ⚠️ **DESCONOCIDO**: Configuración de cookies
- ⚠️ **DESCONOCIDO**: Configuración de CORS

---

## ✅ LISTA DE VERIFICACIÓN COMPLETA

### 1️⃣ Frontend - Netlify

#### A. Variables de Entorno en Netlify

**Estado:** ⚠️ VERIFICAR

En el dashboard de Netlify → Site settings → Environment variables, debes tener:

```bash
VITE_API_BASE_URL=https://casino-platform-production.up.railway.app/api/v1
VITE_NODE_ENV=production
VITE_ENABLE_API_LOGGING=false
```

**Acción requerida:**

1. Ve a: https://app.netlify.com/sites/[tu-site]/settings/deploys#environment
2. Agrega las variables si no existen
3. Haz un redeploy después de agregar las variables

---

#### B. Código del Frontend

**Estado:** ✅ CORRECTO

```typescript
// src/api/client.ts
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ CORRECTO
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

---

### 2️⃣ Backend - Railway

#### A. Configuración de Cookies en el Login

**Estado:** ⚠️ VERIFICAR

El backend DEBE configurar las cookies así:

```csharp
// En el endpoint de login (/admin/auth/login)
var cookieOptions = new CookieOptions
{
    HttpOnly = true,                    // ✅ Seguridad
    Secure = true,                      // ✅ CRÍTICO: Solo HTTPS
    SameSite = SameSiteMode.None,       // ✅ CRÍTICO: Permite cross-origin
    Domain = null,                      // ✅ NO especificar dominio
    Path = "/",
    MaxAge = TimeSpan.FromDays(7),
    IsEssential = true
};

Response.Cookies.Append("jwt", token, cookieOptions);
```

**Acción requerida:**

- Verificar que el backend tenga `SameSite=None` y `Secure=true`
- Si no lo tiene, actualizar el código del backend

---

#### B. Configuración de CORS

**Estado:** ⚠️ VERIFICAR

El backend DEBE tener esta configuración:

```csharp
// En Program.cs o Startup.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "https://tu-app.netlify.app",        // ← TU URL DE NETLIFY
                "http://localhost:5173"
            )
            .AllowCredentials()                      // ✅ CRÍTICO
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Set-Cookie");       // ✅ CRÍTICO
    });
});

// IMPORTANTE: UseCors() ANTES de UseAuthentication()
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
```

**Acción requerida:**

1. Verificar que `AllowCredentials()` esté presente
2. Verificar que tu URL de Netlify esté en `WithOrigins()`
3. Verificar que `WithExposedHeaders("Set-Cookie")` esté presente

---

#### C. Variables de Entorno en Railway

**Estado:** ⚠️ VERIFICAR

En Railway → Variables → Agregar:

```bash
ALLOWED_ORIGINS=https://tu-app.netlify.app,http://localhost:5173
COOKIE_SECURE=true
COOKIE_SAMESITE=None
```

**Acción requerida:**

1. Ve a: https://railway.app/project/[tu-proyecto]/settings
2. Agrega las variables si no existen
3. Haz un redeploy después de agregar las variables

---

## 🧪 PRUEBAS

### Paso 1: Verificar que las cookies se configuran correctamente

1. Abre tu app en Netlify
2. Abre DevTools (F12) → Network
3. Haz login
4. Busca la petición POST `/admin/auth/login`
5. En "Response Headers", verifica:

```
Set-Cookie: jwt=eyJhbG...; Path=/; HttpOnly; Secure; SameSite=None
Access-Control-Allow-Origin: https://tu-app.netlify.app
Access-Control-Allow-Credentials: true
```

**✅ Si ves estos headers:** El backend está configurado correctamente
**❌ Si NO ves `SameSite=None; Secure`:** El backend necesita actualización
**❌ Si NO ves `Allow-Credentials: true`:** CORS está mal configurado

---

### Paso 2: Verificar que la cookie se guarda

1. En DevTools → Application → Cookies
2. Busca tu dominio de Netlify
3. ¿Ves una cookie llamada `jwt`?

**✅ Si la ves:** La cookie se guardó correctamente
**❌ Si NO la ves:** El navegador bloqueó la cookie (problema de `SameSite`)

---

### Paso 3: Verificar que la cookie se envía

1. En DevTools → Network
2. Haz cualquier petición (ej: navega a otra página)
3. Busca una petición GET al API (ej: `/admin/auth/me`)
4. En "Request Headers", verifica:

```
Cookie: jwt=eyJhbG...
```

**✅ Si ves el header Cookie:** La cookie SÍ se está enviando (perfecto)
**❌ Si NO ves el header Cookie:** La cookie NO se está enviando (problema de CORS o SameSite)

---

## 🔥 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: Cookie no se guarda después de login

**Causa:** Falta `SameSite=None; Secure` en el backend
**Solución:**

```csharp
var cookieOptions = new CookieOptions
{
    SameSite = SameSiteMode.None,  // ← Agregar esto
    Secure = true                   // ← Agregar esto
};
```

---

### Problema 2: Error CORS al hacer login

**Causa:** El origen de Netlify no está permitido en CORS
**Solución:**

```csharp
policy.WithOrigins("https://tu-app.netlify.app")  // ← Agregar tu URL
```

---

### Problema 3: Cookie se guarda pero no se envía

**Causa:** Falta `AllowCredentials()` en CORS
**Solución:**

```csharp
policy.AllowCredentials()  // ← Agregar esto
```

---

### Problema 4: Variables de entorno no se aplican

**Causa:** No se hizo redeploy después de agregar las variables
**Solución:**

1. Después de agregar variables en Netlify o Railway
2. Hacer un **redeploy manual**
3. Las variables solo se aplican en nuevos deploys

---

## 📋 CHECKLIST RÁPIDO

Backend (Railway):

- [ ] `SameSite = SameSiteMode.None` en cookies
- [ ] `Secure = true` en cookies
- [ ] `AllowCredentials()` en CORS
- [ ] URL de Netlify en `WithOrigins()`
- [ ] `WithExposedHeaders("Set-Cookie")` en CORS
- [ ] Variable `ALLOWED_ORIGINS` incluye URL de Netlify
- [ ] Redeploy después de cambios

Frontend (Netlify):

- [ ] `withCredentials: true` en axios ✅
- [ ] Variable `VITE_API_BASE_URL` configurada en Netlify
- [ ] Redeploy después de agregar variables

---

## 🎯 PRÓXIMOS PASOS

1. **Verificar configuración del backend** (lo más probable)
   - Revisar que tenga `SameSite=None` y `Secure=true`
   - Revisar CORS con `AllowCredentials()`

2. **Agregar variables de entorno en Netlify**
   - `VITE_API_BASE_URL`
   - Hacer redeploy

3. **Agregar URL de Netlify en backend**
   - Variable `ALLOWED_ORIGINS` en Railway
   - Hacer redeploy

4. **Probar con DevTools**
   - Verificar headers de Set-Cookie
   - Verificar que la cookie se guarda y se envía

---

## 📞 ¿Necesitas ayuda?

Si después de verificar todo esto sigue sin funcionar, comparte:

1. Screenshot de los headers de la respuesta de login
2. Screenshot de las cookies en Application tab
3. Screenshot de los headers de la request de /me
4. Configuración de CORS de tu backend

Con esa información puedo diagnosticar exactamente dónde está el problema.
