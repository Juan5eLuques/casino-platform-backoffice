# Corrección y Mejoras - Página de Auditoría

## Fecha: 15 de octubre de 2025

## Problema Inicial

La página de auditoría estaba completamente en blanco debido a un error en el renderizado. El error era:

```
Cannot read properties of undefined (reading 'username')
```

### Causa Raíz

La estructura del tipo `AuditLog` no coincidía con la respuesta real del API. El tipo definía una estructura anidada con un objeto `user`, pero la respuesta del backend enviaba las propiedades directamente en el nivel superior.

## Cambios Realizados

### 1. Actualización del Tipo `AuditLog` (`src/types/index.ts`)

**Antes:**

```typescript
export interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  meta?: Record<string, any>;
  createdAt: string;
  user: {
    id: string;
    username: string;
    role: BackofficeRole;
  };
}
```

**Después:**

```typescript
export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  userRole: string;
  operatorName: string | null;
  action: string;
  targetType: string;
  targetId: string;
  meta?: Record<string, any>;
  createdAt: string;
}
```

### 2. Nuevo Tipo para Respuesta Paginada de Auditoría (`src/types/index.ts`)

Se agregó un nuevo tipo específico para la respuesta del endpoint de auditoría:

```typescript
export interface AuditPaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
```

### 3. Actualización del API Client (`src/api/audit.ts`)

Se cambió el tipo de retorno de `getBackofficeLogs`:

```typescript
getBackofficeLogs: async (params?: BackofficeAuditParams) => {
   const response = await apiClient.get<AuditPaginatedResponse<AuditLog>>(
      '/admin/audit/backoffice',
      { params }
   );
   return response.data;
},
```

### 4. Mejoras en la Página de Auditoría (`src/pages/AuditPage.tsx`)

#### 4.1 Filtros de Fecha

- **Filtro "Desde"**: Input de fecha con valor por defecto al inicio del mes actual
- **Filtro "Hasta"**: Input de fecha con valor por defecto al final del mes actual
- **Botón "Limpiar Filtros"**: Resetea todos los filtros a sus valores por defecto

```typescript
const [fromDate, setFromDate] = useState<string>(
  format(startOfMonth(new Date()), 'yyyy-MM-dd')
);
const [toDate, setToDate] = useState<string>(
  format(endOfMonth(new Date()), 'yyyy-MM-dd')
);
```

#### 4.2 Navegación por Usuario

- La columna "Usuario" ahora es clickeable
- Al hacer clic en un usuario, navega a `/audit/:userId`
- Muestra únicamente los registros de auditoría de ese usuario específico

```typescript
{
   key: 'username',
   header: 'Usuario',
   render: (log) => (
      <div>
         <button
            onClick={() => navigate(`/audit/${log.userId}`)}
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
         >
            {log.username}
         </button>
         <div className="text-xs text-gray-500 dark:text-gray-400">{log.userRole}</div>
      </div>
   ),
}
```

#### 4.3 Header Mejorado

- Muestra información diferente cuando se está filtrando por usuario específico
- Botón para volver a la vista completa cuando se está filtrando por usuario
- Diseño responsive mejorado

#### 4.4 Filtros en Query

Se actualizó el query para incluir los nuevos parámetros:

```typescript
queryFn: () =>
   auditApi.getBackofficeLogs({
      userId: userIdParam,
      action: actionFilter || undefined,
      startDate: fromDate ? `${fromDate}T00:00:00Z` : undefined,
      endDate: toDate ? `${toDate}T23:59:59Z` : undefined,
      page,
      pageSize: 50,
   }),
```

#### 4.5 Paginación Corregida

Se actualizó para usar la estructura correcta de la respuesta del API:

```typescript
pagination={
   backofficeData
      ? {
         page: backofficeData.page,
         pageSize: backofficeData.pageSize,
         totalCount: backofficeData.totalCount,
         totalPages: backofficeData.totalPages,
         onPageChange: setPage,
      }
      : undefined
}
```

### 5. Nueva Ruta (`src/App.tsx`)

Se agregó una nueva ruta para soportar el filtrado por usuario:

```typescript
<Route path="audit" element={<AuditPage />} />
<Route path="audit/:userId" element={<AuditPage />} />
```

## Funcionalidades Implementadas

### ✅ Corrección del Error de Renderizado

- La página ahora renderiza correctamente los registros de auditoría
- Se solucionó el problema del objeto `user` indefinido

### ✅ Filtros de Fecha

- Filtro "Desde" con fecha del inicio del mes actual por defecto
- Filtro "Hasta" con fecha del fin del mes actual por defecto
- Botón para limpiar y resetear filtros

### ✅ Navegación por Usuario

- Clic en cualquier username para ver solo sus registros
- Ruta dedicada `/audit/:userId`
- Botón para volver a la vista completa

### ✅ UI/UX Mejorada

- Diseño responsive con grid layout para filtros
- Soporte completo para dark mode
- Estilos consistentes con el resto de la aplicación
- Indicadores visuales claros para el estado de filtrado

## Query Params Disponibles

El endpoint soporta los siguientes parámetros (según documentación):

- `userId`: UUID - Filtrar por usuario específico
- `action`: string - Filtrar por tipo de acción
- `targetType`: string - Filtrar por tipo de objetivo
- `targetId`: UUID - Filtrar por ID de objetivo
- `fromDate`: DateTime - Fecha de inicio
- `toDate`: DateTime - Fecha de fin
- `page`: number - Número de página (default: 1)
- `pageSize`: number - Tamaño de página (default: 50)

## Formato de Respuesta del API

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "username": "string",
      "userRole": "SUPER_ADMIN|BRAND_ADMIN|CASHIER",
      "operatorName": "string|null",
      "action": "CREATE_USER|DELETE_USER|CREATE_PLAYER|...",
      "targetType": "BackofficeUser|Player",
      "targetId": "uuid",
      "meta": {
        /* metadata del evento */
      },
      "createdAt": "2025-10-14T01:54:13.616936Z"
    }
  ],
  "page": 1,
  "pageSize": 50,
  "totalCount": 40,
  "totalPages": 1
}
```

## Testing

Para probar las nuevas funcionalidades:

1. **Vista General**: Navegar a `/audit` para ver todos los registros
2. **Filtro de Fecha**: Cambiar las fechas para filtrar por rango
3. **Filtro de Acción**: Escribir un tipo de acción (ej: "CREATE_USER")
4. **Click en Usuario**: Hacer clic en cualquier username para filtrar por ese usuario
5. **Volver**: Usar el botón "Volver a todos los registros" para limpiar el filtro de usuario
6. **Limpiar Filtros**: Usar el botón para resetear todos los filtros

## Mejoras Futuras Sugeridas

1. **Exportación CSV**: Implementar la funcionalidad de exportación (actualmente muestra alert)
2. **Filtros Adicionales**: Agregar filtros para `targetType` y `targetId`
3. **Modal de Detalles**: Mostrar el objeto `meta` completo en un modal al hacer clic
4. **Búsqueda Global**: Agregar búsqueda de texto libre en todos los campos
5. **Presets de Fecha**: Botones rápidos para "Hoy", "Esta semana", "Este mes"
6. **Visualización de Meta**: Formatear mejor el JSON del campo `meta` en la tabla

## Archivos Modificados

1. `src/types/index.ts` - Tipos actualizados y nuevos
2. `src/api/audit.ts` - Tipo de respuesta corregido
3. `src/pages/AuditPage.tsx` - Componente completamente refactorizado
4. `src/App.tsx` - Nueva ruta agregada
