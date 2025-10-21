# 🌐 Guía de Configuración /etc/hosts para Desarrollo Multi-Brand

## 📋 Resumen

Esta guía explica cómo configurar el archivo `/etc/hosts` para desarrollo local multi-brand con la nueva arquitectura de cookies `SameSite=Lax`.

## ❓ ¿Por qué necesito configurar /etc/hosts?

Con la nueva arquitectura de cookies (`SameSite=Lax` + `Domain` específico), las cookies solo funcionan cuando frontend y backend están en el mismo dominio o subdominio.

**Problema en desarrollo:**

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- ❌ Las cookies NO se envían (diferentes "dominios" conceptualmente para el navegador)

**Solución:**

- Frontend: `http://sitea.local:5173`
- Backend: `http://api.sitea.local:5000` (o mismo dominio `sitea.local:5000`)
- ✅ Las cookies SÍ se envían (ambos en dominio `sitea.local`)

---

## 🖥️ Configuración por Sistema Operativo

### Windows

1. **Abrir el archivo hosts como Administrador:**

```powershell
# Opción 1: Desde PowerShell (Ejecutar como Administrador)
notepad C:\Windows\System32\drivers\etc\hosts

# Opción 2: Desde CMD (Ejecutar como Administrador)
notepad C:\Windows\System32\drivers\etc\hosts
```

2. **Agregar las siguientes líneas al final del archivo:**

```
# Casino Platform - Multi-Brand Development
127.0.0.1 sitea.local
127.0.0.1 siteb.local
127.0.0.1 api.sitea.local
127.0.0.1 api.siteb.local
```

3. **Guardar el archivo** (se requieren permisos de administrador)

4. **Limpiar caché DNS (opcional pero recomendado):**

```powershell
ipconfig /flushdns
```

5. **Verificar que funciona:**

```powershell
ping sitea.local
# Debería responder desde 127.0.0.1
```

---

### Linux / macOS

1. **Abrir el archivo hosts con editor de texto:**

```bash
# Linux
sudo nano /etc/hosts

# macOS
sudo nano /etc/hosts
```

2. **Agregar las siguientes líneas al final del archivo:**

```
# Casino Platform - Multi-Brand Development
127.0.0.1 sitea.local
127.0.0.1 siteb.local
127.0.0.1 api.sitea.local
127.0.0.1 api.siteb.local
```

3. **Guardar el archivo:**
   - En nano: `Ctrl + O`, luego `Enter`, luego `Ctrl + X`
   - En vim: `Esc`, luego `:wq`, luego `Enter`

4. **Limpiar caché DNS:**

```bash
# Linux (Ubuntu/Debian)
sudo systemctl restart systemd-resolved

# macOS
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

5. **Verificar que funciona:**

```bash
ping sitea.local
# Debería responder desde 127.0.0.1
```

---

## 🚀 Uso en Desarrollo

### Configurar variables de entorno

**Para SiteA:**

Crear archivo `.env.local` (o `.env`):

```bash
# Frontend accede mediante sitea.local
VITE_API_BASE_URL=http://sitea.local:5000/api/v1

# O usar subdominio api:
# VITE_API_BASE_URL=http://api.sitea.local:5000/api/v1
```

**Para SiteB:**

```bash
# Frontend accede mediante siteb.local
VITE_API_BASE_URL=http://siteb.local:5000/api/v1

# O usar subdominio api:
# VITE_API_BASE_URL=http://api.siteb.local:5000/api/v1
```

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

### Acceder a la aplicación

**NO usar:**

- ❌ `http://localhost:5173`

**SÍ usar:**

- ✅ `http://sitea.local:5173` (para SiteA)
- ✅ `http://siteb.local:5173` (para SiteB)

---

## ✅ Verificación

### Checklist de Configuración Correcta

1. **Archivo hosts configurado:**

   ```bash
   # Windows
   type C:\Windows\System32\drivers\etc\hosts | findstr "sitea.local"

   # Linux/macOS
   cat /etc/hosts | grep "sitea.local"
   ```

   Deberías ver:

   ```
   127.0.0.1 sitea.local
   127.0.0.1 siteb.local
   ```

