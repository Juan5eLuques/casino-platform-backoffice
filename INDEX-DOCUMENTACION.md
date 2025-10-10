# 📚 ÍNDICE DE DOCUMENTACIÓN: SOLUCIÓN AXIOS + COOKIES

## 🎯 Inicio Rápido (Empieza aquí)

### Si tienes 2 minutos:
**Lee:** [`EXECUTIVE-SUMMARY-AXIOS.md`](./EXECUTIVE-SUMMARY-AXIOS.md)
- Diagnóstico final
- Problema identificado
- Solución aplicada
- Próximos pasos

### Si tienes 5 minutos:
**Ejecuta el Checklist Rápido:**

```powershell
# 1. Verifica que el backend responda
curl http://localhost:5000/api/v1/admin/auth/me

# 2. Verifica variables de entorno
Get-Content .env

# 3. Reinicia el servidor
npm run dev

# 4. Verifica configuración de Axios (en navegador → Console)
window.apiDebug()

# 5. Prueba login con credenciales de demo
# Usuario: admin_mycasino
# Password: admin123
```

---

## 📖 Documentación Completa

### 1️⃣ Resumen Ejecutivo
📄 **[EXECUTIVE-SUMMARY-AXIOS.md](./EXECUTIVE-SUMMARY-AXIOS.md)**

**Contenido:**
- ✅ Diagnóstico completo de tu configuración
- 🚨 Problema identificado (URL incorrecta)
- ✨ Solución aplicada (localhost HTTP)
- 🎯 Respuestas a tus 8 preguntas específicas
- 🚀 Próximos pasos inmediatos
- ⚠️ Checklist de verificación

**Léelo cuando:**
- Quieres entender el problema general
- Necesitas un resumen de todo
- Quieres saber qué hacer ahora mismo

---

### 2️⃣ Solución Completa
📄 **[AXIOS-COOKIE-SOLUTION-COMPLETE.md](./AXIOS-COOKIE-SOLUTION-COMPLETE.md)**

**Contenido:**
- 🔍 Diagnóstico final detallado
- 🚨 Explicación del problema (CORS, SSL, cookies)
- 💡 Solución implementada (desarrollo vs producción)
- 🔧 Verificación y testing paso a paso
- 📋 Checklist de verificación completo
- 🐛 Problemas comunes y soluciones
- 🎯 Respuestas detalladas a tus 5 preguntas
- 🆘 Troubleshooting rápido

**Léelo cuando:**
- Necesitas entender TODO el contexto
- Quieres saber POR QUÉ falló
- Necesitas el checklist completo de verificación
- Estás troubleshooting un problema

---

### 3️⃣ Referencia de Código
📄 **[AXIOS-CODE-REFERENCE.md](./AXIOS-CODE-REFERENCE.md)**

**Contenido:**
- 📌 Tu configuración actual (comentada)
- ✅ Código de `client.ts` (instancia Axios)
- ✅ Código de `auth.ts` (endpoints)
- ✅ Código de `auth.ts` store (Zustand)
- 📌 Ejemplos de uso en componentes
- 🔐 Configuración de backend (ASP.NET + Node.js)
- 🍪 Configuración de cookies en backend
- 🧪 Tests manuales en consola
- 🐛 Debugging avanzado
- ⚠️ Errores comunes y soluciones

**Léelo cuando:**
- Necesitas ver código específico
- Quieres copiar/pegar configuración
- Necesitas configurar el backend
- Estás haciendo debugging avanzado

---

### 4️⃣ Configuración de Backend
📄 **[BACKEND-COOKIE-CONFIGURATION.md](./BACKEND-COOKIE-CONFIGURATION.md)**

**Contenido:**
- 🎯 ASP.NET Core completo:
  - Configuración de CORS
  - Endpoint de login (envía cookie)
  - Middleware de autenticación (lee cookie)
  - Endpoints protegidos
  - Endpoint de logout
  - appsettings.json
- 🔧 Node.js + Express completo:
  - Configuración de CORS
  - Endpoint de login
  - Middleware de autenticación
  - Endpoints protegidos
  - Endpoint de logout
- 🐛 Debugging de backend
- ✅ Checklist de backend
- 🧪 Tests con curl

**Léelo cuando:**
- Necesitas configurar el backend
- Tienes dudas sobre CORS
- No sabes cómo enviar/recibir cookies en backend
- Backend devuelve 401 aunque la cookie se envía

---

### 5️⃣ Plan de Testing
📄 **[TESTING-PLAN.md](./TESTING-PLAN.md)**

