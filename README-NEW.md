# 🎰 Casino Backoffice

> Sistema de administración completo para plataforma de casino B2B multi-tenant desarrollado con React + TypeScript

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)](https://tailwindcss.com/)

---

## 🚀 Quick Start (5 minutos)

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
# El archivo .env ya está configurado para desarrollo local:
# VITE_API_BASE_URL=http://localhost:5000/api/v1

# Verificar configuración:
cat .env
```

### 3. Iniciar Backend

```bash
# En otra terminal, correr el backend .NET
cd ../casino-backend
dotnet run --project apps/api/Casino.Api

# Debe mostrar: Now listening on: http://localhost:5000
```

### 4. Iniciar Frontend

```bash
npm run dev

# Se abre automáticamente en: http://localhost:5173
```

### 5. Login

```
URL: http://localhost:5173/login
Usuario: superadmin (o el que tengas configurado)
Password: tu_password
```

**¡Listo!** El backoffice está corriendo y conectado al backend. ✅

---

## 🎯 Características Principales

### ✨ Funcionalidades Core

- 🔐 **Autenticación JWT + Cookies HttpOnly** - Segura y automática
- 👥 **Sistema de Permisos Completo** - 3 roles con matriz de permisos
- 🏢 **Gestión de Operadores** - CRUD completo (solo SUPER_ADMIN)
- 🏷️ **Multi-Brand Management** - Gestión de marcas por operador
- 👤 **Gestión de Usuarios Backoffice** - Con roles y permisos
- 🎮 **Gestión de Jugadores** - CRUD + ajuste de wallet
- 🎲 **Catálogo de Juegos** - Por brand con habilitación
- 📋 **Auditoría Completa** - Logs de backoffice y providers
- 📊 **Dashboard Analytics** - Métricas en tiempo real
- 🌙 **Dark Mode** - Soporte completo con persistencia

---

## 📁 Estructura del Proyecto

```
src/
├── api/                    # API Clients con Axios
│   ├── client.ts          # Cliente configurado con withCredentials
│   ├── auth.ts            # Login, logout, profile
│   ├── operators.ts       # CRUD operadores
│   ├── brands.ts          # CRUD brands + settings + providers
│   ├── users.ts           # CRUD usuarios backoffice
│   ├── players.ts         # CRUD jugadores + wallet
│   ├── games.ts           # Catálogo de juegos
│   └── audit.ts           # Logs de auditoría
│
├── components/
│   ├── DataTable.tsx      # Tabla reutilizable con paginación
│   ├── Modal.tsx          # Modal genérico
│   ├── PermissionGuard.tsx # Guard de permisos
│   └── layout/            # Componentes de layout
│
├── pages/
│   ├── LoginPage.tsx      # Login con JWT
│   ├── DashboardPage.tsx  # Dashboard principal
│   ├── OperatorsPage.tsx  # CRUD operadores
│   ├── BrandsPage.tsx     # Gestión de brands
│   ├── UsersPage.tsx      # Gestión de usuarios
│   ├── PlayersPage.tsx    # Gestión de jugadores
│   ├── GamesPage.tsx      # Catálogo de juegos
│   └── AuditPage.tsx      # Logs de auditoría
│
├── hooks/
│   ├── useAuth.ts         # Hook de autenticación
│   └── usePermissions.ts  # Hook de permisos
│
├── lib/
│   └── permissions.ts     # Sistema de permisos
│
├── store/
│   ├── auth.ts            # Store de autenticación (Zustand)
│   └── ui.ts              # Store de UI (dark mode, sidebar)
│
├── types/
│   └── index.ts           # Tipos TypeScript
│
└── App.tsx                # Routing principal
```

---

## 🔐 Sistema de Permisos

### Roles Disponibles

#### 1. **SUPER_ADMIN** (Todos los permisos)

- ✅ Gestiona operadores (CRUD completo)
- ✅ Gestiona todas las brands de cualquier operador
- ✅ Gestiona todos los usuarios backoffice
- ✅ Gestiona todos los jugadores
- ✅ Ve todos los logs de auditoría
- ✅ Configuración global

#### 2. **OPERATOR_ADMIN** (Scoped a su operador)

- 🔒 Ve solo su operador (read-only)
- ✅ Gestiona brands de su operador
- ✅ Gestiona usuarios de su operador
- ✅ Gestiona jugadores de sus brands
- ✅ Ve logs de auditoría de su operador
- ✅ Configuración de su operador

#### 3. **CASHIER** (Scoped a jugadores asignados)

- 🔒 Sin acceso a operadores
- 🔒 Sin acceso a brands (solo lectura)
- 🔒 Sin acceso a usuarios
- ✅ Solo ve jugadores asignados
- ✅ Puede ajustar wallet de jugadores asignados
- 🔒 Sin acceso a auditoría
- ✅ Configuración personal

---

## 🛠️ Stack Tecnológico

### Core

- **React 18.2** - UI Library
- **TypeScript 5.0** - Type Safety
- **Vite 5.0** - Build Tool
- **TailwindCSS 3.0** - Styling

### State Management

- **Zustand 4.4** - Global State (auth, UI)
- **TanStack Query 5.0** - Server State & Cache

### Routing & Forms

- **React Router 6.17** - Client-side routing
- **React Hook Form 7.47** - Form handling
- **Zod 3.22** - Schema validation

### UI Components

- **Headless UI 1.7** - Accessible components
- **Heroicons 2.0** - Icon library
- **Lucide React 0.292** - Additional icons
- **React Hot Toast 2.4** - Notifications

### HTTP Client

- **Axios 1.6** - HTTP requests con interceptors

### Charts (opcional)

- **Recharts 2.8** - Data visualization

---

## 📚 Documentación

| Documento                                      | Descripción                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| `SETUP-GUIDE.md`                               | Guía completa de configuración y troubleshooting |
| `EXECUTIVE-SUMMARY.md`                         | Resumen ejecutivo del proyecto                   |
| `IMPLEMENTATION-SUMMARY.md`                    | Resumen de lo implementado                       |
| `API-CLIENT-CHANGES.md`                        | Cambios aplicados al cliente API                 |
| `BACKOFFICE-FRONTEND-IMPLEMENTATION-PROMPT.md` | Documentación de endpoints                       |

---

## 🧪 Testing y Debug

### Helper de Debug en Consola

```javascript
// Disponible en modo desarrollo
window.apiDebug.config; // Ver configuración actual
await window.apiDebug.testConnection(); // Probar conexión con backend
```

### Verificar Cookies

1. Abrir DevTools (F12)
2. Ir a **Application** > **Cookies** > `http://localhost:5173`
3. Verificar que existe: `bk.token`
4. Debe tener:
   - ✅ **HttpOnly**: true
   - ✅ **Path**: /admin
   - ✅ **SameSite**: Lax

### Ver Network Requests

1. Ir a **Network** tab
2. Filtrar por: `admin`
3. Verificar headers:
   - Request: `Cookie: bk.token=...`
   - Response: `Access-Control-Allow-Credentials: true`

---

## 🐛 Troubleshooting

### "CORS error"

**Solución:**

```bash
# Verificar que el backend esté corriendo
curl http://localhost:5000/health

# Verificar .env
cat .env | grep VITE_API_BASE_URL
# Debe mostrar: http://localhost:5000/api/v1
```

### "401 Unauthorized"

**Solución:**

1. Hacer login primero
2. Verificar cookie `bk.token` en DevTools
3. Si no existe, hacer login de nuevo

### "Network Error"

**Solución:**

```bash
# El backend no está corriendo
dotnet run --project apps/api/Casino.Api

# Verificar que esté en el puerto correcto (5000)
```

### Más información

Ver `SETUP-GUIDE.md` para troubleshooting completo.

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo
npm run dev:debug        # Dev con debugging habilitado

# Build
npm run build            # Build para producción
npm run preview          # Preview del build

# Linting
npm run lint             # Ejecuta ESLint
npm run lint:fix         # Arregla problemas de ESLint

# Type Checking
npm run type-check       # Verifica tipos TypeScript

# Hosts
npm run hosts:setup      # Muestra instrucciones para configurar hosts (opcional)
```

---

## 🚢 Deployment

### Configuración para Producción

1. Actualizar `.env`:

```env
VITE_API_BASE_URL=https://api.tudominio.com/api/v1
VITE_NODE_ENV=production
VITE_ENABLE_API_LOGGING=false
```

2. Build:

```bash
npm run build
```

3. El output estará en: `dist/`

4. Deploy a tu servidor favorito:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Nginx

---

## 🤝 Contribuir

### Workflow

1. Fork el repositorio
2. Crear branch: `git checkout -b feature/nueva-feature`
3. Commit cambios: `git commit -m 'Add nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Crear Pull Request

### Código de Conducta

- Usar TypeScript estricto
- Seguir convenciones de Prettier y ESLint
- Escribir código auto-documentado
- Comentar lógica compleja
- Probar antes de hacer PR

---

## 📄 Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

---

## 👥 Equipo

Desarrollado por el equipo de Casino Platform.

---

## 📞 Soporte

Para preguntas o problemas:

1. Leer primero: `SETUP-GUIDE.md`
2. Verificar: `EXECUTIVE-SUMMARY.md`
3. Contactar: equipo de desarrollo

---

**¡Feliz coding! 🎰🚀**
