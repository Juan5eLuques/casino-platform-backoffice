# Actualización API de Transacciones - Guía Completa

## 📋 Resumen de Cambios

La API de transacciones ha sido actualizada para usar un modelo unificado. Los cambios principales son:

### 1. Nuevo Request Format

```typescript
// ANTES (incorrecto)
{
  playerId: string;
  amount: number;
  transactionType: TransactionType;
  description?: string;
  externalRef?: string;
}

// AHORA (correcto)
{
  fromUserId?: string | null;        // null para DEPOSIT (SUPER_ADMIN)
  fromUserType?: 'BACKOFFICE' | 'PLAYER' | null;
  toUserId: string;                  // usuario destino
  toUserType: 'BACKOFFICE' | 'PLAYER';
  amount: number;
  transactionType: TransactionType;
  idempotencyKey: string;            // REQUERIDO
  description?: string;
}
```

### 2. Lógica de Operaciones del Backoffice

#### Botón [+] DEPÓSITO:

- **SUPER_ADMIN**: Usa `transactionType: 'DEPOSIT'` con `fromUserId: null` (crea dinero)
- **Otros roles**: Usa `transactionType: 'TRANSFER'` desde su wallet

#### Botón [-] RETIRO:

- **Todos los roles**: Usa `transactionType: 'WITHDRAWAL'` (quita fondos del usuario)

#### Transferencia Manual:

- **Todos los roles**: Usa `transactionType: 'TRANSFER'` entre dos usuarios específicos

---

## 🔧 Archivos Actualizados

### ✅ 1. `src/types/index.ts`

```typescript
// Request para crear transacción - Nueva API Unificada
export interface CreateTransactionRequest {
  fromUserId?: string | null; // ID usuario origen (null para MINT)
  fromUserType?: 'BACKOFFICE' | 'PLAYER' | null; // Tipo origen (null para MINT)
  toUserId: string; // ID usuario destino
  toUserType: 'BACKOFFICE' | 'PLAYER'; // Tipo destino
  amount: number; // Monto en formato decimal
  transactionType: TransactionType; // Tipo de transacción
  idempotencyKey: string; // Clave de idempotencia (REQUERIDO)
  description?: string; // Descripción opcional
}
```

### ✅ 2. `src/api/transactions.ts`

```typescript
export const transactionsApi = {
   // ... métodos existentes ...

   /**
    * DEPÓSITO (Botón +)
    * - SUPER_ADMIN: Usa DEPOSIT (crea dinero desde null)
    * - Otros roles: Usa TRANSFER (desde su wallet)
    */
   depositFunds: async (
      currentUserId: string,
      currentUserType: 'BACKOFFICE' | 'PLAYER',
      isSuperAdmin: boolean,
      toUserId: string,
      toUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description?: string
   ): Promise<TransactionResponse>,

   /**
    * RETIRO (Botón -)
    * Quita fondos del usuario (para todos los roles)
    */
   withdrawFunds: async (
      fromUserId: string,
      fromUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description?: string
   ): Promise<TransactionResponse>,

   /**
    * TRANSFERENCIA EXPLÍCITA
    * Transferir fondos entre usuarios específicos
    */
   transferBetweenUsers: async (
      fromUserId: string,
      fromUserType: 'BACKOFFICE' | 'PLAYER',
      toUserId: string,
      toUserType: 'BACKOFFICE' | 'PLAYER',
      amount: number,
      description?: string
   ): Promise<TransactionResponse>,
};
```

### ✅ 3. `src/hooks/useTransactions.ts`

```typescript
// Hooks actualizados:
export function useDepositFunds() { ... }
export function useWithdrawFunds() { ... }
export function useTransferBetweenUsers() { ... }

// Hooks deprecated (mantienen compatibilidad):
export function useSendBalance() { return useDepositFunds(); }
export function useRemoveBalance() { return useWithdrawFunds(); }
```

---

## ⚠️ Errores Pendientes de Corrección

### 1. `TransactionsPage.tsx`

#### Error 1: Propiedad `userType` no existe en `TransactionFilters`

```typescript
// Línea ~72 - ANTES (incorrecto):
const {
  data: transactionsData,
  isLoading,
  error,
} = useTransactions({
  page,
  pageSize: 20,
  userId: userIdFilter || undefined,
  userType: userTypeFilter || undefined, // ❌ NO EXISTE
});

// DESPUÉS (correcto):
const {
  data: transactionsData,
  isLoading,
  error,
} = useTransactions({
  page,
  pageSize: 20,
  playerId: userIdFilter || undefined, // ✅ Usar playerId
  // userType no existe en los filtros
});
```

