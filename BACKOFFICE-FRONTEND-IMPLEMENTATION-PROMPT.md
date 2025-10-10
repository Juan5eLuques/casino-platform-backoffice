# 🎯 Casino Platform - Backoffice Frontend Implementation Guide

## 📋 Contexto del Proyecto

Estás trabajando en el **frontend del Backoffice** de una plataforma de casino B2B multi-tenant. El proyecto ya tiene:
- ✅ **Login funcional** con autenticación JWT + cookies HttpOnly
- ✅ **API Backend completa** con todos los endpoints listos
- ✅ **React + Vite** como stack tecnológico
- ✅ **Sistema de roles**: SUPER_ADMIN, OPERATOR_ADMIN, CASHIER

### 🏗️ Arquitectura Multi-Tenant

```
SUPER_ADMIN (sin operador)
    ├── Gestiona OPERADORES
    ├── Gestiona BRANDS de cualquier operador
    ├── Gestiona todos los USUARIOS
    └── Ve todos los JUGADORES y AUDITORÍAS

OPERATOR_ADMIN (scoped a su operador)
    ├── Gestiona BRANDS de su operador
    ├── Gestiona USUARIOS de su operador
    └── Gestiona JUGADORES de sus brands

CASHIER (scoped a su operador + jugadores asignados)
    ├── Ve solo JUGADORES asignados
    ├── Ajusta WALLETS de jugadores asignados
    └── Solo lectura de sus brands
```

---

## 🔐 Sistema de Autenticación (Ya Implementado)

### **Estado Actual del Login**

El login ya está funcionando y retorna:

```typescript
// Response de POST /api/v1/admin/auth/login
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "superadmin",
    "role": "SUPER_ADMIN",
    "operator": { "id": "uuid", "name": "Casino Corp" } | null
  },
  "expiresAt": "2024-12-20T16:00:00Z"
}

// + Cookie HttpOnly: bk.token=<JWT> (automática)
```

### **Autenticación en Requests**

Todos los requests a `/api/v1/admin/*` ya incluyen automáticamente:
- Cookie `bk.token` (enviada automáticamente por el browser)
- O Header `Authorization: Bearer <token>` (si lo extraes manualmente)

**No necesitas manejar el token manualmente**, las cookies HttpOnly lo hacen automáticamente.

### **Endpoint de Perfil**

```typescript
GET /api/v1/admin/auth/me
// Response:
{
  "id": "uuid",
  "username": "superadmin",
  "role": "SUPER_ADMIN",
  "operator": { "id": "uuid", "name": "Casino Corp" } | null,
  "lastLoginAt": "2024-12-20T12:00:00Z"
}
```

---

## 🎨 Stack Tecnológico Recomendado

### **Core**
- ✅ React 18+
- ✅ Vite
- ✅ TypeScript

### **UI/Styling (Elige uno)**
- **Opción A**: TailwindCSS + Headless UI
- **Opción B**: Material-UI (MUI)
- **Opción C**: Ant Design
- **Opción D**: Shadcn/ui + TailwindCSS (recomendado)

### **Estado y Datos**
- **React Query (TanStack Query)** - Para API calls y caché
- **Zustand** o **Context API** - Para estado global del usuario

### **Routing**
- **React Router v6**

### **Formularios y Validación**
- **React Hook Form** + **Zod** (recomendado)

### **Tablas**
- **TanStack Table (React Table v8)** - Para tablas complejas con paginación

---

## 📁 Estructura de Carpetas Propuesta

```
src/
├── api/                    # API client y tipos
│   ├── client.ts          # Axios/fetch configurado
│   ├── types.ts           # Tipos TypeScript de la API
│   └── endpoints/
│       ├── auth.ts
│       ├── operators.ts
│       ├── brands.ts
│       ├── users.ts
│       ├── players.ts
│       └── audit.ts
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Input, etc)
│   ├── layout/           # Layout components (Sidebar, Header)
│   ├── tables/           # Componentes de tablas
│   └── forms/            # Componentes de formularios
├── features/             # Features por dominio
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── operators/
│   ├── brands/
│   ├── users/
│   ├── players/
│   └── audit/
├── hooks/                # Custom hooks globales
│   ├── useAuth.ts
│   └── usePermissions.ts
├── layouts/              # Layout wrappers
│   ├── DashboardLayout.tsx
│   └── AuthLayout.tsx
├── lib/                  # Utilidades y configuración
│   ├── permissions.ts
│   └── constants.ts
├── routes/               # Configuración de rutas
│   └── index.tsx
└── store/                # Estado global (Zustand)
    └── authStore.ts
```

