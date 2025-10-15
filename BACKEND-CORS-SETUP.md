# Configuración de CORS para el Backend

## 🎯 Objetivo

Configurar CORS en el backend para permitir que el frontend deployado pueda hacer peticiones al API con credenciales (cookies).

---

## 📋 Requisitos CRÍTICOS

Para que el sistema funcione en producción, el backend **DEBE**:

1. ✅ Permitir el origen del frontend en CORS
2. ✅ Tener `AllowCredentials = true` (para cookies HttpOnly)
3. ✅ Permitir headers: `Content-Type`, `Authorization`
4. ✅ Permitir métodos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
5. ✅ Usar HTTPS (obligatorio para cookies con `Secure` flag)

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
            .AllowCredentials()                    // ✅ CRÍTICO: permite cookies
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

        // 📌 Configurar cookie con las opciones correctas
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,           // ✅ No accesible desde JavaScript
            Secure = true,             // ✅ Solo HTTPS (CRÍTICO en producción)
            SameSite = SameSiteMode.None, // ✅ Permite cross-origin (CRÍTICO)
            Domain = Configuration["COOKIE_DOMAIN"], // ej: ".tudominio.com"
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
            SameSite = SameSiteMode.None,
            Domain = Configuration["COOKIE_DOMAIN"],
            Path = "/",
            MaxAge = TimeSpan.FromDays(-1) // Expirar inmediatamente
        };

        Response.Cookies.Delete("auth_token", cookieOptions);

        return Ok(new { success = true });
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
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

// Configurar CORS
app.use(cors({
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
  credentials: true,           // Permite cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());
app.use(express.json());

// Login endpoint
app.post('/api/v1/auth/login', (req, res) => {
  // ... validación ...
  
  const token = generateJwtToken(user);
  
  // Configurar cookie
  res.cookie('auth_token', token, {
    httpOnly: true,        // No accesible desde JS
    secure: true,          // Solo HTTPS
    sameSite: 'none',      // Cross-origin
    domain: '.tudominio.com',
    maxAge: 604800000,     // 7 días en ms
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
  credentials: 'include',  // Incluir cookies
})
  .then(r => r.json())
  .then(data => console.log('✅ CORS funciona:', data))
  .catch(err => console.error('❌ CORS error:', err));

// Test de login
fetch('https://casino-platform-production.up.railway.app/api/v1/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test123' })
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

### Error 3: "Cookie blocked because SameSite=None requires Secure"

**Causa:** Cookie con `SameSite=None` sin el flag `Secure=true`.

**Solución:**
```csharp
cookieOptions.Secure = true;     // Requiere HTTPS
cookieOptions.SameSite = SameSiteMode.None;
```

### Error 4: "Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'"

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

## 📝 Checklist de Configuración

### Backend
- [ ] Variable `ALLOWED_ORIGINS` configurada con el dominio del frontend
- [ ] `AllowCredentials()` habilitado en CORS
- [ ] Cookie con `HttpOnly = true`
- [ ] Cookie con `Secure = true` (en producción)
- [ ] Cookie con `SameSite = None` (para cross-origin)
- [ ] Cookie con `Domain` configurado correctamente
- [ ] HTTPS habilitado en producción

### Frontend
- [ ] Variable `VITE_API_BASE_URL` apunta al backend correcto
- [ ] `withCredentials: true` en axios config
- [ ] Requests usan HTTPS
- [ ] Dominio del frontend agregado a CORS en backend

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
