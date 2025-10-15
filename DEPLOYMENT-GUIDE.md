# Guía de Deployment - Casino Backoffice

## 🚀 Deploy en Railway/Vercel/Netlify

### Prerrequisitos

1. **API Backend funcionando en:**
   - URL: `https://casino-platform-production.up.railway.app`
   - Debe tener CORS configurado para permitir el dominio del frontend

2. **Variables de Entorno en Producción:**
   ```bash
   VITE_API_BASE_URL=https://casino-platform-production.up.railway.app/api/v1
   VITE_NODE_ENV=production
   VITE_ENABLE_API_LOGGING=false
   ```

---

## 📋 Paso a Paso

### Opción 1: Vercel (Recomendado)

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login en Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# Primer deploy (configuración inicial)
vercel

# Deploys subsecuentes
vercel --prod
```

#### 4. Configurar Variables de Entorno en Vercel Dashboard
- Ve a: https://vercel.com/dashboard
- Selecciona tu proyecto
- Settings → Environment Variables
- Agrega:
  - `VITE_API_BASE_URL` = `https://casino-platform-production.up.railway.app/api/v1`
  - `VITE_NODE_ENV` = `production`
  - `VITE_ENABLE_API_LOGGING` = `false`

#### 5. Configurar Custom Domain (Opcional)
- Settings → Domains
- Agrega tu dominio (ej: `admin.tudominio.com`)

---

### Opción 2: Netlify

#### 1. Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Login en Netlify
```bash
netlify login
```

#### 3. Build Local
```bash
npm run build
```

#### 4. Deploy
```bash
# Primer deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

#### 5. Configurar Variables de Entorno
```bash
# Desde CLI
netlify env:set VITE_API_BASE_URL "https://casino-platform-production.up.railway.app/api/v1"
netlify env:set VITE_NODE_ENV "production"
netlify env:set VITE_ENABLE_API_LOGGING "false"

# O desde Dashboard: Site settings → Environment variables
```

#### 6. Archivo `netlify.toml` (ya incluido)
El proyecto ya tiene un archivo `netlify.toml` configurado.

---

### Opción 3: Railway

#### 1. Crear cuenta en Railway
- Ir a: https://railway.app

#### 2. Nuevo Proyecto
- Click en "New Project"
- Seleccionar "Deploy from GitHub repo"
- Conectar el repositorio

#### 3. Configurar Variables de Entorno
En el dashboard de Railway:
- Variables → Add Variable
  - `VITE_API_BASE_URL` = `https://casino-platform-production.up.railway.app/api/v1`
  - `VITE_NODE_ENV` = `production`
  - `VITE_ENABLE_API_LOGGING` = `false`

#### 4. Configurar Build Settings
- Build Command: `npm run build`
- Start Command: `npx vite preview --port $PORT --host`

---

## 🔧 Configuración del Backend (IMPORTANTE)

### CORS Configuration

El backend **DEBE** tener configurado CORS para permitir peticiones desde el dominio del frontend deployado.

**Ejemplo en .NET (C#):**

```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder
            .WithOrigins(
                "http://localhost:5173",                          // Dev local
                "https://tu-app.vercel.app",                     // Vercel
                "https://tu-app.netlify.app",                    // Netlify
                "https://admin.tudominio.com"                    // Custom domain
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()                                  // CRÍTICO para cookies
            .SetIsOriginAllowed(origin => true);                 // Solo en dev/test
    });
});

// En Configure
app.UseCors("AllowFrontend");
```

**Variables de Entorno en el Backend:**
```bash
ALLOWED_ORIGINS=http://localhost:5173,https://tu-app.vercel.app,https://admin.tudominio.com
```

---

## 🧪 Verificar el Deploy

### 1. Test de Conexión al API
Una vez deployado, abre la consola del navegador en tu app y ejecuta:

```javascript
// Ver la URL del API configurada
console.log(import.meta.env.VITE_API_BASE_URL)

// Probar conexión
fetch('https://casino-platform-production.up.railway.app/api/v1/health')
  .then(r => r.json())
  .then(console.log)
```

### 2. Test de Login
- Ir a `/login`
- Intentar login con credenciales válidas
- Verificar en Network Tab:
  - Status 200 en POST `/api/v1/auth/login`
  - Cookie `auth_token` en la respuesta
  - Requests subsecuentes envían la cookie

### 3. Errores Comunes

#### ❌ Error: CORS policy
**Solución:** Agregar el dominio del frontend a los `ALLOWED_ORIGINS` del backend

#### ❌ Error: 401 Unauthorized
**Solución:** Verificar que las cookies se estén enviando (`withCredentials: true`)

#### ❌ Error: Mixed Content (HTTP/HTTPS)
**Solución:** Asegurar que tanto frontend como backend usen HTTPS

---

## 📦 Scripts de Package.json

```json
{
  "scripts": {
    "dev": "vite --host localhost --port 5173",
    "build": "tsc && vite build",
    "preview": "vite preview --port 5173",
    "deploy:vercel": "vercel --prod",
    "deploy:netlify": "netlify deploy --prod"
  }
}
```

---

## 🌐 Dominios y DNS

### Configurar Custom Domain

#### En Vercel:
1. Settings → Domains
2. Add Domain
3. Configurar DNS:
   - Tipo: `CNAME`
   - Name: `admin` (o tu subdominio)
   - Value: `cname.vercel-dns.com`

#### En Netlify:
1. Domain settings → Add custom domain
2. Configurar DNS:
   - Tipo: `CNAME`
   - Name: `admin`
   - Value: `[your-site].netlify.app`

---

## 🔐 Variables de Entorno

### Desarrollo (`.env`)
```bash
VITE_API_BASE_URL=/api/v1
VITE_API_ORIGIN=https://casino-platform-production.up.railway.app/
VITE_NODE_ENV=development
VITE_ENABLE_API_LOGGING=true
```

### Producción (`.env.production` o Platform Variables)
```bash
VITE_API_BASE_URL=https://casino-platform-production.up.railway.app/api/v1
VITE_NODE_ENV=production
VITE_ENABLE_API_LOGGING=false
```

---

## 🚦 Checklist Pre-Deploy

- [ ] `npm run build` funciona sin errores
- [ ] Variables de entorno configuradas en la plataforma
- [ ] Backend tiene CORS configurado para el dominio del frontend
- [ ] Backend acepta `credentials: true`
- [ ] Cookies `SameSite=None; Secure` en producción (HTTPS)
- [ ] API accesible desde el navegador (test con curl/Postman)

---

## 📊 Monitoreo Post-Deploy

### Vercel Analytics
Vercel proporciona analytics automáticamente.

### Logs
```bash
# Vercel
vercel logs [deployment-url]

# Netlify
netlify logs
```

### Errores en Producción
Considera integrar:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: APM monitoring

---

## 🔄 Actualizar Deploy

### Vercel
```bash
# Commit cambios
git add .
git commit -m "Update"
git push

# Auto-deploy en cada push a main
# O manual:
vercel --prod
```

### Netlify
```bash
# Auto-deploy en push, o manual:
npm run build
netlify deploy --prod
```

---

## 📞 Soporte

### Recursos
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

### Errores Comunes
Ver `TROUBLESHOOTING.md` para soluciones detalladas.

---

## 🎯 Próximos Pasos

1. ✅ Deploy en plataforma (Vercel recomendado)
2. ✅ Configurar dominio custom
3. ✅ Verificar CORS en backend
4. ✅ Test completo de flujo de login
5. ✅ Configurar CI/CD automático
6. ✅ Monitoreo y analytics

---

**Última actualización:** 15 de octubre de 2025
