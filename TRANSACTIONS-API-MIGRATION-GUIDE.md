# Actualización API de Transacciones - Guía de Migración

## 📋 Resumen de Cambios

La API de transacciones ha sido **completamente rediseñada** para simplificar su uso y alinearse con el sistema unificado del gateway.

### Cambio Principal:

❌ **Antes**: Sistema complejo de `fromUserId`/`toUserId` con tipos
✅ **Ahora**: Sistema simplificado con solo `playerId` y `transactionType`

---

## 🔄 Tipos de Transacción para Backoffice

### Operaciones Disponibles:

| Tipo           | Botón UI     | Descripción                                   | Roles Permitidos                  |
| -------------- | ------------ | --------------------------------------------- | --------------------------------- |
| **DEPOSIT**    | `[+]`        | Enviar fondos a un jugador                    | SUPER_ADMIN, BRAND_ADMIN, CASHIER |
| **WITHDRAWAL** | `[-]`        | Quitar fondos de un jugador                   | SUPER_ADMIN, BRAND_ADMIN, CASHIER |
| **TRANSFER**   | `Transferir` | Transferir fondos del wallet admin al jugador | SUPER_ADMIN, BRAND_ADMIN, CASHIER |
| **MINT**       | —            | Crear dinero de la nada                       | Solo SUPER_ADMIN                  |
| **BONUS**      | —            | Dar bonus a jugador                           | SUPER_ADMIN, BRAND_ADMIN          |
| **ADJUSTMENT** | —            | Ajuste manual                                 | SUPER_ADMIN, BRAND_ADMIN          |

---

## 📁 Archivos Actualizados

### 1. ✅ `src/types/index.ts`

- Agregado: `TransactionType` enum
- Actualizado: `TransactionResponse` con nuevos campos
- Actualizado: `CreateTransactionRequest` simplificado
- Agregado: `RollbackTransactionRequest`
- Actualizado: `TransactionFilters` con nuevos filtros

### 2. ✅ `src/api/transactions.ts`

- Actualizado: `getTransactions()` - usa nueva respuesta
- Actualizado: `createTransaction()` - usa nueva request
- Agregado: `rollbackTransaction()` - revertir transacciones
- Agregado: `depositToPlayer()` - Depósito (Botón +)
- Agregado: `withdrawFromPlayer()` - Retiro (Botón -)
- Agregado: `transferToPlayer()` - Transferencia
- Agregado: `mintToPlayer()` - Crear dinero (SUPER_ADMIN)
- Agregado: `bonusToPlayer()` - Dar bonus
- Agregado: `adjustPlayerBalance()` - Ajuste manual

### 3. ✅ `src/hooks/useTransactions.ts`

- Actualizado: `useCreateTransaction()` - usa nueva API
- Agregado: `useDepositToPlayer()` - Hook para depósito
- Agregado: `useWithdrawFromPlayer()` - Hook para retiro
- Agregado: `useTransferToPlayer()` - Hook para transferencia
- Agregado: `useMintToPlayer()` - Hook para mint
- Agregado: `useBonusToPlayer()` - Hook para bonus
- Agregado: `useAdjustPlayerBalance()` - Hook para ajuste
- Agregado: `useRollbackTransaction()` - Hook para rollback
- **Deprecated**: `useSendBalance()` - Usar `useDepositToPlayer()`
- **Deprecated**: `useRemoveBalance()` - Usar `useWithdrawFromPlayer()`

---

## 🔧 Cómo Usar los Nuevos Hooks

### Ejemplo 1: Depósito (Botón +)

```typescript
import { useDepositToPlayer } from '@/hooks';

function MyComponent() {
   const depositMutation = useDepositToPlayer();

   const handleDeposit = async () => {
      await depositMutation.mutateAsync({
         playerId: 'player-uuid',
         amount: 100.50,
         description: 'Depósito inicial'
      });
   };

   return (
      <button onClick={handleDeposit}>
         Depositar +
      </button>
   );
}
```

### Ejemplo 2: Retiro (Botón -)

```typescript
import { useWithdrawFromPlayer } from '@/hooks';

function MyComponent() {
   const withdrawMutation = useWithdrawFromPlayer();

   const handleWithdraw = async () => {
      await withdrawMutation.mutateAsync({
         playerId: 'player-uuid',
         amount: 50.00,
         description: 'Retiro de fondos'
      });
   };

   return (
      <button onClick={handleWithdraw}>
         Retirar -
      </button>
   );
}
```

### Ejemplo 3: Transferencia

```typescript
import { useTransferToPlayer } from '@/hooks';

function MyComponent() {
   const transferMutation = useTransferToPlayer();

   const handleTransfer = async () => {
      await transferMutation.mutateAsync({
         playerId: 'player-uuid',
         amount: 200.00,
         description: 'Transferencia de fondos'
      });
   };

   return (
      <button onClick={handleTransfer}>
         Transferir
      </button>
   );
}
```

