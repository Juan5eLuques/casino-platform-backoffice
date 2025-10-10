# 🔧 CONFIGURACIÓN DE BACKEND PARA COOKIES

## 📋 Requisitos para que las Cookies Funcionen

Tu backend debe:

1. ✅ Configurar CORS con `AllowCredentials()`
2. ✅ Permitir el origen `http://localhost:5173` (frontend dev)
3. ✅ Enviar cookies con los atributos correctos
4. ✅ Validar cookies en requests protegidos

---

## 🎯 ASP.NET Core (.NET 6/7/8)

### 1. Configuración de CORS

#### Program.cs o Startup.cs

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// CONFIGURACIÓN DE CORS (IMPORTANTE)
// ============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            // Orígenes permitidos
            .WithOrigins(
                "http://localhost:5173",    // ✅ Vite dev server
                "http://localhost:5174",    // ✅ Vite alternativo
                "https://admin.bet30.com"   // ✅ Producción (ajusta según tu dominio)
            )
            // ✅ CRÍTICO: AllowCredentials permite cookies
            .AllowCredentials()
            // Métodos permitidos
            .AllowAnyMethod()
            // Headers permitidos
            .AllowAnyHeader()
            // Exponer headers si es necesario
            .WithExposedHeaders("Set-Cookie");
    });
});

// Otros servicios...
builder.Services.AddControllers();
builder.Services.AddAuthentication(...);
builder.Services.AddAuthorization();

var app = builder.Build();

// ============================================
// MIDDLEWARE - ORDEN IMPORTANTE
// ============================================

// 1. CORS primero (antes de Authentication)
app.UseCors("AllowFrontend");

// 2. Authentication
app.UseAuthentication();

// 3. Authorization
app.UseAuthorization();

// 4. Controllers
app.MapControllers();

app.Run();
```

**⚠️ IMPORTANTE:**
- `AllowCredentials()` es **OBLIGATORIO** para cookies
- CORS debe ir **ANTES** de `UseAuthentication()` y `UseAuthorization()`
- NO uses `.AllowAnyOrigin()` con `.AllowCredentials()` (no es compatible)

---

### 2. Endpoint de Login (Envía Cookie)

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

[ApiController]
[Route("api/v1/admin/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // 1. Validar credenciales (tu lógica)
        var user = ValidateCredentials(request.Username, request.Password);
        
        if (user == null)
        {
            return Unauthorized(new { message = "Credenciales inválidas" });
        }

        // 2. Generar JWT
        var token = GenerateJwtToken(user);

        // ============================================
        // 3. CONFIGURAR Y ENVIAR COOKIE
        // ============================================
        var cookieOptions = new CookieOptions
        {
            // ✅ HttpOnly: Cookie NO accesible desde JavaScript
            HttpOnly = true,
            
            // ✅ Secure: true para HTTPS, false para HTTP
            // En desarrollo (HTTP): false
            // En producción (HTTPS): true
            Secure = false, // ⚠️ Cambia a true en producción con HTTPS
            
            // ✅ SameSite: Lax para same-site, None para cross-domain
            // Desarrollo (localhost → localhost): Lax
            // Producción (cross-domain): None (requiere Secure=true)
            SameSite = SameSiteMode.Lax, // ⚠️ Usa None si es cross-domain en producción
            
            // ✅ Path: "/" para que funcione en todos los endpoints
            // ⚠️ IMPORTANTE: NO uses "/admin" o la cookie no se enviará a /api/v1/admin/...
            Path = "/",
            
            // ✅ Expiración: Ajusta según tus necesidades
            Expires = DateTime.UtcNow.AddDays(7),
        };

        // Enviar cookie al navegador
        Response.Cookies.Append("bk.token", token, cookieOptions);

        // 4. Responder con info del usuario (SIN el token en el body)
        return Ok(new
        {
            user = new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email,
                role = user.Role,
                // ... otros campos
            }
        });
    }
}
```

**Atributos Importantes de Cookie:**

| Atributo | Desarrollo (HTTP) | Producción (HTTPS) | Explicación |
|----------|-------------------|---------------------|-------------|
| `HttpOnly` | `true` | `true` | Previene acceso desde JS (seguridad) |
| `Secure` | `false` | `true` | Requiere HTTPS (true solo con SSL) |
| `SameSite` | `Lax` | `Lax` o `None` | `Lax` = same-site, `None` = cross-domain |
| `Path` | `/` | `/` | Ruta donde aplica la cookie |
| `Expires` | `+7 días` | `+7 días` | Tiempo de vida |

---

