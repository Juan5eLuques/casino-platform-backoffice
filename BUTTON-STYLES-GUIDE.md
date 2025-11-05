# Guía de Estilos de Botones - Casino Backoffice

## 🎨 Sistema de Colores Consistente

Todos los botones deben usar las variables CSS del sistema de theming para mantener consistencia.

---

## 📋 Estilos de Botones Estándar

### **Botón Primary (Azul Vibrante)**

```jsx
// Para botones de acción principal
className =
  'px-4 py-2 bg-brand-secondary text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50';

// Ejemplos: Crear, Guardar, Enviar
```

### **Botón Secondary (Gris con borde)**

```jsx
// Para botones de cancelar o acciones secundarias
className =
  'px-4 py-2 text-secondary border border-default rounded-lg hover:bg-tertiary transition-colors';

// Ejemplos: Cancelar, Volver, Cerrar
```

### **Botón Success (Verde Esmeralda)**

```jsx
// Para acciones positivas o de éxito
className =
  'px-4 py-2 bg-status-success text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50';

// Ejemplos: Aprobar, Confirmar, Activar, Exportar
```

### **Botón Danger (Naranja - NO rojo)**

```jsx
// Para acciones destructivas o de advertencia
className =
  'px-4 py-2 bg-btn-danger-bg hover:bg-btn-danger-bg-hover text-white rounded-lg transition-all disabled:opacity-50';

// Ejemplos: Eliminar, Rechazar, Desactivar
```

### **Botón Ghost (Transparente)**

```jsx
// Para acciones terciarias o iconos
className =
  'p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-lg transition-colors';

// Ejemplos: Iconos de acción, botones de menos importancia
```

---

## 🔧 Usando el Componente Button

El componente `Button` ya implementa estos estilos:

```tsx
import { Button } from '@/components/ui/Button';

// Uso:
<Button variant="primary">Crear Usuario</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="success">Aprobar</Button>
<Button variant="danger">Eliminar</Button>
<Button variant="warning">Advertencia</Button>
```

---

## 🚫 Qué NO Hacer

❌ **NO usar colores hardcodeados:**

```jsx
// MAL - No hacer esto
className = 'bg-blue-600 hover:bg-blue-700';
className = 'bg-green-500 hover:bg-green-600';
className = 'bg-red-600 hover:bg-red-700';
className = 'text-gray-700 dark:text-gray-300';
```

✅ **SÍ usar variables del tema:**

```jsx
// BIEN - Hacer esto
className = 'bg-brand-secondary hover:opacity-90';
className = 'bg-status-success hover:opacity-90';
className = 'bg-btn-danger-bg hover:bg-btn-danger-bg-hover';
className = 'text-secondary';
```

---

## 📦 Variables CSS Disponibles

### **Colores de Marca:**

- `bg-brand-primary` - Azul marino oscuro (#0F172A)
- `bg-brand-secondary` - Azul vibrante (#3B82F6)
- `bg-brand-accent` - Verde esmeralda (#10B981)

### **Colores de Estado:**

- `bg-status-success` - Verde (#10B981)
- `bg-status-warning` - Amarillo/Naranja (#F59E0B)
- `bg-status-error` - Naranja (#F97316)
- `bg-status-info` - Azul (#3B82F6)

### **Colores de Botones:**

- `bg-btn-primary-bg` / `hover:bg-btn-primary-bg-hover`
- `bg-btn-secondary-bg` / `hover:bg-btn-secondary-bg-hover`
- `bg-btn-danger-bg` / `hover:bg-btn-danger-bg-hover`
- `bg-btn-success-bg` / `hover:bg-btn-success-bg-hover`

### **Colores de Texto:**

- `text-primary` - Texto principal oscuro
- `text-secondary` - Texto secundario gris
- `text-tertiary` - Texto terciario gris claro

### **Colores de Fondo:**

- `bg-primary` - Fondo blanco
- `bg-secondary` - Fondo gris muy claro
- `bg-tertiary` - Fondo gris claro

### **Bordes:**

- `border-default` - Borde gris estándar
- `border-subtle` - Borde muy sutil
- `border-strong` - Borde más fuerte

---

## 🎯 Reglas de Oro

1. **SIEMPRE usar variables del tema** - Nunca hardcodear colores
2. **Preferir el componente Button** cuando sea posible
3. **Mantener consistencia** - Mismas acciones = Mismos colores
4. **No usar rojo estridente** - Usar naranja para errores/peligro
5. **Responsive** - Los botones deben verse bien en mobile y desktop

---

## 📝 Ejemplos de Migración

### Antes (❌):

```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white">Guardar</button>
```

### Después (✅):

```jsx
<button className="bg-brand-secondary hover:opacity-90 text-white rounded-lg transition-all">
  Guardar
</button>
```

### O mejor aún:

```jsx
<Button variant="primary">Guardar</Button>
```

---

## 🔄 Páginas Actualizadas

- ✅ TransactionsPage - Botones migrados a variables del tema
- ✅ UsersPage - Botones migrados a variables del tema
- ✅ GamesPage - Botones migrados a variables del tema
- ✅ AuditPage - Botones migrados a variables del tema
- ✅ CreateSubordinateForm - Botones migrados a variables del tema
- ✅ Sidebar - Navegación con colores del tema

---

Última actualización: 28 de octubre de 2025
