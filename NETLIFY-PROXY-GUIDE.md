# 🌐 Guía de Configuración de Proxy en Netlify

## 📋 Resumen

Esta guía explica cómo configurar Netlify para que actúe como proxy entre tu frontend y el backend en Railway, preservando el dominio original en el header `Host`.

---

## ❓ ¿Por qué necesitas un proxy?

### Problema Sin Proxy:
```
Cliente (navegador) → Railway API
                      ↓
                      Host: tuapp.railway.app
```
- ❌ El backend recibe `Host: tuapp.railway.app`
- ❌ No puede determinar el brand desde el dominio
- ❌ No puede resolver `sitea.com` vs `siteb.com`

### Solución Con Proxy:
```
Cliente (navegador) → Netlify (sitea.com) → Railway API
                      ↓                      ↓
                      Host: sitea.com        Host: sitea.com
```
- ✅ El backend recibe `Host: sitea.com` (preservado por Netlify)
- ✅ Puede determinar el brand automáticamente
- ✅ Cookies con `Domain=sitea.com` funcionan correctamente

---

## 🛠️ Configuración Paso a Paso

### 1. Actualizar `netlify.toml`

El archivo ya ha sido actualizado con la configuración correcta:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  
  # Variables de entorno para el build
  # ⚠️ IMPORTANTE: Ahora apuntamos a /api (proxy local) en lugar del backend directo
  [build.environment]
    VITE_API_BASE_URL = "/api/v1"
    VITE_NODE_ENV = "production"
    VITE_ENABLE_API_LOGGING = "false"

# 🔥 PROXY: Redirige peticiones /api/* al backend en Railway
# Esto preserva el host original del frontend en las peticiones
[[redirects]]
  from = "/api/*"
  to = "https://casino-platform-production.up.railway.app/api/:splat"
  status = 200
  force = true
  headers = {X-From = "Netlify-Proxy"}

# Redirects for SPA (Single Page Application)
# ⚠️ IMPORTANTE: Esto debe ir DESPUÉS del proxy para no interferir
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Configurar Variables de Entorno por Brand

En Netlify Dashboard, para cada sitio (uno por brand):

#### Para SiteA (sitea.com):
1. Ve a **Site settings → Environment variables**
2. Agrega:
   ```
   VITE_API_BASE_URL = /api/v1
   VITE_NODE_ENV = production
   VITE_ENABLE_API_LOGGING = false
   ```

#### Para SiteB (siteb.com):
1. Ve a **Site settings → Environment variables**
2. Agrega las mismas variables:
   ```
   VITE_API_BASE_URL = /api/v1
   VITE_NODE_ENV = production
   VITE_ENABLE_API_LOGGING = false
   ```

### 3. Configurar Custom Domains

En cada sitio de Netlify:

1. **Site settings → Domain management → Custom domains**
2. Agregar dominio:
   - SiteA: `sitea.com` (o `app.sitea.com`)
   - SiteB: `siteb.com` (o `app.siteb.com`)

---

## 🔍 Cómo Funciona el Proxy

### Request Flow:

1. **Cliente hace request:**
   ```javascript
   // Frontend en https://sitea.com
   GET https://sitea.com/api/v1/auth/me
   ```

2. **Netlify intercepta `/api/*`:**
   ```
   Netlify Proxy detecta que la ruta empieza con /api/
   ```

3. **Netlify hace proxy a Railway:**
   ```http
   GET https://casino-platform-production.up.railway.app/api/v1/auth/me
   Host: sitea.com                    ← ✅ HOST PRESERVADO!
   X-From: Netlify-Proxy
   Cookie: auth_token=...
   ```

4. **Backend recibe el request con host original:**
   ```csharp
   // Backend puede leer:
   var host = Request.Headers["Host"];  // "sitea.com"
   var brand = ResolveBrandFromHost(host);  // "sitea"
   ```

---

## ⚙️ Configuración Multi-Brand

### Opción 1: Un Sitio Netlify por Brand (Recomendado)

Crear dos sitios separados en Netlify:

**Sitio 1 - SiteA:**
- Custom domain: `sitea.com`
- Environment variables: `VITE_API_BASE_URL=/api/v1`
- Proxy redirect: Mismo `netlify.toml`
- Build del mismo repo/branch

**Sitio 2 - SiteB:**
- Custom domain: `siteb.com`
- Environment variables: `VITE_API_BASE_URL=/api/v1`
- Proxy redirect: Mismo `netlify.toml`
- Build del mismo repo/branch

**Ventajas:**
- ✅ Aislamiento completo entre brands
- ✅ Host automáticamente diferente por sitio
- ✅ Configuración más simple
- ✅ Deploys independientes por brand

### Opción 2: Un Sitio con Branch Deploys

Si usas branch deploys:

**Main branch → SiteA (sitea.com):**
```toml
VITE_API_BASE_URL = "/api/v1"
```

**Siteb branch → SiteB (siteb.com):**
```toml
VITE_API_BASE_URL = "/api/v1"
```

Configurar custom domains por branch en Netlify.

---

## 🧪 Testing y Verificación

### 1. Verificar que el proxy funciona:

```bash
# Hacer request a tu sitio
curl -v https://sitea.com/api/v1/health

# Deberías ver:
< HTTP/2 200
< x-from: Netlify-Proxy
```

### 2. Verificar headers en DevTools:

1. Abrir DevTools → Network
2. Hacer login
3. Inspeccionar request a `/api/v1/auth/login`
4. Ver **Headers**:
   - Request URL: `https://sitea.com/api/v1/auth/login` ✅
   - Host: `sitea.com` ✅ (no `railway.app`)

### 3. Verificar en backend logs:

