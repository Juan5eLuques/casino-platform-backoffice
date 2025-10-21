# 🔐 Multi-Brand Session Isolation - Frontend Implementation

## 📋 Resumen de Cambios en el Backend

El backend implementó mejoras de seguridad para aislamiento de sesiones multi-brand:

### Cambios Principales:

1. ✅ **SameSite=Lax** (antes era `None`)
2. ✅ **Domain específico** por brand en producción
3. ✅ **Validación de brand** en login (403 si no corresponde)
4. ✅ **Brand claims** en JWT (`brand_id`, `brand_code`)
5. ✅ **No hay brand por defecto** en localhost

---

## 🎯 Configuración del Frontend

### 1. **Axios Client - Ya Configurado ✅**

```typescript
// src/api/client.ts
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ CRÍTICO: Para enviar cookies automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
```

**¿Por qué funciona con SameSite=Lax?**

- `withCredentials: true` hace que Axios incluya cookies en requests
- `SameSite=Lax` permite cookies en navegación normal (GET, POST desde misma pestaña)
- El frontend y backend deben estar en el **mismo dominio** (ej: `sitea.com`)

---

## 🌐 Arquitectura Multi-Brand

### Escenario de Producción:

```
┌────────────────────────────────────────────────────┐
│  Brand A                                           │
│  Frontend: https://sitea.com                       │
│  Backend:  https://api.sitea.com                   │
│  Cookie:   Domain=.sitea.com, SameSite=Lax        │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│  Brand B                                           │
│  Frontend: https://siteb.com                       │
│  Backend:  https://api.siteb.com                   │
│  Cookie:   Domain=.siteb.com, SameSite=Lax        │
└────────────────────────────────────────────────────┘
```

**✅ Resultado:**

- Cada brand tiene su cookie **aislada** por dominio
- No hay conflicto entre sesiones
- SUPER_ADMIN puede tener sesiones simultáneas en múltiples brands

---

## 🔧 Configuración de Desarrollo

### ⚠️ IMPORTANTE: Localhost NO Funciona Sin Configuración

El backend **NO resuelve ningún brand** para `localhost` o `127.0.0.1` por seguridad.

### Opción 1: Usar Dominios Locales (Recomendado)

#### Paso 1: Configurar `/etc/hosts`

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac:** `/etc/hosts`

```bash
# Agregar estas líneas:
127.0.0.1  sitea.local
127.0.0.1  siteb.local
127.0.0.1  api.sitea.local
127.0.0.1  api.siteb.local
```

#### Paso 2: Crear Brands en la Base de Datos

```sql
INSERT INTO "Brands" ("Id", "Code", "Name", "Locale", "Domain", "AdminDomain", "CorsOrigins", "Status", "CreatedAt", "UpdatedAt")
VALUES
  (gen_random_uuid(), 'SITEA_LOCAL', 'Site A Local', 'en-US', 'sitea.local', 'sitea.local',
   'http://sitea.local:5173,http://localhost:5173', 'ACTIVE', NOW(), NOW()),
  (gen_random_uuid(), 'SITEB_LOCAL', 'Site B Local', 'en-US', 'siteb.local', 'siteb.local',
   'http://siteb.local:5173,http://localhost:5173', 'ACTIVE', NOW(), NOW());
```

#### Paso 3: Configurar Variables de Entorno

**`.env` (desarrollo):**

```bash
VITE_API_BASE_URL=http://api.sitea.local:5000/api/v1
```

**`.env.local.sitea`:**

```bash
VITE_API_BASE_URL=http://api.sitea.local:5000/api/v1
```

**`.env.local.siteb`:**

```bash
VITE_API_BASE_URL=http://api.siteb.local:5000/api/v1
```

#### Paso 4: Acceder

- **Brand A Frontend:** `http://sitea.local:5173`
- **Brand B Frontend:** `http://siteb.local:5173`
- **Brand A API:** `http://api.sitea.local:5000/api/v1`
- **Brand B API:** `http://api.siteb.local:5000/api/v1`

### Opción 2: Usar Railway URLs Directamente

Si tienes el backend en Railway:

**`.env.production`:**

```bash
VITE_API_BASE_URL=https://casino-platform-production.up.railway.app/api/v1
```