### 3. Middleware de Autenticación (Lee Cookie)

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// En Program.cs o Startup.cs:

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            ),
            ClockSkew = TimeSpan.Zero
        };

        // ============================================
        // CONFIGURAR PARA LEER TOKEN DESDE COOKIE
        // ============================================
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // 1. Intentar leer token desde cookie
                if (context.Request.Cookies.TryGetValue("bk.token", out var token))
                {
                    context.Token = token;
                }
                // 2. Si no hay cookie, intentar desde header Authorization
                // (esto permite ambos métodos: cookie o bearer token)
                else if (context.Request.Headers.ContainsKey("Authorization"))
                {
                    var authHeader = context.Request.Headers["Authorization"].ToString();
                    if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        context.Token = authHeader.Substring("Bearer ".Length).Trim();
                    }
                }

                return Task.CompletedTask;
            }
        };
    });
```

---

### 4. Endpoint Protegido (Requiere Cookie)

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/v1/admin")]
public class OperatorsController : ControllerBase
{
    // ✅ [Authorize] valida automáticamente la cookie
    [Authorize]
    [HttpGet("operators")]
    public IActionResult GetOperators([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        // Si llegamos aquí, el token es válido
        // Podemos obtener info del usuario desde el token:
        var userId = User.FindFirst("sub")?.Value;
        var role = User.FindFirst("role")?.Value;

        // Tu lógica para obtener operadores...
        var operators = GetOperatorsFromDatabase(page, pageSize);

        return Ok(new
        {
            items = operators,
            total = operators.Count,
            page = page,
            pageSize = pageSize
        });
    }
}
```

---

### 5. Endpoint de Logout (Elimina Cookie)

```csharp
[ApiController]
[Route("api/v1/admin/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // ============================================
        // ELIMINAR COOKIE DEL NAVEGADOR
        // ============================================
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // ⚠️ Debe coincidir con la configuración de login
            SameSite = SameSiteMode.Lax,
            Path = "/",
            // ✅ Max-Age = 0 elimina la cookie inmediatamente
            MaxAge = TimeSpan.Zero,
        };

        // Enviar cookie vacía con Max-Age=0
        Response.Cookies.Append("bk.token", "", cookieOptions);

        // Alternativa: usar Delete
        // Response.Cookies.Delete("bk.token", cookieOptions);

        return Ok(new { message = "Logout exitoso" });
    }
}
```

---

## 🔧 appsettings.json

```json
{
  "Jwt": {
    "Key": "TU_CLAVE_SECRETA_MUY_LARGA_Y_SEGURA_DE_AL_MENOS_32_CARACTERES",
    "Issuer": "CasinoBackoffice",
    "Audience": "CasinoBackofficeUsers",
    "ExpirationDays": 7
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## 🔧 Node.js + Express

### 1. Instalación de dependencias

```bash
npm install express cors cookie-parser jsonwebtoken
npm install --save-dev @types/express @types/cookie-parser @types/jsonwebtoken
```

---

### 2. Configuración de CORS

```javascript
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// ============================================
// CONFIGURACIÓN DE CORS
// ============================================
app.use(cors({
    // Orígenes permitidos
    origin: [
        'http://localhost:5173',   // ✅ Vite dev server
        'http://localhost:5174',   // ✅ Vite alternativo
        'https://admin.bet30.com'  // ✅ Producción
    ],
    // ✅ CRÍTICO: credentials permite cookies
    credentials: true,
    // Métodos permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // Headers permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Exponer headers
    exposedHeaders: ['Set-Cookie']
}));

// Middleware para parsear JSON
app.use(express.json());

// ✅ IMPORTANTE: Middleware para parsear cookies
app.use(cookieParser());

// ... tus rutas
```

---

### 3. Endpoint de Login (Envía Cookie)

```javascript
const jwt = require('jsonwebtoken');

