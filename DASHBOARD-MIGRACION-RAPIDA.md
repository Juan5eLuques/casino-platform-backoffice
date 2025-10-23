# 🚀 Guía de Migración Rápida - Dashboard Moderno

## ⚡ Inicio Rápido (2 minutos)

### 1. Verificar que Recharts esté instalado

```bash
npm install recharts
```

### 2. Verificar estructura de archivos

Los siguientes archivos deben existir:

```
src/components/dashboard/
  ├── FichasCard.tsx         ✅
  ├── CasinoCard.tsx         ✅
  ├── UsuariosCard.tsx       ✅
  ├── AlertasCard.tsx        ✅
  └── DashboardHeader.tsx    ✅

src/components/dashboard-old/  (backup automático) ✅
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

### 4. Verificar en el navegador

Abrir: `http://localhost:5173/dashboard`

---

## 🎨 Cambios Visuales

### Antes → Después

#### FichasCard

- **Antes**: Barras de progreso simples
- **Después**: Gráfico de pastel (donut) interactivo con tooltips

#### CasinoCard

- **Antes**: Solo números
- **Después**: Gráfico de barras con Jugado/Pagado/NetWin

#### UsuariosCard

- **Antes**: Lista simple
- **Después**: Barras de progreso + gráfico horizontal de agentes

#### AlertasCard

- **Antes**: Lista estática
- **Después**: Lista scrollable con badges de severidad + estado operativo

#### DashboardHeader

- **Antes**: Controles básicos
- **Después**: Filtros modernos con íconos + auto-refresh + timestamps

---

## 📱 Responsive Check

### Probar en estos tamaños:

1. **Mobile** (375px)
   - Chrome DevTools → iPhone 12 Pro
   - Todo debe verse en 1 columna
   - Textos deben ser legibles

2. **Tablet** (768px)
   - Chrome DevTools → iPad
   - Grid de 2 columnas
   - Gráficos se ajustan

3. **Desktop** (1920px)
   - Navegador normal
   - Grid de 4 columnas
   - Todo centrado y espaciado

---

## 🌓 Dark Mode Check

### Cómo probar:

1. Cambiar tema del sistema a oscuro, o
2. Usar extensión "Dark Reader", o
3. Modificar temporalmente en DevTools

### Verificar:

- ✅ Fondos oscuros (gray-800, gray-900)
- ✅ Texto claro (white, gray-400)
- ✅ Bordes visibles (gray-700)
- ✅ Gráficos legibles

---

## 🔧 Configuración Necesaria

### Tailwind Config (verificar)

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // ← IMPORTANTE
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // ...
};
```

### Viewport Meta Tag (verificar)

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

---

## 🐛 Solución de Problemas Comunes

### Problema 1: Recharts no se encuentra

```bash
# Solución:
npm install recharts
```

### Problema 2: Componentes no se muestran

```bash
# Verificar imports en DashboardPage.tsx:
import { FichasCard } from '../components/dashboard/FichasCard';
import { CasinoCard } from '../components/dashboard/CasinoCard';
import { UsuariosCard } from '../components/dashboard/UsuariosCard';
import { AlertasCard } from '../components/dashboard/AlertasCard';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
```

### Problema 3: Gráficos aparecen cortados

```bash
# Asegurarse de que ResponsiveContainer tenga width y height:
<ResponsiveContainer width="100%" height="100%">
```

### Problema 4: Dark mode no funciona

```js
// Verificar darkMode en tailwind.config.js:
darkMode: 'class'; // o 'media'
```

### Problema 5: Tipos de TypeScript

```bash
# Si hay errores de tipos:
npm install --save-dev @types/recharts
```

---

## 📦 Rollback (Si es necesario)

### Restaurar versión anterior:

```bash
# 1. Eliminar componentes nuevos
rm -rf src/components/dashboard

# 2. Restaurar desde backup
mv src/components/dashboard-old src/components/dashboard
```

---

## ✅ Checklist Final

Antes de dar por terminado, verificar:

### Funcionalidad

- [ ] Dashboard carga sin errores
- [ ] Gráficos se muestran correctamente
- [ ] Tooltips funcionan en hover
- [ ] Botón refresh actualiza datos
- [ ] Auto-refresh toggle funciona
- [ ] Cambio de scope funciona
- [ ] Filtros de período funcionan

### Responsive

- [ ] Mobile: 1 columna
- [ ] Tablet: 2 columnas
- [ ] Desktop: 4 columnas
- [ ] Textos legibles en todos los tamaños
- [ ] Gráficos se adaptan correctamente

### Dark Mode

- [ ] Todos los componentes tienen variantes dark
- [ ] Contraste adecuado
- [ ] Gráficos legibles

### Performance

- [ ] Carga rápida (< 2s)
- [ ] Sin lag en interacciones
- [ ] Transiciones suaves

---

## 🎯 Próximos Pasos

### Opcional - Mejoras adicionales:

1. **Agregar animaciones**

   ```bash
   npm install framer-motion
   ```

2. **Agregar date picker**

   ```bash
   npm install react-datepicker
   ```

3. **Agregar exportación**
   ```bash
   npm install jspdf jspdf-autotable
   ```

---

## 📚 Documentación

Para más detalles, ver:

- `DASHBOARD-MODERNO-DOCS.md` → Documentación completa
- `DASHBOARD-MODERNO-RESUMEN.md` → Resumen ejecutivo

---

## 🆘 Soporte

Si encuentras algún problema:

1. Revisar console del navegador (F12)
2. Verificar errores de TypeScript en terminal
3. Consultar documentación de Recharts
4. Verificar configuración de Tailwind

---

## 🎉 ¡Listo!

Tu dashboard moderno está configurado y listo para usar.

**Tiempo estimado**: 2-5 minutos  
**Dificultad**: Fácil  
**Status**: ✅ Completado

---

**Última actualización**: 23 de octubre de 2025
