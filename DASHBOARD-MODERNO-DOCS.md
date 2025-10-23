# Dashboard Moderno - Documentación

## 🎨 Resumen de Mejoras

Se ha rediseñado completamente el dashboard del backoffice del casino con un enfoque moderno, profesional y totalmente responsive. Los cambios principales incluyen:

### 1. **Nueva Paleta de Colores**

- ✅ Diseño limpio con fondo blanco/gris oscuro (dark mode)
- ✅ Tarjetas con sombras elevadas y bordes sutiles
- ✅ Gradientes modernos en íconos de encabezado
- ✅ Colores semánticos para diferentes tipos de datos

### 2. **Librería de Gráficos: Recharts**

Se integró **Recharts** para visualizaciones interactivas y profesionales:

- 📊 **Gráfico de pastel** (donut chart) en FichasCard
- 📊 **Gráfico de barras verticales** en CasinoCard
- 📊 **Gráfico de barras horizontales** en UsuariosCard

### 3. **Responsive Design Completo**

Todos los componentes son 100% responsive:

- 📱 **Mobile**: Diseño de 1 columna, textos y espaciados optimizados
- 💻 **Tablet**: Grid de 2 columnas
- 🖥️ **Desktop**: Grid de 4 columnas
- 📐 Breakpoints: `sm:`, `md:`, `lg:`

### 4. **Mejoras UX/UI**

#### **Badges y Pills**

- Badges de estado con íconos y colores semánticos
- Pills para métricas importantes (Hold %, % activos, etc.)

#### **Iconografía Mejorada**

Uso de `lucide-react` para íconos modernos y consistentes:

- 💰 Wallet (Fichas)
- 🎮 Gamepad2 (Casino)
- 👥 Users (Usuarios)
- ⚠️ AlertTriangle (Alertas)

#### **Interactividad**

- Hover states con elevación de sombras
- Tooltips interactivos en gráficos
- Transiciones suaves (300ms)
- Botones con feedback visual

#### **Tipografía Mejorada**

- Jerarquía clara de tamaños
- Pesos de fuente apropiados
- Espaciado optimizado
- Truncado inteligente de texto largo

---

## 📦 Componentes Actualizados

### 1. **FichasCard.tsx**

```typescript
Características:
- Gráfico de pastel (donut) con distribución House/Cajeros/Jugadores
- Badge de delta del día con ícono de tendencia
- Leyenda con colores y montos
- 3 secciones de transacciones (Cargas, Depósitos, Retiros)
- Tooltip interactivo en gráfico
```

**Responsive:**

- Mobile: Gráfico más pequeño (h-40), textos xs
- Desktop: Gráfico completo (h-48), textos sm/base

### 2. **CasinoCard.tsx**

```typescript
Características:
- Gráfico de barras con Jugado/Pagado/NetWin
- Badge de Hold Percentage
- Grid de métricas principales
- KPIs en tarjetas con colores
- Tooltips con formateo de moneda
```

**Responsive:**

- Eje Y formateado (K para miles)
- Grid 2 columnas para métricas
- Espaciado adaptativo

### 3. **UsuariosCard.tsx**

```typescript
Características:
- Estadísticas de jugadores activos/inactivos
- Barras de progreso visuales
- Gráfico de barras horizontales para agentes por nivel
- Grid de resumen con total de agentes y niveles
- Colores diferentes por nivel de agente
```

**Responsive:**

- Layout vertical adaptativo
- Gráfico horizontal optimizado para mobile

### 4. **AlertasCard.tsx**

```typescript
Características:
- Grid de alertas críticas y altas
- Lista scrollable de alertas ordenadas por severidad
- Íconos y colores por severidad (Critical, High, Medium, Low)
- Estado operativo con cajeros activos, jugadores online, etc.
- Mensaje "No hay alertas" cuando está vacío
```

**Responsive:**

- Scroll interno para alertas (max-h-48)
- Grid adaptativo 2 columnas

### 5. **DashboardHeader.tsx**

```typescript
Características:
- Selector de scope (Direct/Tree/Global) con íconos
- Botones de período rápido (Hoy, 7d, 30d)
- Botón de actualización manual
- Toggle de auto-refresh con estado visual
- Timestamp de última actualización
- Rango de fechas opcional
```

**Responsive:**

- Layout flex que se adapta a vertical en mobile
- Íconos se ocultan en mobile (solo labels)
- Botones compactos en pantallas pequeñas

---

## 🎨 Sistema de Diseño

### Colores Principales

```typescript
const COLORS = {
  // Fichas
  green: '#10b981', // House
  blue: '#3b82f6', // Cajeros
  purple: '#8b5cf6', // Jugadores

  // Casino
  indigo: '#4f46e5',

  // Alertas
  red: '#ef4444', // Critical
  orange: '#f97316', // High
  yellow: '#eab308', // Medium
};
```

### Espaciado

- Padding cards: `p-4 sm:p-6`
- Gaps: `gap-2 sm:gap-3`
- Margins: `mb-4 sm:mb-6`

### Sombras

- Default: `shadow-xl`
- Hover: `hover:shadow-2xl`

### Bordes

- Radio: `rounded-2xl` (tarjetas), `rounded-lg` (elementos internos)
- Width: `border` (1px)
- Color: `border-gray-100 dark:border-gray-700`

### Transiciones

- Duración: `transition-all duration-300`
- Propiedades: `shadow`, `transform`, `colors`

