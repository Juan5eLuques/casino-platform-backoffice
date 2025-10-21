# Configuración de CORS para el Backend

## 🎯 Objetivo

Configurar CORS en el backend para permitir que el frontend deployado pueda hacer peticiones al API con credenciales (cookies) usando **SameSite=Lax** para mejor aislamiento multi-brand.

---

## ⚠️ CAMBIO IMPORTANTE: SameSite=Lax

**ACTUALIZACIÓN:** El backend ahora usa `SameSite=Lax` en lugar de `SameSite=None` para mejor aislamiento de sesiones multi-brand.

### Implicaciones:

1. ✅ **Same-Origin**: Frontend y Backend deben estar en el **mismo dominio base**
   - ✅ Correcto: `https://sitea.com` → `https://api.sitea.com`
   - ❌ Incorrecto: `https://sitea.com` → `https://api.siteb.com`

2. ✅ **Cookies Aisladas**: Cada brand tiene su cookie independiente
   - `sitea.com` → Cookie con `Domain=.sitea.com`
   - `siteb.com` → Cookie con `Domain=.siteb.com`

3. ✅ **Mayor Seguridad**: Protección mejorada contra CSRF

---

## 📋 Requisitos CRÍTICOS

Para que el sistema funcione en producción, el backend **DEBE**:

1. ✅ Permitir el origen del frontend en CORS
2. ✅ Tener `AllowCredentials = true` (para cookies HttpOnly) - **CRÍTICO**
3. ✅ Configurar cookies con `SameSite=Lax` y `Secure=true` - **ACTUALIZADO**
4. ✅ Configurar `Domain` específico por brand en producción - **NUEVO**
5. ✅ Validar brand en login (403 si no corresponde) - **NUEVO**
6. ✅ Permitir headers: `Content-Type`, `Authorization`
7. ✅ Permitir métodos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
8. ✅ Usar HTTPS (obligatorio para cookies con `Secure` flag)

---

## 🔧 Configuración en .NET (C#)

### 1. Agregar Variables de Entorno

En Railway, agrega estas variables de entorno:

```bash
# Origins permitidos (separados por coma)
ALLOWED_ORIGINS=http://localhost:5173,https://tu-app.vercel.app,https://tu-app.netlify.app,https://admin.tudominio.com

# Cookie Settings
COOKIE_DOMAIN=.tudominio.com
COOKIE_SECURE=true
COOKIE_SAMESITE=None
```

### 2. Configurar CORS en `Program.cs` o `Startup.cs`

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 📌 1. Leer origins permitidos desde configuración
var allowedOrigins = builder.Configuration["ALLOWED_ORIGINS"]?.Split(',')
    ?? new[] { "http://localhost:5173" };

// 📌 2. Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", corsBuilder =>
    {
        corsBuilder
            .WithOrigins(allowedOrigins)           // ✅ Origins específicos
            .AllowAnyMethod()                      // ✅ Todos los métodos HTTP
            .AllowAnyHeader()                      // ✅ Todos los headers
            .AllowCredentials()                    // ✅ CRÍTICO: permite cookies cross-origin
            .WithExposedHeaders("Set-Cookie")      // ✅ CRÍTICO: expone cookie al navegador
            .SetIsOriginAllowed(origin =>          // ✅ Validación custom (opcional)
            {
                // Log para debugging
                Console.WriteLine($"[CORS] Origin request: {origin}");
                return allowedOrigins.Contains(origin) || origin.Contains("localhost");
            });
    });
});

var app = builder.Build();

// 📌 3. Usar CORS (ANTES de routing y endpoints)
app.UseCors("AllowFrontend");