#### Error 2: Falta `transactionType` en `CreateTransactionRequest`

```typescript
// Línea ~106 - ANTES (incorrecto):
const transactionData: CreateTransactionRequest = {
  fromUserId: currentUser.id,
  fromUserType: 'BACKOFFICE',
  toUserId: data.targetUserId,
  toUserType: data.targetUserType,
  amount: data.amount,
  description: data.description,
  idempotencyKey: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
};

// DESPUÉS (correcto):
const transactionData: CreateTransactionRequest = {
  fromUserId: currentUser.id,
  fromUserType: 'BACKOFFICE',
  toUserId: data.targetUserId,
  toUserType: data.targetUserType,
  amount: data.amount,
  transactionType: 'TRANSFER', // ✅ REQUERIDO
  description: data.description,
  idempotencyKey: `transfer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
};
```

#### Error 3: Uso incorrecto de `useDepositFunds`

```typescript
// Línea ~125 - ANTES (incorrecto):
sendBalanceMutation.mutate({
  fromUserId: currentUser.id, // ❌ No existe
  fromUserType: 'BACKOFFICE', // ❌ No existe
  toUserId: data.targetUserId,
  toUserType: data.targetUserType,
  amount: data.amount,
  description: data.description,
});

// DESPUÉS (correcto):
depositFundsMutation.mutate({
  currentUserId: currentUser.id, // ✅ Correcto
  currentUserType: 'BACKOFFICE', // ✅ Correcto
  isSuperAdmin: currentUser.role === 'SUPER_ADMIN', // ✅ NUEVO
  toUserId: data.targetUserId,
  toUserType: data.targetUserType,
  amount: data.amount,
  description: data.description,
});
```

#### Error 4: Uso incorrecto de `useWithdrawFunds`

```typescript
// Línea ~142 - ANTES (incorrecto):
removeBalanceMutation.mutate({
  fromUserId: currentUser.id,
  fromUserType: 'BACKOFFICE',
  targetUserId: data.targetUserId, // ❌ No existe
  targetUserType: data.targetUserType,
  amount: data.amount,
  description: data.description,
});

// DESPUÉS (correcto):
withdrawFundsMutation.mutate({
  fromUserId: data.targetUserId, // ✅ Usuario al que se le quita
  fromUserType: data.targetUserType, // ✅ Tipo del usuario
  amount: data.amount,
  description: data.description,
});
```

### 2. `UsersPage.tsx`

#### Error: Similar a TransactionsPage

```typescript
// Línea ~236 - ANTES (incorrecto):
sendBalanceMutation.mutate({
  fromUserId: currentUser.id, // ❌ No existe
  fromUserType: 'BACKOFFICE', // ❌ No existe
  toUserId: user.id,
  toUserType: user.userType,
  amount: Number(quickActionAmount),
  description: 'Depósito desde panel de usuarios',
});

// DESPUÉS (correcto):
depositFundsMutation.mutate({
  currentUserId: currentUser.id, // ✅ Correcto
  currentUserType: 'BACKOFFICE', // ✅ Correcto
  isSuperAdmin: currentUser.role === 'SUPER_ADMIN', // ✅ NUEVO
  toUserId: user.id,
  toUserType: user.userType,
  amount: Number(quickActionAmount),
  description: 'Depósito desde panel de usuarios',
});
```

```typescript
// Línea ~247 - ANTES (incorrecto):
removeBalanceMutation.mutate({
  fromUserId: currentUser.id,
  fromUserType: 'BACKOFFICE',
  targetUserId: user.id, // ❌ No existe
  targetUserType: user.userType,
  amount: Number(quickActionAmount),
  description: 'Retiro desde panel de usuarios',
});

// DESPUÉS (correcto):
withdrawFundsMutation.mutate({
  fromUserId: user.id, // ✅ Usuario al que se le quita
  fromUserType: user.userType, // ✅ Tipo del usuario
  amount: Number(quickActionAmount),
  description: 'Retiro desde panel de usuarios',
});
```

### 3. `usePlayers.ts`

#### Error: Métodos `sendBalance` y `removeBalance` ya no existen

```typescript
// Línea ~124 - ANTES (incorrecto):
mutationFn: ({ playerId, amount, description }) =>
   transactionsApi.sendBalance(
      currentUser.id,
      'BACKOFFICE',
      playerId,
      'PLAYER',
      amount,
      description
   ),

// DESPUÉS (correcto):
mutationFn: ({ playerId, amount, description }) =>
   transactionsApi.depositFunds(
      currentUser.id,
      'BACKOFFICE',
      currentUser.role === 'SUPER_ADMIN',
      playerId,
      'PLAYER',
      amount,
      description
   ),
