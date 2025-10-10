# Casino Backoffice - Setup & Development Guide

## 🚀 Configuración Inicial

### 1. Instalación de Dependencias

```bash
npm install
```

### 2. Configuración de Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables según tu entorno
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_ADMIN_DOMAIN=admin.mycasino.local
```

### 3. Configuración del Backend

Asegúrate de que el backend esté corriendo en `http://localhost:5000` con los siguientes endpoints disponibles:

- `POST /api/v1/admin/auth/login` - Autenticación
- `GET /api/v1/admin/auth/me` - Perfil usuario
- `GET /api/v1/admin/players` - Lista de jugadores
- `GET /api/v1/admin/users` - Lista de usuarios
- `GET /api/v1/admin/brands` - Lista de brands
- Y más endpoints según la documentación de API

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con HMR
npm run build           # Build de producción
npm run preview         # Preview del build de producción

# Linting y Formatting
npm run lint            # Verificar errores de ESLint
npm run lint:fix        # Corregir errores automáticamente
npm run type-check      # Verificación de tipos TypeScript
```

## 🏗 Estructura del Proyecto

```
src/
├── api/                 # Clientes HTTP y configuración de Axios
│   ├── client.ts       # Cliente base con interceptors
│   ├── auth.ts         # API de autenticación
│   ├── players.ts      # API de jugadores
│   ├── users.ts        # API de usuarios
│   ├── brands.ts       # API de brands
│   └── index.ts        # Re-exports
├── components/         # Componentes reutilizables
│   ├── ui/            # Componentes UI básicos
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   └── layout/        # Componentes de layout
│       ├── DashboardLayout.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
├── hooks/             # Custom hooks con React Query
│   ├── useAuth.ts
│   ├── usePlayers.ts
│   └── ...
├── pages/             # Páginas principales
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── PlayersPage.tsx
│   └── ...
├── store/             # Estado global con Zustand
│   ├── auth.ts        # Estado de autenticación
│   ├── ui.ts          # Estado de UI (sidebar, dark mode)
│   └── index.ts
├── types/             # Definiciones TypeScript
│   └── index.ts
├── utils/             # Utilidades y helpers
│   └── index.ts
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada
├── index.css          # Estilos globales
└── vite-env.d.ts      # Types de Vite
```

## 🎨 Configuración de Tailwind CSS

### Colores Personalizados

```css
/* Casino Gold - Primary */
primary-500: #f59e0b

/* Deep Blue - Secondary */
secondary-500: #1e40af

/* Casino Green - Success */
success-500: #10b981

/* Alert Red - Danger */
danger-500: #ef4444

/* Casino Orange - Warning */
warning-500: #f97316

/* Dark Backgrounds */
dark-bg: #0f172a
dark-bg-secondary: #1e293b
dark-bg-tertiary: #334155
```

### Componentes CSS Personalizados

```css
.btn-primary {
  /* Botón primario */
}
.btn-secondary {
  /* Botón secundario */
}
.card {
  /* Tarjeta */
}
.input {
  /* Input de formulario */
}
.label {
  /* Label de formulario */
}
```

## 🔐 Autenticación y Seguridad

### Sistema de Autenticación

- **JWT + HttpOnly Cookies**: Doble capa de seguridad
- **Separación de Contextos**: Tokens de backoffice vs players
- **Auto-refresh**: Manejo automático de tokens expirados
- **Role-based Access**: SUPER_ADMIN, OPERATOR_ADMIN, CASHIER

### Configuración de Headers

```javascript
// Headers requeridos para brand resolution
headers: {
  'Host': 'admin.mycasino.local',
  'Content-Type': 'application/json'
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px (sidebar como drawer)
- **Tablet**: 640px - 1024px (sidebar colapsado por defecto)
- **Desktop**: > 1024px (sidebar expandido)

### Componentes Adaptativos

- Sidebar se convierte en drawer overlay en móvil
- Tablas se convierten en cards en móvil
- Navigation bottom en móvil

## ⚡ Performance y Optimización

### Code Splitting

```javascript
// Lazy loading de páginas
const PlayersPage = lazy(() => import('@/pages/PlayersPage'));
```

### React Query Cache

```javascript
// Configuración de cache inteligente
queryClient: {
  staleTime: 5 * 60 * 1000, // 5 minutos
  refetchOnWindowFocus: false,
}
```

### Bundle Optimization

- Tree shaking automático
- Minificación en producción
- Source maps para debugging

## 🧪 Testing (Pendiente)

### Setup de Testing

```bash
# Instalar dependencias de testing
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Configurar Vitest
# vitest.config.ts
```

### Tipos de Tests

- **Unit Tests**: Utilidades y helpers
- **Component Tests**: Componentes UI
- **Integration Tests**: Flujos de autenticación
- **E2E Tests**: Casos de uso completos

## 🚀 Deployment

### Build de Producción

```bash
npm run build
```

### Variables de Entorno - Producción

```bash
VITE_API_BASE_URL=https://api.casino.com/api/v1
VITE_ADMIN_DOMAIN=admin.casino.com
```

### Configuración de Servidor

```nginx
# nginx.conf
server {
  listen 80;
  server_name admin.casino.com;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://backend:5000;
  }
}
```

## 🐛 Troubleshooting

### Errores Comunes

#### 1. PostCSS Configuration Error

```bash
# Error: module is not defined in ES module scope
# Solución: Usar export default en postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 2. CORS Errors

```javascript
// Verificar configuración del backend
corsOrigins: ['http://localhost:3000'];
```

#### 3. 401 Unauthorized

```javascript
// Verificar cookies y headers
withCredentials: true,
headers: { 'Host': 'admin.mycasino.local' }
```

### Debug Tools

- **React DevTools**: Para componentes y state
- **TanStack Query DevTools**: Para cache de queries
- **Console Ninja**: Para debugging en Vite

## 📋 Checklist de Desarrollo

### Antes de Commit

- [ ] `npm run lint` sin errores
- [ ] `npm run type-check` sin errores
- [ ] `npm run build` exitoso
- [ ] Funcionalidad probada en dev
- [ ] Responsive design verificado

### Antes de Deploy

- [ ] Variables de entorno configuradas
- [ ] Build de producción generado
- [ ] Assets optimizados
- [ ] Performance audit
- [ ] Security headers configurados

## 🤝 Contribución

### Guidelines

1. **TypeScript Strict**: Sin any implícitos
2. **ESLint**: Sin warnings
3. **Prettier**: Código formateado
4. **Conventional Commits**: Mensajes semánticos
5. **Component Props**: Documentadas con JSDoc

### Workflow

1. Fork y clone
2. Crear feature branch
3. Implementar y probar
4. Lint y build
5. Pull request

---

**🎰 Casino Backoffice - Sistema de administración profesional para plataformas de casino 🎲**