// 📌 4. HTTPS Redirection en producción
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### 3. Configurar Cookies en el Controller

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // ... validación de credenciales ...

        var token = GenerateJwtToken(user);

        // 📌 NUEVA CONFIGURACIÓN: Cookies específicas por brand con SameSite=Lax
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,                      // ✅ No accesible desde JavaScript
            Secure = true,                        // ✅ Solo HTTPS (CRÍTICO en producción)
            SameSite = SameSiteMode.Lax,          // ✅ NUEVO: Lax para mejor seguridad multi-brand
            Domain = GetBrandDomain(),            // ✅ NUEVO: Domain específico por brand (sitea.com, siteb.com)
            Path = "/",
            MaxAge = TimeSpan.FromDays(7),
            IsEssential = true
        };

        Response.Cookies.Append("auth_token", token, cookieOptions);

        return Ok(new { success = true, user = userDto });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // 📌 Eliminar cookie con las mismas opciones
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax,          // ✅ NUEVO: Lax
            Domain = GetBrandDomain(),            // ✅ NUEVO: Domain específico por brand
            Path = "/",
            MaxAge = TimeSpan.FromDays(-1) // Expirar inmediatamente
        };

        Response.Cookies.Delete("auth_token", cookieOptions);

        return Ok(new { success = true });
    }

    // 📌 NUEVO: Helper para obtener domain del brand actual
    private string GetBrandDomain()
    {
        var brand = HttpContext.Items["Brand"] as string; // Brand viene del middleware
        return brand switch
        {
            "sitea" => "sitea.com",
            "siteb" => "siteb.com",
            _ => null // En desarrollo/localhost
        };
    }
}
```

---

## 🐍 Configuración en Python (FastAPI)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Leer origins desde variables de entorno
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,          # Origins específicos
    allow_credentials=True,                 # Permite cookies
    allow_methods=["*"],                    # Todos los métodos
    allow_headers=["*"],                    # Todos los headers
    expose_headers=["*"],
)

@app.post("/api/v1/auth/login")
async def login(response: Response, credentials: LoginRequest):
    # ... validación ...

    token = create_jwt_token(user)

    # Configurar cookie
    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,         # No accesible desde JS
        secure=True,           # Solo HTTPS
        samesite="none",       # Cross-origin
        domain=".tudominio.com",
        max_age=604800,        # 7 días
    )

    return {"success": True, "user": user_dict}
```

---

## 🟢 Configuración en Node.js (Express)

```javascript
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Leer origins desde variables de entorno
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:5173'
).split(',');

// Configurar CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (ej: mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`[CORS] Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Permite cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(cookieParser());
app.use(express.json());

// Login endpoint
app.post('/api/v1/auth/login', (req, res) => {
  // ... validación ...

  const token = generateJwtToken(user);

  // Configurar cookie
  res.cookie('auth_token', token, {
    httpOnly: true, // No accesible desde JS
    secure: true, // Solo HTTPS
    sameSite: 'none', // Cross-origin
    domain: '.tudominio.com',
    maxAge: 604800000, // 7 días en ms
  });

  res.json({ success: true, user: userDto });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Allowed origins:', allowedOrigins);
});
```

---

## 🧪 Testing de CORS

### 1. Test con curl

```bash
# Test preflight (OPTIONS)
curl -X OPTIONS \
  -H "Origin: https://tu-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v \
  https://casino-platform-production.up.railway.app/api/v1/auth/login

# Debe responder con:
# Access-Control-Allow-Origin: https://tu-app.vercel.app
# Access-Control-Allow-Credentials: true
# Access-Control-Allow-Methods: POST, ...
```

### 2. Test desde el navegador

Abre la consola del navegador en tu app deployada:

```javascript
// Test de CORS
fetch('https://casino-platform-production.up.railway.app/api/v1/health', {
  method: 'GET',
  credentials: 'include', // Incluir cookies
})
  .then(r => r.json())
  .then(data => console.log('✅ CORS funciona:', data))
  .catch(err => console.error('❌ CORS error:', err));

// Test de login
fetch('https://casino-platform-production.up.railway.app/api/v1/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test123' }),
})
  .then(r => r.json())
  .then(data => console.log('✅ Login funciona:', data))
  .catch(err => console.error('❌ Login error:', err));
```

### 3. Verificar en Network Tab

1. Abrir DevTools → Network
2. Hacer login
3. Verificar request a `/api/v1/auth/login`:
   - ✅ Status: 200
   - ✅ Response Headers: `Set-Cookie: auth_token=...`
   - ✅ Request Headers: `Origin: https://tu-app.vercel.app`
   - ✅ Response Headers: `Access-Control-Allow-Origin: https://tu-app.vercel.app`
   - ✅ Response Headers: `Access-Control-Allow-Credentials: true`

---

## ❌ Errores Comunes

### Error 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** El backend no tiene configurado CORS o no incluye el origin del frontend.

**Solución:**

```csharp
// Agregar el origin del frontend a ALLOWED_ORIGINS
ALLOWED_ORIGINS=http://localhost:5173,https://tu-app.vercel.app
```

### Error 2: "Credentials flag is 'true', but 'Access-Control-Allow-Credentials' header is ''"

**Causa:** `AllowCredentials()` no está configurado en el backend.

**Solución:**

```csharp
corsBuilder.AllowCredentials();  // Agregar esta línea
```