**Desplegar en Netlify/Vercel:**

- Cada brand en un sitio diferente
- Configurar variable `VITE_API_BASE_URL` por sitio

---

## 🚨 Errores Comunes y Soluciones

### Error 1: "Brand Not Resolved"

```json
{
  "error": "brand_not_resolved",
  "host": "localhost:5000",
  "message": "No brand found for this host."
}
```

**Causa:** Intentando acceder desde `localhost` sin configurar `/etc/hosts`

**Solución:**

1. Configurar `/etc/hosts` con dominios locales
2. Crear brands con esos dominios en BD
3. Acceder desde `sitea.local:5173`

---

### Error 2: "Brand Mismatch" (403)

```json
{
  "title": "Brand Mismatch",
  "detail": "This user account is not authorized for this brand/site.",
  "status": 403
}
```

**Causa:** Usuario asignado a Brand A intentando loguearse en Brand B

**Solución:**

1. Verificar que el usuario esté asignado al brand correcto en BD
2. O usar un usuario SUPER_ADMIN (puede loguearse en cualquier brand)

---

### Error 3: Cookie No Se Envía

**Síntomas:**

- Login exitoso pero `/me` retorna 401
- Cookie se crea pero no se envía en siguientes requests

**Posibles Causas:**

1. **Frontend y Backend en dominios diferentes:**

   ```
   ❌ Frontend: sitea.com
   ❌ Backend:  api.siteb.com
   → Cookie con Domain=api.siteb.com no se envía a sitea.com
   ```

   **Solución:** Usar mismo dominio base:

   ```
   ✅ Frontend: sitea.com
   ✅ Backend:  api.sitea.com
   → Cookie con Domain=.sitea.com funciona para ambos
   ```

2. **HTTPS/HTTP mismatch:**

   ```
   ❌ Frontend: https://sitea.com
   ❌ Backend:  http://api.sitea.com
   → Cookie con Secure=true no se envía por HTTP
   ```

   **Solución:** Usar mismo protocolo (ambos HTTPS en producción)

3. **withCredentials no configurado:**
   ```typescript
   ❌ axios.get('/api/users') // Sin credenciales
   ✅ apiClient.get('/users') // Con withCredentials: true
   ```

---

## 🧪 Testing Multi-Brand

### Test 1: Login en Brand Correcto

```typescript
// Usuario admin1 pertenece a Brand A
// Frontend: sitea.local:5173
// Backend: api.sitea.local:5000

const response = await authApi.login({
  username: 'admin1',
  password: 'pass123',
});

// ✅ Esperado: 200 OK
// Cookie: bk.token con Domain=sitea.local
```

### Test 2: Login en Brand Incorrecto

```typescript
// Usuario admin1 pertenece a Brand A
// Frontend: siteb.local:5173
// Backend: api.siteb.local:5000

const response = await authApi.login({
  username: 'admin1',
  password: 'pass123',
});

// ❌ Esperado: 403 Brand Mismatch
```

### Test 3: SUPER_ADMIN en Múltiples Brands

```typescript
// Tab 1: sitea.local:5173
await authApi.login({
  username: 'superadmin',
  password: 'pass123',
});
// ✅ Cookie A en sitea.local

// Tab 2: siteb.local:5173
await authApi.login({
  username: 'superadmin',
  password: 'pass123',
});
// ✅ Cookie B en siteb.local

// ✅ Ambas sesiones funcionan simultáneamente
```

### Test 4: Verificar Cookies en el Navegador

**Chrome DevTools → Application → Cookies**

```
Site A (sitea.local):
┌────────────────────────────────────────┐
│ Name:     bk.token                     │
│ Value:    eyJhbGc...                   │
│ Domain:   sitea.local                  │
│ Path:     /                            │
│ SameSite: Lax                          │
│ Secure:   ✓ (si HTTPS)                 │
│ HttpOnly: ✓                            │
└────────────────────────────────────────┘

Site B (siteb.local):
┌────────────────────────────────────────┐
│ Name:     bk.token                     │
│ Value:    eyJhbGc... (DIFERENTE)       │
│ Domain:   siteb.local                  │
│ Path:     /                            │
│ SameSite: Lax                          │
│ Secure:   ✓ (si HTTPS)                 │
│ HttpOnly: ✓                            │
└────────────────────────────────────────┘
```