---

## ⚠️ Archivos que NECESITAN Actualización Manual

### 1. ❌ `src/pages/TransactionsPage.tsx`

**Problemas identificados:**

- Usa el esquema antiguo con `fromUserId`/`toUserId`
- Hooks deprecados: `useSendBalance()`, `useRemoveBalance()`
- Formulario complejo que necesita simplificación
- Filtro `userTypeFilter` que ya no existe en la API

**Cambios necesarios:**

#### A. Actualizar Schema del Formulario

```typescript
// ❌ ANTES
const createTransactionSchema = z.object({
  fromUserId: z.string().min(1, 'Usuario origen es requerido'),
  fromUserType: z.enum(['BACKOFFICE', 'PLAYER']),
  toUserId: z.string().min(1, 'Usuario destino es requerido'),
  toUserType: z.enum(['BACKOFFICE', 'PLAYER']),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida'),
  transactionType: z.enum(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'ADJUSTMENT']),
});

// ✅ AHORA
const createTransactionSchema = z.object({
  playerId: z.string().min(1, 'Jugador es requerido'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida'),
  transactionType: z.enum([
    'DEPOSIT',
    'WITHDRAWAL',
    'TRANSFER',
    'BONUS',
    'MINT',
    'ADJUSTMENT',
  ]),
});
```

#### B. Actualizar Imports

```typescript
// ❌ ANTES
import { useSendBalance, useRemoveBalance, useBackofficeUsers } from '@/hooks';

// ✅ AHORA
import {
  useDepositToPlayer,
  useWithdrawFromPlayer,
  useTransferToPlayer,
} from '@/hooks';
```

#### C. Actualizar Mutations

```typescript
// ❌ ANTES
const sendBalanceMutation = useSendBalance();
const removeBalanceMutation = useRemoveBalance();

// ✅ AHORA
const depositMutation = useDepositToPlayer();
const withdrawMutation = useWithdrawFromPlayer();
```

#### D. Actualizar Handlers

```typescript
// ❌ ANTES
const handleQuickSend = async data => {
  await sendBalanceMutation.mutateAsync({
    fromUserId: currentUser.id,
    fromUserType: 'BACKOFFICE',
    toUserId: data.toUserId,
    toUserType: data.toUserType,
    amount: data.amount,
    description: data.description,
  });
};

// ✅ AHORA
const handleQuickDeposit = async (data: {
  playerId: string;
  amount: number;
  description: string;
}) => {
  await depositMutation.mutateAsync({
    playerId: data.playerId,
    amount: data.amount,
    description: data.description,
  });
};
```

#### E. Actualizar Formulario JSX

```tsx
{/* ❌ ANTES */}
<select {...register('fromUserType')}>
   <option value="BACKOFFICE">Backoffice</option>
   <option value="PLAYER">Jugador</option>
</select>
<select {...register('fromUserId')}>
   {/* opciones */}
</select>

{/* ✅ AHORA */}
<select {...register('playerId')}>
   <option value="">Seleccionar jugador</option>
   {players?.data.map(player => (
      <option key={player.id} value={player.id}>
         {player.username}
      </option>
   ))}
</select>
```

#### F. Remover Filtro de UserType

```typescript
// ❌ REMOVER
const [userTypeFilter, setUserTypeFilter] = useState<
  'BACKOFFICE' | 'PLAYER' | ''
>('');

// ✅ Los filtros ahora son:
const { data: transactionsData } = useTransactions({
  transactionType: transactionTypeFilter || undefined,
  fromDate: dateFromFilter || undefined,
  toDate: dateToFilter || undefined,
});
```

### 2. ❌ `src/pages/UsersPage.tsx`

**Problemas identificados:**

- Usa hooks deprecados en operaciones de balance
- Necesita actualizar a los nuevos hooks simplificados

**Cambios necesarios:**

```typescript
// ❌ ANTES
const sendBalanceMutation = useSendBalance();
await sendBalanceMutation.mutateAsync({
  fromUserId: currentUser.id,
  fromUserType: 'BACKOFFICE',
  toUserId: user.id,
  toUserType: user.userType,
  amount: amount,
  description: description,
});

// ✅ AHORA
const depositMutation = useDepositToPlayer();
await depositMutation.mutateAsync({
  playerId: user.id, // Solo si user.userType === 'PLAYER'
  amount: amount,
  description: description,
});
```

### 3. ❌ `src/pages/UserDetailPage.tsx`

**Problema identificado:**

- Usa `userId` en filtros pero debe ser `playerId`

**Cambio necesario:**

```typescript
// ❌ ANTES
const { data: transactionsData } = useTransactions({
  userId,
  page,
  pageSize,
});

// ✅ AHORA
const { data: transactionsData } = useTransactions({
  playerId: userId, // Cambiar userId a playerId
  page,
  pageSize,
});
```

