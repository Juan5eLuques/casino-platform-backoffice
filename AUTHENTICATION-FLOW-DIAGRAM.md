# 🔄 FLUJO COMPLETO: AUTENTICACIÓN CON COOKIES

## 📊 Diagrama de Flujo

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE AUTENTICACIÓN                            │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────┐                                      ┌─────────────┐
│   Browser   │                                      │   Backend   │
│ localhost:  │                                      │ localhost:  │
│   5173      │                                      │   5000      │
└──────┬──────┘                                      └──────┬──────┘
       │                                                     │
       │ 1. Usuario completa formulario de login            │
       │    {username: "admin", password: "123"}            │
       │                                                     │
       │ 2. POST /api/v1/admin/auth/login                   │
       ├────────────────────────────────────────────────────>│
       │    Body: {username, password}                      │
       │    Headers:                                        │
       │      Content-Type: application/json                │
       │      ✅ withCredentials: true (Axios)              │
       │                                                     │
       │                                       3. Valida credenciales
       │                                       4. Genera JWT
       │                                       5. Configura cookie
       │                                                     │
       │ 6. Response 200 OK                                 │
       │<────────────────────────────────────────────────────┤
       │    Headers:                                        │
       │      ✅ Set-Cookie: bk.token=eyJ...                │
       │         Path=/; HttpOnly; SameSite=Lax             │
       │    Body:                                           │
       │      {user: {id, username, role, ...}}             │
       │                                                     │
       │ 7. Navegador guarda cookie automáticamente         │
       │    (HttpOnly → No accesible desde JS)              │
       │                                                     │
       │ 8. Zustand store guarda info del usuario           │
       │    (para UI: nombre, rol, permisos, etc.)          │
       │                                                     │
       │ 9. React Router redirige a /dashboard              │
       │                                                     │
       │                                                     │
       │ 10. Usuario navega a /operators                    │
       │                                                     │
       │ 11. GET /api/v1/admin/operators                    │
       ├────────────────────────────────────────────────────>│
       │     Headers:                                       │
       │       ✅ Cookie: bk.token=eyJ...                   │
       │          (Enviada automáticamente por navegador)   │
       │       ✅ withCredentials: true (Axios)             │
       │                                                     │
       │                                      12. Lee cookie
       │                                      13. Valida JWT
       │                                      14. Obtiene datos
       │                                                     │
       │ 15. Response 200 OK                                │
       │<────────────────────────────────────────────────────┤
       │     Body: {items: [...], total, page, ...}         │
       │                                                     │
       │ 16. React Query cachea los datos                   │
       │ 17. UI muestra la tabla de operadores              │
       │                                                     │
       │                                                     │
       │ 18. Usuario hace click en "Logout"                 │
       │                                                     │
       │ 19. POST /api/v1/admin/auth/logout                 │
       ├────────────────────────────────────────────────────>│
       │     Headers:                                       │
       │       Cookie: bk.token=eyJ...                      │
       │                                                     │
       │                                   20. Elimina cookie
       │                                                     │
       │ 21. Response 200 OK                                │
       │<────────────────────────────────────────────────────┤
       │     Headers:                                       │
       │       ✅ Set-Cookie: bk.token=; Max-Age=0          │
       │                                                     │
       │ 22. Navegador elimina cookie                       │
       │ 23. Zustand store limpia estado                    │
       │ 24. React Query limpia cache                       │
       │ 25. React Router redirige a /login                 │
       │                                                     │
       └─────────────────────────────────────────────────────┘
```

---

## 🔐 Flujo de Token Expirado

```
┌─────────────┐                                      ┌─────────────┐
│   Browser   │                                      │   Backend   │
└──────┬──────┘                                      └──────┬──────┘
       │                                                     │
       │ 1. Usuario ya autenticado (cookie válida)          │
       │    Navega a /players                               │
       │                                                     │
       │ ⏰ Token expira mientras el usuario usa la app     │
       │                                                     │
       │ 2. GET /api/v1/admin/players                       │
       ├────────────────────────────────────────────────────>│
       │    Headers:                                        │
       │      Cookie: bk.token=eyJ... (expirado)            │
       │                                                     │
       │                                       3. Lee cookie
       │                                       4. Valida JWT
       │                                       ❌ Token expirado
       │                                                     │
       │ 5. Response 401 Unauthorized                       │
       │<────────────────────────────────────────────────────┤
       │    Body: {message: "Token expirado"}               │
       │                                                     │
       │ 6. Interceptor de Axios detecta 401                │
       │    (src/api/client.ts líneas 59-76)                │
       │                                                     │
       │ 7. Verifica que NO es /auth/login ni /auth/me      │
       │    ✅ No lo es, entonces procesa el error          │
       │                                                     │
       │ 8. Llama useAuthStore.getState().clearAuth()       │
       │    - Limpia estado de Zustand                      │
       │    - Limpia localStorage                           │
       │                                                     │
       │ 9. window.location.href = '/login'                 │
       │    Usuario es redirigido a login                   │
       │                                                     │
       │ 10. Toast muestra: "Sesión expirada"               │
       │                                                     │
       └─────────────────────────────────────────────────────┘