---

## 📊 Comparación Frontend: Antes vs Después

| Aspecto             | Antes (SameSite=None)  | Ahora (SameSite=Lax)   |
| ------------------- | ---------------------- | ---------------------- |
| **withCredentials** | ✅ Requerido           | ✅ Requerido           |
| **Cross-Origin**    | ✅ Funciona            | ❌ NO funciona         |
| **Same-Origin**     | ✅ Funciona            | ✅ Funciona            |
| **Subdominios**     | ✅ Con Domain correcto | ✅ Con Domain correcto |
| **Localhost Dev**   | ✅ Funciona            | ✅ Con /etc/hosts      |
| **Seguridad CSRF**  | 🔶 Media               | ✅ Alta                |
| **Aislamiento**     | 🔶 Manual              | ✅ Automático          |

---

## 🎯 Checklist de Implementación

### Desarrollo:

- [ ] Configurar `/etc/hosts` con dominios locales
- [ ] Crear brands en BD con esos dominios
- [ ] Actualizar `.env` con API URL correcta
- [ ] Verificar que `withCredentials: true` está en `apiClient`
- [ ] Probar login y verificar cookie en DevTools

### Producción:

- [ ] Configurar DNS para cada brand
- [ ] SSL/TLS para HTTPS (Secure cookie)
- [ ] Configurar CORS en backend con orígenes correctos
- [ ] Variables de entorno por brand en Netlify/Vercel
- [ ] Verificar Domain de cookie en producción

---

## 🔐 Mejoras de Seguridad para el Frontend

### 1. **No Compartir Estado Entre Brands**

```typescript
// ❌ MAL: Store global compartido entre brands
const globalStore = createStore();

// ✅ BIEN: Store aislado por brand
const store = createStore({
  brand: getCurrentBrand(), // Detectar brand del host
});
```

### 2. **Limpiar Estado al Cambiar Brand**

```typescript
// Si el usuario navega entre brands
useEffect(() => {
  const currentBrand = getBrandFromHost();
  if (currentBrand !== previousBrand) {
    authStore.logout(); // Limpiar sesión anterior
  }
}, [window.location.host]);
```

### 3. **Validar Brand en Respuestas**

```typescript
// Opcional: Verificar que las respuestas son del brand correcto
apiClient.interceptors.response.use(response => {
  const expectedBrand = getBrandFromHost();
  const responseBrand = response.headers['x-brand-code'];

  if (responseBrand && responseBrand !== expectedBrand) {
    console.warn('Brand mismatch detected!');
    // Opcionalmente: forzar logout
  }

  return response;
});
```

---

## 📝 Notas Adicionales

### ¿Qué NO Cambió en el Frontend?

1. ✅ **withCredentials** sigue siendo `true`
2. ✅ **Estructura de requests** sin cambios
3. ✅ **Manejo de errores** sin cambios
4. ✅ **Flujo de autenticación** sin cambios

### ¿Qué SÍ Cambió?

1. ⚠️ **Desarrollo local** requiere configurar `/etc/hosts`
2. ⚠️ **Validación de brand** en backend (403 si incorrecto)
3. ⚠️ **Cookies aisladas** por dominio en producción

### Migración Gradual

Si tienes brands existentes:

1. Configurar dominio en cada brand
2. Desplegar frontend de cada brand en su dominio
3. Backend automáticamente usa Domain correcto
4. Usuarios deben re-loguearse después del deploy

---

## ✅ Resumen

**Frontend NO requiere cambios de código**, solo configuración:

1. ✅ `withCredentials: true` ya está configurado
2. ⚠️ Configurar `/etc/hosts` para desarrollo multi-brand
3. ⚠️ Desplegar cada brand en su dominio en producción
4. ✅ Backend maneja aislamiento automáticamente

**Beneficios:**

- 🔒 Sesiones completamente aisladas por brand
- 🚀 Sin cambios en código del frontend
- 🛡️ Mayor seguridad contra CSRF
- ✅ Compatible con SUPER_ADMIN en múltiples brands