---

## 🔑 API Endpoints Disponibles

### **1. Autenticación**

```typescript
// Ya implementado
POST   /api/v1/admin/auth/login     // Login
POST   /api/v1/admin/auth/logout    // Logout
GET    /api/v1/admin/auth/me        // Perfil actual
```

### **2. Operadores** (Solo SUPER_ADMIN)

```typescript
POST   /api/v1/admin/operators                    // Crear operador
GET    /api/v1/admin/operators                    // Listar operadores
GET    /api/v1/admin/operators/{id}               // Ver operador
PATCH  /api/v1/admin/operators/{id}               // Actualizar operador
DELETE /api/v1/admin/operators/{id}               // Eliminar operador

// Query params para GET /operators
{
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  page?: number;
  pageSize?: number;
}

// Request body para POST/PATCH
{
  name: string;
  taxId?: string;
  status?: "ACTIVE" | "INACTIVE";
}
```

### **3. Brands** (SUPER_ADMIN y OPERATOR_ADMIN)

```typescript
POST   /api/v1/admin/brands                       // Crear brand
GET    /api/v1/admin/brands                       // Listar brands
GET    /api/v1/admin/brands/{id}                  // Ver brand
PATCH  /api/v1/admin/brands/{id}                  // Actualizar brand
DELETE /api/v1/admin/brands/{id}                  // Eliminar brand
POST   /api/v1/admin/brands/{id}/status           // Cambiar status

// Settings
GET    /api/v1/admin/brands/{id}/settings         // Ver settings
PUT    /api/v1/admin/brands/{id}/settings         // Reemplazar settings
PATCH  /api/v1/admin/brands/{id}/settings         // Actualizar settings parcial

// Provider Config
GET    /api/v1/admin/brands/{id}/providers        // Listar providers
PUT    /api/v1/admin/brands/{id}/providers/{code} // Config provider
POST   /api/v1/admin/brands/{id}/providers/{code}/rotate-secret

// Catalog
GET    /api/v1/admin/brands/{id}/catalog          // Ver catálogo de juegos

// Query params para GET /brands
{
  operatorId?: string;
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  page?: number;
  pageSize?: number;
}

// Request body para POST/PATCH brand
{
  code: string;
  name: string;
  domain: string;
  operatorId: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}
```

### **4. Usuarios Backoffice** (Según rol)

```typescript
POST   /api/v1/admin/users                        // Crear usuario
GET    /api/v1/admin/users                        // Listar usuarios
GET    /api/v1/admin/users/{id}                   // Ver usuario
PATCH  /api/v1/admin/users/{id}                   // Actualizar usuario
DELETE /api/v1/admin/users/{id}                   // Eliminar usuario
PATCH  /api/v1/admin/users/{id}/status            // Cambiar status

// Query params para GET /users
{
  operatorId?: string;
  role?: "SUPER_ADMIN" | "OPERATOR_ADMIN" | "CASHIER";
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  search?: string;
  page?: number;
  pageSize?: number;
}

// Request body para POST user
{
  username: string;
  password: string;
  role: "SUPER_ADMIN" | "OPERATOR_ADMIN" | "CASHIER";
  operatorId?: string;  // Requerido si role != SUPER_ADMIN
}

// Request body para PATCH user
{
  password?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}
```

### **5. Jugadores** (Según rol y brand)

```typescript
POST   /api/v1/admin/players                      // Crear jugador
GET    /api/v1/admin/players                      // Listar jugadores
GET    /api/v1/admin/players/{id}                 // Ver jugador
PATCH  /api/v1/admin/players/{id}                 // Actualizar jugador
PATCH  /api/v1/admin/players/{id}/status          // Cambiar status

// Wallet adjustment
POST   /api/v1/admin/players/{id}/wallet/adjust   // Ajustar saldo

// Query params para GET /players
{
  brandId?: string;
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  page?: number;
  pageSize?: number;
}

// Request body para POST player
{
  username: string;
  password?: string;
  email?: string;
  brandId: string;
  initialBalance?: number;  // En enteros (fichas * 100)
}

// Request body para ajustar wallet
{
  amount: number;           // Positivo = crédito, Negativo = débito
  reason: string;
  reference?: string;
}
```

### **6. Cashier - Gestión de Jugadores Asignados**