```

---

## 🚫 Flujo de Error de Login (Credenciales Incorrectas)

```
┌─────────────┐                                      ┌─────────────┐
│   Browser   │                                      │   Backend   │
└──────┬──────┘                                      └──────┬──────┘
       │                                                     │
       │ 1. Usuario ingresa credenciales incorrectas        │
       │                                                     │
       │ 2. POST /api/v1/admin/auth/login                   │
       ├────────────────────────────────────────────────────>│
       │    Body: {username: "wrong", password: "wrong"}    │
       │                                                     │
       │                                       3. Valida credenciales
       │                                       ❌ Credenciales inválidas
       │                                                     │
       │ 4. Response 401 Unauthorized                       │
       │<────────────────────────────────────────────────────┤
       │    Body: {message: "Credenciales inválidas"}       │
       │    ❌ NO hay Set-Cookie                            │
       │                                                     │
       │ 5. Interceptor detecta 401                         │
       │    Verifica: ¿Es /auth/login?                      │
       │    ✅ Sí, entonces NO redirige                     │
       │                                                     │
       │ 6. Error llega al hook useLogin                    │
       │    (src/hooks/useAuth.ts)                          │
       │                                                     │
       │ 7. React Hook Form muestra error                   │
       │    Toast: "Credenciales inválidas"                 │
       │                                                     │
       │ 8. Usuario sigue en /login                         │
       │    Puede intentar nuevamente                       │
       │                                                     │
       └─────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Refresh de Página

```
┌─────────────┐                                      
│   Browser   │                                      
└──────┬──────┘                                      
       │                                             
       │ 1. Usuario ya autenticado                  
       │    Está en /operators                      
       │                                             
       │ 2. Usuario hace F5 (refresh)               
       │                                             
       │ 3. React app se reinicia                   
       │                                             
       │ 4. Zustand + persist recupera estado de localStorage
       │    - user: {id, username, role, ...}       
       │    - isAuthenticated: true                 
       │                                             
       │ 5. Cookie sigue en el navegador            
       │    (HttpOnly cookies persisten)            
       │                                             
       │ 6. React Router evalúa ruta /operators     
       │    ✅ isAuthenticated = true → Permite acceso
       │                                             
       │ 7. OperatorsPage se monta                  
       │    useQuery hace fetch de datos            
       │                                             
       │ 8. GET /api/v1/admin/operators             
       │    ✅ Cookie enviada automáticamente       
       │                                             
       │ 9. Backend valida cookie → 200 OK          
       │                                             
       │ 10. Datos se muestran en UI                
       │                                             
       └─────────────────────────────────────────────
```

---

## 🌐 Múltiples Pestañas

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│  Pestaña 1  │          │  Pestaña 2  │          │   Backend   │
│  /operators │          │  /players   │          │             │
└──────┬──────┘          └──────┬──────┘          └──────┬──────┘
       │                         │                        │
       │ Usuario autenticado     │ Usuario autenticado    │
       │ Cookie: bk.token=ABC    │ Cookie: bk.token=ABC   │
       │                         │                        │
       │ 1. Hace logout          │                        │
       │                         │                        │
       │ 2. POST /auth/logout    │                        │
       ├────────────────────────────────────────────────────>│
       │                         │                        │
       │ 3. Backend elimina cookie                        │
       │<────────────────────────────────────────────────────┤
       │                         │                        │
       │ 4. Zustand limpia estado│                        │
       │    localStorage actualizado                       │
       │                         │                        │
       │ 5. Redirige a /login    │                        │
       │                         │                        │
       │                         │ 6. Usuario intenta navegar
       │                         │                        │
       │                         │ 7. GET /admin/games    │
       │                         ├────────────────────────>│
       │                         │    ❌ NO hay cookie    │
       │                         │                        │
       │                         │ 8. 401 Unauthorized    │
       │                         │<────────────────────────┤
       │                         │                        │
       │                         │ 9. Interceptor detecta 401
       │                         │    Limpia estado       │
       │                         │    Redirige a /login   │
       │                         │                        │
       └─────────────────────────┴────────────────────────┴─────
       
       RESULTADO: Ambas pestañas terminan en /login
```

---

## 🎯 PUNTOS CLAVE

### ✅ Lo que funciona automáticamente:

1. **Cookies se envían automáticamente**
   - Navegador las incluye en cada request
   - No necesitas código manual
   - Requiere `withCredentials: true` en Axios

2. **HttpOnly es seguro**
   - JavaScript no puede acceder a la cookie
   - Previene ataques XSS
   - Backend valida el token

3. **Persist mantiene la sesión**
   - Zustand + persist guarda estado en localStorage
   - Info de UI (nombre, rol, etc.) persiste
   - Cookie persiste entre reloads

4. **Interceptor maneja errores globalmente**
   - 401 → Redirige a login
   - Excepciones: /auth/login, /auth/me
   - No necesitas manejar auth en cada componente

### ⚠️ Importante recordar:

1. **Cookie Path debe ser "/"**
   - NO uses "/admin" o no funcionará con "/api/v1/admin/..."
   - Backend debe configurar: `Path=/`

2. **CORS con AllowCredentials**
   - Backend debe tener `AllowCredentials()` o `credentials: true`
   - Frontend debe tener `withCredentials: true`
   - Ambos son obligatorios

3. **Mismo dominio en desarrollo**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000` (o el puerto que uses)
   - NO uses HTTPS en desarrollo (causa problemas de certificado)

