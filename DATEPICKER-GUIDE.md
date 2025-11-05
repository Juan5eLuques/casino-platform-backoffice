# DatePicker Component - Guía de Uso

## 📅 Componente DatePicker Profesional

Componente moderno y profesional para selección de fechas, diseñado para mantener consistencia visual en toda la aplicación.

---

## ✨ Características

- 🎨 **Diseño Moderno**: UI limpia y profesional con animaciones suaves
- 🌙 **Dark Mode**: Soporte completo para tema oscuro
- 📱 **Responsive**: Adaptado para mobile, tablet y desktop
- ♿ **Accesible**: Labels, aria-labels y navegación por teclado
- 🎯 **Validación**: Min/max dates, fechas deshabilitadas
- 🧹 **Limpiar Fecha**: Botón X para limpiar la selección
- 📆 **Vista de Calendario**: Calendario interactivo con navegación mes a mes
- 🚀 **Quick Actions**: Botones "Hoy" y "Limpiar" para acciones rápidas
- 🎨 **Theme Variables**: Usa colores del sistema de theming

---

## 📦 Importación

```tsx
import { DatePicker } from '@/components/ui';
```

---

## 🔧 Props

| Prop          | Tipo                      | Requerido | Default               | Descripción                               |
| ------------- | ------------------------- | --------- | --------------------- | ----------------------------------------- |
| `value`       | `string`                  | ✅        | -                     | Valor de la fecha en formato `YYYY-MM-DD` |
| `onChange`    | `(value: string) => void` | ✅        | -                     | Callback cuando cambia la fecha           |
| `placeholder` | `string`                  | ❌        | `'Seleccionar fecha'` | Texto placeholder                         |
| `label`       | `string`                  | ❌        | -                     | Label del campo                           |
| `className`   | `string`                  | ❌        | -                     | Clases CSS adicionales                    |
| `disabled`    | `boolean`                 | ❌        | `false`               | Deshabilitar el campo                     |
| `minDate`     | `string`                  | ❌        | -                     | Fecha mínima permitida (`YYYY-MM-DD`)     |
| `maxDate`     | `string`                  | ❌        | -                     | Fecha máxima permitida (`YYYY-MM-DD`)     |
| `id`          | `string`                  | ❌        | -                     | ID del elemento HTML                      |

---

## 📖 Ejemplos de Uso

### 1. **Básico**

```tsx
const [fecha, setFecha] = useState('');

<DatePicker
  value={fecha}
  onChange={setFecha}
  placeholder="Seleccionar fecha"
/>;
```

### 2. **Con Label**

```tsx
<DatePicker
  label="Fecha de Nacimiento"
  value={fechaNacimiento}
  onChange={setFechaNacimiento}
  placeholder="DD/MM/YYYY"
/>
```

### 3. **Rango de Fechas (Desde - Hasta)**

```tsx
const [desde, setDesde] = useState('');
const [hasta, setHasta] = useState('');

<div className="grid grid-cols-2 gap-4">
  <DatePicker
    label="Desde"
    value={desde}
    onChange={setDesde}
    maxDate={hasta || undefined} // No permitir después de "hasta"
  />
  <DatePicker
    label="Hasta"
    value={hasta}
    onChange={setHasta}
    minDate={desde || undefined} // No permitir antes de "desde"
  />
</div>;
```

### 4. **Con Validación de Fechas**

```tsx
// Solo permitir fechas futuras
const hoy = new Date().toISOString().split('T')[0];

<DatePicker
   label="Fecha de Entrega"
   value={fechaEntrega}
   onChange={setFechaEntrega}
   minDate={hoy}
   placeholder="Seleccione fecha futura"
/>

// Solo permitir fechas pasadas
<DatePicker
   label="Fecha de Creación"
   value={fechaCreacion}
   onChange={setFechaCreacion}
   maxDate={hoy}
   placeholder="Seleccione fecha pasada"
/>
```

### 5. **Deshabilitado**

```tsx
<DatePicker
  label="Fecha Bloqueada"
  value={fechaBloqueada}
  onChange={setFechaBloqueada}
  disabled={true}
/>
```