```typescript
POST   /api/v1/admin/cashiers/{cashierId}/assign-player/{playerId}
GET    /api/v1/admin/cashiers/{cashierId}/players
DELETE /api/v1/admin/cashiers/{cashierId}/players/{playerId}
```

### **7. Auditoría**

```typescript
GET    /api/v1/admin/audit/backoffice            // Auditoría de backoffice
GET    /api/v1/admin/audit/provider              // Auditoría de providers

// Query params para auditoría
{
  userId?: string;
  action?: string;
  sessionId?: string;
  provider?: string;
  page?: number;
  pageSize?: number;
}
```

---

## 🎭 Sistema de Permisos

### **Matriz de Permisos por Rol**

| Feature              | SUPER_ADMIN | OPERATOR_ADMIN | CASHIER |
|---------------------|-------------|----------------|---------|
| Operadores          | CRUD        | Read (propio)  | -       |
| Brands              | CRUD        | CRUD (propios) | Read    |
| Usuarios Backoffice | CRUD        | CRUD (propios) | -       |
| Jugadores           | CRUD + Wallet | CRUD + Wallet | Read + Wallet (asignados) |
| Provider Config     | Full        | Full (propios) | -       |
| Auditoría           | Full        | Scoped         | Scoped  |

### **Implementación de Permisos**

```typescript
// lib/permissions.ts
export enum Permission {
  OPERATOR_CREATE = 'operator:create',
  OPERATOR_READ = 'operator:read',
  OPERATOR_UPDATE = 'operator:update',
  OPERATOR_DELETE = 'operator:delete',
  
  BRAND_CREATE = 'brand:create',
  BRAND_READ = 'brand:read',
  BRAND_UPDATE = 'brand:update',
  BRAND_DELETE = 'brand:delete',
  
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  PLAYER_CREATE = 'player:create',
  PLAYER_READ = 'player:read',
  PLAYER_UPDATE = 'player:update',
  PLAYER_WALLET_ADJUST = 'player:wallet_adjust',
  
  AUDIT_READ = 'audit:read',
}

export const rolePermissions: Record<BackofficeRole, Permission[]> = {
  SUPER_ADMIN: Object.values(Permission), // Todos los permisos
  
  OPERATOR_ADMIN: [
    Permission.OPERATOR_READ,
    Permission.BRAND_CREATE,
    Permission.BRAND_READ,
    Permission.BRAND_UPDATE,
    Permission.BRAND_DELETE,
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.PLAYER_CREATE,
    Permission.PLAYER_READ,
    Permission.PLAYER_UPDATE,
    Permission.PLAYER_WALLET_ADJUST,
    Permission.AUDIT_READ,
  ],
  
  CASHIER: [
    Permission.BRAND_READ,
    Permission.PLAYER_READ,
    Permission.PLAYER_WALLET_ADJUST,
  ],
};

export function hasPermission(role: BackofficeRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}
```

```typescript
// hooks/usePermissions.ts
import { useAuth } from './useAuth';
import { hasPermission, Permission } from '../lib/permissions';

export function usePermissions() {
  const { user } = useAuth();
  
  return {
    can: (permission: Permission) => hasPermission(user?.role, permission),
    canAny: (permissions: Permission[]) => 
      permissions.some(p => hasPermission(user?.role, p)),
    canAll: (permissions: Permission[]) => 
      permissions.every(p => hasPermission(user?.role, p)),
  };
}

// Uso en componentes
function CreateOperatorButton() {
  const { can } = usePermissions();
  
  if (!can(Permission.OPERATOR_CREATE)) return null;
  
  return <button>Crear Operador</button>;
}
```

---

## 📦 Tipos TypeScript

```typescript
// api/types.ts

export enum BackofficeRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATOR_ADMIN = 'OPERATOR_ADMIN',
  CASHIER = 'CASHIER',
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface User {
  id: string;
  username: string;
  role: BackofficeRole;
  status: EntityStatus;
  operator?: {
    id: string;
    name: string;
  };
  lastLoginAt?: string;
}

export interface Operator {
  id: string;
  name: string;
  taxId?: string;
  status: EntityStatus;
  brandsCount: number;
  usersCount: number;
  createdAt: string;
}

export interface Brand {
  id: string;
  code: string;
  name: string;
  domain: string;
  status: EntityStatus;
  operator: {
    id: string;
    name: string;
  };
  settings?: Record<string, any>;
  createdAt: string;
}

export interface Player {
  id: string;
  username: string;
  email?: string;
  status: EntityStatus;
  brandCode: string;
  brandName: string;
  balance: number;
  createdAt: string;
  lastActivityAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  meta?: Record<string, any>;
  createdAt: string;
  user: {
    username: string;
    role: BackofficeRole;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiError {
  title: string;
  detail: string;
  status: number;
}
```

