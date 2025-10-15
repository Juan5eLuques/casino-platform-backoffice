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
         // Proxy para evitar CORS en desarrollo según especificaciones
         '/api': {
            target: 'https://casino-platform-production.up.railway.app/', // VITE_API_ORIGIN
            changeOrigin: true,
            secure: false // Para certificados self-signed en desarrollo
         }
      }
   },
   build: {
      outDir: 'dist',
      sourcemap: true,
   },
})