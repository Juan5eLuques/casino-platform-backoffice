# 🚀 Quick Deploy Checklist

## Pre-Deploy

### Frontend
- [x] `.env.production` configurado con URL del API en producción
- [x] `vercel.json` y `netlify.toml` creados
- [ ] `npm run build` funciona sin errores
- [ ] `npm run preview:prod` funciona localmente

### Backend
- [ ] API deployada y accesible en: `https://casino-platform-production.up.railway.app`
- [ ] CORS configurado con el dominio del frontend
- [ ] Variable `ALLOWED_ORIGINS` incluye el dominio del frontend
- [ ] Cookies configuradas: `HttpOnly=true`, `Secure=true`, `SameSite=None`
- [ ] HTTPS habilitado

---

## Deploy Steps

### Opción A: Vercel (Recomendado)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to: https://vercel.com/dashboard
   - Select your project → Settings → Environment Variables
   - Add:
     - `VITE_API_BASE_URL` = `https://casino-platform-production.up.railway.app/api/v1`
     - `VITE_NODE_ENV` = `production`
     - `VITE_ENABLE_API_LOGGING` = `false`

5. **Redeploy** (después de agregar variables)
   ```bash
   vercel --prod
   ```

### Opción B: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

4. **Configure Environment Variables**
   ```bash
   netlify env:set VITE_API_BASE_URL "https://casino-platform-production.up.railway.app/api/v1"
   netlify env:set VITE_NODE_ENV "production"
   netlify env:set VITE_ENABLE_API_LOGGING "false"
   ```

---

## Post-Deploy

### 1. Get the deployed URL
Después del deploy, obtendrás una URL como:
- Vercel: `https://[project-name].vercel.app`
- Netlify: `https://[project-name].netlify.app`

### 2. Configure CORS in Backend

Agrega la URL del frontend a las variables de entorno del backend en Railway:

```bash
# En Railway Dashboard → Variables
ALLOWED_ORIGINS=http://localhost:5173,https://[tu-app].vercel.app
```

**Importante:** Redeploy el backend después de agregar la variable.

### 3. Test the deployment

1. **Abrir la app** en el navegador
2. **Abrir DevTools** (F12) → Console
3. **Verificar configuración**:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL)
   // Debe mostrar: https://casino-platform-production.up.railway.app/api/v1
   ```

4. **Test de conexión al API**:
   ```javascript
   fetch('https://casino-platform-production.up.railway.app/api/v1/health', {
     credentials: 'include'
   })
     .then(r => r.json())
     .then(console.log)
   ```

5. **Test de Login**:
   - Ir a `/login`
   - Intentar login con credenciales válidas
   - Verificar en Network Tab:
     - Status 200
     - Cookie `auth_token` en Response
     - No errores de CORS

### 4. Common Issues

#### ❌ CORS Error
```
Access to fetch at '...' has been blocked by CORS policy
```

**Fix:**
- Agregar el dominio del frontend a `ALLOWED_ORIGINS` en el backend
- Redeploy el backend

#### ❌ 401 Unauthorized
```
Unauthorized - JWT cookie issue
```

**Fix:**
- Verificar que el backend tenga `AllowCredentials = true`
- Verificar cookies: `Secure=true`, `SameSite=None`
- Asegurar que ambos (frontend y backend) usen HTTPS

#### ❌ Mixed Content Error
```
Mixed Content: The page was loaded over HTTPS, but requested an insecure resource
```

**Fix:**
- Asegurar que `VITE_API_BASE_URL` use `https://` (no `http://`)

---

## 📊 Verification Commands

```bash
# Test API health
curl https://casino-platform-production.up.railway.app/api/v1/health

# Test CORS
curl -X OPTIONS \
  -H "Origin: https://[tu-app].vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v \
  https://casino-platform-production.up.railway.app/api/v1/auth/login

# Ver logs (Vercel)
vercel logs [deployment-url]

# Ver logs (Netlify)
netlify logs
```

---

## 🎯 Success Criteria

- [ ] App carga sin errores en el navegador
- [ ] Login funciona correctamente
- [ ] Cookie `auth_token` se envía en requests subsecuentes
- [ ] No hay errores de CORS en la consola
- [ ] Navegación entre páginas funciona
- [ ] Dark mode funciona
- [ ] Responsive design funciona en mobile

---

## 🔄 Update Deployment

### Vercel
```bash
git add .
git commit -m "Update"
git push
# Auto-deploy on push to main, or:
vercel --prod
```

### Netlify
```bash
git add .
git commit -m "Update"
git push
# Auto-deploy on push to main, or:
npm run build
netlify deploy --prod
```

---

## 📞 Need Help?

Ver documentación detallada:
- `DEPLOYMENT-GUIDE.md` - Guía completa de deployment
- `BACKEND-CORS-SETUP.md` - Configuración de CORS en el backend
- `TROUBLESHOOTING.md` - Soluciones a problemas comunes

---

**Ready to deploy? 🚀**

```bash
# Quick deploy con Vercel
npm run build
vercel --prod
```

**Última actualización:** 15 de octubre de 2025