---

## 🌐 Cliente API

```typescript
// api/client.ts
import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Importante: Envía cookies automáticamente
  headers: {
    'Content-Type': 'application/json',
    'Host': 'admin.bet30test.netlify.app', // Host para BrandResolver
  },
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Redirigir al login si no autorizado
      window.location.href = '/login';
    }
    
    return Promise.reject({
      title: error.response?.data?.title || 'Error',
      detail: error.response?.data?.detail || 'An error occurred',
      status: error.response?.status || 500,
    });
  }
);
```

```typescript
// api/endpoints/auth.ts
import { apiClient } from '../client';
import { User } from '../types';

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<{ success: boolean; user: User; expiresAt: string }>(
      '/api/v1/admin/auth/login',
      { username, password }
    ),
  
  logout: () =>
    apiClient.post('/api/v1/admin/auth/logout'),
  
  getProfile: () =>
    apiClient.get<User>('/api/v1/admin/auth/me'),
};
```

---

## 🎯 Páginas a Implementar

### **1. Dashboard** (Todas las roles)
- **Ruta**: `/dashboard`
- **Contenido**:
  - Estadísticas según rol
  - Resumen de actividad reciente
  - Gráficos de métricas

### **2. Operadores** (Solo SUPER_ADMIN)
- **Ruta**: `/operators`
- **Features**:
  - Tabla con búsqueda y filtros
  - Crear operador (modal/drawer)
  - Editar operador
  - Eliminar operador
  - Ver detalles + brands asociados

### **3. Brands** (SUPER_ADMIN y OPERATOR_ADMIN)
- **Ruta**: `/brands`
- **Features**:
  - Tabla con búsqueda, filtros por operador y status
  - Crear brand (modal con validación de dominio único)
  - Editar brand (info, settings, provider configs)
  - Ver catálogo de juegos
  - Gestionar providers (habilitar/deshabilitar, rotar secret)
  - Cambiar status (ACTIVE/INACTIVE/SUSPENDED)

### **4. Usuarios Backoffice** (SUPER_ADMIN y OPERATOR_ADMIN)
- **Ruta**: `/users`
- **Features**:
  - Tabla filtrada por operador y rol
  - Crear usuario (con validación según rol del creador)
  - Editar usuario (cambiar password, status)
  - Eliminar usuario
  - Ver última actividad

### **5. Jugadores** (Según rol)
- **Ruta**: `/players`
- **Features**:
  - Tabla con filtros por brand y status
  - Crear jugador (modal con saldo inicial)
  - Ver perfil de jugador (info + historial de transacciones)
  - Ajustar wallet (modal con validación de monto)
  - Cambiar status (bloquear/desbloquear)
  - **Para CASHIER**: Solo ve jugadores asignados

### **6. Cashier - Asignación de Jugadores** (OPERATOR_ADMIN)
- **Ruta**: `/cashiers/{id}/players`
- **Features**:
  - Ver jugadores asignados a un cashier
  - Asignar nuevos jugadores
  - Desasignar jugadores

### **7. Auditoría** (Todas las roles, scoped)
- **Ruta**: `/audit`
- **Features**:
  - Tabla de logs de backoffice
  - Tabla de logs de providers (opcional)
  - Filtros por usuario, acción, fecha
  - Paginación
  - Export a CSV (opcional)

---

## 🧩 Componentes Clave a Implementar

### **1. DataTable Component** (Reutilizable)

```typescript
// components/tables/DataTable.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  fetchData: (params: QueryParams) => Promise<PaginatedResponse<T>>;
  filters?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({ columns, fetchData, filters, actions }: DataTableProps<T>) {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['table-data', pagination, search],
    queryFn: () => fetchData({ ...pagination, search }),
  });
  
  // Implementación con TanStack Table
  // ...
}
```

### **2. CreateEntityModal Component** (Genérico)

```typescript
// components/forms/CreateEntityModal.tsx
interface CreateEntityModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  fields: FormField[];
  title: string;
}

export function CreateEntityModal<T>({ 
  isOpen, 
  onClose, 
  onSubmit, 
  fields, 
  title 
}: CreateEntityModalProps<T>) {
  // Implementación con React Hook Form + Zod
  // ...
}
```

### **3. PermissionGuard Component**