```

```typescript
// Línea ~161 - ANTES (incorrecto):
mutationFn: ({ playerId, amount, description }) =>
   transactionsApi.removeBalance(
      currentUser.id,
      'BACKOFFICE',
      playerId,
      'PLAYER',
      amount,
      description
   ),

// DESPUÉS (correcto):
mutationFn: ({ playerId, amount, description }) =>
   transactionsApi.withdrawFunds(
      playerId,
      'PLAYER',
      amount,
      description
   ),
```

### 4. `useBackofficeUsers.ts`

#### Error: Similar a `usePlayers.ts`

```typescript
// Línea ~129 - ANTES (incorrecto):
mutationFn: ({ fromUserId, toUserId, amount, description }) =>
   transactionsApi.sendBalance(
      fromUserId,
      'BACKOFFICE',
      toUserId,
      'BACKOFFICE',
      amount,
      description
   ),

// DESPUÉS (correcto):
mutationFn: ({ fromUserId, toUserId, amount, description }) =>
   transactionsApi.transferBetweenUsers(
      fromUserId,
      'BACKOFFICE',
      toUserId,
      'BACKOFFICE',
      amount,
      description
   ),
```

---

## 📝 Pasos para Completar la Actualización

### 1. Actualizar `TransactionsPage.tsx`

- [ ] Cambiar `useSendBalance` por `useDepositFunds`
- [ ] Cambiar `useRemoveBalance` por `useWithdrawFunds`
- [ ] Actualizar parámetros de mutaciones
- [ ] Remover `userType` del filtro de transacciones
- [ ] Agregar `transactionType` al request manual
- [ ] Agregar `isSuperAdmin` a las llamadas de depósito

### 2. Actualizar `UsersPage.tsx`

- [ ] Cambiar `useSendBalance` por `useDepositFunds`
- [ ] Cambiar `useRemoveBalance` por `useWithdrawFunds`
- [ ] Actualizar parámetros de mutaciones
- [ ] Agregar `isSuperAdmin` a las llamadas de depósito

### 3. Actualizar `usePlayers.ts`

- [ ] Cambiar `transactionsApi.sendBalance` por `transactionsApi.depositFunds`
- [ ] Cambiar `transactionsApi.removeBalance` por `transactionsApi.withdrawFunds`
- [ ] Actualizar parámetros de las llamadas

### 4. Actualizar `useBackofficeUsers.ts`

- [ ] Cambiar `transactionsApi.sendBalance` por `transactionsApi.transferBetweenUsers`

---

## 🎯 Lógica de Negocio

### Botón [+] - DEPÓSITO

```typescript
if (user.role === 'SUPER_ADMIN') {
  // Crea dinero de la nada
  transactionType = 'DEPOSIT';
  fromUserId = null;
  fromUserType = null;
} else {
  // Transfiere desde mi wallet
  transactionType = 'TRANSFER';
  fromUserId = currentUser.id;
  fromUserType = 'BACKOFFICE';
}
```

### Botón [-] - RETIRO

```typescript
// Para todos los roles
transactionType = 'WITHDRAWAL';
fromUserId = targetUser.id; // Usuario al que se le quita
fromUserType = targetUser.userType;
toUserId = null; // Manejado por backend como retiro al sistema
```

### Transferencia Manual

```typescript
transactionType = 'TRANSFER';
fromUserId = sourceUser.id;
fromUserType = sourceUser.userType;
toUserId = targetUser.id;
toUserType = targetUser.userType;
```

---

## ✅ Testing Checklist

Después de aplicar todos los cambios, verificar:

- [ ] SUPER_ADMIN puede hacer DEPÓSITO (botón +) creando dinero
- [ ] BRAND_ADMIN puede hacer TRANSFERENCIA (botón +) desde su wallet
- [ ] CASHIER puede hacer TRANSFERENCIA (botón +) desde su wallet
- [ ] Todos los roles pueden hacer RETIRO (botón -)
- [ ] Las transacciones se registran correctamente en la base de datos
- [ ] Los balances se actualizan correctamente (from y to)
- [ ] No hay errores de compilación TypeScript
- [ ] Los toasts muestran los mensajes correctos

---

## 📞 Soporte

Si encuentras algún problema adicional:

1. Verifica que todos los tipos están actualizados
2. Asegúrate de que `idempotencyKey` siempre se está enviando
3. Confirma que `transactionType` es un valor válido del enum
4. Verifica que los `fromUserId`/`toUserId` coincidan con la lógica de negocio