```csharp
// Agregar logging temporal
[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    var host = Request.Headers["Host"].ToString();
    var xFrom = Request.Headers["X-From"].ToString();
    
    Console.WriteLine($"🔍 Host: {host}");         // Debería mostrar "sitea.com"
    Console.WriteLine($"🔍 X-From: {xFrom}");      // Debería mostrar "Netlify-Proxy"
    
    // ... resto del código
}
```

---

## 🚀 Deployment

### 1. Commit y Push:

```bash
git add netlify.toml
git commit -m "Add Netlify proxy configuration for multi-brand"
git push origin main
```

### 2. Netlify Auto-Deploy:

Netlify detectará los cambios en `netlify.toml` y aplicará la nueva configuración automáticamente.

### 3. Verificar Deploy:

1. Ve a Netlify Dashboard → **Deploys**
2. Espera que termine el build
3. Click en el deploy para ver los logs
4. Verifica que no haya errores

---

## 🔧 Troubleshooting

### Problema 1: "404 Not Found" en /api/*

**Causa:** El proxy redirect no se aplicó correctamente.

**Solución:**
1. Verificar que `netlify.toml` está en la raíz del repo
2. Verificar que el formato es correcto (TOML syntax)
3. Re-deploy manualmente desde Netlify Dashboard

### Problema 2: "Mixed Content" warnings

**Causa:** Frontend en HTTPS, backend en HTTP.

**Solución:**
- Asegurar que Railway backend usa HTTPS (Railway lo hace automáticamente)
- Verificar que `to = "https://..."` en netlify.toml

### Problema 3: Cookies no se envían

**Causa:** Con proxy, las cookies deben tener `Domain` del frontend.

**Solución en Backend:**
```csharp
var cookieOptions = new CookieOptions
{
    Domain = GetDomainFromHost(Request.Headers["Host"]),
    // ej: "sitea.com" si Host es "sitea.com" o "app.sitea.com"
    SameSite = SameSiteMode.Lax,
    Secure = true,
    HttpOnly = true
};
```

### Problema 4: Backend no recibe Host correcto

**Causa:** Railway o Netlify no está preservando el header.

**Solución:**
1. Verificar en backend logs qué headers llegan
2. Agregar `X-Forwarded-Host` como fallback:
   ```csharp
   var host = Request.Headers["Host"].FirstOrDefault() 
           ?? Request.Headers["X-Forwarded-Host"].FirstOrDefault();
   ```

### Problema 5: Redirect loop infinito

**Causa:** El orden de los redirects en `netlify.toml` está mal.

**Solución:**
- El proxy `/api/*` debe ir **ANTES** del SPA fallback `/*`
- Verificar que `force = true` está en el proxy

---

## 📊 Comparación: Sin Proxy vs Con Proxy

| Aspecto | Sin Proxy | Con Proxy |
|---------|-----------|-----------|
| **URL Request** | `railway.app/api/v1/login` | `sitea.com/api/v1/login` |
| **Host Header** | `railway.app` ❌ | `sitea.com` ✅ |
| **Brand Resolution** | Imposible ❌ | Automático ✅ |
| **Cookie Domain** | `.railway.app` ❌ | `.sitea.com` ✅ |
| **CORS Config** | Complejo ❌ | Simple ✅ |
| **Security** | Expone backend URL ❌ | Backend oculto ✅ |
| **Multi-Brand** | Imposible ❌ | Funciona ✅ |

---

## 🔐 Consideraciones de Seguridad

### 1. Ocultar URL del Backend:

Con proxy, los clientes no ven la URL real de Railway:
```javascript
// Cliente ve:
GET https://sitea.com/api/v1/users

// Backend real:
https://casino-platform-production.up.railway.app/api/v1/users
```

### 2. Rate Limiting:

Netlify tiene rate limiting automático, protegiendo tu backend.

### 3. DDoS Protection:

Netlify CDN actúa como escudo contra ataques DDoS.

### 4. SSL/TLS:

Netlify maneja certificados SSL automáticamente (Let's Encrypt).

---

## 🌐 Configuración CORS en Backend (Actualizada)

Con proxy, tu backend debe permitir el origin del frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", corsBuilder =>
    {
        corsBuilder
            .WithOrigins(
                "https://sitea.com",
                "https://siteb.com",
                "http://sitea.local:5173",  // Desarrollo
                "http://siteb.local:5173"   // Desarrollo
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

---

## 📝 Checklist de Configuración

- [ ] `netlify.toml` actualizado con proxy redirect
- [ ] `VITE_API_BASE_URL = "/api/v1"` en env variables
- [ ] Proxy redirect ANTES del SPA fallback
- [ ] `force = true` en proxy redirect
- [ ] Custom domain configurado (sitea.com, siteb.com)
- [ ] Backend permite origin del frontend en CORS
- [ ] Backend lee `Host` header correctamente
- [ ] Cookies con `Domain` del frontend
- [ ] HTTPS habilitado en ambos lados
- [ ] Testing con DevTools para verificar headers

---

## 🎯 Resumen Rápido

```toml
# netlify.toml

# 1. Variables de entorno
[build.environment]
  VITE_API_BASE_URL = "/api/v1"  # ← Ruta relativa!

# 2. Proxy (ANTES del SPA fallback)
[[redirects]]
  from = "/api/*"
  to = "https://tu-backend.railway.app/api/:splat"
  status = 200
  force = true

# 3. SPA fallback (DESPUÉS del proxy)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

```bash
# Deploy
git add netlify.toml
git commit -m "Add proxy configuration"
git push
```

¡Listo! 🎉 Tu frontend ahora pasa por proxy y preserva el `Host` original.
