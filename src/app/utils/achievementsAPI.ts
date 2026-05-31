/**
 * Utilidades para gestionar logros/títulos.
 * En producción, estas funciones harían llamadas a tu API backend.
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge?: string;
  badgeType?: 'image' | 'emoji';
}

/**
 * Simula la obtención de logros desde el backend
 */
export async function fetchAchievements(userId: string): Promise<Achievement[]> {
  // En producción, esto sería:
  // const response = await fetch(`/api/users/${userId}/achievements`);
  // return response.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem(`achievements_${userId}`);
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        resolve([]);
      }
    }, 300); // Simular latencia de red
  });
}

/**
 * Simula agregar un nuevo logro desde el backend
 */
export async function addAchievement(
  userId: string,
  achievement: Omit<Achievement, 'id'>
): Promise<Achievement> {
  // En producción, esto sería:
  // const response = await fetch(`/api/users/${userId}/achievements`, {
  //   method: 'POST',
  //   body: JSON.stringify(achievement),
  // });
  // return response.json();

  return new Promise((resolve) => {
    setTimeout(() => {
      const newAchievement: Achievement = {
        ...achievement,
        id: Date.now().toString(),
      };

      const stored = localStorage.getItem(`achievements_${userId}`);
      const current = stored ? JSON.parse(stored) : [];
      const updated = [...current, newAchievement];

      localStorage.setItem(`achievements_${userId}`, JSON.stringify(updated));
      resolve(newAchievement);
    }, 300);
  });
}

/**
 * Simula actualizar un logro existente
 */
export async function updateAchievement(
  userId: string,
  achievementId: string,
  updates: Partial<Achievement>
): Promise<Achievement> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const stored = localStorage.getItem(`achievements_${userId}`);
      if (!stored) {
        reject(new Error('No achievements found'));
        return;
      }

      const current: Achievement[] = JSON.parse(stored);
      const index = current.findIndex((a) => a.id === achievementId);

      if (index === -1) {
        reject(new Error('Achievement not found'));
        return;
      }

      current[index] = { ...current[index], ...updates };
      localStorage.setItem(`achievements_${userId}`, JSON.stringify(current));
      resolve(current[index]);
    }, 300);
  });
}

/**
 * Simula eliminar un logro
 */
export async function deleteAchievement(
  userId: string,
  achievementId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const stored = localStorage.getItem(`achievements_${userId}`);
      if (!stored) {
        reject(new Error('No achievements found'));
        return;
      }

      const current: Achievement[] = JSON.parse(stored);
      const filtered = current.filter((a) => a.id !== achievementId);

      localStorage.setItem(`achievements_${userId}`, JSON.stringify(filtered));
      resolve();
    }, 300);
  });
}
