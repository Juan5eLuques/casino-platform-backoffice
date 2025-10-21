# 🍪 Fix: Cookies Cross-Origin (Frontend en Netlify/Vercel → Backend en Railway)

## Problema

Las cookies **NO se envían** cuando el frontend y backend están en dominios diferentes, porque:

1. El navegador bloquea cookies cross-origin por defecto
2. El backend no está configurando las cookies con los atributos necesarios

## ✅ Solución Completa

### 1️⃣ BACKEND - Configurar Cookies para Cross-Origin

El backend DEBE establecer las cookies con estos atributos:

```csharp
// En tu método de login o donde generas la cookie JWT

var cookieOptions = new CookieOptions
{
    HttpOnly = true,           // ✅ Seguridad: no accesible desde JavaScript
    Secure = true,             // ✅ OBLIGATORIO: solo HTTPS (Railway usa HTTPS)
    SameSite = SameSiteMode.None,  // ✅ CRÍTICO: permite cross-origin
    Domain = null,             // ✅ NO especificar dominio (o usar dominio padre si compartes)
    Path = "/",
    MaxAge = TimeSpan.FromDays(7),  // O el tiempo que prefieras
    IsEssential = true
};

Response.Cookies.Append("jwt", token, cookieOptions);
```

### 2️⃣ BACKEND - CORS Configuration

El backend DEBE permitir credenciales y el origen del frontend:

```csharp
// En Program.cs o Startup.cs

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "https://tu-app.netlify.app",        // ✅ URL de tu frontend en Netlify
                "https://tu-app.vercel.app",         // ✅ O Vercel
                "http://localhost:5173",             // Para desarrollo
                "http://localhost:3000"
            )
            .AllowCredentials()                      // ✅ CRÍTICO: permite cookies
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Set-Cookie");       // ✅ Expone la cookie al navegador
    });
});

// IMPORTANTE: UseCors() ANTES de UseAuthentication() y UseAuthorization()
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
```

### 3️⃣ FRONTEND - Ya está configurado ✅

Tu `apiClient` ya tiene `withCredentials: true`, que es correcto:

```typescript
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Ya configurado
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

## 🔍 Verificar en el Backend

### Verifica los Headers de la Respuesta de Login

Cuando haces login, la respuesta debe incluir:

```
Set-Cookie: jwt=eyJhbGc...; Path=/; HttpOnly; Secure; SameSite=None
Access-Control-Allow-Origin: https://tu-app.netlify.app
Access-Control-Allow-Credentials: true
```

### Cómo verificar en el navegador

1. Abre DevTools → Network
2. Haz login
3. Busca la petición POST `/auth/login`
4. En la pestaña **Headers**, verifica:
   - `Set-Cookie` incluye `SameSite=None; Secure`
   - `Access-Control-Allow-Credentials: true`

## ⚠️ Errores Comunes

### Error 1: Cookie no se guarda

**Causa:** Falta `Secure=true` o `SameSite=None`
**Solución:** Agregar ambos atributos en el backend

### Error 2: CORS error al hacer login

**Causa:** Falta `AllowCredentials()` en CORS o el origen no está permitido
**Solución:** Verificar configuración de CORS en el backend

### Error 3: Cookie se guarda pero no se envía en siguientes requests

**Causa:** Falta `withCredentials: true` en Axios (ya lo tienes ✅)
**Solución:** Ya está configurado correctamente

## 🎯 Checklist Backend

- [ ] `Secure = true` en CookieOptions
- [ ] `SameSite = SameSiteMode.None` en CookieOptions
- [ ] `AllowCredentials()` en configuración de CORS
- [ ] URL del frontend en `WithOrigins()`
- [ ] `UseCors()` ANTES de `UseAuthentication()`
- [ ] Backend desplegado en HTTPS (Railway ya lo tiene)
- [ ] Variables de entorno actualizadas con URL del frontend

## 🚀 Despliegue

### En Railway (Backend)

Actualiza la variable de entorno:

```bash
ALLOWED_ORIGINS=https://tu-app.netlify.app,http://localhost:5173
```

Luego redeploy el backend.

### En Netlify/Vercel (Frontend)

Ya está configurado, solo verifica que la URL del API sea correcta:

```bash
VITE_API_BASE_URL=https://casino-platform-production.up.railway.app/api/v1
```

## 📚 Referencias

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [MDN: CORS credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
- [Axios: withCredentials](https://axios-http.com/docs/req_config)

## 🆘 Si sigue sin funcionar

1. Verifica en DevTools → Application → Cookies si la cookie se guarda
2. Verifica en DevTools → Network → Headers si la cookie se envía en las requests
3. Comparte los headers de la respuesta de login para debug
