# 🔍 Debug Completo - Creación de Usuarios

## Fecha: 13 de octubre de 2025

---

## 🚨 Problema Reportado

**Síntoma:** Solo se pueden crear PLAYERS. Al intentar crear SUPER_ADMIN, BRAND_ADMIN o CASHIER:

- ❌ No aparece nada en la consola
- ❌ No se ve ninguna request en Network
- ❌ El formulario parece no hacer nada

---

## 🔧 Correcciones Aplicadas

### 1. Schema de Validación Mejorado

**Cambios:**

```typescript
const createUserSchema = z.object({
  username: z.string().min(3, 'El username debe tener al menos 3 caracteres'),
  password: z.string().optional(),
  role: z.number().min(0).max(2, 'Role inválido').optional().nullable(), // ✅ Acepta null
  email: z.string().email('Email inválido').optional().or(z.literal('')), // ✅ Acepta string vacío
  externalId: z.string().optional().or(z.literal('')),
  parentCashierId: z.string().optional().or(z.literal('')), // ✅ Acepta string vacío (no valida UUID si está vacío)
  commissionPercent: z.number().min(0).max(100).optional().nullable(), // ✅ Acepta null
});
```

**Problema anterior:**

- `parentCashierId` validaba UUID incluso cuando estaba vacío
- `role` y `commissionPercent` no aceptaban `null`

---

### 2. Logs de Debug Agregados

**En múltiples puntos del código:**

#### A) Logs en el Schema (dentro de superRefine):

```typescript
console.log('=== VALIDACION SCHEMA ===');
console.log('Data recibida:', data);
console.log('Es Player?:', isPlayer);
// Logs específicos de cada validación
console.log('=== FIN VALIDACION ===');
```

#### B) Logs fuera del handler (continuo):

```typescript
console.log('=== VALIDACION DEBUG ===');
console.log('Errores actuales:', errors);
console.log('Role seleccionado:', selectedRole);
```

#### C) Logs en el submit del form:

```typescript
<form
   onSubmit={(e) => {
      console.log('=== FORM SUBMIT EVENT ===');
      console.log('Event:', e);
      handleSubmit(handleCreateUser)(e);
   }}
>
```

#### D) Logs en handleCreateUser:

```typescript
console.log('=== DEBUG: handleCreateUser LLAMADO ===');
console.log('Datos del formulario:', data);
console.log('Role seleccionado:', data.role);
console.log('Usuario actual:', currentUser);
console.log('Datos a enviar:', userData);
console.log('Llamando a createUserMutation...');
// Después del await:
console.log('Usuario creado exitosamente!');
```

---

## 🔍 Cómo Usar el Debug

### Paso 1: Abrir DevTools

1. Presiona `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña **Console**
3. Limpia la consola (icono 🚫 o `Ctrl+L`)

### Paso 2: Intentar Crear Usuario

1. Click en "Nuevo Usuario"
2. Selecciona "Super Admin" (role = 0)
3. Ingresa:
   - Username: `test_admin`
   - Password: `admin123`
4. Click en "Crear Usuario"

### Paso 3: Analizar los Logs

**Escenario A: No aparece ningún log**

```
❌ Problema: El formulario no se está enviando
Causa posible:
- Hay un error de JavaScript bloqueando
- El botón está disabled
- El evento click no se propaga
```

**Escenario B: Aparece "FORM SUBMIT EVENT" pero no "handleCreateUser LLAMADO"**

```
❌ Problema: La validación de Zod está fallando
Causa: Revisa los logs de "VALIDACION SCHEMA"
- Si dice "ERROR: Password requerida" → Falta llenar el campo
- Si dice "ERROR: Email requerido" → El formulario cree que es player
```

**Escenario C: Aparece "handleCreateUser LLAMADO" pero no hay request**

```
❌ Problema: El mutation no se está ejecutando
Solución: Revisa el log "Datos a enviar"
- Verifica que role tenga el valor correcto (0, 1, o 2)
- Verifica que password esté presente
```

**Escenario D: Aparece todo hasta "Llamando a createUserMutation..." pero error después**

```
❌ Problema: El backend está rechazando la request
Solución:
1. Ve a la pestaña Network
2. Busca la request a /api/v1/admin/users
3. Click en ella
4. Ve a la pestaña Response
5. Lee el error del backend
```

---

## 🎯 Tabla de Diagnóstico

| Logs que aparecen                        | Diagnóstico                               | Solución                                                            |
| ---------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| Ninguno                                  | Evento submit no se dispara               | Verificar que el botón no esté disabled, revisar errores en consola |
| Solo "VALIDACION DEBUG"                  | Errores de validación en tiempo real      | Revisar el objeto `errors` en los logs                              |
| "FORM SUBMIT EVENT"                      | Submit se dispara pero no pasa validación | Revisar "VALIDACION SCHEMA" para ver qué falla                      |
| Hasta "handleCreateUser LLAMADO"         | Validación OK, función se ejecuta         | Revisar "Datos a enviar" para verificar el payload                  |
| Hasta "Llamando a createUserMutation..." | Todo OK hasta el mutation                 | Ir a Network tab y buscar errores del backend                       |
| "Usuario creado exitosamente!"           | ✅ Todo funciona                          | Si no se ve en la lista, problema de actualización                  |

---

## 📊 Ejemplo de Logs Esperados

### Creación Exitosa de Super Admin

```javascript
=== VALIDACION DEBUG ===
Errores actuales: {}
Role seleccionado: 0