```typescript
// components/PermissionGuard.tsx
interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback, children }: PermissionGuardProps) {
  const { can } = usePermissions();
  
  if (!can(permission)) {
    return fallback || null;
  }
  
  return <>{children}</>;
}

// Uso
<PermissionGuard permission={Permission.OPERATOR_CREATE}>
  <CreateOperatorButton />
</PermissionGuard>
```

---

## 🚀 Plan de Implementación por Fases

### **Fase 1: Fundación** (Ya completada)
- ✅ Setup de proyecto (React + Vite + TS)
- ✅ Sistema de autenticación (Login funcional)
- ✅ Layout básico

### **Fase 2: Core (Prioridad Alta)**
1. **API Client y Tipos**
   - Implementar `apiClient.ts`
   - Definir todos los tipos en `types.ts`
   - Crear hooks de React Query para cada endpoint

2. **Sistema de Permisos**
   - Implementar `permissions.ts`
   - Crear hook `usePermissions`
   - Crear componente `PermissionGuard`

3. **Componentes Reutilizables**
   - DataTable genérica con TanStack Table
   - Modal genérico para crear/editar
   - Form fields reutilizables

### **Fase 3: Features Admin (Prioridad Alta)**
4. **Operadores** (Solo SUPER_ADMIN)
   - Página de listado
   - Crear operador
   - Editar operador

5. **Brands** (SUPER_ADMIN y OPERATOR_ADMIN)
   - Página de listado con filtros
   - Crear brand con validación
   - Editar brand
   - Gestión de settings
   - Configuración de providers

6. **Usuarios Backoffice**
   - Página de listado filtrada
   - Crear usuario con validación de permisos
   - Editar usuario (password, status)

### **Fase 4: Gestión de Jugadores (Prioridad Media)**
7. **Jugadores**
   - Listado filtrado por brand
   - Crear jugador con saldo inicial
   - Ver perfil detallado
   - Ajustar wallet
   - Cambiar status

8. **Cashier Features**
   - Asignación de jugadores
   - Vista de jugadores asignados
   - Ajuste de wallets

### **Fase 5: Monitoring (Prioridad Baja)**
9. **Auditoría**
   - Logs de backoffice
   - Logs de providers
   - Filtros avanzados

10. **Dashboard**
    - Métricas según rol
    - Gráficos de actividad
    - Resumen de KPIs

---

## 📚 Recursos y Librerías Recomendadas

### **Instalación Inicial**

```bash
# Core
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install zustand

# UI (Elige una opción)
npm install @shadcn/ui tailwindcss    # Opción recomendada
# O
npm install @mui/material @emotion/react @emotion/styled
# O
npm install antd

# Formularios
npm install react-hook-form zod @hookform/resolvers

# Tablas
npm install @tanstack/react-table

# Utilidades
npm install date-fns
npm install clsx tailwind-merge

# Development
npm install -D @types/node
```

### **Configuración de React Query**

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

---

## 🎨 Diseño UX Recomendado

### **Layout Principal**

```
┌─────────────────────────────────────────────┐
│ [Logo] Dashboard      [User] [Logout]       │ ← Header
├──────────┬──────────────────────────────────┤
│          │                                  │
│ Sidebar  │         Content Area             │
│          │                                  │
│ - Dash   │  ┌─────────────────────────┐   │
│ - Ops    │  │ Page Title              │   │
│ - Brands │  ├─────────────────────────┤   │
│ - Users  │  │                         │   │
│ - Players│  │  [Search] [Filters]     │   │
│ - Audit  │  │                         │   │
│          │  │  ┌───────────────────┐  │   │
│          │  │  │ DataTable         │  │   │
│          │  │  └───────────────────┘  │   │
│          │  │  Pagination             │   │
│          │  └─────────────────────────┘   │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### **Colores por Status**

```typescript
const statusColors = {
  ACTIVE: 'green',
  INACTIVE: 'gray',
  SUSPENDED: 'red',
  BLOCKED: 'red',
};

const roleColors = {
  SUPER_ADMIN: 'purple',
  OPERATOR_ADMIN: 'blue',
  CASHIER: 'orange',
};
```

---

## ✅ Criterios de Aceptación

### **Funcionalidad**
- ✅ Autenticación persiste en refresh
- ✅ Permisos se validan en frontend y backend
- ✅ Todas las tablas tienen búsqueda y paginación
- ✅ Formularios validan según reglas de negocio
- ✅ Feedback visual para operaciones exitosas/fallidas
- ✅ Loading states en todas las acciones async

### **UX**
- ✅ Navegación intuitiva
- ✅ Responsive (Desktop first, mobile opcional)
- ✅ Confirmaciones para acciones destructivas
- ✅ Mensajes de error claros
- ✅ Indicadores de estado visual

### **Performance**
- ✅ Cache de queries con React Query
- ✅ Lazy loading de páginas con React.lazy
- ✅ Debounce en búsquedas
- ✅ Optimistic updates donde aplique

---

## 🐛 Testing (Opcional pero Recomendado)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
```

