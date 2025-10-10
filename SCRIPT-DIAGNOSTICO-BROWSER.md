# 🧪 SCRIPT DE DIAGNÓSTICO - Ejecuta en la Consola del Navegador

## 📋 Instrucciones

1. Abre tu aplicación: `https://admin.bet30.local:5173`
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**
4. Copia y pega el siguiente script completo
5. Presiona Enter
6. Comparte los resultados

---

## 🔍 SCRIPT DE DIAGNÓSTICO COMPLETO

```javascript
(async function diagnosticoCookiesBearer() {
  console.clear();
  console.log('🔍 DIAGNÓSTICO DE AUTENTICACIÓN - Casino Backoffice');
  console.log('='.repeat(60));
  
  const resultados = {
    paso1_configuracion: {},
    paso2_cookies_actuales: {},
    paso3_storage: {},
    paso4_prueba_login: {},
    paso5_prueba_endpoint_protegido: {},
    recomendaciones: []
  };
  
  // ============================================
  // PASO 1: Verificar Configuración de Axios
  // ============================================
  console.log('\n📊 PASO 1: Configuración de Axios');
  console.log('-'.repeat(60));
  
  try {
    const { apiClient } = await import('/src/api/client.ts');
    
    resultados.paso1_configuracion = {
      baseURL: apiClient.defaults.baseURL,
      withCredentials: apiClient.defaults.withCredentials,
      timeout: apiClient.defaults.timeout,
      headers: apiClient.defaults.headers
    };
    
    console.log('✅ Configuración de Axios:', resultados.paso1_configuracion);
    
    if (!apiClient.defaults.withCredentials) {
      console.error('❌ PROBLEMA: withCredentials NO está configurado como true');
      resultados.recomendaciones.push('Configurar withCredentials: true en client.ts');
    } else {
      console.log('✅ withCredentials está configurado correctamente');
    }
    
    if (apiClient.defaults.baseURL.includes('https://admin.bet30.local')) {
      console.warn('⚠️ ADVERTENCIA: Estás usando HTTPS con dominio .local');
      console.warn('   Esto puede causar problemas con cookies HttpOnly');
      resultados.recomendaciones.push('Considera cambiar a http://localhost:7182/api/v1 para desarrollo');
    }
  } catch (error) {
    console.error('❌ Error al cargar configuración de Axios:', error);
    resultados.paso1_configuracion.error = error.message;
  }
  
  // ============================================
  // PASO 2: Verificar Cookies Actuales
  // ============================================
  console.log('\n🍪 PASO 2: Cookies Actuales');
  console.log('-'.repeat(60));
  
  const cookiesRaw = document.cookie;
  resultados.paso2_cookies_actuales.raw = cookiesRaw;
  
  if (!cookiesRaw || cookiesRaw.trim() === '') {
    console.error('❌ NO hay cookies en document.cookie');
    console.log('   Esto puede significar:');
    console.log('   1. No has hecho login todavía');
    console.log('   2. La cookie es HttpOnly (NO accesible desde JS)');
    console.log('   3. La cookie no se guardó debido a problemas de SSL/dominio');
    resultados.paso2_cookies_actuales.status = 'NINGUNA COOKIE VISIBLE';
  } else {
    console.log('✅ Cookies encontradas:', cookiesRaw);
    
    // Parsear cookies
    const cookiesObj = {};
    cookiesRaw.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookiesObj[name] = value;
    });
    resultados.paso2_cookies_actuales.parsed = cookiesObj;
    
    if (cookiesObj['bk.token']) {
      console.log('✅ Cookie bk.token ENCONTRADA (accesible desde JS)');
      console.log('   Valor:', cookiesObj['bk.token'].substring(0, 50) + '...');
      resultados.paso2_cookies_actuales.bkToken = 'PRESENTE (NO HttpOnly)';
    } else {
      console.log('⚠️ Cookie bk.token NO visible en document.cookie');
      console.log('   Esto es NORMAL si la cookie es HttpOnly');
      console.log('   Verifica en DevTools → Application → Cookies');
      resultados.paso2_cookies_actuales.bkToken = 'NO VISIBLE (posiblemente HttpOnly)';
    }
  }
  
  // ============================================
  // PASO 3: Verificar LocalStorage/SessionStorage
  // ============================================
  console.log('\n💾 PASO 3: Storage del Navegador');
  console.log('-'.repeat(60));
  
  const authToken = localStorage.getItem('auth_token');
  const authStore = localStorage.getItem('auth-store');
  
  resultados.paso3_storage = {
    auth_token: authToken ? 'PRESENTE' : 'AUSENTE',
    auth_store: authStore ? 'PRESENTE' : 'AUSENTE'
  };
  
  if (authToken) {
    console.log('✅ auth_token en localStorage:', authToken.substring(0, 50) + '...');
    console.log('   ⚠️ ADVERTENCIA: Token en localStorage NO es seguro');
    console.log('   ⚠️ Vulnerable a XSS. Se recomienda usar cookies HttpOnly');
  } else {
    console.log('✅ NO hay auth_token en localStorage (correcto si usas cookies)');
  }
  
  if (authStore) {
    try {
      const parsedStore = JSON.parse(authStore);
      console.log('✅ auth-store en localStorage:', parsedStore);
      resultados.paso3_storage.auth_store_data = parsedStore.state;
      
      if (parsedStore.state?.isAuthenticated) {
        console.log('✅ Usuario aparece autenticado en Zustand store');
      } else {
        console.log('⚠️ Usuario NO aparece autenticado en Zustand store');
      }
    } catch (e) {
      console.error('❌ Error parseando auth-store:', e);
    }
  } else {
    console.log('⚠️ NO hay auth-store en localStorage');
  }
  
  // ============================================
  // PASO 4: Prueba de Login (si no estás logueado)
  // ============================================
  console.log('\n🔐 PASO 4: Prueba de Login');
  console.log('-'.repeat(60));
  console.log('⏭️ OMITIDO: Haz login manualmente desde la UI');
  console.log('   Después ejecuta el PASO 5 para probar endpoints protegidos');
  
  // ============================================
  // PASO 5: Prueba de Endpoint Protegido
  // ============================================
  console.log('\n🔒 PASO 5: Prueba de Endpoint Protegido');
  console.log('-'.repeat(60));
  
  try {
    const { apiClient } = await import('/src/api/client.ts');
    
    console.log('🧪 Probando GET /admin/brands...');
    
    const response = await apiClient.get('/admin/brands');
    
    console.log('✅ REQUEST EXITOSO!');
    console.log('   Status:', response.status);
    console.log('   Data:', response.data);
    
    resultados.paso5_prueba_endpoint_protegido = {
      status: 'SUCCESS',
      code: response.status,
      data: response.data
    };
    
    console.log('\n🎉 TODO FUNCIONA CORRECTAMENTE!');
    console.log('   Las cookies se están enviando bien');
    
  } catch (error) {
    console.error('❌ REQUEST FALLÓ');
    console.error('   Error:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
      
      resultados.paso5_prueba_endpoint_protegido = {
        status: 'FAILED',
        code: error.response.status,
        message: error.message,
        data: error.response.data
      };
      
      if (error.response.status === 401) {
        console.log('\n🔍 DIAGNÓSTICO DEL ERROR 401:');
        console.log('   El backend NO está recibiendo o validando la cookie correctamente');
        console.log('   Posibles causas:');
        console.log('   1. Cookie no se está ENVIANDO en la request');
        console.log('   2. Cookie HttpOnly bloqueada por SSL/dominio');
        console.log('   3. Backend no está LEYENDO la cookie');
        console.log('   4. JWT expirado o inválido');
        console.log('\n   📝 VERIFICA EN DEVTOOLS → NETWORK:');
        console.log('   - Busca la request GET /admin/brands');
        console.log('   - Ve a Headers → Request Headers');
        console.log('   - ¿Ves "Cookie: bk.token=..."? ');
        console.log('     SI → Backend no está validando correctamente');
        console.log('     NO → Cookie no se está enviando (problema de SSL/dominio)');
        
        resultados.recomendaciones.push('Revisar Network tab para ver si la cookie se envía');
        resultados.recomendaciones.push('Considerar cambiar a http://localhost:7182');
        resultados.recomendaciones.push('Verificar configuración de CORS en backend');
      } else if (error.response.status === 403) {
        console.log('\n🔍 ERROR 403: Sin permisos');
        console.log('   La cookie se está enviando, pero el usuario no tiene permisos');
      }
    } else if (error.request) {
      console.error('❌ ERROR DE RED');
      console.error('   No se recibió respuesta del servidor');
      console.error('   Verifica que el backend esté corriendo');
      
      resultados.paso5_prueba_endpoint_protegido = {
        status: 'NETWORK_ERROR',
        message: 'No se recibió respuesta del servidor'
      };
      
      resultados.recomendaciones.push('Verificar que el backend esté corriendo en https://admin.bet30.local:7182');
    } else {
      console.error('❌ ERROR DESCONOCIDO:', error);
      resultados.paso5_prueba_endpoint_protegido = {
        status: 'UNKNOWN_ERROR',
        message: error.message
      };
    }
  }
  
  // ============================================
  // PASO 6: Verificar Headers en Request
  // ============================================
  console.log('\n📤 PASO 6: Verificar Headers de Request');
  console.log('-'.repeat(60));
  console.log('⚠️ MANUAL: Abre DevTools → Network tab');
  console.log('   1. Haz una request a un endpoint protegido (ej: /admin/brands)');
  console.log('   2. Click en la request');
  console.log('   3. Ve a Headers → Request Headers');
  console.log('   4. Busca el header "Cookie"');
  console.log('');
  console.log('   ✅ SI VES: Cookie: bk.token=eyJ...');
  console.log('      → La cookie SE ESTÁ ENVIANDO');
  console.log('      → Problema está en el backend (validación, CORS, etc.)');
  console.log('');
  console.log('   ❌ SI NO VES el header Cookie:');
  console.log('      → La cookie NO SE ESTÁ ENVIANDO');
  console.log('      → Problema: SSL, dominio .local, o SameSite policy');
  console.log('      → SOLUCIÓN: Cambiar a http://localhost:7182');
  
  // ============================================
  // RESUMEN Y RECOMENDACIONES
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DEL DIAGNÓSTICO');
  console.log('='.repeat(60));
  
  console.log('\n1️⃣ Configuración de Axios:');
  console.log(JSON.stringify(resultados.paso1_configuracion, null, 2));
  
  console.log('\n2️⃣ Cookies Actuales:');
  console.log(JSON.stringify(resultados.paso2_cookies_actuales, null, 2));
  
  console.log('\n3️⃣ Storage:');
  console.log(JSON.stringify(resultados.paso3_storage, null, 2));
  
  console.log('\n5️⃣ Prueba de Endpoint Protegido:');
  console.log(JSON.stringify(resultados.paso5_prueba_endpoint_protegido, null, 2));
  
  if (resultados.recomendaciones.length > 0) {
    console.log('\n💡 RECOMENDACIONES:');
    resultados.recomendaciones.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ DIAGNÓSTICO COMPLETO');
  console.log('='.repeat(60));
  
  // Guardar resultados en variable global para inspección
  window.diagnosticoResultados = resultados;
  console.log('\n💾 Resultados guardados en: window.diagnosticoResultados');
  
  return resultados;
})();
```

