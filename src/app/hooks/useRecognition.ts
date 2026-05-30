import { useState, useEffect } from 'react';

export interface Recognition {
  id: string;
  name: string;
  description: string;
  badge?: string;
  badgeType?: 'image' | 'emoji';
}

/**
 * Hook para obtener el reconocimiento financiero desde el backend (simulado con localStorage).
 * En producción, esto haría una llamada a: GET /api/users/{userId}/recognition
 *
 * Retorna un único reconocimiento destacado o null si no hay ninguno.
 */
export function useRecognition(userId: string | undefined) {
  const [recognition, setRecognition] = useState<Recognition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRecognition(null);
      setLoading(false);
      return;
    }

    // Simular carga desde backend
    const fetchRecognition = async () => {
      setLoading(true);

      // Simular latencia de red
      await new Promise(resolve => setTimeout(resolve, 300));

      // Intentar cargar desde localStorage
      const stored = localStorage.getItem(`recognition_${userId}`);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRecognition(parsed);
        } catch {
          setRecognition(null);
        }
      } else {
        // Si no hay datos guardados, no mostrar nada
        // En producción, el backend retornaría null o un objeto
        setRecognition(null);
      }

      setLoading(false);
    };

    fetchRecognition();
  }, [userId]);

  return { recognition, loading };
}
