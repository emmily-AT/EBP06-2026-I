# API de Recomendaciones Financieras

Este documento describe el formato de datos que el backend debe usar para enviar las recomendaciones financieras personalizadas al frontend.

## Endpoint

```
GET /api/users/{userId}/recommendations
```

## Formato de Respuesta

El backend debe devolver un array de objetos con la siguiente estructura:

```typescript
interface Recommendation {
  id: string;          // ID único de la recomendación
  icon: string;        // Nombre del ícono de lucide-react o emoji
  title: string;       // Título de la recomendación
  description: string; // Descripción detallada de la recomendación
  createdAt?: string;  // Fecha de creación de la recomendación (ISO 8601)
}
```

## Ejemplo de Respuesta JSON

```json
[
  {
    "id": "rec_001",
    "icon": "TrendingDown",
    "title": "Reduce gastos en entretenimiento",
    "description": "Has gastado un 25% más en entretenimiento este mes. Considera reducir salidas para mejorar tu balance.",
    "createdAt": "2026-05-30T10:30:00Z"
  },
  {
    "id": "rec_002",
    "icon": "PiggyBank",
    "title": "Crea un fondo de emergencia",
    "description": "No tienes ahorros registrados. Intenta separar al menos el 10% de tus ingresos mensuales.",
    "createdAt": "2026-05-30T10:30:00Z"
  },
  {
    "id": "rec_003",
    "icon": "💡",
    "title": "Revisa tu presupuesto de transporte",
    "description": "Tus gastos de transporte han aumentado. Evalúa opciones más económicas como transporte público.",
    "createdAt": "2026-05-30T10:30:00Z"
  }
]
```

## Campos

### `id` (requerido)
- Tipo: `string`
- Identificador único de la recomendación
- Ejemplo: `"rec_001"`, `"uuid-v4"`, etc.

### `icon` (requerido)
- Tipo: `string`
- Puede ser:
  - Nombre de un ícono de lucide-react (PascalCase): `"TrendingDown"`, `"PiggyBank"`, `"Target"`, etc.
  - Emoji: `"💡"`, `"📊"`, `"💰"`, etc.
- Si no se encuentra el ícono, se mostrará un ícono de bombilla por defecto
- Ejemplos de íconos útiles:
  - Finanzas: `"DollarSign"`, `"TrendingUp"`, `"TrendingDown"`, `"PiggyBank"`
  - Alertas: `"AlertTriangle"`, `"AlertCircle"`, `"Info"`
  - Objetivos: `"Target"`, `"CheckCircle"`, `"Award"`
  - Gráficos: `"BarChart"`, `"LineChart"`, `"PieChart"`

### `title` (requerido)
- Tipo: `string`
- Título corto y claro de la recomendación
- Debe ser directo y orientado a la acción
- Ejemplo: `"Reduce gastos en entretenimiento"`, `"Crea un fondo de emergencia"`

### `description` (requerido)
- Tipo: `string`
- Descripción detallada de la recomendación
- Debe explicar el contexto y el beneficio de seguir la recomendación
- Ejemplo: `"Has gastado un 25% más en entretenimiento este mes. Considera reducir salidas para mejorar tu balance."`

### `createdAt` (opcional)
- Tipo: `string` (ISO 8601 date)
- Fecha y hora de creación de la recomendación
- Útil para ordenar recomendaciones por antigüedad
- Usado internamente para detectar nuevas recomendaciones y generar notificaciones
- Ejemplo: `"2026-05-30T10:30:00Z"`

## Lógica de Negocio (Recomendaciones)

El backend debe analizar los datos financieros del usuario y generar recomendaciones personalizadas basadas en:

### Análisis de Patrones
- Gastos excesivos en categorías específicas
- Falta de ahorro o fondos de emergencia
- Presupuestos superados consistentemente
- Desequilibrio entre ingresos y gastos

### Tipos de Recomendaciones

**Reducción de gastos:**
- Identificar categorías con gastos crecientes
- Sugerir alternativas más económicas
- Alertar sobre gastos innecesarios

**Ahorro y planificación:**
- Sugerir crear o incrementar ahorros
- Recomendar distribución de ingresos
- Proponer metas de ahorro

