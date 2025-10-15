# Balance Display - Documentación

## Descripción

Sistema de visualización del balance del usuario logueado en el backoffice. Implementado directamente en el Header para máxima visibilidad y accesibilidad. Diseñado para ser completamente responsive y funcionar perfectamente en dispositivos móviles.

## Ubicación

**Header**: `src/components/layout/Header.tsx` (Implementación principal)

## Características

### ✅ Funcionalidades Principales

1. **Visualización del Balance**: Muestra el saldo actual del usuario en formato de moneda USD
2. **Auto-actualización**: Se actualiza automáticamente cada 30 segundos
3. **Actualización Manual**: Botón para refrescar el balance manualmente
4. **Estados de Carga**: Loading states con skeleton mientras carga
5. **Manejo de Errores**: Muestra mensaje de error si no se puede obtener el balance

### 📱 Responsive Design

- **Mobile First**: Diseñado prioritariamente para móviles
- **Breakpoints**:
  - Mobile: `text-xs`, `p-4`, iconos pequeños
  - Tablet: `sm:text-sm`, `sm:p-6`
  - Desktop: `md:text-5xl` para el monto del balance

### 🌓 Dark Mode

- Soporte completo para modo oscuro
- Gradientes adaptativos: `dark:from-primary-600 dark:to-primary-800`
- Texto y fondos con opacidad: `dark:bg-white/10`, `dark:text-white/70`
- Bordes suaves: `dark:border-primary-700`

## API Endpoint

```typescript
GET /api/v1/admin/wallet/balance?userId={userId}&userType=BACKOFFICE
```

### Response

```json
{
  "userId": "22222222-2222-2222-2222-222222222222",
  "userType": "BACKOFFICE",
  "username": "superadmin",
  "balance": 9999478299.9
}
```

**IMPORTANTE**: El campo es `balance`, NO `walletBalance`

## Integración con Store

```typescript
const { user } = useAuthStore();
const {
  data: balanceData,
  isLoading,
  isError,
  refetch,
} = useUserBalance(user?.id || '', 'BACKOFFICE');
```

## Estructura Visual

```
┌────────────────────────────────────────┐
│ 💼 Balance Actual          🔄          │
│    username                            │
├────────────────────────────────────────┤
│                                        │
│    $1,500.00                          │
│    Saldo disponible para operaciones  │
│                                        │
├────────────────────────────────────────┤
│  Usuario        │  Rol                │
│  admin1         │  CASHIER            │
├────────────────────────────────────────┤
│           🟢 Actualizado              │
└────────────────────────────────────────┘
```

## Componentes del UI

### 1. Header

- **Icono de Wallet**: `WalletIcon` con fondo glassmorphism
- **Texto**: "Balance Actual" + username
- **Botón Refresh**: Con animación de spin durante loading

### 2. Balance Amount

- **Monto Principal**: Texto grande y bold con formato de moneda
- **Descripción**: "Saldo disponible para operaciones"
- **Estados**:
  - Loading: Skeleton animation
  - Error: Mensaje de error
  - Success: Monto formateado

### 3. User Info Grid

- **2 Columnas** con información del usuario:
  - Username
  - Rol (formateado sin guiones bajos)

### 4. Update Indicator

- **Dot verde pulsante**: Indica actualización reciente
- **Texto**: "Actualizado"

## Características de Diseño

### Colores y Gradientes

```css
/* Gradiente principal */
from-primary-500 to-primary-700
dark:from-primary-600 dark:to-primary-800

/* Fondos con glassmorphism */
bg-white/20 backdrop-blur-sm
dark:bg-white/10
```

### Animaciones

- **Spin**: En el botón de refresh durante loading
- **Pulse**: En el dot del indicador de actualización
- **Hover**: Efectos en el botón de refresh
- **Skeleton**: Durante carga inicial

### Espaciado Responsive

```typescript
p-4 sm:p-6           // Padding
text-xs sm:text-sm   // Textos pequeños
text-3xl sm:text-4xl md:text-5xl  // Balance amount
```

## Implementación en Header

El balance se muestra en el Header junto a los demás controles (dark mode, notificaciones, perfil):

```tsx
{
  /* Balance Display */
}
{
  user && (
    <div
      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg
      bg-gradient-to-r from-primary-500 to-primary-600"
    >
      <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      <span className="text-sm sm:text-base font-bold text-white">
        {formatCurrency(balanceData?.balance || 0)}
      </span>
      <button onClick={() => refetchBalance()}>
        <ArrowPathIcon className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
}
```

**Ventajas de esta ubicación**:

- ✅ Siempre visible, sin importar el estado del sidebar
- ✅ Perfecto para móviles donde el espacio es limitado
- ✅ Junto a otros controles importantes (perfil, notificaciones)
- ✅ Acceso rápido para actualizar el balance

## Estados del Componente

### Loading State

```tsx
<div className="animate-pulse">
  <div className="h-8 sm:h-10 bg-white/20 rounded w-3/4" />
  <div className="h-3 sm:h-4 bg-white/20 rounded w-1/2" />
</div>
```

### Error State

```tsx
<div className="text-center">
  <p>Error al cargar</p>
  <p>No se pudo obtener el balance</p>
</div>
```

### Success State

```tsx
<span className="text-3xl sm:text-4xl md:text-5xl font-bold">
  {formatCurrency(balanceData?.walletBalance || 0)}
</span>
```

## Formato de Moneda

```typescript
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
```

**Ejemplo**: `1500.00` → `$1,500.00`

## Auto-actualización

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 30000); // 30 segundos

  return () => clearInterval(interval);
}, [refetch]);
```

## Consideraciones de Performance

1. **Refetch inteligente**: Solo se actualiza cada 30 segundos, no en cada render
2. **Conditional rendering**: No renderiza si no hay usuario logueado
3. **Query caching**: React Query cachea la data automáticamente
4. **Cleanup**: Se limpia el interval al desmontar el componente

## Testing Manual

### Checklist Mobile

- [ ] Balance visible correctamente en iPhone SE (375px)
- [ ] Textos legibles sin zoom
- [ ] Botones tienen área de touch adecuada (min 44x44px)
- [ ] No hay overflow horizontal
- [ ] Grid de información se ve bien en 2 columnas

### Checklist Dark Mode

- [ ] Gradientes se ven correctamente
- [ ] Texto tiene buen contraste
- [ ] Bordes visibles pero sutiles
- [ ] Fondos glassmorphism funcionan bien

### Checklist Funcional

- [ ] Balance se carga correctamente
- [ ] Botón refresh actualiza el balance
- [ ] Auto-refresh funciona cada 30 segundos
- [ ] Estados de loading se muestran
- [ ] Errores se manejan correctamente
- [ ] Username y rol se muestran correctamente

## Mejoras Futuras (Opcionales)

1. **Historial de Balance**: Gráfico pequeño de tendencia
2. **Notificaciones**: Alerta si el balance es bajo
3. **Comparación**: Comparar con balance de ayer/semana
4. **Animaciones**: Transición animada cuando cambia el monto
5. **Tooltip**: Más información al hacer hover

## Archivos Relacionados

- `src/components/Balance.tsx` - Componente principal
- `src/hooks/useTransactions.ts` - Hook `useUserBalance`
- `src/api/transactions.ts` - API client `getUserBalance`
- `src/types/index.ts` - Interface `UserBalanceResponse`
- `src/components/layout/Sidebar.tsx` - Integración en sidebar