---

## 📊 Gráficos (Recharts)

### Configuración de Pie Chart

```typescript
<PieChart>
  <Pie
    data={pieData}
    cx="50%"
    cy="50%"
    innerRadius={50}    // Donut style
    outerRadius={70}
    paddingAngle={2}    // Separación entre secciones
    dataKey="value"
  />
  <Tooltip formatter={formatCurrency} />
</PieChart>
```

### Configuración de Bar Chart

```typescript
<BarChart data={chartData}>
  <XAxis tick={{ fontSize: 12 }} />
  <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
    {/* Bordes redondeados en la parte superior */}
  </Bar>
</BarChart>
```

---

## 🔧 Utilidades

### Formatters (`src/utils/formatters.ts`)

```typescript
formatCurrency(value: number): string
  // Ejemplo: 1234567.89 → "$1,234,567.89"

formatPercent(value: number): string
  // Ejemplo: 45.67 → "45.67%"

formatTimeAgo(date: Date): string
  // Ejemplo: "hace 5 minutos"

getPercentage(part: number, total: number): number
  // Calcula porcentaje con manejo de división por cero
```

---

## 📱 Breakpoints de Tailwind

```css
/* Mobile First Approach */
default:  < 640px   (mobile)
sm:       ≥ 640px   (tablet)
md:       ≥ 768px   (tablet landscape)
lg:       ≥ 1024px  (desktop)
xl:       ≥ 1280px  (large desktop)
```

### Ejemplo de Uso Responsive

```tsx
<div
  className="
  text-xs        /* mobile */
  sm:text-sm     /* tablet */
  md:text-base   /* desktop */
  lg:text-lg     /* large desktop */
"
>
  Responsive Text
</div>
```

---

## 🌓 Dark Mode

Todos los componentes soportan dark mode con Tailwind:

```tsx
<div className="
  bg-white dark:bg-gray-800
  text-gray-900 dark:text-white
  border-gray-100 dark:border-gray-700
">
  <!-- Contenido -->
</div>
```

**Variantes Dark:**

- Backgrounds: `dark:bg-gray-800`, `dark:bg-gray-900`
- Textos: `dark:text-white`, `dark:text-gray-400`
- Bordes: `dark:border-gray-700`

---

## 🚀 Mejoras de Performance

1. **Lazy Loading**: Componentes se cargan bajo demanda
2. **Memoización**: React Query cachea datos por 30s
3. **Optimización de Re-renders**: Props específicas en lugar de objetos completos
4. **CSS Purge**: Tailwind elimina clases no utilizadas en producción

---

## ✅ Checklist de Testing

### Mobile (< 640px)

- [ ] Tarjetas se apilan en 1 columna
- [ ] Textos son legibles (min 12px)
- [ ] Botones táctiles (min 44px)
- [ ] Gráficos se renderizan correctamente
- [ ] Scroll funciona sin cortes

### Tablet (640px - 1024px)

- [ ] Grid de 2 columnas
- [ ] Header se adapta correctamente
- [ ] Gráficos mantienen proporciones

### Desktop (> 1024px)

- [ ] Grid de 4 columnas
- [ ] Todos los íconos visibles
- [ ] Hover states funcionan
- [ ] Tooltips se muestran correctamente

### Dark Mode

- [ ] Todos los componentes tienen variantes dark
- [ ] Contraste adecuado (WCAG AA)
- [ ] Gráficos legibles en modo oscuro

### Interactividad

- [ ] Botón de refresh actualiza datos
- [ ] Auto-refresh funciona (toggle on/off)
- [ ] Cambio de scope actualiza datos
- [ ] Tooltips en gráficos funcionan
- [ ] Filtros de período actualizan datos

---

## 📦 Dependencias Nuevas

```json
{
  "dependencies": {
    "recharts": "^2.x.x" // Librería de gráficos
  }
}
```

---

## 🎯 Próximos Pasos Recomendados

1. **Animaciones de entrada**: Usar `framer-motion` para animaciones al cargar
2. **Skeleton Loaders**: Mostrar placeholders mientras carga
3. **Export a PDF/Excel**: Agregar funcionalidad de exportación
4. **Comparación de períodos**: Mostrar vs período anterior
5. **Drill-down**: Click en tarjetas para ver detalles
6. **Notificaciones**: Toast notifications para acciones exitosas/fallidas
7. **Filtros avanzados**: Selector de fechas personalizado (date picker)
8. **Métricas en tiempo real**: WebSocket para actualizaciones live

---

## 📚 Recursos

- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [React Query](https://tanstack.com/query/latest)

---

## 🐛 Troubleshooting

### Problema: Gráficos no se muestran

**Solución**: Verificar que `recharts` esté instalado:

```bash
npm install recharts
```

### Problema: Dark mode no funciona

**Solución**: Verificar configuración de Tailwind en `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class', // o 'media'
  // ...
};
```

### Problema: Responsive no funciona

**Solución**: Verificar viewport meta tag en `index.html`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## 💡 Tips de Desarrollo

1. **DevTools**: Usar React DevTools para inspeccionar componentes
2. **Responsive Testing**: Usar Chrome DevTools para simular dispositivos
3. **Color Contrast**: Usar herramientas como WebAIM para verificar contraste
4. **Performance**: Usar Lighthouse para auditar performance

---

**Última actualización**: 23 de octubre de 2025
**Versión**: 2.0.0
**Autor**: GitHub Copilot
