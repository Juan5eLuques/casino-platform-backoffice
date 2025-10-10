# Casino Backoffice

Sistema de administración completo para plataforma de casino multi-brand desarrollado con React + TypeScript.

## � Configuración del Dominio Local

Para que la aplicación funcione correctamente en `http://admin.bet30.local:7182`, necesitas configurar el archivo hosts de Windows.

### Pasos de Configuración:

1. **Ejecutar PowerShell como Administrador**
   - Presiona `Win + X` y selecciona "Windows PowerShell (Admin)" o "Terminal (Admin)"

2. **Agregar el dominio al archivo hosts**

   ```powershell
   # Ejecutar en PowerShell como administrador
   Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "127.0.0.1 admin.bet30.local"
   ```

3. **Verificar que se agregó correctamente**

   ```powershell
   Get-Content "C:\Windows\System32\drivers\etc\hosts" | Select-String "bet30"
   ```

4. **Limpiar caché DNS (opcional)**
   ```powershell
   ipconfig /flushdns
   ```

### Ejecutar la Aplicación:

```bash
npm run dev
```

La aplicación estará disponible en: `http://admin.bet30.local:7182`

## �🎯 Características Principales

### ✨ Funcionalidades Core

- **Autenticación JWT + Cookies HttpOnly** con separación de contextos
- **Gestión Multi-Brand** con resolución automática por dominio
- **Sistema de Roles**: SUPER_ADMIN, OPERATOR_ADMIN, CASHIER
- **Dashboard Analytics** con métricas en tiempo real
- **Gestión Completa de Jugadores** con billeteras y transacciones
- **Asignaciones Cajero-Jugador** con drag & drop
- **Gestión de Juegos** por brand con configuración avanzada
- **Dark/Light Mode** con persistencia
- **Responsive Design** para desktop, tablet y móvil

### 🛠 Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand + TanStack Query
- **Routing**: React Router v6
- **UI Components**: Tailwind CSS + Headless UI
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios con interceptors
- **Icons**: Lucide React + Heroicons
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 🚀 Instalación y Setup

### Prerequisitos

- Node.js 18+
- npm o yarn
- Backend API corriendo en `http://localhost:5000`

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd casino-backoffice

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_ADMIN_DOMAIN=admin.mycasino.local
```

## 📱 Páginas y Funcionalidades

### 🔐 Autenticación

- **Login Page**: Formulario de login con validación
- **Protected Routes**: Redirección automática basada en autenticación
- **Session Management**: Auto-refresh y logout en 401

### 📊 Dashboard

- **Métricas Clave**: Players activos, balance total, transacciones
- **Gráficos**: Actividad de jugadores, revenue, transacciones
- **Actividad Reciente**: Últimos registros y transacciones

### 👥 Gestión de Jugadores

- **Lista con Filtros**: Por status, brand, cajero, balance
- **Crear/Editar**: Formulario completo con validación
- **Detalle del Jugador**: Info completa + billetera + transacciones
- **Ajuste de Saldo**: Modal con confirmación y razones predefinidas
- **Cambio de Status**: Suspender/banear con motivos
- **Gestión de Passwords**: Reset de contraseñas

### 🏢 Gestión de Usuarios Backoffice

- **Lista Filtrable**: Por rol, operador, status
- **Crear/Editar**: Control de permisos por rol
- **Asignación de Roles**: SUPER_ADMIN, OPERATOR_ADMIN, CASHIER
- **Gestión de Accesos**: Control por operador

### 🎰 Gestión de Brands

- **Lista de Brands**: Con métricas y status
- **Configuración Completa**: Tema, dominio, configuraciones
- **Gestión de Juegos**: Habilitar/deshabilitar por brand
- **Configuración de Proveedores**: HMAC, webhooks

### 🎮 Gestión de Juegos

- **Catálogo Global**: Todos los juegos disponibles
- **Configuración por Brand**: Orden, tags, habilitación
- **Filtros Avanzados**: Por proveedor, categoría, status

### 🔗 Asignaciones Cajero-Jugador

- **Vista Dual**: Cajeros + jugadores asignados
- **Drag & Drop**: Asignación visual intuitiva
- **Gestión en Batch**: Asignación múltiple

## 🎨 Diseño y UX

### 🌗 Temas

- **Dark Mode**: Tema oscuro elegante con colores casino
- **Light Mode**: Tema claro y profesional
- **Toggle**: Cambio instantáneo con persistencia

### 🎭 Colores Casino

- **Primary Gold**: `#f59e0b` - Acciones principales
- **Deep Blue**: `#1e40af` - Secundario y navegación
- **Casino Green**: `#10b981` - Estados positivos
- **Alert Red**: `#ef4444` - Errores y alertas
- **Warning Orange**: `#f97316` - Advertencias

