# 📦 Preparación para Deploy - Resumen

## Fecha: 15 de octubre de 2025

---

## ✅ Archivos Creados/Modificados

### 1. Configuración de Entorno

#### `.env.production`
```bash
VITE_API_BASE_URL=https://casino-platform-production.up.railway.app/api/v1
VITE_NODE_ENV=production
VITE_ENABLE_API_LOGGING=false
```
**Propósito:** Variables de entorno específicas para producción.

---

### 2. Configuración de Deployment

#### `vercel.json` ⭐ NUEVO
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [...]
}
```
**Propósito:** Configuración para deploy en Vercel con rewrites para SPA y headers de seguridad.

#### `netlify.toml` ⭐ NUEVO
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
**Propósito:** Configuración para deploy en Netlify con redirects para SPA.

---

### 3. Scripts de Package.json

#### Agregados:
```json
"build:prod": "tsc && vite build --mode production",
"preview:prod": "vite preview --port 5173 --mode production"
```

**Uso:**
- `npm run build:prod` - Build optimizado para producción
- `npm run preview:prod` - Preview local del build de producción

---

### 4. Documentación

#### `DEPLOYMENT-GUIDE.md` ⭐ NUEVO
**Contenido:** Guía completa de deployment paso a paso para Vercel, Netlify y Railway.

#### `BACKEND-CORS-SETUP.md` ⭐ NUEVO
**Contenido:** 
- Configuración detallada de CORS para .NET, Python y Node.js
- Ejemplos de código específicos
- Troubleshooting de errores comunes
- Testing de CORS

#### `QUICK-DEPLOY.md` ⭐ ACTUALIZADO
**Contenido:**
- Checklist rápido de pre-deploy
- Comandos de deployment
- Post-deploy verification
- Common issues y soluciones

---

## 🚀 Siguiente Paso: DEPLOY

### Opción 1: Deploy en Vercel (Recomendado)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

**Después del deploy:**
1. Anotar la URL deployada (ej: `https://casino-backoffice-xyz.vercel.app`)
2. Agregar esa URL a `ALLOWED_ORIGINS` en el backend (Railway)
3. Redeploy el backend

---

### Opción 2: Deploy en Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
npm run build
netlify deploy --prod
```

**Configurar variables de entorno:**
```bash
netlify env:set VITE_API_BASE_URL "https://casino-platform-production.up.railway.app/api/v1"
netlify env:set VITE_NODE_ENV "production"
netlify env:set VITE_ENABLE_API_LOGGING "false"
```

---

## 🔧 Configuración del Backend (CRÍTICO)

### En Railway Dashboard

1. Ve a tu proyecto del backend
2. Variables → Add Variable
3. Agregar/Actualizar:

```bash
ALLOWED_ORIGINS=http://localhost:5173,https://[tu-app].vercel.app
```

4. **Redeploy el backend** para aplicar cambios

---

## 📋 Checklist Pre-Deploy

### Frontend ✅
- [x] `.env.production` configurado
- [x] `vercel.json` creado
- [x] `netlify.toml` creado
- [x] `npm run build:prod` funciona sin errores
- [x] Scripts de deployment agregados a `package.json`

### Backend (PENDIENTE)
- [ ] CORS configurado con `AllowCredentials = true`
- [ ] Variable `ALLOWED_ORIGINS` lista para agregar dominio del frontend
- [ ] Cookies configuradas: `Secure=true`, `SameSite=None`, `HttpOnly=true`
- [ ] HTTPS habilitado

---

## 🧪 Testing Post-Deploy

### 1. Test Básico
```bash
# Verificar que el API responde
curl https://casino-platform-production.up.railway.app/api/v1/health
```

### 2. Test de CORS
```bash
curl -X OPTIONS \
  -H "Origin: https://[tu-app].vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v \
  https://casino-platform-production.up.railway.app/api/v1/auth/login
```

### 3. Test desde el Frontend Deployado
1. Abrir la app en el navegador
2. Abrir DevTools (F12) → Console
3. Ejecutar:
```javascript
// Ver configuración
console.log(import.meta.env.VITE_API_BASE_URL)

// Test de conexión
fetch('https://casino-platform-production.up.railway.app/api/v1/health', {
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

---

## ❌ Problemas Comunes y Soluciones

### Error 1: CORS Policy Blocked
**Síntoma:** `Access to fetch at '...' has been blocked by CORS policy`

**Solución:**
1. Agregar el dominio del frontend a `ALLOWED_ORIGINS` en el backend
2. Redeploy el backend
3. Verificar que el backend tenga `AllowCredentials = true`

### Error 2: 401 Unauthorized
**Síntoma:** Todas las peticiones devuelven 401 después del login

**Solución:**
1. Verificar que las cookies tengan `Secure=true` (requiere HTTPS)
2. Verificar que las cookies tengan `SameSite=None`
3. Asegurar que el frontend use `withCredentials: true` (ya configurado)

### Error 3: Mixed Content
**Síntoma:** `Mixed Content: The page was loaded over HTTPS, but requested an insecure resource`

**Solución:**
1. Verificar que `VITE_API_BASE_URL` use `https://` (no `http://`)
2. Asegurar que el backend use HTTPS

---

## 📊 Estado del Proyecto

### Build Local ✅
```bash
✓ 2267 modules transformed.
dist/index.html                   0.93 kB │ gzip:   0.51 kB
dist/assets/index-631cba5e.css   52.76 kB │ gzip:   8.10 kB
dist/assets/index-48012db2.js   593.76 kB │ gzip: 172.17 kB
✓ built in 7.52s
```

### Backend API ✅
- URL: `https://casino-platform-production.up.railway.app`
- Estado: Funcionando
- Pendiente: Configurar CORS con dominio del frontend

---

## 🎯 Próximos Pasos

1. **Deploy del Frontend**
   ```bash
   vercel --prod
   # o
   netlify deploy --prod
   ```

2. **Anotar URL del Frontend**
   - Ejemplo: `https://casino-backoffice-xyz.vercel.app`

3. **Configurar Backend**
   - Agregar URL del frontend a `ALLOWED_ORIGINS`
   - Redeploy backend

4. **Verificar Funcionamiento**
   - Abrir app deployada
   - Intentar login
   - Verificar que no hay errores de CORS
   - Verificar que las cookies se envían correctamente

5. **Configurar Custom Domain** (Opcional)
   - En Vercel/Netlify: Settings → Domains
   - Agregar dominio personalizado (ej: `admin.tudominio.com`)
   - Configurar DNS

---

## 📚 Documentación de Referencia

1. **QUICK-DEPLOY.md** - Checklist rápido y comandos
2. **DEPLOYMENT-GUIDE.md** - Guía completa paso a paso
3. **BACKEND-CORS-SETUP.md** - Configuración CORS del backend
4. **TROUBLESHOOTING.md** - Solución de problemas

---

## 🎉 Ready to Deploy!

Todo está configurado y listo para el deployment. Sigue los pasos en `QUICK-DEPLOY.md` para hacer el primer deploy.

**Comando rápido:**
```bash
vercel --prod
```

Después del deploy, recuerda configurar CORS en el backend con el dominio generado.

---

**Última actualización:** 15 de octubre de 2025  
**Estado:** ✅ Listo para deploy
