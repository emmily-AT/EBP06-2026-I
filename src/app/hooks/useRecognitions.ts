import { useState, useEffect } from 'react';

export type RecognitionTier = 'positive' | 'negative';

export interface Recognition {
  id: string;
  name: string;
  description: string;
  badge: string;
  tier: RecognitionTier;
  obtained: boolean;
  obtainedAt?: string; // ISO date string
}

/**
 * Hook para obtener todos los reconocimientos financieros del usuario.
 * En producción, esto haría una llamada a: GET /api/users/{userId}/recognitions
 */
export function useRecognitions(userId: string | undefined) {
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRecognitions([]);
      setLoading(false);
      return;
    }

    const fetchRecognitions = async () => {
      setLoading(true);

      // Simular latencia de red
      await new Promise(resolve => setTimeout(resolve, 300));

      // Intentar cargar desde localStorage
      const stored = localStorage.getItem(`recognitions_${userId}`);

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRecognitions(parsed);
        } catch {
          setRecognitions(getDefaultRecognitions());
        }
      } else {
        // Datos por defecto
        const defaultRecognitions = getDefaultRecognitions();
        setRecognitions(defaultRecognitions);
        localStorage.setItem(`recognitions_${userId}`, JSON.stringify(defaultRecognitions));
      }

      setLoading(false);
    };

    fetchRecognitions();
  }, [userId]);

  const obtainedCount = recognitions.filter(r => r.obtained).length;
  const pendingCount = recognitions.filter(r => !r.obtained).length;
  const currentRecognition = recognitions.find(r => r.obtained && r.tier === 'positive') ||
                            recognitions.find(r => r.obtained);

  return {
    recognitions,
    loading,
    obtainedCount,
    pendingCount,
    currentRecognition
  };
}

function getDefaultRecognitions(): Recognition[] {
  return [
    {
      id: '1',
      name: 'Modo adulto premium',
      description: 'Lograste el equilibrio entre responsabilidad, control y ahorro. Tu yo del pasado está orgulloso.',
      badge: '👑',
      tier: 'positive',
      obtained: false,
    },
    {
      id: '2',
      name: 'Tacañito profesional',
      description: 'Cada peso cuenta contigo. Encontraste la forma de ahorrar hasta en los pequeños gastos.',
      badge: '💎',
      tier: 'positive',
      obtained: true,
      obtainedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Guardián del presupuesto',
      description: 'Controlaste tus gastos con disciplina y evitaste salirte de los límites establecidos.',
      badge: '🛡️',
      tier: 'positive',
      obtained: false,
    },
    {
      id: '4',
      name: 'Modo supervivencia',
      description: 'Tus finanzas están bajo presión. Es momento de recuperar estabilidad y crear un colchón financiero.',
      badge: '⚠️',
      tier: 'negative',
      obtained: false,
    },
    {
      id: '5',
      name: 'Gasto sin freno',
      description: 'Los gastos impulsivos tomaron el volante. Tu billetera pide una pausa urgente.',
      badge: '🚨',
      tier: 'negative',
      obtained: false,
    },
    {
      id: '6',
      name: 'El Desbordado',
      description: 'El caos financiero se expandió a múltiples áreas de tu presupuesto. Es hora de reorganizar prioridades y recuperar el equilibrio.',
      badge: '💸',
      tier: 'negative',
      obtained: false,
    },
  ];
}
