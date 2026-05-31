import { useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge?: string;
  badgeType?: 'image' | 'emoji';
}

/**
 * Hook para obtener logros/títulos desde el backend (simulado con localStorage).
 * En producción, esto haría una llamada a una API.
 */
export function useAchievements(userId: string | undefined) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    // Simular carga desde backend
    const fetchAchievements = async () => {
      setLoading(true);

      // Intentar cargar desde localStorage primero
      const stored = localStorage.getItem(`achievements_${userId}`);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAchievements(parsed);
        } catch {
          setAchievements([]);
        }
      } else {
        // Si no hay datos guardados, crear algunos por defecto (simulando respuesta del backend)
        // En producción, esto vendría de: GET /api/users/{userId}/achievements
        const defaultAchievements: Achievement[] = [
          {
            id: '1',
            title: 'Primer Paso',
            description: 'Registraste tu primera transacción financiera y comenzaste tu viaje hacia la libertad financiera.',
            badge: '🎯',
            badgeType: 'emoji',
          },
          {
            id: '2',
            title: 'Ahorrista Consistente',
            description: 'Has mantenido un balance positivo durante 30 días consecutivos. ¡Tu disciplina está dando frutos!',
            badge: '💰',
            badgeType: 'emoji',
          },
          {
            id: '3',
            title: 'Maestro del Presupuesto',
            description: 'Creaste y seguiste tu primer presupuesto mensual sin excederte en ninguna categoría.',
            badge: '📊',
            badgeType: 'emoji',
          },
        ];

        setAchievements(defaultAchievements);
        localStorage.setItem(`achievements_${userId}`, JSON.stringify(defaultAchievements));
      }

      setLoading(false);
    };

    fetchAchievements();
  }, [userId]);

  return { achievements, loading };
}