### Error 3: "Cookie blocked because SameSite=Lax requires same-origin"

**Causa:** Con `SameSite=Lax`, las cookies solo se envían en requests al mismo dominio (o subdominio).

**Solución (Nueva Arquitectura Multi-Brand):**

```bash
# Opción 1: Frontend y Backend en mismo dominio/subdominio
Frontend: https://app.sitea.com
Backend:  https://api.sitea.com
# ✅ Ambos en sitea.com - cookies funcionan

# Opción 2: Configurar /etc/hosts en desarrollo
# /etc/hosts (Linux/Mac) o C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 sitea.local
127.0.0.1 siteb.local

# Acceder a: http://sitea.local:5173
```

**Ver más detalles en:** `MULTI-BRAND-FRONTEND-GUIDE.md`

### Error 4: "brand_not_resolved" (Error 400)

**Causa:** Backend no pudo determinar el brand del request (falta header `X-Brand` o cookie con domain).

**Solución:**

1. Verificar que frontend esté desplegado en dominio específico del brand (ej: `sitea.com`)
2. En desarrollo local, usar `/etc/hosts` para mapear `sitea.local` → `127.0.0.1`
3. Backend debería resolver brand automáticamente desde el dominio

### Error 5: "Forbidden: Brand mismatch" (Error 403)

**Causa:** Usuario intentando hacer login en brand incorrecto (ej: usuario de SiteA intentando login en SiteB).

**Solución:**

- Verificar que el usuario pertenezca al brand correcto en la base de datos
- En desarrollo, asegurarse de acceder al dominio correcto (`sitea.local` vs `siteb.local`)

### Error 6: "Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'"

**Causa:** Frontend en HTTPS intentando conectar a backend en HTTP.

**Solución:** Usar HTTPS en el backend también.

---

## 🔍 Logs de Debugging

Agregar logs en el backend para debugging:

```csharp
// En el método de configuración de CORS
.SetIsOriginAllowed(origin =>
{
    Console.WriteLine($"[CORS] Origin request: {origin}");
    Console.WriteLine($"[CORS] Allowed origins: {string.Join(", ", allowedOrigins)}");
    var isAllowed = allowedOrigins.Contains(origin);
    Console.WriteLine($"[CORS] Is allowed: {isAllowed}");
    return isAllowed;
});
```

---

## 📝 Checklist de Configuración (Actualizado para Multi-Brand)

### Backend

- [ ] Variable `ALLOWED_ORIGINS` configurada con dominios del frontend por brand
- [ ] `AllowCredentials()` habilitado en CORS
- [ ] Cookie con `HttpOnly = true`
- [ ] Cookie con `Secure = true` (en producción)
- [ ] Cookie con `SameSite = Lax` (NUEVO - para aislamiento multi-brand)
- [ ] Cookie con `Domain` específico por brand (ej: `sitea.com`, `siteb.com`)
- [ ] Middleware de brand resolution implementado
- [ ] Validación de brand en login (403 si mismatch)
- [ ] HTTPS habilitado en producción

### Frontend

- [ ] Variable `VITE_API_BASE_URL` apunta al backend correcto
- [ ] `withCredentials: true` en axios config
- [ ] Requests usan HTTPS
- [ ] Frontend desplegado en dominios específicos por brand (ej: `app.sitea.com`)
- [ ] Configuración `/etc/hosts` para desarrollo local (ver `MULTI-BRAND-FRONTEND-GUIDE.md`)
- [ ] Dominio del frontend agregado a CORS en backend

### Desarrollo Local

- [ ] Archivo `/etc/hosts` configurado con `sitea.local` y `siteb.local`
- [ ] Acceso mediante dominios locales (no usar `localhost` directamente)
- [ ] Backend resuelve brand correctamente desde request headers/domain

### Testing

- [ ] curl test de OPTIONS request funciona
- [ ] Login desde el frontend funciona
- [ ] Cookie `auth_token` se envía en requests subsecuentes
- [ ] No hay errores de CORS en la consola

---

## 🎯 Variables de Entorno en Railway

En el dashboard de Railway para el backend, agrega:

```bash
ALLOWED_ORIGINS=http://localhost:5173,https://casino-backoffice.vercel.app
COOKIE_DOMAIN=.vercel.app
COOKIE_SECURE=true
COOKIE_SAMESITE=None
ASPNETCORE_ENVIRONMENT=Production
```

---

**Importante:** Después de configurar CORS, **redeploy el backend** para que los cambios tomen efecto.

---

**Última actualización:** 15 de octubre de 2025
