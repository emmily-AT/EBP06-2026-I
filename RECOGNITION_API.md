# API de Reconocimiento Financiero

Este documento describe el formato de datos que el backend debe usar para enviar el reconocimiento financiero destacado al frontend.

## Endpoint

```
GET /api/users/{userId}/recognition
```

## Formato de Respuesta

El backend debe devolver un único objeto (o `null` si no hay reconocimiento) con la siguiente estructura:

```typescript
interface Recognition {
  id: string;              // ID único del reconocimiento
  name: string;            // Nombre del reconocimiento (longitud variable)
  description: string;     // Descripción personalizada (longitud variable)
  badge?: string;          // Opcional: emoji o URL de imagen
  badgeType?: 'image' | 'emoji';  // Tipo de badge (por defecto 'emoji')
}
```

## Ejemplo de Respuesta JSON

### Con reconocimiento activo:

```json
{
  "id": "recognition_001",
  "name": "Ahorrador Elite 2026",
  "description": "Has demostrado una disciplina financiera excepcional durante todo el año, manteniendo consistencia en tus ahorros y superando todas tus metas mensuales.",
  "badge": "🏆",
  "badgeType": "emoji"
}
```

### Con imagen como badge:

```json
{
  "id": "recognition_002",
  "name": "Inversionista Certificado",
  "description": "Completaste exitosamente el programa de educación financiera avanzada y realizaste tu primera inversión estratégica.",
  "badge": "https://example.com/badges/investor-gold.png",
  "badgeType": "image"
}
```

### Sin reconocimiento activo:

```json
null
```

## Campos

### `id` (requerido)
- Tipo: `string`
- Identificador único del reconocimiento
- Ejemplo: `"recognition_001"`, `"uuid-v4"`, etc.

### `name` (requerido)
- Tipo: `string`
- Nombre del reconocimiento
- Soporta longitud variable (se adapta automáticamente)
- Se muestra con fuente semibold en color morado (#3D2C8D) tamaño 20-22px
- Ejemplo: `"Ahorrador Elite 2026"`, `"Maestro Financiero del Año"`, etc.

### `description` (requerido)
- Tipo: `string`
- Descripción personalizada del reconocimiento
- Soporta longitud variable (se ajusta automáticamente)
- Se muestra en gris oscuro con line-height optimizado para lectura
- Puede ser corta o larga según necesites
- Ejemplo: `"Has demostrado..."` o textos más largos

### `badge` (opcional)
- Tipo: `string`
- Puede ser:
  - **Emoji**: Un emoji Unicode (🏆, 💰, 🎖️, ⭐, etc.)
  - **URL de imagen**: URL completa a una imagen (debe usar `badgeType: 'image'`)
- Si no se proporciona, la tarjeta se renderiza sin badge
- Ejemplo emoji: `"🏆"`
- Ejemplo imagen: `"https://cdn.example.com/badges/gold-trophy.png"`

### `badgeType` (opcional)
- Tipo: `'image' | 'emoji'`
- Por defecto: `'emoji'`
- Define cómo renderizar el badge:
  - `'emoji'`: Renderiza el badge como emoji en un contenedor circular con gradiente amarillo-dorado (80x80px)
  - `'image'`: Renderiza el badge como `<img>` con la URL proporcionada en un círculo de 80x80px

## Notas de Implementación

1. **Un solo reconocimiento**: A diferencia del sistema anterior de múltiples logros, este endpoint devuelve UN SOLO reconocimiento destacado.
2. **Null cuando no hay reconocimiento**: Si el usuario no tiene reconocimiento activo, el backend debe devolver `null`, no un array vacío.
3. **Flexibilidad**: El componente maneja automáticamente nombres y descripciones de cualquier longitud.
4. **Responsive**: La tarjeta se adapta a diferentes tamaños de pantalla.
5. **Badge opcional**: El badge es completamente opcional - la tarjeta funciona sin él.
6. **Imágenes**: Si usas imágenes para badges, asegúrate de que sean:
   - Formato cuadrado preferiblemente
   - Tamaño recomendado: 80x80px o mayor
   - Formato: PNG con transparencia o SVG

## Ejemplo de Uso en el Frontend

El frontend consume estos datos así:

```typescript
// El hook automáticamente obtiene el reconocimiento
const { recognition, loading } = useRecognition(user?.id);

// Si existe, lo renderiza:
{recognition && (
  <RecognitionCard
    name={recognition.name}
    description={recognition.description}
    badge={recognition.badge}
    badgeType={recognition.badgeType}
  />
)}
```

## Gestión del Reconocimiento (Endpoints Adicionales)

### Crear o Actualizar Reconocimiento
```
PUT /api/users/{userId}/recognition
Content-Type: application/json

{
  "name": "Ahorrador del Mes",
  "description": "Tu dedicación ha dado frutos este mes",
  "badge": "🌟",
  "badgeType": "emoji"
}
```

### Eliminar Reconocimiento
```
DELETE /api/users/{userId}/recognition
```

## Estilos Visuales

La tarjeta sigue la estética de la aplicación:
- **Fondo**: Blanco con bordes redondeados (rounded-2xl)
- **Borde**: Color morado claro (#D8D0F0)
- **Nombre**: Color morado (#3D2C8D), fuente semibold 20-22px
- **Descripción**: Color gris oscuro, fuente regular 15-16px
- **Badge**: Gradiente amarillo-dorado (emoji) o imagen circular
- **Hover**: Sombra elevada para feedback interactivo
- **Layout**: Horizontal en desktop (badge a la izquierda), vertical en mobile

## Diferencias con el Sistema Anterior

| Característica | Sistema Anterior (Logros) | Sistema Nuevo (Reconocimiento) |
|----------------|---------------------------|--------------------------------|
| Cantidad | Múltiples logros en array | Un solo reconocimiento |
| Endpoint | `/achievements` | `/recognition` |
| Respuesta vacía | Array vacío `[]` | `null` |
| Campo título | `title` | `name` |
| Visualización | Lista de tarjetas pequeñas | Tarjeta destacada grande |
| Badge | Pequeño (48x48px) | Grande (80x80px) |

## Errores Comunes a Evitar

❌ **Incorrecto** - Devolver un array
❌ **Incorrecto** - Devolver array vacío cuando no hay reconocimiento
❌ **Incorrecto** - Nombres o descripciones hardcodeados en el frontend

✅ **Correcto** - Devolver un objeto o `null`
✅ **Correcto** - Todo dinámico desde el backend
✅ **Correcto** - Soportar textos de cualquier longitud
