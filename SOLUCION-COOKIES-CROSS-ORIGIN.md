# ✅ Resumen: Configuración de Cookies Cross-Origin (Netlify → Railway)

## 🎯 Estado Actual

### Frontend (Netlify) - ✅ CORRECTO
- ✅ `withCredentials: true` configurado en axios
- ✅ Variables de entorno agregadas a `netlify.toml`
- ✅ URL del API correcta

### Backend (Railway) - ⚠️ VERIFICAR
**Necesitas verificar/actualizar la configuración del backend**

---

## 🚀 Pasos para Solucionar

### 1️⃣ Actualizar Backend (Railway)

#### A. Configuración de Cookies
En el endpoint de login, asegúrate de tener:

```csharp
var cookieOptions = new CookieOptions
{
    HttpOnly = true,
    Secure = true,                      // ✅ CRÍTICO
    SameSite = SameSiteMode.None,       // ✅ CRÍTICO
    Domain = null,
    Path = "/",
    MaxAge = TimeSpan.FromDays(7)
};

Response.Cookies.Append("jwt", token, cookieOptions);
```

#### B. Configuración de CORS
En `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "https://tu-app.netlify.app",    // ← Reemplaza con tu URL de Netlify
                "http://localhost:5173"
            )
            .AllowCredentials()                  // ✅ CRÍTICO
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Set-Cookie");   // ✅ CRÍTICO
    });
});

// IMPORTANTE: UseCors() ANTES de UseAuthentication()
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
```

#### C. Variables de Entorno en Railway
Agrega estas variables:
```
ALLOWED_ORIGINS=https://tu-app.netlify.app,http://localhost:5173
```

#### D. Redeploy en Railway
**IMPORTANTE:** Después de hacer cambios, haz un redeploy.

---

### 2️⃣ Verificar Frontend (Netlify)

#### A. Variables de Entorno
Ya están configuradas en `netlify.toml` ✅

Si prefieres configurarlas en el dashboard de Netlify:
1. Ve a: Site settings → Environment variables
2. Agrega:
   - `VITE_API_BASE_URL` = `https://casino-platform-production.up.railway.app/api/v1`
   - `VITE_NODE_ENV` = `production`
   - `VITE_ENABLE_API_LOGGING` = `false`

#### B. Redeploy en Netlify
Después de actualizar variables, haz un redeploy.

---

### 3️⃣ Probar

1. **Abre tu app en Netlify**
2. **Abre DevTools (F12)**
3. **Intenta hacer login**
4. **Verifica en Network tab:**
   - POST `/admin/auth/login`
   - Response Headers debe incluir:
     - `Set-Cookie: jwt=...; SameSite=None; Secure`
     - `Access-Control-Allow-Credentials: true`
     - `Access-Control-Allow-Origin: https://tu-app.netlify.app`

5. **Verifica en Application tab:**
   - Cookies → [tu-dominio.netlify.app]
   - Debe aparecer la cookie `jwt`

6. **Verifica que se envía en siguientes requests:**
   - Cualquier petición al API
   - Request Headers debe incluir: `Cookie: jwt=...`

---

## 🔥 Si Sigue Sin Funcionar

Comparte capturas de pantalla de:
1. Response Headers del POST `/admin/auth/login`
2. Cookies en Application tab
3. Request Headers de GET `/admin/auth/me`

Con eso puedo diagnosticar exactamente el problema.

---

## 📚 Documentación Completa

- `DIAGNOSTICO-COOKIES-PRODUCCION.md` - Diagnóstico detallado
- `COOKIE-CROSS-ORIGIN-FIX.md` - Guía completa de configuración
- `BACKEND-CORS-SETUP.md` - Configuración de CORS en backend

---

## 🎯 TL;DR (Resumen Ultra Corto)

**El problema más probable:**
- El backend NO tiene `SameSite=None` y `Secure=true` en las cookies
- El backend NO tiene `AllowCredentials()` en CORS
- La URL de Netlify NO está en `WithOrigins()` del backend

**Solución:**
1. Actualizar configuración de cookies en backend (agregar `SameSite=None; Secure`)
2. Actualizar CORS en backend (agregar `AllowCredentials()` y tu URL de Netlify)
3. Redeploy backend y frontend
4. Probar
