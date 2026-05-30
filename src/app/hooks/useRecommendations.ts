import { useState, useEffect, useCallback } from 'react';

export interface Recommendation {
  id: string;
  icon: string; // Emoji o nombre del ícono
  title: string;
  description: string;
  createdAt?: string; // Fecha de creación de la recomendación
}

/**
 * Hook para obtener recomendaciones financieras personalizadas del usuario.
 * En producción, esto haría una llamada a: GET /api/users/{userId}/recommendations
 */
export function useRecommendations(userId: string | undefined, onNewRecommendation?: (recommendation: Recommendation) => void) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);

      // Simular latencia de red
      await new Promise(resolve => setTimeout(resolve, 300));

      // En producción, esto haría:
      // const response = await fetch(`/api/users/${userId}/recommendations`);
      // const data = await response.json();

      // Obtener recomendaciones previas de localStorage
      const stored = localStorage.getItem(`recommendations_${userId}`);
      const previousRecommendations: Recommendation[] = stored ? JSON.parse(stored) : [];

      // Por ahora, devolver array vacío (sin datos de ejemplo)
      // const newRecommendations: Recommendation[] = data;
      const newRecommendations: Recommendation[] = [];

      // Detectar nuevas recomendaciones comparando con las anteriores
      if (onNewRecommendation) {
        const previousIds = new Set(previousRecommendations.map(r => r.id));
        newRecommendations.forEach(recommendation => {
          if (!previousIds.has(recommendation.id)) {
            onNewRecommendation(recommendation);
          }
        });
      }

      // Guardar en localStorage
      localStorage.setItem(`recommendations_${userId}`, JSON.stringify(newRecommendations));

      setRecommendations(newRecommendations);
      setLoading(false);
    };

    fetchRecommendations();
  }, [userId, onNewRecommendation]);

  return {
    recommendations,
    loading
  };
}
