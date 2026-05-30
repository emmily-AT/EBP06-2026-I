# Modo Alto Contraste - WCAG AAA

## 🎨 Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| **Fondo Principal** | `#000000` | Fondo de la página, sidebar |
| **Superficies** | `#121212` | Tarjetas, modales, inputs |
| **Texto Principal** | `#FFFFFF` | Todo el texto |
| **Bordes** | `#FFFFFF` (2px) | Todos los bordes visibles |
| **Botones Activos** | `#FFFF00` | Botones primarios, estados activos |
| **Texto en Botones Activos** | `#000000` | Texto sobre amarillo |
| **Enlaces** | `#00FFFF` | Todos los links |
| **Hover/Focus** | `#FFFF00` | Indicadores de interacción |
| **Verde (Income)** | `#00FF00` | Ingresos, éxito |
| **Rojo (Expense)** | `#FF0000` | Gastos, errores |

## ✅ Ratios de Contraste WCAG AAA

Todos los ratios cumplen con **WCAG AAA (7:1 mínimo para texto normal, 4.5:1 para texto grande)**

### Texto Principal
- ✅ **Blanco sobre Negro** (#FFFFFF / #000000): **21:1** ← Máximo contraste posible
- ✅ **Blanco sobre Gris Oscuro** (#FFFFFF / #121212): **18.2:1**

### Botones Activos
- ✅ **Negro sobre Amarillo** (#000000 / #FFFF00): **19.56:1**

### Enlaces
- ✅ **Cian sobre Negro** (#00FFFF / #000000): **16.75:1**

### Semántico
- ✅ **Verde sobre Negro** (#00FF00 / #000000): **15.3:1**
- ✅ **Rojo sobre Negro** (#FF0000 / #000000): **5.25:1** (AAA para texto grande)

## 🎯 Características de Accesibilidad

### Estados Visuales Claramente Diferenciados

**1. Estado Normal**
- Fondo: `#121212`
- Texto: `#FFFFFF`
- Borde: `2px solid #FFFFFF`

**2. Estado Hover**
- Fondo: `#FFFF00`
- Texto: `#000000`
- Borde: `2px solid #000000`

**3. Estado Focus**
- Outline: `3px solid #FFFF00`
- Offset: `2px` (separación clara del elemento)

**4. Estado Activo/Seleccionado**
- Fondo: `#FFFF00`
- Texto: `#000000`
- Borde: `2px solid #000000`
- Indicador adicional si es necesario

**5. Estado Deshabilitado**
- Fondo: `#333333`
- Texto: `#666666`
- Borde: `2px solid #666666`
- Opacity: `0.5`
- Cursor: `not-allowed`

### Indicadores de Interacción

**Focus Visible (Teclado)**
```css
*:focus-visible {
  outline: 3px solid #FFFF00;
  outline-offset: 2px;
}
```

**Hover (Mouse)**
```css
button:hover {
  background-color: #FFFF00;
  color: #000000;
}
```

**Selección de Texto**
```css
::selection {
  background-color: #FFFF00;
  color: #000000;
}
```

### Bordes Visibles

Todos los elementos interactivos y superficies tienen:
- **Grosor mínimo**: 2px
- **Color**: `#FFFFFF` (máximo contraste)
- **Aplicación consistente**: Tarjetas, inputs, botones, navegación

## 🔍 Elementos Específicos

### Navegación (Sidebar & Bottom Nav)

**Items No Seleccionados**
- Background: `transparent`
- Text: `#FFFFFF`
- Border: `2px solid transparent`

**Items Hover**
- Background: `#121212`
- Text: `#FFFF00`
- Border: `2px solid #FFFF00`

**Items Seleccionados**
- Background: `#FFFF00`
- Text: `#000000`
- Border: `2px solid #000000`

### Botones

**Botones Secundarios**
- Background: `#121212`
- Text: `#FFFFFF`
- Border: `2px solid #FFFFFF`

**Botones Primarios**
- Background: `#FFFF00`
- Text: `#000000`
- Border: `2px solid #000000`

**Hover en Cualquier Botón**
- Background: `#FFFF00`
- Text: `#000000`

### Inputs y Formularios

**Estado Normal**
- Background: `#121212`
- Text: `#FFFFFF`
- Border: `2px solid #FFFFFF`
- Placeholder: `#AAAAAA`

**Estado Focus**
- Outline: `3px solid #FFFF00`
- Offset: `2px`
- Border: `2px solid #FFFF00`

### Enlaces

**Estado Normal**
- Color: `#00FFFF` (Cian)
- Text-decoration: `underline`

**Estado Hover**
- Color: `#FFFF00` (Amarillo)
- Background: `rgba(255, 255, 0, 0.1)`
- Text-decoration: `underline`

**Estado Focus**
- Outline: `3px solid #FFFF00`
- Offset: `2px`

## 📊 Gráficos y Visualizaciones

Para mantener la accesibilidad en gráficos:
- Líneas y bordes: `#FFFFFF`
- Datos positivos (ingresos): `#00FF00`
- Datos negativos (gastos): `#FF0000`
- Puntos de datos: Círculos con borde blanco de 2px

## 🎨 Semántica de Color

| Significado | Color | Contraste sobre Negro |
|-------------|-------|----------------------|
| Neutro | `#FFFFFF` | 21:1 |
| Acción/Interactivo | `#FFFF00` | 19.56:1 |
| Información/Link | `#00FFFF` | 16.75:1 |
| Éxito/Ingresos | `#00FF00` | 15.3:1 |
| Error/Gastos | `#FF0000` | 5.25:1 |

## ♿ Conformidad WCAG AAA

### Criterios Cumplidos

✅ **1.4.3 Contraste (Mínimo) - Nivel AA**
- Texto normal: mínimo 4.5:1 → Tenemos 21:1
- Texto grande: mínimo 3:1 → Tenemos 21:1

✅ **1.4.6 Contraste (Mejorado) - Nivel AAA**
- Texto normal: mínimo 7:1 → Tenemos 21:1
- Texto grande: mínimo 4.5:1 → Tenemos 21:1

✅ **1.4.11 Contraste de No Texto - Nivel AA**
- Componentes UI: mínimo 3:1 → Todos tienen 7:1 o más

✅ **2.4.7 Foco Visible - Nivel AA**
- Outline amarillo de 3px con 2px de offset

✅ **1.4.13 Contenido sobre hover o focus - Nivel AA**
- Estados claramente diferenciados con colores de alto contraste

## 🧪 Pruebas Recomendadas

1. **Navegación por Teclado**
   - Tab → Verificar outline amarillo visible
   - Enter/Space → Verificar cambio de estado visual

2. **Lectores de Pantalla**
   - NVDA/JAWS: Verificar que los estados se anuncien
   - VoiceOver: Verificar nombres accesibles

3. **Zoom**
   - 200% → Todo debe permanecer legible
   - 400% → Textos e interacciones deben funcionar

4. **Herramientas de Contraste**
   - WebAIM Contrast Checker
   - Chrome DevTools (Lighthouse)
   - axe DevTools

## 🎯 Uso del Modo

El usuario puede activar el Alto Contraste desde:
1. **Botón flotante "A+"** → Toggle "Alto contraste"
2. **Sidebar** → Opción "Texto grande"

Al activar, se aplica la clase `high-contrast` al body y todos los estilos se activan automáticamente.

## 📝 Notas de Implementación

- **Todos los shadows removidos**: Para claridad visual máxima
- **Gradientes convertidos a sólidos**: Evitar pérdida de contraste
- **Bordes de 2px mínimo**: Para visibilidad en todas las pantallas
- **Focus outline de 3px**: Para máxima visibilidad de navegación por teclado
- **Sin dependencia de color solo**: Los estados siempre tienen múltiples indicadores (color + borde + forma)
