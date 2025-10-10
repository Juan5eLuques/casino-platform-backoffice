# 🔍 DIAGNÓSTICO: Problema con Endpoints Autenticados

## 📊 Análisis de la Situación

### ✅ Lo que SÍ funciona:
- ✅ Login endpoint (`/admin/auth/login`)
- ✅ Health endpoint (sin autenticación)

### ❌ Lo que NO funciona:
- ❌ Todos los endpoints que requieren autenticación (después del login)
- ❌ Ejemplos: `/admin/operators`, `/admin/players`, `/admin/brands`, etc.

---

## 🎯 CAUSA RAÍZ IDENTIFICADA

El problema **NO es con Bearer Token**, es con **Cookies HttpOnly + HTTPS con dominio personalizado**.

### Tu configuración actual:
```env
VITE_API_BASE_URL=https://admin.bet30.local:7182/api/v1
```

### Flujo esperado:
1. **Login exitoso** → Backend envía `Set-Cookie: bk.token=JWT_TOKEN`
2. **Cookie guardada** → Navegador almacena la cookie
3. **Requests subsecuentes** → Cookie debería enviarse automáticamente
4. **Backend valida** → Lee la cookie y autentica

### ⚠️ El problema:

**Las cookies HttpOnly con HTTPS + dominio `.local` tienen 3 problemas:**

#### 1. **Certificado SSL No Válido**
- `https://admin.bet30.local:7182` requiere certificado SSL válido
- Sin certificado válido → El navegador **BLOQUEA las cookies**
- Síntoma: Cookie aparece en DevTools pero **NO se envía en requests**

#### 2. **SameSite Policy del Navegador**
- Chrome/Firefox/Edge tienen políticas estrictas con `.local`
- Dominio `.local` puede ser tratado como "inseguro"
- Resultado: Cookies bloqueadas por seguridad

#### 3. **CORS + Credentials**
- Aunque tienes `withCredentials: true` configurado
- El navegador puede bloquear cookies si detecta problemas de SSL
- El proxy de Vite (`secure: false`) no soluciona el problema del lado del navegador

---

## 🔬 DIAGNÓSTICO TÉCNICO

### Configuración actual de tu código:

**✅ Frontend (client.ts):**
```typescript
export const apiClient = axios.create({
   baseURL: 'https://admin.bet30.local:7182/api/v1',
   withCredentials: true, // ✅ Correcto
   headers: {
      'Content-Type': 'application/json',
   },
   timeout: 10000,
});
```

**✅ Vite Proxy (vite.config.ts):**
```typescript
proxy: {
   '/api': {
      target: 'https://admin.bet30.local:7182',
      changeOrigin: true,
      secure: false // ✅ Ignora SSL en el proxy
   }
}
```

**❌ El problema:**
- El proxy de Vite **solo afecta las requests del servidor de desarrollo**
- Las requests del **navegador (cliente)** van directamente a `https://admin.bet30.local:7182`
- El navegador **aplica sus propias políticas de seguridad** (SSL, cookies, CORS)
- Resultado: Cookies bloqueadas por el navegador

---

## 🧪 CÓMO VERIFICAR EL PROBLEMA

### Test 1: Verificar si la cookie se guarda después del login

```javascript
// En DevTools → Console después de hacer login:
document.cookie
// Esperado: "bk.token=eyJ..."
// Si no ves nada: La cookie NO se guardó
```

### Test 2: Verificar si la cookie se envía en requests

```javascript
// En DevTools → Network tab:
// 1. Haz una request a /admin/operators (o cualquier endpoint protegido)
// 2. Click en la request
// 3. Ve a Headers → Request Headers
// 4. Busca: "Cookie: bk.token=..."

// Si NO ves el header Cookie → La cookie NO se está enviando
```

### Test 3: Verificar advertencias del navegador

```javascript
// En DevTools → Console
// Busca advertencias como:
// "A cookie associated with a cross-site resource was set without the `SameSite` attribute"
// "A cookie with SameSite=Lax was set but was not sent because the domain is insecure"
```

### Test 4: Verificar problema de SSL

```javascript
// En DevTools → Security tab
// Verifica el estado del certificado
// Si ves "Not secure" o "Certificate error" → Problema de SSL
```