2. **DNS resuelve correctamente:**

   ```bash
   ping sitea.local
   # Response from 127.0.0.1
   ```

3. **Variables de entorno configuradas:**
   - `.env.local` o `.env` tiene `VITE_API_BASE_URL` con dominio `.local`

4. **Acceso mediante dominio correcto:**
   - Abrir browser en `http://sitea.local:5173` (NO `localhost:5173`)

5. **Cookies enviándose:**
   - Abrir DevTools → Network → seleccionar un request API
   - Verificar que el request incluye cookies (tab "Cookies" o "Headers")

---

## 🔍 Troubleshooting

### Problema 1: "Este sitio no se puede alcanzar" o "ERR_NAME_NOT_RESOLVED"

**Causa:** El archivo hosts no está configurado correctamente o el navegador no lo detectó.

**Solución:**

1. Verificar que el archivo hosts tiene las entradas correctas
2. Limpiar caché DNS (comandos arriba)
3. Reiniciar el navegador completamente
4. Intentar con modo incógnito

### Problema 2: "Connection refused" o "ERR_CONNECTION_REFUSED"

**Causa:** El servidor de desarrollo no está corriendo, o está corriendo en puerto diferente.

**Solución:**

1. Verificar que `npm run dev` está corriendo
2. Verificar en qué puerto corre Vite (por defecto 5173)
3. Ajustar la URL si el puerto es diferente

### Problema 3: Cookies siguen sin enviarse

**Causa:** Varias posibles:

1. Backend no está configurado con `SameSite=Lax`
2. Backend no tiene CORS con `AllowCredentials()`
3. Frontend no tiene `withCredentials: true` en axios
4. Accediendo mediante `localhost` en lugar de `.local`

**Solución:**

1. Verificar backend tiene cookie con:

   ```csharp
   SameSite = SameSiteMode.Lax,
   Domain = "sitea.local" // o ".sitea.local" para subdominios
   ```

2. Verificar CORS en backend:

   ```csharp
   corsBuilder.AllowCredentials()
              .WithOrigins("http://sitea.local:5173")
   ```

3. Verificar axios en frontend (`src/api/client.ts`):

   ```typescript
   withCredentials: true;
   ```

4. **IMPORTANTE:** Acceder mediante `http://sitea.local:5173`, NO `http://localhost:5173`

### Problema 4: "brand_not_resolved" error 400

**Causa:** Backend no puede determinar el brand del request.

**Solución:**

1. Verificar que estás accediendo mediante dominio con brand (`sitea.local` o `siteb.local`)
2. Backend debería detectar brand automáticamente desde el hostname
3. Revisar middleware de brand resolution en backend

---

## 🌐 Configuración para Producción

En producción, **NO necesitas** configurar `/etc/hosts`. Usas dominios reales:

**SiteA:**

- Frontend: `https://app.sitea.com` o `https://sitea.com`
- Backend: `https://api.sitea.com` o `https://sitea.com/api`

**SiteB:**

- Frontend: `https://app.siteb.com` o `https://siteb.com`
- Backend: `https://api.siteb.com` o `https://siteb.com/api`

**Cookies en producción:**

```csharp
Domain = ".sitea.com",  // Funciona para app.sitea.com y api.sitea.com
SameSite = SameSiteMode.Lax,
Secure = true  // OBLIGATORIO en HTTPS
```

---

## 📚 Recursos Adicionales

- **Guía completa multi-brand:** `MULTI-BRAND-FRONTEND-GUIDE.md`
- **Configuración CORS backend:** `BACKEND-CORS-SETUP.md`
- **Ejemplo de variables de entorno:** `.env.example`

---

## ✨ Resumen Rápido

```bash
# 1. Editar hosts (Windows - como Admin)
notepad C:\Windows\System32\drivers\etc\hosts

# 2. Agregar:
127.0.0.1 sitea.local
127.0.0.1 siteb.local

# 3. Limpiar DNS
ipconfig /flushdns

# 4. Configurar .env
VITE_API_BASE_URL=http://sitea.local:5000/api/v1

# 5. Iniciar dev server
npm run dev

# 6. Acceder a:
http://sitea.local:5173
```

¡Listo! 🎉
