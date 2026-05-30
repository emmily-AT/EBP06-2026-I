# API de Logros y Títulos

Este documento describe el formato de datos que el backend debe usar para enviar logros/títulos al frontend.

## Endpoint

```
GET /api/users/{userId}/achievements
```

## Formato de Respuesta

El backend debe devolver un array de objetos con la siguiente estructura:

```typescript
interface Achievement {
  id: string;              // ID único del logro
  title: string;           // Nombre del reconocimiento (longitud variable)
  description: string;     // Descripción del logro (longitud variable)
  badge?: string;          // Opcional: emoji o URL de imagen
  badgeType?: 'image' | 'emoji';  // Tipo de badge (por defecto 'emoji')
}
```

## Ejemplo de Respuesta JSON

```json
[
  {
    "id": "achievement_001",
    "title": "Primer Paso",
    "description": "Registraste tu primera transacción financiera y comenzaste tu viaje hacia la libertad financiera.",
    "badge": "🎯",
    "badgeType": "emoji"
  },
  {
    "id": "achievement_002",
    "title": "Ahorrista Consistente",
    "description": "Has mantenido un balance positivo durante 30 días consecutivos. ¡Tu disciplina está dando frutos!",
    "badge": "💰",
    "badgeType": "emoji"
  },
  {
    "id": "achievement_003",
    "title": "Experto en Inversiones",
    "description": "Completaste el curso avanzado de inversiones y obtuviste una calificación perfecta en todas las evaluaciones.",
    "badge": "https://example.com/badges/investment-expert.png",
    "badgeType": "image"
  }
]
```

## Campos

### `id` (requerido)
- Tipo: `string`
- Identificador único del logro
- Ejemplo: `"achievement_001"`, `"uuid-v4"`, etc.

### `title` (requerido)
- Tipo: `string`
- Nombre del reconocimiento/logro
- Soporta longitud variable
- Se muestra con fuente semibold en color morado (#3D2C8D)
- Ejemplo: `"Primer Paso"`, `"Maestro del Ahorro Premium"`, etc.

### `description` (requerido)
- Tipo: `string`
- Descripción detallada del logro
- Soporta longitud variable (se ajusta automáticamente)
- Se muestra en gris oscuro con line-height optimizado para lectura
- Puede ser corta o larga según necesites
- Ejemplo: `"Completaste tu primera meta de ahorro"` o textos más largos

### `badge` (opcional)
- Tipo: `string`
- Puede ser:
  - **Emoji**: Un emoji Unicode (🎯, 💰, 🏆, etc.)
  - **URL de imagen**: URL completa a una imagen (debe usar `badgeType: 'image'`)
- Si no se proporciona, la tarjeta se renderiza sin badge
- Ejemplo emoji: `"🏆"`
- Ejemplo imagen: `"https://cdn.example.com/badges/gold-star.png"`

### `badgeType` (opcional)
- Tipo: `'image' | 'emoji'`
- Por defecto: `'emoji'`
- Define cómo renderizar el badge:
  - `'emoji'`: Renderiza el badge como emoji en un contenedor con gradiente amarillo
  - `'image'`: Renderiza el badge como `<img>` con la URL proporcionada

## Notas de Implementación

1. **Flexibilidad**: El componente maneja automáticamente títulos y descripciones de cualquier longitud
2. **Responsive**: Las tarjetas se adaptan a diferentes tamaños de pantalla
3. **Opcionalidad**: El badge es completamente opcional - las tarjetas funcionan sin él
4. **Emojis**: Se recomienda usar emojis para consistencia visual con la app
5. **Imágenes**: Si usas imágenes, asegúrate de que sean:
   - Formato cuadrado preferiblemente
   - Tamaño recomendado: 48x48px o mayor
   - Formato: PNG con transparencia o SVG

## Ejemplo de Uso en el Frontend

El frontend consume estos datos así:

```typescript
// El hook automáticamente obtiene los logros
const { achievements, loading } = useAchievements(user?.id);

// Y los renderiza:
achievements.map((achievement) => (
  <AchievementCard
    key={achievement.id}
    title={achievement.title}
    description={achievement.description}
    badge={achievement.badge}
    badgeType={achievement.badgeType}
  />
))
```

## Gestión de Logros (Endpoints Adicionales)

### Agregar Logro
```
POST /api/users/{userId}/achievements
Content-Type: application/json

{
  "title": "Nuevo Logro",
  "description": "Descripción del logro",
  "badge": "🎉",
  "badgeType": "emoji"
}
```

### Actualizar Logro
```
PATCH /api/users/{userId}/achievements/{achievementId}
Content-Type: application/json

{
  "title": "Título Actualizado",
  "description": "Nueva descripción"
}
```

### Eliminar Logro
```
DELETE /api/users/{userId}/achievements/{achievementId}
```

## Estilos Visuales

Las tarjetas siguen la estética de la aplicación:
- **Fondo**: Blanco con bordes redondeados (rounded-2xl)
- **Borde**: Color morado claro (#D8D0F0)
- **Título**: Color morado (#3D2C8D), fuente semibold 17px
- **Descripción**: Color gris oscuro, fuente regular 14px
- **Badge**: Gradiente amarillo-dorado con el emoji/imagen centrado
- **Hover**: Sombra elevada para feedback interactivo

## Errores Comunes a Evitar

❌ **Incorrecto** - Títulos hardcodeados en el frontend
❌ **Incorrecto** - Descripciones con longitud fija
❌ **Incorrecto** - Badges obligatorios

✅ **Correcto** - Todo dinámico desde el backend
✅ **Correcto** - Soportar textos de cualquier longitud
✅ **Correcto** - Badge opcional