---

## 💡 SOLUCIONES PROPUESTAS

### 🥇 SOLUCIÓN 1: Usar Certificado SSL Válido (RECOMENDADO PARA PRODUCCIÓN)

Si necesitas usar `admin.bet30.local` para simular producción:

#### Opción A: Certificado autofirmado con mkcert

```powershell
# 1. Instalar mkcert
choco install mkcert

# 2. Instalar CA local
mkcert -install

# 3. Generar certificado para tu dominio
mkcert admin.bet30.local localhost 127.0.0.1

# 4. Configurar tu backend para usar estos certificados
# Los archivos generados serán:
# - admin.bet30.local+2.pem (certificado)
# - admin.bet30.local+2-key.pem (clave privada)
```

#### Opción B: Agregar excepción en el navegador

1. Navega a `https://admin.bet30.local:7182`
2. El navegador mostrará advertencia de certificado
3. Click en "Advanced" → "Proceed to admin.bet30.local (unsafe)"
4. Esto agrega una excepción temporal

**⚠️ Limitación:** Las cookies pueden seguir bloqueadas incluso con excepción.

---

### 🥈 SOLUCIÓN 2: Cambiar a HTTP localhost (RECOMENDADO PARA DESARROLLO)

La forma más simple y confiable para desarrollo:

#### Paso 1: Actualizar .env

```env
VITE_API_BASE_URL=http://localhost:7182/api/v1
```

#### Paso 2: Asegurar que el backend acepte requests de localhost

**Backend debe tener CORS configurado:**
```csharp
// ASP.NET Core ejemplo
builder.WithOrigins("http://localhost:5173")
       .AllowCredentials()
       .AllowAnyMethod()
       .AllowAnyHeader();
```

#### Paso 3: Reiniciar servidor

```powershell
# Detener servidor (Ctrl+C)
npm run dev
```

**✅ Ventajas:**
- Sin problemas de SSL
- Sin problemas de cookies
- Sin configuración adicional
- 100% confiable para desarrollo

**❌ Desventajas:**
- No simula el dominio real
- No prueba problemas de CORS que puedan ocurrir en producción

---

### 🥉 SOLUCIÓN 3: Cambiar a Bearer Token en Headers (ALTERNATIVA)

Si quieres mantener `https://admin.bet30.local:7182` pero evitar cookies:

#### Modificación 1: Backend - Enviar token en response body

```csharp
// En tu AuthController, método Login:
return Ok(new
{
    token = jwtToken, // ✅ Enviar token en el body
    user = userInfo
});
```

#### Modificación 2: Frontend - Guardar token y enviarlo en headers

**auth.ts:**
```typescript
export const authApi = {
   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiClient.post('/admin/auth/login', credentials);
      const data = handleApiResponse<AuthResponse>(response);
      
      // Guardar token en localStorage
      if (data.token) {
         localStorage.setItem('auth_token', data.token);
      }
      
      return data;
   },
   
   logout: async (): Promise<void> => {
      await apiClient.post('/admin/auth/logout');
      localStorage.removeItem('auth_token');
   },
};
```

**client.ts - Agregar interceptor:**
```typescript
// Request interceptor para agregar Bearer token
apiClient.interceptors.request.use(
   (config) => {
      // Obtener token de localStorage
      const token = localStorage.getItem('auth_token');
      
      // Si existe token, agregarlo al header Authorization
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Logging en desarrollo si está habilitado
      if (IS_DEVELOPMENT && ENABLE_LOGGING) {
         console.log('🔗 API Request:', config.method?.toUpperCase(), config.url, {
            baseURL: config.baseURL,
            withCredentials: config.withCredentials,
            hasToken: !!token,
            data: config.data
         });
      }
      return config;
   },
   (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
   }
);
```

**⚠️ Desventajas de esta solución:**
- Token accesible desde JavaScript (menos seguro que HttpOnly cookies)
- Vulnerable a XSS si tu app tiene vulnerabilidades
- No es la práctica recomendada para tokens sensibles

**✅ Ventajas:**
- Funciona sin problemas de SSL
- No depende de cookies
- Permite usar el dominio personalizado

---

## 📋 RECOMENDACIÓN FINAL

