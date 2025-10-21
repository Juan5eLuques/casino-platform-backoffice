# 🎯 Deploy NOW - Instrucciones Paso a Paso

## ⚡ Deployment Inmediato

Sigue estos pasos **EXACTAMENTE** en orden:

---

## 📱 PASO 1: Deploy del Frontend

### Con Vercel (RECOMENDADO)

```bash
# Terminal 1: Instalar Vercel CLI
npm install -g vercel

# Terminal 2: Login (abrirá el navegador)
vercel login

# Terminal 3: Deploy en producción
vercel --prod
```

**Output esperado:**

```
🔍  Inspect: https://vercel.com/...
✅  Production: https://casino-backoffice-xyz123.vercel.app
```

**⚠️ IMPORTANTE:** Copia la URL de Production, la necesitarás en el siguiente paso.

---

## 🔧 PASO 2: Configurar CORS en el Backend

### 2.1 Ve a Railway Dashboard

1. Abre: https://railway.app
2. Login con tu cuenta
3. Selecciona el proyecto: `casino-platform-production`

### 2.2 Agregar Variable de Entorno

1. Click en el servicio del backend
2. Variables → New Variable
3. **Name:** `ALLOWED_ORIGINS`
4. **Value:**

   ```
   http://localhost:5173,https://casino-backoffice-xyz123.vercel.app
   ```

   ⚠️ **Reemplaza** `casino-backoffice-xyz123.vercel.app` con **TU URL** del paso 1

5. Click en **Add**

### 2.3 Redeploy el Backend

1. En Railway, click en **Deploy**
2. Espera a que termine (aprox 2-3 minutos)
3. Verifica que el deploy fue exitoso (✅ verde)

---

## 🧪 PASO 3: Verificar el Deploy

### 3.1 Abrir la App

1. Abre la URL de Vercel en el navegador
2. La app debe cargar correctamente

### 3.2 Test de Conexión al API

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Ejecuta este código:

```javascript
// Verificar configuración
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
// Debe mostrar: https://casino-platform-production.up.railway.app/api/v1

// Test de conexión
fetch('https://casino-platform-production.up.railway.app/api/v1/health', {
  credentials: 'include',
})
  .then(r => r.json())
  .then(data => console.log('✅ API funciona:', data))
  .catch(err => console.error('❌ Error:', err));
```

**Resultado esperado:**

```
API URL: https://casino-platform-production.up.railway.app/api/v1
✅ API funciona: { status: "ok", ... }
```

### 3.3 Test de Login

1. Ve a `/login` en tu app
2. Ingresa credenciales:
   - Username: `superadmin` (o tu usuario de prueba)
   - Password: tu contraseña

3. Click en **Iniciar Sesión**

4. **Verificar en DevTools:**
   - Ve a: **Network** tab
   - Busca el request: `login`
   - Click en el request
   - Ve a: **Headers** → **Response Headers**
   - Debe haber: `Set-Cookie: auth_token=...`

5. **Verificar Redirección:**
   - Debe redirigir a `/dashboard`
   - El dashboard debe cargar correctamente

---

## ❌ Si Algo Sale Mal

### Error: CORS Policy Blocked

**Síntoma en Console:**

```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**Solución:**

1. Ve a Railway Dashboard
2. Verifica que `ALLOWED_ORIGINS` contenga la URL correcta de Vercel
3. Asegúrate de que NO haya espacios ni caracteres extra
4. Redeploy el backend
5. Espera 2-3 minutos
6. Refresca la app del frontend (F5)

### Error: 401 Unauthorized

**Síntoma:** Login devuelve 401 o no funciona

**Solución:**

1. Verifica en Network → Headers → Response Headers:
   - Debe haber: `Access-Control-Allow-Origin: tu-dominio-vercel.app`
   - Debe haber: `Access-Control-Allow-Credentials: true`

2. Si NO aparecen esos headers:
   - El backend no está configurado correctamente
   - Verifica la variable `ALLOWED_ORIGINS`
   - Redeploy el backend

### Error: Variables de Entorno No Cargadas

**Síntoma:** `import.meta.env.VITE_API_BASE_URL` es `undefined`

**Solución en Vercel:**

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Settings → Environment Variables
4. Agrega:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://casino-platform-production.up.railway.app/api/v1`
   - **Environment:** Production

5. Redeploy:
   ```bash
   vercel --prod
   ```

---

## ✅ Checklist de Éxito

Marca cada punto cuando esté funcionando:

- [ ] App deployada en Vercel y accesible
- [ ] Variable `ALLOWED_ORIGINS` configurada en Railway
- [ ] Backend redeployado después de agregar variable
- [ ] Console test de API funciona (no error 404 o CORS)
- [ ] Login funciona correctamente
- [ ] Cookie `auth_token` aparece en Response Headers
- [ ] Redirección a `/dashboard` después del login funciona
- [ ] Dashboard muestra datos correctamente
- [ ] No hay errores en la consola del navegador

---

## 🎉 ¡Éxito!

Si todos los puntos del checklist están marcados, ¡tu app está funcionando en producción!

### Próximos Pasos Opcionales:

1. **Custom Domain**
   - Vercel: Settings → Domains → Add
   - Configurar DNS: `CNAME admin → cname.vercel-dns.com`

2. **Monitoreo**
   - Vercel Analytics (incluido gratis)
   - Ver logs: `vercel logs [deployment-url]`

3. **CI/CD Automático**
   - Conecta tu repo de GitHub a Vercel
   - Auto-deploy en cada push a `main`

---

## 📞 ¿Necesitas Ayuda?

Ver documentación completa:

- `QUICK-DEPLOY.md` - Checklist detallado
- `DEPLOYMENT-GUIDE.md` - Guía completa
- `BACKEND-CORS-SETUP.md` - Configuración de CORS
- `TROUBLESHOOTING.md` - Solución de problemas

---

## 🔄 Actualizaciones Futuras

Para actualizar la app después de cambios:

```bash
# 1. Commit cambios
git add .
git commit -m "Update feature"

# 2. Push a GitHub
git push

# 3. Deploy (si no está conectado a GitHub)
vercel --prod
```

Si conectaste GitHub a Vercel, el deploy es automático en cada push.

---

**Última actualización:** 15 de octubre de 2025  
**Tiempo estimado:** 10-15 minutos  
**Dificultad:** ⭐⭐☆☆☆ Fácil