app.post('/api/v1/admin/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Validar credenciales
    const user = await validateCredentials(username, password);
    
    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 2. Generar JWT
    const token = jwt.sign(
        {
            sub: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    // ============================================
    // 3. ENVIAR COOKIE
    // ============================================
    res.cookie('bk.token', token, {
        httpOnly: true,           // ✅ No accesible desde JS
        secure: false,            // ✅ false para HTTP, true para HTTPS
        sameSite: 'lax',          // ✅ 'lax' para same-site, 'none' para cross-domain
        path: '/',                // ✅ "/" para todos los endpoints
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    });

    // 4. Responder con info del usuario
    res.json({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
});
```

---

### 4. Middleware de Autenticación (Lee Cookie)

```javascript
const jwt = require('jsonwebtoken');

// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================
function authenticateToken(req, res, next) {
    // 1. Intentar leer token desde cookie
    let token = req.cookies['bk.token'];
    
    // 2. Si no hay cookie, intentar desde header Authorization
    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    // 3. Si no hay token, devolver 401
    if (!token) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    // 4. Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        // 5. Guardar info del usuario en request
        req.user = user;
        next();
    });
}

// Exportar para usar en rutas
module.exports = { authenticateToken };
```

---

### 5. Endpoint Protegido

```javascript
const { authenticateToken } = require('./middleware/auth');

// ✅ Usar middleware de autenticación
app.get('/api/v1/admin/operators', authenticateToken, async (req, res) => {
    // Si llegamos aquí, el token es válido
    const userId = req.user.sub;
    const userRole = req.user.role;

    // Tu lógica...
    const operators = await getOperatorsFromDatabase();

    res.json({
        items: operators,
        total: operators.length
    });
});
```

---

### 6. Endpoint de Logout

```javascript
app.post('/api/v1/admin/auth/logout', (req, res) => {
    // ============================================
    // ELIMINAR COOKIE
    // ============================================
    res.clearCookie('bk.token', {
        httpOnly: true,
        secure: false,  // ⚠️ Debe coincidir con login
        sameSite: 'lax',
        path: '/'
    });

    res.json({ message: 'Logout exitoso' });
});
```

---

## 🐛 Debugging en Backend

### Ver cookies recibidas

```csharp
// ASP.NET Core
[HttpGet("debug-cookies")]
public IActionResult DebugCookies()
{
    var cookies = Request.Cookies.Select(c => new { c.Key, c.Value });
    return Ok(cookies);
}
```

```javascript
// Node.js
app.get('/api/v1/admin/debug-cookies', (req, res) => {
    res.json({ cookies: req.cookies });
});
```

### Ver headers recibidos

```csharp
// ASP.NET Core
[HttpGet("debug-headers")]
public IActionResult DebugHeaders()
{
    var headers = Request.Headers.Select(h => new { h.Key, Value = h.Value.ToString() });
    return Ok(headers);
}
```

```javascript
// Node.js
app.get('/api/v1/admin/debug-headers', (req, res) => {
    res.json({ headers: req.headers });
});
```

---

## ✅ CHECKLIST DE BACKEND

### Configuración CORS:
- [ ] `AllowCredentials()` (ASP.NET) o `credentials: true` (Node.js)
- [ ] Origen `http://localhost:5173` permitido
- [ ] CORS middleware va **antes** de Authentication

### Cookie en Login:
- [ ] `HttpOnly = true`
- [ ] `Secure = false` (desarrollo) o `true` (producción HTTPS)
- [ ] `SameSite = Lax` (desarrollo) o `None` (producción cross-domain)
- [ ] `Path = "/"` (NO `/admin`)
- [ ] `Expires` o `MaxAge` configurado

### Autenticación:
- [ ] Middleware lee token desde cookie `bk.token`
- [ ] Fallback a header `Authorization: Bearer ...` (opcional)
- [ ] Endpoints protegidos tienen `[Authorize]` o middleware

### Logout:
- [ ] Elimina cookie con `Max-Age=0` o `clearCookie()`
- [ ] Opciones de cookie coinciden con las del login

---

## 🧪 Testing de Backend

### Test 1: Login devuelve cookie

```bash
curl -X POST http://localhost:5000/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_mycasino","password":"admin123"}' \
  -v

# ✅ Busca en el output:
# Set-Cookie: bk.token=eyJ...; Path=/; HttpOnly; SameSite=Lax
```

### Test 2: Request con cookie funciona

```bash
# 1. Primero hacer login y copiar el token de la response

# 2. Hacer request con cookie:
curl -X GET http://localhost:5000/api/v1/admin/operators \
  -H "Cookie: bk.token=TU_TOKEN_AQUI" \
  -v

# ✅ Debe responder con 200 y datos
```

### Test 3: Request sin cookie falla

```bash
curl -X GET http://localhost:5000/api/v1/admin/operators \
  -v

# ✅ Debe responder con 401 Unauthorized
```

---

## 📚 Recursos Adicionales

- [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors)
- [ASP.NET Core Cookies](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/cookie)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Express Cookie Parser](https://www.npmjs.com/package/cookie-parser)
- [MDN HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)

---

## 🎯 RESUMEN RÁPIDO

### Para que las cookies funcionen necesitas:

**En Backend:**
1. CORS con `AllowCredentials()`
2. Permitir origen `http://localhost:5173`
3. Cookie con: `HttpOnly=true`, `Secure=false` (dev), `Path=/`, `SameSite=Lax`
4. Middleware que lea token desde cookie `bk.token`
5. Logout que elimine la cookie

**En Frontend (YA TIENES):**
✅ `withCredentials: true` en Axios
✅ Instancia centralizada
✅ Interceptores configurados

**Si Backend está correctamente configurado + Frontend con `withCredentials: true` = ✅ Cookies funcionan automáticamente**

---

**¿Necesitas ayuda configurando el backend?** Comparte:
- Qué tecnología usas (ASP.NET, Node.js, otra)
- Versión del framework
- Código actual de CORS y autenticación

¡Y te ayudo a configurarlo! 🚀
