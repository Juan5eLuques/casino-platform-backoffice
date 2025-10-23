import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
   server: {
      port: 5173,
      host: 'localhost', // localhost para compatibilidad con cookies
      cors: true,
      proxy: {
         // Proxy para evitar CORS en desarrollo
         // ✅ Cambia el target según tu backend:
         //    - Desarrollo local: 'https://localhost:7182'
         //    - Producción Railway: 'https://casino-platform-production.up.railway.app'
         '/api': {
            target: 'https://localhost:7182', // 🔥 Tu backend local
            changeOrigin: true,
            secure: false, // Para certificados self-signed en desarrollo
            rewrite: (path) => path, // Mantener /api en la ruta
         }
      }
   },
   build: {
      outDir: 'dist',
      sourcemap: true,
   },
})