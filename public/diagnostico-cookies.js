// 🔍 Script para Diagnosticar Cookies en el Navegador
// Ejecuta este código en la consola del navegador (F12) después de hacer login

console.clear();
console.log('🔍 === DIAGNÓSTICO DE COOKIES ===\n');

// 1. Información del entorno
console.log('📍 1. Información del Entorno:');
console.log('   Frontend URL:', window.location.origin);
console.log('   Hostname:', window.location.hostname);
console.log('   Protocol:', window.location.protocol);
console.log('');

// 2. Verificar cookies visibles (no HttpOnly)
console.log('🍪 2. Cookies Visibles desde JavaScript:');
const visibleCookies = document.cookie;
if (visibleCookies) {
    console.log('   ✅ Cookies:', visibleCookies);
} else {
    console.log('   ⚠️  No hay cookies visibles (normal para HttpOnly)');
}
console.log('');

// 3. Instrucciones para verificar cookies HttpOnly
console.log('🔎 3. Verificar Cookies HttpOnly en DevTools:');
console.log('   1. Abre DevTools (F12)');
console.log('   2. Ve a: Application → Storage → Cookies');
console.log('   3. Selecciona:', window.location.origin);
console.log('');
console.log('   Busca una cookie llamada "jwt" o "auth_token"');
console.log('');

// 4. Verificar configuración de axios
console.log('⚙️  4. Configuración de Axios:');
console.log('   API Base URL:', import.meta.env.VITE_API_BASE_URL || 'No definida');
console.log('   withCredentials: Verificar en src/api/client.ts (debe ser true)');
console.log('');

// 5. Hacer prueba de petición al /me
console.log('📡 5. Prueba de Petición al /me:');
console.log('   Ejecutando fetch al /me...\n');

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://casino-platform-production.up.railway.app/api/v1';

fetch(`${apiUrl}/admin/auth/me`, {
    method: 'GET',
    credentials: 'include', // ← Equivalente a withCredentials: true
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('   📥 Respuesta recibida:');
    console.log('   Status:', response.status, response.statusText);
    
    if (response.status === 401) {
        console.log('   ❌ 401 Unauthorized - La cookie NO se envió o el token es inválido\n');
    } else if (response.ok) {
        console.log('   ✅ Respuesta exitosa - La cookie SÍ se envió\n');
    }
    
    return response.json();
})
.then(data => {
    console.log('   📄 Data:', data);
    console.log('');
})
.catch(error => {
    console.error('   ❌ Error:', error.message);
    console.log('');
});

// 6. Instrucciones para verificar en Network tab
console.log('🌐 6. Verificar en Network Tab:');
console.log('   1. Abre DevTools → Network');
console.log('   2. Busca la petición GET /admin/auth/me');
console.log('   3. Click en la petición → Headers');
console.log('');
console.log('   📋 Verifica en "Request Headers":');
console.log('   ┌─────────────────────────────────────────────┐');
console.log('   │ Cookie: jwt=eyJhbGc...                      │');
console.log('   └─────────────────────────────────────────────┘');
console.log('');
console.log('   ✅ Si ves el header "Cookie": La cookie SÍ se envía');
console.log('   ❌ Si NO ves el header "Cookie": La cookie NO se envía');
console.log('');

// 7. Posibles causas si la cookie no se envía
console.log('🔧 7. Posibles Causas (si la cookie NO se envía):');
console.log('');
console.log('   Causa 1: Domain incorrecto');
console.log('   ─────────────────────────────');
console.log('   La cookie puede estar asociada a un dominio diferente.');
console.log('   Solución: El backend debe configurar Domain = null');
console.log('');
console.log('   Causa 2: SameSite incorrecto');
console.log('   ─────────────────────────────');
console.log('   Si el backend y frontend están en dominios diferentes,');
console.log('   la cookie DEBE tener: SameSite=None; Secure');
console.log('   Solución: El backend debe configurar:');
console.log('   SameSite = SameSiteMode.None');
console.log('   Secure = true');
console.log('');
console.log('   Causa 3: Path incorrecto');
console.log('   ─────────────────────────────');
console.log('   La cookie puede tener un Path diferente al de la petición.');
console.log('   Solución: El backend debe configurar Path = "/"');
console.log('');
console.log('   Causa 4: Cookie expiró');
console.log('   ─────────────────────────────');
console.log('   La cookie puede haber expirado.');
console.log('   Verifica en Application → Cookies → Expires/Max-Age');
console.log('');

console.log('✅ === FIN DEL DIAGNÓSTICO ===');
console.log('');
console.log('📋 Próximos pasos:');
console.log('   1. Verifica la cookie en Application → Cookies');
console.log('   2. Anota el Domain, Path, SameSite, Secure de la cookie');
console.log('   3. Verifica si el header "Cookie" se envía en la petición /me');
console.log('   4. Comparte esa información para diagnosticar el problema exacto');
