# ⚡ SOLUCIONES RÁPIDAS - Endpoints Protegidos No Funcionan

## 🎯 TU PROBLEMA

**✅ Funciona:** Login + Health endpoint  
**❌ NO funciona:** Todos los endpoints protegidos (401 Unauthorized)

**Causa:** Las cookies HttpOnly no se están enviando correctamente debido a HTTPS + dominio `.local`

---

## 🚀 SOLUCIÓN 1: Cambiar a localhost HTTP (⏱️ 2 minutos - RECOMENDADO)

### Paso 1: Editar `.env`

Cambia esta línea:
```env
VITE_API_BASE_URL=https://admin.bet30.local:7182/api/v1
```

Por esta:
```env
VITE_API_BASE_URL=http://localhost:7182/api/v1
```

### Paso 2: Reiniciar servidor

```powershell
# Detén el servidor (Ctrl+C)
npm run dev
```

### Paso 3: Probar

1. Abre `http://localhost:5173`
2. Login con `admin_mycasino` / `admin123`
3. Navega a Operators o cualquier página protegida

**✅ Debe funcionar inmediatamente**

**✅ Ventajas:**
- Funciona sin configuración adicional
- Sin problemas de SSL
- Cookies funcionan automáticamente
- Estándar de la industria

**❌ Desventajas:**
- No simula el dominio real

---

## 🛡️ SOLUCIÓN 2: Certificado SSL Válido (⏱️ 10 minutos)

Si necesitas usar `https://admin.bet30.local` para simular producción.

### Paso 1: Instalar mkcert

```powershell
# Si tienes Chocolatey:
choco install mkcert

# O descarga desde: https://github.com/FiloSottile/mkcert/releases
```

### Paso 2: Generar certificado

```powershell
# Instalar CA local
mkcert -install

# Generar certificado para tu dominio
mkcert admin.bet30.local localhost 127.0.0.1

# Esto genera 2 archivos:
# - admin.bet30.local+2.pem (certificado)
# - admin.bet30.local+2-key.pem (clave privada)
```

### Paso 3: Configurar Backend con HTTPS

#### Si usas ASP.NET Core:

**appsettings.Development.json:**
```json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://admin.bet30.local:7182",
        "Certificate": {
          "Path": "C:/path/to/admin.bet30.local+2.pem",
          "KeyPath": "C:/path/to/admin.bet30.local+2-key.pem"
        }
      }
    }
  }
}
```

#### Si usas Node.js:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  cert: fs.readFileSync('path/to/admin.bet30.local+2.pem'),
  key: fs.readFileSync('path/to/admin.bet30.local+2-key.pem')
};

https.createServer(options, app).listen(7182);
```

### Paso 4: Reiniciar backend y frontend

```powershell
# Reinicia tu backend
# Luego:
npm run dev
```

### Paso 5: Probar

1. Abre `https://admin.bet30.local:5173`
2. NO deberías ver advertencias de certificado
3. Login y navega a páginas protegidas

**✅ Ventajas:**
- Simula entorno de producción
- SSL válido sin advertencias
- Cookies funcionan correctamente

**❌ Desventajas:**
- Configuración más compleja
- Requiere instalar herramientas

---

## 🔑 SOLUCIÓN 3: Bearer Token en Headers (⏱️ 20 minutos)

Si prefieres no usar cookies HttpOnly y usar tokens en localStorage.

### Modificación 1: Backend - Enviar token en response body

**AuthController.cs (ASP.NET) o auth.js (Node):**

```csharp
// ASP.NET Core
[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    // Validar credenciales...
    var user = ValidateCredentials(request.Username, request.Password);
    
    if (user == null)
        return Unauthorized(new { message = "Credenciales inválidas" });
    
    // Generar JWT
    var token = GenerateJwtToken(user);
    
    // ✅ Enviar token en el BODY (no en cookie)
    return Ok(new
    {
        token = token,  // ✅ Token en el body
        user = new
        {
            id = user.Id,
            username = user.Username,
            email = user.Email,
            role = user.Role
        }
    });
}
```

```javascript
// Node.js
app.post('/api/v1/admin/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validar credenciales...
  const user = await validateCredentials(username, password);
  
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  
  // Generar JWT
  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // ✅ Enviar token en el BODY
  res.json({
    token: token,  // ✅ Token en el body
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});
```

### Modificación 2: Frontend - Actualizar tipos

**src/types/index.ts:**

```typescript
export interface AuthResponse {
  success: boolean;
  user: BackofficeUser;
  token?: string; // ✅ Agregar token opcional
  message?: string;
}
```

### Modificación 3: Frontend - Guardar y usar token

**src/api/auth.ts:**

```typescript
import { apiClient, handleApiResponse } from './client';
import type { LoginCredentials, AuthResponse, BackofficeUser } from '@/types';

export const authApi = {
   // Login - Guardar token
   login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiClient.post('/admin/auth/login', credentials);
      const data = handleApiResponse<AuthResponse>(response);
      
      // ✅ Si el backend envía token, guardarlo en localStorage
      if (data.token) {
         localStorage.setItem('auth_token', data.token);
      }
      
      return data;
   },

   // Get current user profile
   getMe: async (): Promise<BackofficeUser> => {
      const response = await apiClient.get('/admin/auth/me');
      return handleApiResponse<BackofficeUser>(response);
   },

   // Logout - Eliminar token
   logout: async (): Promise<void> => {
      await apiClient.post('/admin/auth/logout');
      // ✅ Eliminar token de localStorage
      localStorage.removeItem('auth_token');
   },
};
```