4. **Token en cookie, info en store**
   - JWT va en cookie HttpOnly (seguridad)
   - Info del usuario va en Zustand (UI)
   - NO guardes el token en localStorage

---

## 📝 DEBUGGING CHECKLIST

### Si las cookies NO funcionan:

```
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: ¿El login envía Set-Cookie?                         │
├─────────────────────────────────────────────────────────────┤
│ DevTools → Network → POST /admin/auth/login                 │
│ Response Headers → buscar: Set-Cookie: bk.token=...         │
│                                                              │
│ ✅ Sí → Continúa al PASO 2                                  │
│ ❌ No → PROBLEMA EN BACKEND (no envía cookie)               │
│         Ver: BACKEND-COOKIE-CONFIGURATION.md                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PASO 2: ¿El navegador guarda la cookie?                     │
├─────────────────────────────────────────────────────────────┤
│ DevTools → Application → Cookies → http://localhost:5173    │
│ Buscar: bk.token con valor eyJ...                           │
│                                                              │
│ ✅ Sí → Continúa al PASO 3                                  │
│ ❌ No → PROBLEMA EN ATRIBUTOS DE COOKIE                     │
│         Verifica: Path, SameSite, Secure                    │
│         Path debe ser "/" (no "/admin")                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PASO 3: ¿Las requests incluyen la cookie?                   │
├─────────────────────────────────────────────────────────────┤
│ DevTools → Network → GET /admin/operators                   │
│ Request Headers → buscar: Cookie: bk.token=...              │
│                                                              │
│ ✅ Sí → Continúa al PASO 4                                  │
│ ❌ No → PROBLEMA EN AXIOS o PATH DE COOKIE                  │
│         Verifica: window.apiDebug() → withCredentials: true │
│         Verifica: Cookie Path incluye tu endpoint           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PASO 4: ¿El backend valida la cookie?                       │
├─────────────────────────────────────────────────────────────┤
│ Si la cookie se envía pero responde 401:                    │
│                                                              │
│ ❌ PROBLEMA EN VALIDACIÓN DE BACKEND                        │
│    - Verifica que backend lee cookie "bk.token"            │
│    - Verifica que valida el JWT correctamente              │
│    - Verifica que el token no expiró                       │
│                                                              │
│ Ver: BACKEND-COOKIE-CONFIGURATION.md                        │
│      Sección "Middleware de Autenticación"                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 GLOSARIO DE TÉRMINOS

**HttpOnly Cookie**
Cookie que no es accesible desde JavaScript. Solo el navegador puede leerla y enviarla. Previene ataques XSS.

**withCredentials: true**
Opción de Axios que indica al navegador que envíe cookies en requests cross-origin (o same-origin). Obligatorio para que las cookies funcionen.

**AllowCredentials**
Configuración de CORS en backend que permite que el frontend envíe cookies. Obligatorio para que `withCredentials: true` funcione.

**SameSite**
Atributo de cookie que controla cuándo se envía:
- `Lax`: Solo en same-site (localhost → localhost)
- `None`: Cross-domain (requiere Secure=true)
- `Strict`: Solo en navegación directa

**Path**
Ruta donde aplica la cookie. `Path=/` funciona en todos los endpoints. `Path=/admin` solo en rutas que empiecen con `/admin`.

**Secure**
Cookie solo se envía en HTTPS. En desarrollo HTTP usar `false`, en producción HTTPS usar `true`.

**JWT (JSON Web Token)**
Token firmado que contiene información del usuario. Backend lo genera en login y lo valida en cada request.

**Interceptor**
Función que Axios ejecuta antes de enviar una request (request interceptor) o después de recibir una response (response interceptor). Útil para logging y manejo de errores global.

**Zustand Store**
Estado global de React. Guarda info del usuario para UI. Con persist middleware, sobrevive a reloads.

---

## 🚀 PRÓXIMOS PASOS

1. **Verifica el puerto del backend** (actualiza `.env` si es necesario)
2. **Reinicia el servidor de Vite** (`npm run dev`)
3. **Ejecuta el Checklist Rápido** de `TESTING-PLAN.md`
4. **Sigue el flujo de debugging** si algo falla

**Si todo está correcto, las cookies funcionarán automáticamente.** 🎉

---

**Archivos de referencia:**
- `EXECUTIVE-SUMMARY-AXIOS.md` - Resumen ejecutivo
- `AXIOS-COOKIE-SOLUTION-COMPLETE.md` - Solución completa
- `AXIOS-CODE-REFERENCE.md` - Código comentado
- `BACKEND-COOKIE-CONFIGURATION.md` - Configuración de backend
- `TESTING-PLAN.md` - Plan de testing paso a paso
- Este archivo - Flujo visual completo

**¡Éxito con tu implementación!** 🎰