**Contenido:**
- 📋 Pre-requisitos (backend, .env, servidor)
- 🔍 FASE 1: Verificación de configuración
- 🔐 FASE 2: Testing de login
- 🔒 FASE 3: Testing de requests autenticados
- 🚪 FASE 4: Testing de logout
- 🔄 FASE 5: Testing de expiración de token
- 🌐 FASE 6: Testing de casos edge
- 🎯 Resumen de resultados esperados
- 🐛 Troubleshooting rápido
- 📞 Checklist rápido de 2 minutos

**Léelo cuando:**
- Quieres probar paso a paso
- Necesitas verificar que todo funciona
- Estás haciendo debugging
- Quieres ver screenshots de dónde buscar en DevTools

---

### 6️⃣ Diagrama de Flujo
📄 **[AUTHENTICATION-FLOW-DIAGRAM.md](./AUTHENTICATION-FLOW-DIAGRAM.md)**

**Contenido:**
- 📊 Diagrama visual del flujo completo
- 🔐 Flujo de login exitoso
- 🔒 Flujo de requests autenticados
- 🚪 Flujo de logout
- ⏰ Flujo de token expirado
- 🚫 Flujo de error en login
- 🔄 Flujo de refresh de página
- 🌐 Flujo con múltiples pestañas
- 🎯 Puntos clave
- 📝 Debugging checklist visual
- 🎓 Glosario de términos

**Léelo cuando:**
- Eres más visual y prefieres diagramas
- Quieres entender el flujo completo
- Necesitas ver qué pasa en cada paso
- Quieres aprender los términos técnicos

---

## 🗺️ Rutas de Aprendizaje

### 🚀 Ruta Rápida (10 minutos)
1. Lee: [`EXECUTIVE-SUMMARY-AXIOS.md`](./EXECUTIVE-SUMMARY-AXIOS.md) (3 min)
2. Ejecuta: Checklist Rápido (2 min)
3. Prueba: Login en tu app (2 min)
4. Si falla: Ve a [`TESTING-PLAN.md`](./TESTING-PLAN.md) → Troubleshooting (3 min)

### 📚 Ruta Completa (30 minutos)
1. Lee: [`EXECUTIVE-SUMMARY-AXIOS.md`](./EXECUTIVE-SUMMARY-AXIOS.md) (5 min)
2. Lee: [`AXIOS-COOKIE-SOLUTION-COMPLETE.md`](./AXIOS-COOKIE-SOLUTION-COMPLETE.md) (10 min)
3. Sigue: [`TESTING-PLAN.md`](./TESTING-PLAN.md) completo (10 min)
4. Consulta: [`AXIOS-CODE-REFERENCE.md`](./AXIOS-CODE-REFERENCE.md) si necesitas código (5 min)

### 🔧 Ruta de Backend (20 minutos)
1. Lee: [`BACKEND-COOKIE-CONFIGURATION.md`](./BACKEND-COOKIE-CONFIGURATION.md) (15 min)
2. Implementa: Configuración de CORS (2 min)
3. Implementa: Cookies en login/logout (3 min)

### 🎨 Ruta Visual (15 minutos)
1. Lee: [`AUTHENTICATION-FLOW-DIAGRAM.md`](./AUTHENTICATION-FLOW-DIAGRAM.md) (10 min)
2. Sigue: Debugging Checklist visual (5 min)

---

## 🔍 Busca por Problema

### ❌ "Network Error" en login
**Solución:**
1. [`TESTING-PLAN.md`](./TESTING-PLAN.md) → Troubleshooting → Network Error
2. Verifica que backend esté corriendo en el puerto correcto

### ❌ "CORS Error"
**Solución:**
1. [`BACKEND-COOKIE-CONFIGURATION.md`](./BACKEND-COOKIE-CONFIGURATION.md) → Configuración de CORS
2. Verifica: `AllowCredentials()` + origen `http://localhost:5173`

### ❌ Cookie no aparece después del login
**Solución:**
1. [`TESTING-PLAN.md`](./TESTING-PLAN.md) → FASE 2: Test 2.2 y 2.3
2. Verifica Response Headers: `Set-Cookie: bk.token=...`
3. Verifica: `Path=/` (no `/admin`)

### ❌ Cookie existe pero no se envía en requests
**Solución:**
1. [`AXIOS-COOKIE-SOLUTION-COMPLETE.md`](./AXIOS-COOKIE-SOLUTION-COMPLETE.md) → Problema 2
2. Verifica: `window.apiDebug()` → `withCredentials: true`
3. Verifica: Path de cookie incluye tu endpoint