---

## 📸 QUÉ COMPARTIR DESPUÉS DE EJECUTAR

### 1. Output de la Consola
- Copia TODO el texto de la consola después de ejecutar el script
- Incluye especialmente:
  - Configuración de Axios
  - Estado de cookies
  - Resultado del PASO 5 (endpoint protegido)

### 2. Screenshot de Network Tab
- DevTools → Network
- Filtra por "brands" o el endpoint que se probó
- Click en la request
- Screenshot de:
  - **Request Headers** (debe incluir todos los headers)
  - **Response Headers** (especialmente después del login)

### 3. Screenshot de Application → Cookies
- DevTools → Application
- Storage → Cookies → `https://admin.bet30.local:5173`
- Screenshot mostrando todas las cookies presentes

### 4. Screenshot de Security Tab
- DevTools → Security
- Screenshot mostrando el estado del certificado SSL

---

## 🎯 INTERPRETACIÓN DE RESULTADOS

### ✅ Si el PASO 5 es exitoso:
```
✅ REQUEST EXITOSO!
   Status: 200
   Data: [...]
```
**→ TODO FUNCIONA CORRECTAMENTE**
- Las cookies se envían bien
- No necesitas hacer cambios

### ❌ Si el PASO 5 falla con 401:
```
❌ REQUEST FALLÓ
   Status: 401
   Data: {message: "Unauthorized"}
```

