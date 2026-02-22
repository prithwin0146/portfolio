export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  category: string;
  rarity: AchievementRarity;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementStats {
  achievements: AchievementWithStatus[];
  unlockedCount: number;
  totalCount: number;
  percentage: number;
  totalXP: number;
}