### 📱 Responsive Design

- **Mobile**: < 640px (sidebar como drawer)
- **Tablet**: 640px - 1024px (sidebar colapsado)
- **Desktop**: > 1024px (sidebar expandido)

## 🧩 Arquitectura de Componentes

### 📁 Estructura de Carpetas

```
src/
├── api/               # Clientes HTTP para cada módulo
├── components/        # Componentes reutilizables
│   ├── ui/           # Componentes UI básicos
│   └── layout/       # Componentes de layout
├── hooks/            # Custom hooks con React Query
├── pages/            # Páginas principales
├── store/            # Stores de Zustand
├── types/            # Definiciones TypeScript
└── utils/            # Utilidades y helpers
```

### 🔧 Componentes UI

- **Button**: Variantes, tamaños, loading states
- **Input**: Labels, errores, helpers
- **Card**: Header, content, footer
- **Table**: Sorting, filtros, paginación
- **Modal**: Overlays y confirmaciones
- **Badge**: Status y roles con colores

### 🗄 Gestión de Estado

- **Zustand**: Estado global (auth, UI)
- **TanStack Query**: Cache de servidor, sincronización
- **Local Storage**: Persistencia de preferencias

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Build
npm run build           # Build de producción
npm run preview         # Preview del build

# Linting
npm run lint            # ESLint
npm run lint:fix        # Fix automático

# Type Checking
npm run type-check      # Verificación de tipos
```

## 🌍 Internacionalización

### 🇪🇸 Idioma

- **Locale Principal**: Español (es-ES)
- **Formatos**: Moneda (EUR), fechas, números
- **Textos**: Todas las interfaces en español

### 💱 Formatos

- **Moneda**: €1.234,56 (centavos → euros)
- **Fechas**: DD/MM/YYYY HH:mm
- **Números**: 1.234.567

## 🔒 Seguridad

### 🛡 Autenticación

- **JWT + HttpOnly Cookies**: Doble capa de seguridad
- **Path-based Cookies**: `/admin` para backoffice
- **Auto-logout**: En caso de token expirado
- **CSRF Protection**: Cookies con SameSite

### 🔐 Autorización

- **Role-based Access**: Permisos por rol
- **Resource Scoping**: Datos filtrados por operador
- **Route Protection**: Guards en todas las rutas

## 📈 Performance

### ⚡ Optimizaciones

- **Code Splitting**: Lazy loading por rutas
- **React Query**: Cache inteligente, deduplicación
- **Bundle Optimization**: Tree shaking, minificación
- **Image Optimization**: WebP, lazy loading

### 📊 Métricas Target

- **First Load**: < 3 segundos
- **Navigation**: < 1 segundo
- **Bundle Size**: < 500KB gzipped

## 🧪 Testing

### 🔬 Estrategia

- **Unit Tests**: Utilidades y helpers
- **Component Tests**: Componentes críticos
- **Integration Tests**: Flujos principales
- **E2E Tests**: Casos de uso completos

### 🛠 Herramientas

- **Vitest**: Test runner
- **Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing

## 📦 Deployment

### 🚀 Build de Producción

```bash
npm run build
```

### 🌐 Variables de Entorno Producción

```bash
VITE_API_BASE_URL=https://api.casino.com/api/v1
VITE_ADMIN_DOMAIN=admin.casino.com
```

### 📋 Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Build exitoso sin warnings
- [ ] Tests pasando
- [ ] Bundle size optimizado
- [ ] Security headers configurados

## 🤝 Contribución

### 📋 Guidelines

1. **TypeScript Strict**: Todos los archivos deben pasar type checking
2. **ESLint**: Sin errores de linting
3. **Prettier**: Código formateado consistentemente
4. **Conventional Commits**: Mensajes de commit semánticos
5. **Component Documentation**: Props documentadas con JSDoc

### 🔄 Workflow

1. Fork del repositorio
2. Crear feature branch
3. Implementar funcionalidad
4. Tests y linting
5. Pull request con descripción detallada

## 📞 Soporte

### 🐛 Reportar Issues

- **GitHub Issues**: Para bugs y feature requests
- **Descripción detallada**: Steps to reproduce, expected behavior
- **Screenshots**: Para issues de UI

### 💡 Mejoras

- **Optimizaciones de performance**
- **Nuevas funcionalidades**
- **Mejoras de UX/UI**
- **Actualizaciones de dependencias**

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**🎲 ¡Desarrollado con pasión para la industria del casino! 🎰**