**Entonces verifica en Network tab:**

#### Caso A: SÍ ves `Cookie: bk.token=...` en Request Headers
**→ Problema en el BACKEND**
- Backend NO está leyendo/validando la cookie correctamente
- Verifica configuración de CORS con `AllowCredentials`
- Verifica que backend lee cookie `bk.token`

#### Caso B: NO ves `Cookie: bk.token=...` en Request Headers
**→ Problema en el FRONTEND/NAVEGADOR**
- Cookie NO se está enviando
- Causa: HTTPS + dominio `.local` + certificado inválido
- **SOLUCIÓN:** Cambiar a `http://localhost:7182/api/v1`

### ❌ Si el PASO 5 falla con Network Error:
```
❌ ERROR DE RED
   No se recibió respuesta del servidor
```
**→ Backend NO está corriendo**
- Verifica que el backend esté activo en `https://admin.bet30.local:7182`
- Intenta: `curl https://admin.bet30.local:7182/api/v1/health`

---

## 🚀 PRÓXIMOS PASOS SEGÚN RESULTADO

### Si Cookie NO se está enviando:
1. Cambia `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:7182/api/v1
   ```
2. Reinicia servidor: `npm run dev`
3. Prueba login y endpoints nuevamente

### Si Backend no valida cookie:
1. Revisa configuración de CORS en backend
2. Verifica que backend lea cookie `bk.token`
3. Verifica que JWT no esté expirado
4. Consulta: `BACKEND-COOKIE-CONFIGURATION.md`

### Si necesitas usar Bearer Token:
1. Consulta: `DIAGNOSTICO-COOKIES-BEARER.md` → SOLUCIÓN 3
2. Modifica backend para enviar token en body
3. Modifica frontend para guardarlo y enviarlo en headers

---

**Ejecuta este script y comparte los resultados completos** 🔍