### ❌ Backend devuelve 401 aunque envío la cookie
**Solución:**
1. [`BACKEND-COOKIE-CONFIGURATION.md`](./BACKEND-COOKIE-CONFIGURATION.md) → Middleware de Autenticación
2. Verifica que backend lee cookie `bk.token`
3. Verifica que backend valida JWT correctamente

### ❌ Redirect infinito en login
**Solución:**
1. [`AXIOS-CODE-REFERENCE.md`](./AXIOS-CODE-REFERENCE.md) → Errores comunes → Problema 5
2. Verifica interceptor excluye `/auth/login` y `/auth/me`

### ❌ No sé cómo configurar el backend
**Solución:**
1. [`BACKEND-COOKIE-CONFIGURATION.md`](./BACKEND-COOKIE-CONFIGURATION.md)
2. Sigue la sección de tu tecnología (ASP.NET Core o Node.js)
3. Copia/pega el código completo

### ❌ No entiendo cómo funcionan las cookies
**Solución:**
1. [`AUTHENTICATION-FLOW-DIAGRAM.md`](./AUTHENTICATION-FLOW-DIAGRAM.md) → Diagrama de flujo
2. [`AUTHENTICATION-FLOW-DIAGRAM.md`](./AUTHENTICATION-FLOW-DIAGRAM.md) → Glosario de términos

---

## 📊 Resumen de Archivos

| Archivo | Tamaño | Propósito | Léelo si... |
|---------|--------|-----------|-------------|
| `EXECUTIVE-SUMMARY-AXIOS.md` | 3 min | Resumen ejecutivo | Quieres un overview rápido |
| `AXIOS-COOKIE-SOLUTION-COMPLETE.md` | 15 min | Solución completa | Necesitas entender TODO |
| `AXIOS-CODE-REFERENCE.md` | 20 min | Referencia de código | Necesitas código específico |
| `BACKEND-COOKIE-CONFIGURATION.md` | 15 min | Configuración de backend | Necesitas configurar backend |
| `TESTING-PLAN.md` | 10 min | Plan de testing | Quieres probar paso a paso |
| `AUTHENTICATION-FLOW-DIAGRAM.md` | 10 min | Diagramas visuales | Prefieres aprender visual |

---

## ✅ Checklist de Implementación

### Pre-implementación
- [ ] Leí [`EXECUTIVE-SUMMARY-AXIOS.md`](./EXECUTIVE-SUMMARY-AXIOS.md)
- [ ] Entendí el problema (URL incorrecta)
- [ ] Entendí la solución (localhost HTTP)

### Configuración Frontend
- [ ] `.env` tiene `VITE_API_BASE_URL=http://localhost:XXXX/api/v1`
- [ ] Puerto del backend es correcto
- [ ] Reinicié el servidor de Vite (`npm run dev`)
- [ ] `window.apiDebug()` muestra `withCredentials: true`

### Configuración Backend
- [ ] CORS configurado con `AllowCredentials()`
- [ ] Origen `http://localhost:5173` permitido
- [ ] Login envía cookie con: `HttpOnly=true`, `Secure=false`, `Path=/`, `SameSite=Lax`
- [ ] Middleware lee cookie `bk.token`
- [ ] Logout elimina cookie

### Testing
- [ ] Seguí [`TESTING-PLAN.md`](./TESTING-PLAN.md) → Checklist Rápido
- [ ] Login exitoso envía `Set-Cookie`
- [ ] Cookie aparece en Application → Cookies
- [ ] Requests autenticados incluyen `Cookie: bk.token=...`
- [ ] Backend responde 200 (no 401)
- [ ] Logout elimina cookie
- [ ] Token expirado redirige a login

### Validación Final
- [ ] Puedo hacer login correctamente
- [ ] Puedo navegar a páginas protegidas
- [ ] Puedo hacer logout correctamente
- [ ] Refresh mantiene la sesión
- [ ] Token expirado redirige a login

---

## 🆘 Necesitas Ayuda?

### Si algo no funciona:

1. **Identifica el problema específico:**
   - Network Error → [`TESTING-PLAN.md`](./TESTING-PLAN.md) → Troubleshooting
   - CORS Error → [`BACKEND-COOKIE-CONFIGURATION.md`](./BACKEND-COOKIE-CONFIGURATION.md)
   - Cookie no se envía → [`AXIOS-COOKIE-SOLUTION-COMPLETE.md`](./AXIOS-COOKIE-SOLUTION-COMPLETE.md) → Problemas comunes

