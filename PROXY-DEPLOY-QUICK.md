# 🚀 Deploy Rápido con Proxy Netlify

## Cambios Realizados

### 1. ✅ `netlify.toml` - Configuración de Proxy

**Cambios:**

- ✅ `VITE_API_BASE_URL = "/api/v1"` (ruta relativa)
- ✅ Proxy redirect `/api/*` → Railway backend
- ✅ Header `X-From: Netlify-Proxy` para tracking
- ✅ `force = true` para priorizar el proxy
- ✅ Orden correcto: proxy ANTES del SPA fallback

**Qué hace:**

- Todas las peticiones a `/api/*` se redirigen al backend en Railway
- El header `Host` se preserva con el dominio original (sitea.com)
- El backend puede resolver el brand desde el host

### 2. ✅ `src/api/client.ts` - Fallback actualizado

**Cambios:**

- Fallback cambiado de `https://localhost:7182` a `http://localhost:5000`

### 3. ✅ `NETLIFY-PROXY-GUIDE.md` - Guía Completa

Documentación detallada de:

- Cómo funciona el proxy
- Configuración multi-brand
- Testing y verificación
- Troubleshooting
- Comparación sin/con proxy

---

## 🎯 Próximos Pasos

### 1. Configurar Variables de Entorno en Netlify

Para **cada sitio** (SiteA y SiteB):

1. Ve a **Netlify Dashboard**
2. Selecciona tu sitio
3. **Site settings → Environment variables**
4. Agrega:
   ```
   VITE_API_BASE_URL = /api/v1
   VITE_NODE_ENV = production
   VITE_ENABLE_API_LOGGING = false
   ```

### 2. Configurar Custom Domains

#### Para SiteA:

1. **Site settings → Domain management → Custom domains**
2. Click **Add custom domain**
3. Agregar: `sitea.com` (o tu dominio real)
4. Configurar DNS records según instrucciones de Netlify

#### Para SiteB:

1. Mismo proceso
2. Agregar: `siteb.com` (o tu dominio real)

### 3. Deploy

```bash
# Commit los cambios
git add netlify.toml src/api/client.ts NETLIFY-PROXY-GUIDE.md
git commit -m "Add Netlify proxy for multi-brand host resolution"
git push origin main
```

Netlify detectará los cambios y hará auto-deploy.

### 4. Verificar el Deploy

#### En Netlify Dashboard:

1. Ve a **Deploys**
2. Espera que termine el build (2-3 minutos)
3. Click en el deploy para ver logs
4. Busca errores en la sección "Build logs"

#### En tu Browser:

1. Abre `https://sitea.com` (tu dominio)
2. Abre DevTools (F12) → Network
3. Intenta hacer login
4. Inspecciona el request a `/api/v1/auth/login`:
   - **Request URL:** `https://sitea.com/api/v1/auth/login` ✅
   - **Headers:** Busca `Host: sitea.com` ✅

#### En Backend Logs (Railway):

```csharp
// Agregar logging temporal para verificar
[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    var host = Request.Headers["Host"].ToString();
    var xFrom = Request.Headers["X-From"].ToString();

    Console.WriteLine($"🔍 Host recibido: {host}");      // Debería ser "sitea.com"
    Console.WriteLine($"🔍 X-From: {xFrom}");            // Debería ser "Netlify-Proxy"

    // ... resto del código
}
```

---

## 🔍 Testing Rápido

### Test 1: Verificar Proxy Funciona

```bash
# Desde tu terminal
curl -v https://sitea.com/api/v1/health

# Deberías ver:
< HTTP/2 200
< x-from: Netlify-Proxy
```

### Test 2: Verificar Host Preservado

1. Login en `https://sitea.com`
2. DevTools → Network → `/api/v1/auth/login`
3. **Request Headers** debe mostrar:
   ```
   Host: sitea.com
   X-From: Netlify-Proxy
   ```

### Test 3: Verificar Brand Resolution

1. Backend debe poder resolver brand:

   ```csharp
   var host = Request.Headers["Host"];  // "sitea.com"
   var brand = ResolveBrandFromHost(host);  // "sitea"
   ```

2. Cookies deben tener domain correcto:
   ```csharp
   Domain = ".sitea.com"  // ✅ Correcto
   // NO "railway.app"
   ```

---

## ⚠️ Problemas Comunes

### Error: "404 Not Found" en /api/\*

**Causa:** Netlify no aplicó la configuración del proxy.

**Solución:**

1. Verificar que `netlify.toml` está en la **raíz del proyecto**
2. Hacer un nuevo deploy forzado:
   - Netlify Dashboard → Deploys → **Trigger deploy** → **Clear cache and deploy site**

### Error: "Mixed Content"

**Causa:** Frontend HTTPS, backend HTTP.

**Solución:**

- Railway usa HTTPS automáticamente
- Verificar en `netlify.toml`: `to = "https://..."` (NO `http://`)

### Error: Cookies no se guardan

**Causa:** Backend sigue usando `Domain=railway.app`.

**Solución Backend:**

```csharp
var cookieOptions = new CookieOptions
{
    Domain = GetDomainFromHost(Request.Headers["Host"]),
    // Ejemplo: si Host="sitea.com" → Domain=".sitea.com"
    SameSite = SameSiteMode.Lax,
    Secure = true,
    HttpOnly = true
};
```

---

## 📋 Checklist Final

### Netlify

- [ ] `netlify.toml` en la raíz del proyecto
- [ ] Proxy redirect ANTES del SPA fallback
- [ ] Variables de entorno configuradas (`VITE_API_BASE_URL=/api/v1`)
- [ ] Custom domains configurados (sitea.com, siteb.com)
- [ ] Deploy exitoso sin errores

### Backend (Railway)

- [ ] CORS permite origins del frontend (sitea.com, siteb.com)
- [ ] Lee header `Host` correctamente
- [ ] Cookies con `Domain` del frontend
- [ ] Brand resolution desde host funciona
- [ ] Logging temporal para verificar headers

### Testing

- [ ] Proxy funciona (curl test)
- [ ] Host preservado (DevTools verificado)
- [ ] Cookies se guardan y envían
- [ ] Login exitoso
- [ ] Brand correcto en backend

---

## 🎉 Resultado Esperado

**Antes (Sin Proxy):**

```
Cliente → Railway (tuapp.railway.app)
           ↓
           Host: railway.app ❌
           Brand: ??? (no se puede resolver)
```

**Ahora (Con Proxy):**

```
Cliente → Netlify (sitea.com) → Railway
           ↓                     ↓
           Host: sitea.com       Host: sitea.com ✅
                                 Brand: sitea ✅
```

---

## 📚 Recursos

- **Guía Completa:** `NETLIFY-PROXY-GUIDE.md`
- **Configuración Multi-Brand:** `MULTI-BRAND-FRONTEND-GUIDE.md`
- **CORS Backend:** `BACKEND-CORS-SETUP.md`
- **Configuración /etc/hosts:** `HOSTS-SETUP-GUIDE.md`

¡Todo listo para deploy! 🚀