### 6. **Con Clase Personalizada**

```tsx
<DatePicker value={fecha} onChange={setFecha} className="w-full md:w-1/2" />
```

---

## 🎨 Formato de Fecha

### **Entrada (`value` prop):**

- Formato: `YYYY-MM-DD` (ISO 8601)
- Ejemplo: `"2025-10-29"`

### **Salida (callback `onChange`):**

- Formato: `YYYY-MM-DD`
- Ejemplo: `"2025-10-29"`

### **Display Visual:**

- Formato: `DD/MM/YYYY`
- Ejemplo: `29/10/2025`

---

## 🔄 Conversión de Fechas

```tsx
// De string ISO a Date object
const dateObj = new Date(value);

// De Date object a string ISO
const isoString = dateObj.toISOString().split('T')[0];

// Formatear para display
const displayDate = `${day}/${month}/${year}`;
```

---

## 📍 Implementación Actual

### **Páginas Actualizadas:**

- ✅ `/users` - Filtros de fecha de creación
- ✅ `/transactions` - Rango de fechas para transacciones
- ✅ `/audit` - Filtros de fecha para auditoría

### **Ejemplo Real (UsersPage):**

```tsx
import { DatePicker } from '@/components/ui';

// State
const [createdFrom, setCreatedFrom] = useState('');
const [createdTo, setCreatedTo] = useState('');

// JSX
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <DatePicker
    label="Desde"
    value={createdFrom}
    onChange={setCreatedFrom}
    placeholder="Seleccionar fecha"
    maxDate={createdTo || undefined}
  />
  <DatePicker
    label="Hasta"
    value={createdTo}
    onChange={setCreatedTo}
    placeholder="Seleccionar fecha"
    minDate={createdFrom || undefined}
  />
</div>;
```

---

## 🎯 Reglas de Oro

1. **SIEMPRE usar DatePicker** para inputs de tipo fecha (NO usar `<input type="date">`)
2. **Estado en formato ISO**: Guardar siempre como `YYYY-MM-DD`
3. **Validación de rangos**: Usar `minDate`/`maxDate` para rangos
4. **Labels descriptivos**: Siempre incluir un label claro
5. **Responsive**: Considerar layout en mobile (grid-cols-1 sm:grid-cols-2)

---

## 🎨 Variables del Theme Usadas

```css
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-border-default
--color-brand-secondary (azul #3B82F6)
--color-status-info-bg
--color-surface-hover
```

---

## ♿ Accesibilidad

- ✅ Labels asociados con `htmlFor`/`id`
- ✅ Aria-labels en botones de navegación
- ✅ Estados disabled claramente indicados
- ✅ Contraste de colores WCAG AA
- ✅ Focus visible en todos los elementos interactivos
- ✅ Click fuera del componente cierra el calendario

---

## 🚀 Performance

- ✅ Cierre de calendario al hacer click fuera (useEffect cleanup)
- ✅ Animación con `animate-scale-in` (CSS-based)
- ✅ Re-renders minimizados con callbacks
- ✅ Estados locales para view date vs selected date

---

## 🔮 Mejoras Futuras (Opcional)

- [ ] Selección de rango en un solo componente
- [ ] Soporte para datetime (con hora)
- [ ] Presets de fechas ("Última semana", "Último mes", etc.)
- [ ] Locales internacionales (i18n)
- [ ] Vista de año/mes para navegación rápida
- [ ] Teclado navigation (arrow keys)

---

## 📝 Notas del Desarrollador

- El componente mantiene dos estados internos:
  - `selectedDate`: La fecha seleccionada por el usuario
  - `viewDate`: El mes/año que se está mostrando en el calendario
- El calendario se cierra automáticamente al seleccionar una fecha

- El formato visual (DD/MM/YYYY) es diferente del formato de datos (YYYY-MM-DD) para mejor UX

- Los colores siguen el sistema de theming para consistencia total

---

**Última actualización:** 29 de Octubre, 2025  
**Versión:** 1.0.0  
**Autor:** Casino Platform Team