=== VALIDACION SCHEMA ===
Data recibida: {
  username: "test_admin",
  password: "admin123",
  role: 0,
  email: "",
  commissionPercent: undefined
}
Es Player?: false
OK: Password válida
=== FIN VALIDACION ===

=== FORM SUBMIT EVENT ===
Event: [SubmitEvent object]

=== DEBUG: handleCreateUser LLAMADO ===
Datos del formulario: {
  username: "test_admin",
  password: "admin123",
  role: 0
}
Role seleccionado: 0
Usuario actual: { id: "...", username: "...", role: "SUPER_ADMIN" }

Datos a enviar: {
  username: "test_admin",
  password: "admin123",
  role: 0,
  email: undefined,
  commissionPercent: undefined
}

Llamando a createUserMutation...

Usuario creado exitosamente!
```

---

## 🧪 Pruebas a Realizar

### Test 1: Crear Super Admin

```
1. Abrir modal
2. Seleccionar "Super Admin"
3. Username: "test_sa"
4. Password: "pass123"
5. Click "Crear Usuario"

Logs esperados:
✅ VALIDACION SCHEMA
✅ Es Player?: false
✅ OK: Password válida
✅ handleCreateUser LLAMADO
✅ role: 0
✅ Usuario creado exitosamente!
```

### Test 2: Crear Brand Admin

```
1. Abrir modal
2. Seleccionar "Brand Admin"
3. Username: "test_ba"
4. Password: "pass123"
5. Click "Crear Usuario"

Logs esperados:
✅ role: 1
✅ Usuario creado exitosamente!
```

### Test 3: Crear Cashier

```
1. Abrir modal
2. Seleccionar "Cashier"
3. Username: "test_cashier"
4. Password: "pass123"
5. (Si eres CASHIER) Comisión: 5.5
6. Click "Crear Usuario"

Logs esperados:
✅ role: 2
✅ commissionPercent: 5.5 (si aplica)
✅ Usuario creado exitosamente!
```

### Test 4: Crear Player

```
1. Abrir modal
2. Dejar "Jugador (PLAYER)"
3. Username: "test_player"
4. Email: "test@example.com"
5. Click "Crear Usuario"

Logs esperados:
✅ Es Player?: true
✅ role: undefined
✅ email: "test@example.com"
✅ Usuario creado exitosamente!
```

---

## 🚀 Próximos Pasos

1. **Probar ahora** con los logs activos
2. **Copiar y pegar los logs** que aparezcan en la consola
3. **Identificar** en qué punto se detiene el flujo
4. **Reportar** los logs específicos si sigue fallando

---

## 📝 Archivos Modificados

**src/pages/UsersPage.tsx:**

- ✅ Schema acepta `null` y strings vacíos
- ✅ Logs en validación (superRefine)
- ✅ Logs en componente (errors, selectedRole)
- ✅ Logs en form submit
- ✅ Logs detallados en handleCreateUser
- ✅ Conversión correcta de null/undefined en userData

---

## ✅ Estado Actual

**LISTO PARA DEBUG** 🔍

El código ahora tiene logging extensivo que te dirá EXACTAMENTE dónde y por qué se está bloqueando la creación de usuarios.

**Abre la consola y prueba crear un Super Admin ahora mismo.**