```typescript
// Ejemplo de test
import { render, screen } from '@testing-library/react';
import { OperatorsPage } from './OperatorsPage';

test('SUPER_ADMIN can see create button', () => {
  render(<OperatorsPage />, {
    wrapper: ({ children }) => (
      <AuthProvider user={{ role: 'SUPER_ADMIN' }}>
        {children}
      </AuthProvider>
    ),
  });
  
  expect(screen.getByText('Crear Operador')).toBeInTheDocument();
});
```

---

## 🚨 Puntos Críticos a Considerar

### **1. Seguridad**
- ✅ **Nunca confíes solo en validación frontend**: El backend ya valida permisos
- ✅ **CSRF**: Las cookies HttpOnly + SameSite=Lax protegen contra CSRF
- ✅ **XSS**: Sanitiza inputs si renderizas HTML dinámico

### **2. Scoping de Datos**
- ✅ **OPERATOR_ADMIN** solo ve datos de su operador
- ✅ **CASHIER** solo ve jugadores asignados
- ✅ Filtros de brand se aplican automáticamente por rol

### **3. Validaciones de Formularios**
- Username: único, alfanumérico, 3-20 chars
- Email: formato válido
- Password: mínimo 8 chars, incluir mayúsculas/números
- Dominio de brand: formato DNS válido
- Monto de wallet: siempre enteros (fichas * 100)

### **4. Manejo de Errores**
```typescript
// Ejemplo de manejo robusto
try {
  await createOperator(data);
  toast.success('Operador creado exitosamente');
  navigate('/operators');
} catch (error) {
  if (error.status === 409) {
    toast.error('Ya existe un operador con ese nombre');
  } else {
    toast.error(error.detail || 'Error al crear operador');
  }
}
```

---

## 📖 Documentación Adicional

### **Variables de Entorno**

```env
# .env.development
VITE_API_URL=http://localhost:5000
VITE_BRAND_HOST=admin.bet30test.netlify.app

# .env.production
VITE_API_URL=https://api.tudominio.com
VITE_BRAND_HOST=admin.tudominio.com
```

### **Scripts Útiles**

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "test": "vitest",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 🎯 Resumen del Scope

### **Endpoints ya implementados en API**: ✅ 100%
- Auth (login, logout, profile)
- Operators (CRUD completo)
- Brands (CRUD + settings + providers)
- Backoffice Users (CRUD)
- Players (CRUD + wallet adjust)
- Cashier assignments
- Audit logs

### **Frontend a implementar**:
1. ✅ **Login/Auth** - Ya funcional
2. 🔨 **Sistema de permisos** - A implementar
3. 🔨 **Componentes reutilizables** - A implementar
4. 🔨 **6-7 páginas principales** - A implementar
5. 🔨 **Formularios y validaciones** - A implementar
6. 🔨 **Tablas con paginación** - A implementar

---

## 💡 Prompt Sugerido para Claude Sonnet

```
Estoy trabajando en el frontend (React + Vite + TypeScript) del backoffice de una plataforma de casino B2B. 

El login ya está funcionando con JWT + cookies HttpOnly.

Necesito que implementes:

1. Cliente API con Axios configurado para cookies HttpOnly
2. Sistema de permisos con 3 roles: SUPER_ADMIN, OPERATOR_ADMIN, CASHIER
3. Hook usePermissions para validar permisos en componentes
4. Componente reutilizable DataTable con TanStack Table
5. Página de gestión de Operadores (CRUD completo)
6. Página de gestión de Brands (CRUD + settings)
7. Página de gestión de Usuarios Backoffice
8. Página de gestión de Jugadores con ajuste de wallet

Usa las definiciones de endpoints y tipos que te proporcioné en el contexto.

Stack: React Query, React Hook Form + Zod, TailwindCSS + Shadcn/ui, React Router v6.

Implementa primero la estructura base (API client, tipos, permisos) y luego continúa con las páginas en orden de prioridad.
```

---

**¡Éxito con la implementación! 🚀**