### Para DESARROLLO LOCAL:

**✅ USA SOLUCIÓN 2: HTTP localhost**

```env
VITE_API_BASE_URL=http://localhost:7182/api/v1
```

**Razones:**
- ✅ Simple y confiable
- ✅ Sin problemas de SSL/certificados
- ✅ Cookies funcionan perfectamente con `withCredentials: true`
- ✅ No requiere cambios en el código
- ✅ Es el estándar de la industria para desarrollo local

### Para PRODUCCIÓN:

**✅ Mantén Cookies HttpOnly + HTTPS con certificado válido**

```env
VITE_API_BASE_URL=https://admin.bet30.com/api/v1
```

**Requisitos:**
- Dominio real registrado (no `.local`)
- Certificado SSL válido (Let's Encrypt, Cloudflare, etc.)
- CORS configurado correctamente en backend
- Cookie con: `Secure=true`, `SameSite=Lax` o `None`, `Path=/`

---

## 🔄 PLAN DE ACCIÓN INMEDIATO

### Opción A: Cambiar a HTTP localhost (5 minutos)

```powershell
# 1. Editar .env
# Cambiar:
# VITE_API_BASE_URL=https://admin.bet30.local:7182/api/v1
# Por:
# VITE_API_BASE_URL=http://localhost:7182/api/v1

# 2. Reiniciar servidor
npm run dev

# 3. Probar login y endpoints protegidos
```

### Opción B: Generar certificado SSL válido (15 minutos)

```powershell
# 1. Instalar mkcert
choco install mkcert

# 2. Instalar CA
mkcert -install

# 3. Generar certificado
mkcert admin.bet30.local localhost 127.0.0.1

# 4. Configurar backend con los certificados generados
# 5. Reiniciar backend y frontend
# 6. Probar
```

### Opción C: Cambiar a Bearer Token en headers (30 minutos)

**Ver código completo en SOLUCIÓN 3 arriba.**

---

## 🧪 TESTING DESPUÉS DE APLICAR SOLUCIÓN

### Test 1: Verificar login

```javascript
// 1. Login con credenciales
// 2. En Console:
console.log('Auth token:', localStorage.getItem('auth_token')); // Si usas Solución 3
console.log('Cookie:', document.cookie); // Si usas Solución 1 o 2
```

### Test 2: Verificar request autenticado

```javascript
// En DevTools → Network
// 1. Navega a /operators
// 2. Busca request GET /admin/operators
// 3. Ve a Headers → Request Headers
// 4. Si usas cookies: Busca "Cookie: bk.token=..."
// 5. Si usas Bearer: Busca "Authorization: Bearer ..."
```

### Test 3: Verificar que el backend recibe el token

```javascript
// Si el endpoint responde 401:
// → Backend NO está recibiendo el token
// → Revisa CORS y configuración de cookies/headers

// Si el endpoint responde 200:
// ✅ Todo funciona correctamente
```

---

## 📚 RESUMEN EJECUTIVO

**Problema:** Endpoints protegidos devuelven 401 porque las cookies HttpOnly no se envían.

**Causa:** HTTPS con dominio `.local` causa problemas de SSL que bloquean cookies en el navegador.

**Solución rápida:** Cambiar a `http://localhost:7182` en `.env` (5 minutos).

**Solución robusta:** Generar certificado SSL válido con mkcert (15 minutos).

**Alternativa:** Cambiar a Bearer Token en headers (30 minutos, menos seguro).

---

## 🆘 SI NECESITAS AYUDA

Comparte esta información:

1. **Logs de consola después de login:**
   ```javascript
   console.log('Cookie:', document.cookie);
   console.log('LocalStorage:', localStorage.getItem('auth_token'));
   ```

2. **Screenshot de Network tab:**
   - Request headers de un endpoint protegido
   - Response de login (headers con Set-Cookie)

3. **Screenshot de DevTools → Security tab:**
   - Estado del certificado SSL

4. **Configuración actual:**
   ```powershell
   Get-Content .env
   ```

Con esta info puedo diagnosticar exactamente el problema específico.

---

**Última actualización:** 6 de octubre de 2025  
**Próximo paso:** Aplicar una de las 3 soluciones propuestas
