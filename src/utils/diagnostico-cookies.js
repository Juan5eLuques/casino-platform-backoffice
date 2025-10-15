// 🔍 Script de Diagnóstico: Verificar Cookies Cross-Origin
// Ejecutar este script en la consola del navegador (F12) en producción (Netlify)

console.log('🔍 === DIAGNÓSTICO DE COOKIES CROSS-ORIGIN ===');
console.log('Frontend URL:', window.location.origin);

// 1. Verificar cookies en el navegador
console.log('\n📦 1. Cookies almacenadas:');
const cookies = document.cookie;
if (cookies) {
    console.log('✅ Cookies visibles:', cookies);
} else {
    console.log('⚠️ NO HAY COOKIES visibles (puede ser HttpOnly - es NORMAL)');
    console.log('💡 Para verificar cookies HttpOnly:');
    console.log('   DevTools → Application → Cookies → ' + window.location.hostname);
}

// 2. Verificar configuración del entorno
console.log('\n⚙️ 2. Variables de entorno:');
console.log('Frontend Origin:', window.location.origin);
console.log('¿Está en producción?', window.location.hostname.includes('netlify') || window.location.hostname.includes('vercel'));

// 3. Verificar que Axios tiene withCredentials
console.log('\n🔗 3. Configuración de Axios:');
console.log('withCredentials:', 'Verificar en el código fuente de client.ts');
console.log('💡 Debe estar configurado como: withCredentials: true');

// 4. Hacer una petición de prueba y verificar headers
console.log('\n📡 4. Verificando petición al API...');

const API_URL = 'https://casino-platform-production.up.railway.app/api/v1';

fetch(`${API_URL}/auth/me`, {
  method: 'GET',
  credentials: 'include', // Equivalente a withCredentials
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('\n✅ Respuesta recibida:');
  console.log('Status:', response.status);
  console.log('Headers:', [...response.headers.entries()]);
  
  // Verificar si hay Set-Cookie
  const setCookie = response.headers.get('Set-Cookie');
  console.log('\nSet-Cookie header:', setCookie || 'NO PRESENTE');
  
  // Verificar CORS headers
  console.log('\nCORS Headers:');
  console.log('Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
  console.log('Access-Control-Allow-Credentials:', response.headers.get('Access-Control-Allow-Credentials'));
  
  return response.json();
})
.then(data => {
  console.log('\n📄 Data:', data);
})
.catch(error => {
  console.error('\n❌ Error:', error);
  console.error('Detalles:', error.message);
});

// 4. Información del entorno
console.log('\n🌍 4. Información del entorno:');
console.log('Frontend URL:', window.location.origin);
console.log('API URL:', API_URL);
console.log('Mismo dominio?', window.location.origin === new URL(API_URL).origin ? '✅ SÍ' : '❌ NO (cross-origin)');

// 5. Verificar si las cookies se envían en DevTools
console.log('\n👀 5. INSTRUCCIONES PARA VERIFICAR MANUALMENTE:');
console.log('1. Abre DevTools → Network');
console.log('2. Haz una petición al API (ej: refresh la página)');
console.log('3. Busca la petición al API');
console.log('4. En la pestaña "Headers", verifica:');
console.log('   - Request Headers: debe incluir "Cookie: jwt=..."');
console.log('   - Response Headers: debe incluir "Set-Cookie: jwt=...; SameSite=None; Secure"');
console.log('   - Response Headers: debe incluir "Access-Control-Allow-Credentials: true"');

console.log('\n✅ === FIN DEL DIAGNÓSTICO ===');