### 4. ❌ `src/hooks/usePlayers.ts`

**Problemas identificados:**

- Usa métodos deprecados `sendBalance` y `removeBalance` de la API

**Cambios necesarios:**

```typescript
// ❌ ANTES
}) => transactionsApi.sendBalance(
   fromUserId,
   fromUserType,
   toUserId,
   toUserType,
   amount,
   description,
   idempotencyKey
),

// ✅ AHORA
}) => transactionsApi.depositToPlayer(
   toUserId,  // playerId
   amount,
   description
),
```

### 5. ❌ `src/hooks/useBackofficeUsers.ts`

**Problemas identificados:**

- Usa métodos deprecados de la API

**Cambios necesarios:** Similares a `usePlayers.ts`

---

## 🎯 Pasos de Migración Sugeridos

### Paso 1: Actualizar TransactionsPage.tsx ⭐ **PRIORIDAD ALTA**

1. Simplificar el formulario de creación de transacciones
2. Usar solo `playerId` en lugar de from/to
3. Cambiar a los nuevos hooks: `useDepositToPlayer`, `useWithdrawFromPlayer`
4. Actualizar botones de acciones rápidas

### Paso 2: Actualizar UsersPage.tsx

1. Cambiar `useSendBalance` por `useDepositToPlayer`
2. Cambiar `useRemoveBalance` por `useWithdrawFromPlayer`
3. Simplificar los parámetros de las mutaciones

### Paso 3: Actualizar UserDetailPage.tsx

1. Cambiar filtro `userId` a `playerId`

### Paso 4: Actualizar usePlayers.ts y useBackofficeUsers.ts

1. Eliminar o actualizar métodos que usan la API antigua
2. Usar los nuevos métodos de `transactionsApi`

---

## ✅ Verificación Final

Una vez completada la migración, verificar:

- [ ] TransactionsPage carga sin errores
- [ ] Se pueden crear transacciones con el nuevo formulario
- [ ] Botón [+] (depósito) funciona correctamente
- [ ] Botón [-] (retiro) funciona correctamente
- [ ] Los filtros de transacciones funcionan
- [ ] UsersPage puede enviar/quitar balance
- [ ] UserDetailPage muestra transacciones correctamente
- [ ] No hay warnings de TypeScript
- [ ] Todos los toasts de éxito/error aparecen

---

## 📚 Referencia Rápida

### Nuevos Hooks Disponibles:

| Hook                       | Uso           | Tipo de Transacción |
| -------------------------- | ------------- | ------------------- |
| `useDepositToPlayer()`     | Botón [+]     | DEPOSIT             |
| `useWithdrawFromPlayer()`  | Botón [-]     | WITHDRAWAL          |
| `useTransferToPlayer()`    | Transferir    | TRANSFER            |
| `useMintToPlayer()`        | Crear dinero  | MINT                |
| `useBonusToPlayer()`       | Dar bonus     | BONUS               |
| `useAdjustPlayerBalance()` | Ajuste manual | ADJUSTMENT          |
| `useRollbackTransaction()` | Revertir TX   | ROLLBACK            |

### Request Simplificado:

```typescript
interface CreateTransactionRequest {
  playerId: string; // Solo ID del jugador
  amount: number; // Monto
  transactionType: TransactionType; // Tipo
  description?: string; // Opcional
  externalRef?: string; // Opcional (idempotencia)
  gameRoundId?: string; // Opcional
}
```

### Filtros Actualizados:

```typescript
interface TransactionFilters {
  page?: number;
  pageSize?: number;
  playerId?: string; // ✅ Usar esto en lugar de userId
  transactionType?: TransactionType; // ✅ Filtro por tipo
  fromDate?: string;
  toDate?: string;
  externalRef?: string;
  globalScope?: boolean; // Solo SUPER_ADMIN
}
```

---

## 🚨 Notas Importantes

1. **Retrocompatibilidad**: Los hooks `useSendBalance()` y `useRemoveBalance()` están marcados como deprecated pero aún funcionan internamente llamando a los nuevos hooks.

2. **Solo para Players**: La nueva API **solo funciona con jugadores (PLAYER)**. Para transferencias entre usuarios de backoffice, se necesitaría una API diferente.

3. **Idempotencia**: Usa `externalRef` para evitar transacciones duplicadas. Los helpers generan automáticamente referencias únicas.

4. **Permisos**: La API valida permisos automáticamente:
   - `MINT`: Solo SUPER_ADMIN
   - `BONUS`, `ADJUSTMENT`: SUPER_ADMIN, BRAND_ADMIN
   - `DEPOSIT`, `WITHDRAWAL`, `TRANSFER`: Todos los roles

---

**Última actualización**: 13 de octubre de 2025
