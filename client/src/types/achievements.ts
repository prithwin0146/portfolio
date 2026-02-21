export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AchievementTrigger = 'auto' | 'scroll' | 'click' | 'time' | 'konami';

export interface VisitorAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  trigger: AchievementTrigger;
  triggerCondition?: string;
  rarity: AchievementRarity;
  xp: number;
}

export interface AchievementWithStatus extends VisitorAchievement {
  unlockedAt?: string;
}

export interface AchievementStats {
  achievements: AchievementWithStatus[];
  unlockedCount: number;
  totalCount: number;
  percentage: number;
  totalXP: number;
}