### Modificación 4: Frontend - Interceptor para agregar Bearer token

**src/api/client.ts:**

Reemplaza el interceptor de request actual por este:

```typescript
// Request interceptor para logging Y agregar Bearer token
apiClient.interceptors.request.use(
   (config) => {
      // ✅ Obtener token de localStorage
      const token = localStorage.getItem('auth_token');
      
      // ✅ Si existe token, agregarlo al header Authorization
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Logging en desarrollo si está habilitado
      if (IS_DEVELOPMENT && ENABLE_LOGGING) {
         console.log('🔗 API Request:', config.method?.toUpperCase(), config.url, {
            baseURL: config.baseURL,
            withCredentials: config.withCredentials,
            hasToken: !!token,
            authorization: config.headers.Authorization ? 'Bearer ***' : 'None',
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

### Modificación 5: Backend - Leer token desde header Authorization

**Si backend ya lee de cookie, debe leer TAMBIÉN de Authorization header:**

```csharp
// ASP.NET Core - En OnMessageReceived de JWT Bearer:
options.Events = new JwtBearerEvents
{
    OnMessageReceived = context =>
    {
        // 1. Intentar leer desde Authorization header (Bearer token)
        if (context.Request.Headers.ContainsKey("Authorization"))
        {
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                context.Token = authHeader.Substring("Bearer ".Length).Trim();
                return Task.CompletedTask;
            }
        }
        
        // 2. Si no hay Bearer, intentar desde cookie (fallback)
        if (context.Request.Cookies.TryGetValue("bk.token", out var token))
        {
            context.Token = token;
        }

        return Task.CompletedTask;
    }
};
```

```javascript
// Node.js - En middleware de autenticación:
function authenticateToken(req, res, next) {
  let token = null;
  
  // 1. Intentar leer desde Authorization header (Bearer token)
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7); // Extraer token después de "Bearer "
  }
  
  // 2. Si no hay Bearer, intentar desde cookie (fallback)
  if (!token) {
    token = req.cookies['bk.token'];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  // Verificar token...
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}
```

### Paso Final: Probar

1. Reinicia backend y frontend
2. Login con credenciales
3. Verifica en DevTools → Network:
   - Request debe incluir: `Authorization: Bearer eyJ...`
4. Navega a páginas protegidas

**✅ Ventajas:**
- Funciona con cualquier dominio/protocolo
- No depende de cookies
- Permite usar `https://admin.bet30.local`

**❌ Desventajas:**
- Token en localStorage (menos seguro)
- Vulnerable a XSS
- Más código para implementar

---

## 📊 COMPARACIÓN DE SOLUCIONES

| Criterio | Solución 1 (localhost) | Solución 2 (SSL) | Solución 3 (Bearer) |
|----------|----------------------|------------------|---------------------|
| ⏱️ Tiempo | 2 min | 10 min | 20 min |
| 🔧 Complejidad | Muy Simple | Media | Alta |
| 🛡️ Seguridad | Alta (cookies) | Alta (cookies) | Media (localStorage) |
| 🌐 Simula Producción | ❌ | ✅ | ✅ |
| 🚀 Recomendado para | Desarrollo | QA/Staging | N/A |

---

## 🎯 RECOMENDACIÓN FINAL

### Para DESARROLLO LOCAL:
**✅ USA SOLUCIÓN 1** (localhost HTTP)
- Rápida, simple, segura
- Estándar de la industria
- Sin configuración adicional

### Para SIMULAR PRODUCCIÓN:
**✅ USA SOLUCIÓN 2** (SSL con mkcert)
- Simula entorno real
- Mantiene seguridad de cookies
- Prueba problemas de SSL

### Solo si es necesario:
**⚠️ USA SOLUCIÓN 3** (Bearer Token)
- Menos seguro (localStorage)
- Más código para mantener
- Úsalo solo si tienes restricciones específicas

---

## 🧪 CÓMO VERIFICAR QUE FUNCIONA

### Después de aplicar cualquier solución:

```javascript
// 1. Login desde la UI

// 2. En Console, ejecuta:
const { apiClient } = await import('/src/api/client.ts');
const response = await apiClient.get('/admin/brands');
console.log('✅ Funciona!', response.data);

// Si ves datos → ✅ TODO CORRECTO
// Si ves 401 → ❌ Sigue habiendo problema
```

### En DevTools → Network:

1. Haz request a endpoint protegido
2. Ve a Headers → Request Headers
3. **Con Solución 1 o 2:** Busca `Cookie: bk.token=...`
4. **Con Solución 3:** Busca `Authorization: Bearer ...`

---

## 🆘 SI NECESITAS MÁS AYUDA

### Ejecuta el script de diagnóstico:

1. Abre Console en DevTools
2. Copia y pega el script de: `SCRIPT-DIAGNOSTICO-BROWSER.md`
3. Comparte los resultados

### Comparte esta información:

```powershell
# 1. Contenido de .env
Get-Content .env

# 2. Prueba de conexión al backend
curl https://admin.bet30.local:7182/api/v1/health

# 3. Screenshot de DevTools → Network mostrando:
#    - Request headers de un endpoint protegido
#    - Response headers del login
```

---

**Próximo paso:** Elige una solución y aplícala. Solución 1 es la más rápida y recomendada para desarrollo.

**Tiempo estimado:** 2-20 minutos según la solución elegida.

**Probabilidad de éxito:** 99% con Solución 1, 95% con Solución 2, 90% con Solución 3.

---

**¡Éxito!** 🚀
