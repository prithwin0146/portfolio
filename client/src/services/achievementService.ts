export interface AchievementStats {
  totalXP: number;
  unlockedCount: number;
}

const STORAGE_KEY = 'portfolio_achievements';

interface StoredData {
  totalXP?: number;
  unlockedCount?: number;
}

export function getAchievementStats(): AchievementStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { totalXP: 0, unlockedCount: 0 };
    const data = JSON.parse(raw) as StoredData;
    return {
      totalXP: typeof data.totalXP === 'number' ? data.totalXP : 0,
      unlockedCount: typeof data.unlockedCount === 'number' ? data.unlockedCount : 0,
    };
  } catch {
    return { totalXP: 0, unlockedCount: 0 };
  }
}