**Optimización de presupuesto:**
- Ajustar presupuestos según historial
- Reasignar recursos a categorías más importantes
- Sugerir nuevas categorías de presupuesto

**Educación financiera:**
- Consejos sobre mejores prácticas
- Información sobre control de gastos
- Estrategias de administración

## Priorización

Las recomendaciones deben ordenarse por prioridad:

1. **Alta prioridad**: Problemas urgentes (deuda, gastos excesivos, falta de ahorros)
2. **Media prioridad**: Mejoras significativas (optimización de presupuesto, reducción de gastos)
3. **Baja prioridad**: Consejos generales (educación financiera, mejoras menores)

## Cantidad de Recomendaciones

- **Recomendado**: 3-5 recomendaciones activas
- **Mínimo**: 0 (usuario nuevo o sin datos suficientes)
- **Máximo**: 8 (evitar sobrecarga de información)

## Actualización

- Las recomendaciones deben actualizarse periódicamente (diariamente o semanalmente)
- Retirar recomendaciones que ya no son relevantes
- Añadir nuevas recomendaciones basadas en cambios en el comportamiento financiero

## Estado Vacío

Cuando no hay recomendaciones disponibles:
- Usuario nuevo sin suficientes datos
- Usuario con comportamiento financiero óptimo
- Sistema en proceso de análisis

El frontend muestra automáticamente un mensaje apropiado cuando `recommendations` es un array vacío.

## Visualización en el Frontend

- **Con recomendaciones**: Tarjetas apiladas verticalmente con ícono, título y descripción
- **Sin recomendaciones**: Estado vacío con mensaje informativo
- **Durante carga**: Indicador de carga
- **Diseño**: Tarjetas blancas con borde suave, ícono en círculo con gradiente púrpura, hover con sombra

## Notas de Implementación

1. **Personalización**: Las recomendaciones deben ser específicas al usuario, no genéricas
2. **Contexto**: Incluir datos concretos cuando sea posible (porcentajes, montos, comparaciones)
3. **Tono**: Constructivo y orientado a soluciones, no crítico
4. **Acción**: Cada recomendación debe sugerir un paso concreto
5. **Privacidad**: No incluir información sensible en las recomendaciones

## Integración con Notificaciones

El sistema de recomendaciones está integrado con el sistema de notificaciones de la aplicación:

### Detección de Nuevas Recomendaciones

- El frontend compara automáticamente las recomendaciones recibidas con las almacenadas previamente en localStorage
- Si se detecta una nueva recomendación (ID no existente previamente), se genera automáticamente una notificación

### Formato de Notificación

```typescript
{
  message: `Nueva recomendación: ${recommendation.title}`,
  type: 'recommendation',
  recommendationId: recommendation.id,
}
```

### Comportamiento de Notificaciones

- **Campana de notificaciones**: Se muestra un badge de notificación no leída
- **Interacción**: Al hacer clic en la notificación, el usuario es redirigido al perfil
- **Resaltado**: La recomendación correspondiente se resalta visualmente y se hace scroll automático hacia ella
- **Persistencia**: Las recomendaciones permanecen visibles incluso después de leer la notificación
- **Múltiples notificaciones**: Pueden existir notificaciones para múltiples recomendaciones simultáneamente

### Consideraciones para el Backend

- No es necesario enviar notificaciones push desde el backend
- El frontend detecta cambios comparando el contenido actual con el anterior
- Importante: mantener IDs únicos y estables para cada recomendación
- Si una recomendación se actualiza pero mantiene el mismo ID, no se genera nueva notificación

## Diferencias con Reconocimientos

| Característica | Recomendaciones | Reconocimientos |
|----------------|-----------------|-----------------|
| Propósito | Guiar acciones futuras | Reflejar estado actual |
| Temporalidad | Dinámicas y cambiantes | Más estables |
| Tono | Sugerencias constructivas | Evaluación objetiva |
| Cantidad | Variable (0-8) | Fija (6 tipos) |
| Ubicación | Perfil (tarjetas) | Pantalla dedicada |
| Notificaciones | Sí, automáticas | No |
