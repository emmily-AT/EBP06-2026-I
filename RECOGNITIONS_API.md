# API de Reconocimientos Financieros

Este documento describe el formato de datos que el backend debe usar para enviar los reconocimientos financieros al frontend.

## Endpoint

```
GET /api/users/{userId}/recognitions
```

## Formato de Respuesta

El backend debe devolver un array de objetos con la siguiente estructura:

```typescript
interface Recognition {
  id: string;                          // ID único del reconocimiento
  name: string;                        // Nombre del reconocimiento
  description: string;                 // Descripción del comportamiento financiero
  badge: string;                       // Emoji representativo
  tier: 'positive' | 'negative';       // Categoría del reconocimiento
  obtained: boolean;                   // Si el usuario lo ha obtenido
  obtainedAt?: string;                 // Fecha de obtención (ISO 8601)
}
```

## Ejemplo de Respuesta JSON

```json
[
  {
    "id": "rec_001",
    "name": "Modo adulto premium",
    "description": "Lograste el equilibrio entre responsabilidad, control y ahorro. Tu yo del pasado está orgulloso.",
    "badge": "👑",
    "tier": "positive",
    "obtained": true,
    "obtainedAt": "2026-05-15T10:30:00Z"
  },
  {
    "id": "rec_002",
    "name": "Tacañito profesional",
    "description": "Cada peso cuenta contigo. Encontraste la forma de ahorrar hasta en los pequeños gastos.",
    "badge": "💎",
    "tier": "positive",
    "obtained": true,
    "obtainedAt": "2026-04-20T14:15:00Z"
  },
  {
    "id": "rec_003",
    "name": "Guardián del presupuesto",
    "description": "Controlaste tus gastos con disciplina y evitaste salirte de los límites establecidos.",
    "badge": "🛡️",
    "tier": "positive",
    "obtained": false
  },
  {
    "id": "rec_004",
    "name": "Modo supervivencia",
    "description": "Tus finanzas están bajo presión. Es momento de recuperar estabilidad y crear un colchón financiero.",
    "badge": "⚠️",
    "tier": "negative",
    "obtained": false
  },
  {
    "id": "rec_005",
    "name": "Gasto sin freno",
    "description": "Los gastos impulsivos tomaron el volante. Tu billetera pide una pausa urgente.",
    "badge": "🚨",
    "tier": "negative",
    "obtained": false
  },
  {
    "id": "rec_006",
    "name": "El Desbordado",
    "description": "El caos financiero se expandió a múltiples áreas de tu presupuesto. Es hora de reorganizar prioridades y recuperar el equilibrio.",
    "badge": "💸",
    "tier": "negative",
    "obtained": false
  }
]
```

## Campos

### `id` (requerido)
- Tipo: `string`
- Identificador único del reconocimiento
- Ejemplo: `"rec_001"`, `"uuid-v4"`, etc.

### `name` (requerido)
- Tipo: `string`
- Nombre del reconocimiento
- Ejemplo: `"Modo adulto premium"`, `"Tacañito profesional"`, etc.

### `description` (requerido)
- Tipo: `string`
- Descripción del comportamiento financiero que representa
- Debe ser objetiva y clara
- Ejemplo: `"Lograste el equilibrio entre responsabilidad, control y ahorro..."`

### `badge` (requerido)
- Tipo: `string`
- Emoji representativo del reconocimiento
- Ejemplo: `"👑"`, `"💎"`, `"⚠️"`, etc.

### `tier` (requerido)
- Tipo: `'positive' | 'negative'`
- Categoría del reconocimiento:
  - `'positive'`: Reconocimientos que reflejan buenos hábitos financieros
  - `'negative'`: Reconocimientos de advertencia que requieren atención

### `obtained` (requerido)
- Tipo: `boolean`
- Indica si el usuario ha obtenido el reconocimiento
- `true`: El usuario cumple actualmente con los criterios
- `false`: El usuario no ha cumplido los criterios

### `obtainedAt` (opcional)
- Tipo: `string` (ISO 8601 date)
- Fecha en que el usuario obtuvo el reconocimiento
- Solo debe incluirse cuando `obtained: true`
- Ejemplo: `"2026-05-15T10:30:00Z"`

## Reconocimientos Predefinidos

El sistema debe incluir al menos estos reconocimientos:

### Positivos
1. **Modo adulto premium** (👑)
   - Equilibrio entre responsabilidad, control y ahorro
   
2. **Tacañito profesional** (💎)
   - Ahorro consistente en gastos pequeños
   
3. **Guardián del presupuesto** (🛡️)
   - Control disciplinado de gastos dentro del presupuesto

### Negativos (Advertencia)
4. **Modo supervivencia** (⚠️)
   - Finanzas bajo presión, necesidad de estabilidad
   
5. **Gasto sin freno** (🚨)
   - Gastos impulsivos frecuentes
   
6. **El Desbordado** (💸)
   - Caos financiero en múltiples categorías

## Lógica de Negocio (Recomendaciones)

El backend debe evaluar periódicamente los hábitos del usuario y actualizar el campo `obtained` según criterios específicos:

### Criterios Sugeridos

**Modo adulto premium:**
- Balance positivo durante 60+ días consecutivos
- Gastos dentro del presupuesto por 3+ meses
- Ahorro del 20%+ de ingresos

**Tacañito profesional:**
- Gastos promedio por transacción menores al promedio
- Al menos 10 transacciones de ahorro en el mes

**Guardián del presupuesto:**
- Sin exceder presupuesto en ninguna categoría por 30+ días
- Al menos 3 categorías activas con presupuesto

**Modo supervivencia:**
- Balance negativo durante 15+ días consecutivos
- Gastos > 95% de ingresos por 2+ meses

**Gasto sin freno:**
- Exceder presupuesto en 3+ categorías en el mismo mes
- Gastos > 120% de ingresos

**El Desbordado:**
- Exceder presupuesto en 5+ categorías
- Balance negativo por 30+ días

## Notas de Implementación

1. **Actualización periódica**: El sistema debe recalcular los reconocimientos diariamente o cuando ocurran cambios significativos.

2. **Múltiples reconocimientos activos**: Un usuario puede tener varios reconocimientos obtenidos simultáneamente.

3. **Historial**: Considerar mantener un historial de cuándo se obtuvieron y perdieron reconocimientos.

4. **Notificaciones**: Cuando un usuario obtiene un nuevo reconocimiento, considerar enviar una notificación.

5. **No son permanentes**: Los reconocimientos se pueden perder si los hábitos cambian (excepto si se decide mantener un historial permanente).

## Visualización en el Frontend

- **Reconocimientos obtenidos**: Se muestran con colores vivos, sombras y el badge completo
- **Reconocimientos no obtenidos**: Se muestran con opacidad reducida y estilo apagado
- **Positivos**: Gradientes amarillo/dorado para los obtenidos
- **Negativos**: Gradientes rojo/naranja para los obtenidos

## Estadísticas

El frontend calcula automáticamente:
- Total de reconocimientos obtenidos
- Total de reconocimientos pendientes
- Reconocimiento actual destacado (el primer positivo obtenido, o el primero obtenido)

## Diferencias con Logros

| Característica | Reconocimientos | Logros (sistema anterior) |
|----------------|-----------------|---------------------------|
| Propósito | Reflejar estado financiero actual | Celebrar hitos alcanzados |
| Permanencia | Temporal, pueden perderse | Permanentes una vez obtenidos |
| Tono | Objetivo, educativo | Motivacional, celebratorio |
| Negativos | Sí, incluye advertencias | No, solo positivos |
| Visualización | Pantalla dedicada con categorías | Tarjetas en perfil |