2. **Recopila información:**
   ```javascript
   // En consola del navegador:
   window.apiDebug()
   ```
   
   ```powershell
   # En PowerShell:
   Get-Content .env
   curl http://localhost:5000/api/v1/admin/auth/me
   ```
   
   - Screenshot de Network tab (request/response headers)
   - Screenshot de Application → Cookies

3. **Consulta la sección correspondiente:**
   - Usa el índice **"Busca por Problema"** arriba
   - Sigue el troubleshooting paso a paso

---

## 📚 Recursos Adicionales

### Enlaces externos:
- [MDN: Using HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Axios: Request Config](https://axios-http.com/docs/req_config)
- [CORS con credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)
- [ASP.NET Core CORS](https://learn.microsoft.com/en-us/aspnet/core/security/cors)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)

### Archivos del proyecto:
- `src/api/client.ts` - Configuración de Axios
- `src/api/auth.ts` - Endpoints de autenticación
- `src/store/auth.ts` - Estado global con Zustand
- `src/hooks/useAuth.ts` - Hooks de autenticación
- `.env` - Variables de entorno (desarrollo)
- `.env.production` - Variables de entorno (producción)

---

## 🎯 Próximo Paso

**AHORA MISMO:**

1. Abre PowerShell y ejecuta:
   ```powershell
   # Verifica puerto del backend
   curl http://localhost:5000/api/v1/admin/auth/me
   
   # Si no responde, prueba puerto 7182:
   curl http://localhost:7182/api/v1/admin/auth/me
   ```

2. Actualiza `.env` con el puerto correcto (si es necesario)

3. Reinicia el servidor:
   ```powershell
   npm run dev
   ```

4. Abre tu app y ejecuta en la consola:
   ```javascript
   window.apiDebug()
   ```

5. Prueba el login con:
   - Usuario: `admin_mycasino`
   - Password: `admin123`

**Si todo funciona:** ✅ ¡Listo! Las cookies funcionan correctamente.

**Si algo falla:** Ve a [`TESTING-PLAN.md`](./TESTING-PLAN.md) → Troubleshooting rápido

---

## 🎉 Resumen Final

**Tu código de Axios está perfecto.** ✅

Solo necesitabas ajustar la URL del backend de:
```
❌ https://admin.bet30.local:7182/api/v1
```

A:
```
✅ http://localhost:5000/api/v1
```

**Esto elimina:**
- ❌ Problemas de CORS (diferentes dominios)
- ❌ Problemas de SSL (certificado inválido)
- ❌ Cookies bloqueadas (SameSite policy)

**Con esta configuración:**
- ✅ Cookies funcionan automáticamente
- ✅ Sin configuración adicional
- ✅ Desarrollo simple y rápido

**¡Éxito con tu proyecto!** 🎰🚀

---

**Última actualización:** 2024
**Versión:** 1.0
**Autor:** GitHub Copilot

---

## 📎 Apéndice: Estructura de Archivos

```
casino-platform-backoffice/
│
├── 📄 INDEX-DOCUMENTACION.md (este archivo)
│   └── Índice completo de toda la documentación
│
├── 📄 EXECUTIVE-SUMMARY-AXIOS.md
│   └── Resumen ejecutivo y diagnóstico
│
├── 📄 AXIOS-COOKIE-SOLUTION-COMPLETE.md
│   └── Solución completa con troubleshooting
│
├── 📄 AXIOS-CODE-REFERENCE.md
│   └── Código completo comentado
│
├── 📄 BACKEND-COOKIE-CONFIGURATION.md
│   └── Configuración de backend (ASP.NET + Node.js)
│
├── 📄 TESTING-PLAN.md
│   └── Plan de testing paso a paso
│
├── 📄 AUTHENTICATION-FLOW-DIAGRAM.md
│   └── Diagramas de flujo visual
│
├── 📄 .env
│   └── Configuración para desarrollo (HTTP localhost)
│
├── 📄 .env.production
│   └── Configuración para producción (HTTPS dominio real)
│
└── src/
    ├── api/
    │   ├── client.ts (Axios instance con withCredentials: true)
    │   └── auth.ts (Login, getMe, logout)
    ├── store/
    │   └── auth.ts (Zustand store con persist)
    └── hooks/
        └── useAuth.ts (useLogin, useLogout, useCurrentUser)
```

**¡Navega por la documentación según tus necesidades!** 📚
