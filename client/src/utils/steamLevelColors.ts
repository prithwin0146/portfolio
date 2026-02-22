import type { CSSProperties } from 'react';
import { calculateLevelFromXP } from './steamXP';

export interface LevelStyle {
  borderColor: string;
  glowColor: string;
  backgroundColor: string;
  name: string;
  shimmer?: boolean;
  rainbow?: boolean;
  gradient?: string;
}

/**
 * Steam-style level tiers matching the Zyon portfolio.
 * Effects escalate every 5-10 levels: plain → gradient → glow → shimmer → rainbow.
 */
const levelTiers: Array<{
  min: number;
  max: number;
  name: string;
  borderColor: string;
  glowColor: string;
  backgroundColor: string;
  shimmer?: boolean;
  rainbow?: boolean;
  gradient?: string;
}> = [
  // 1-4   Gray — Novice
  { min: 0,   max: 4,   name: 'Novice',       borderColor: '#8B8B8B', glowColor: 'rgba(139,139,139,0.3)',  backgroundColor: 'rgba(139,139,139,0.08)' },
  // 5-9   Blue — Apprentice
  { min: 5,   max: 9,   name: 'Apprentice',   borderColor: '#4A90E2', glowColor: 'rgba(74,144,226,0.3)',   backgroundColor: 'rgba(74,144,226,0.08)',  gradient: 'linear-gradient(135deg,#4A90E2,#357ABD)' },
  // 10-14 Teal — Intermediate
  { min: 10,  max: 14,  name: 'Intermediate', borderColor: '#5BC0DE', glowColor: 'rgba(91,192,222,0.3)',   backgroundColor: 'rgba(91,192,222,0.08)',  gradient: 'linear-gradient(135deg,#5BC0DE,#31B0D5)' },
  // 15-19 Green — Experienced
  { min: 15,  max: 19,  name: 'Experienced',  borderColor: '#5CB85C', glowColor: 'rgba(92,184,92,0.3)',    backgroundColor: 'rgba(92,184,92,0.08)',   gradient: 'linear-gradient(135deg,#5CB85C,#4CAE4C)' },
  // 20-24 Lime — Proficient
  { min: 20,  max: 24,  name: 'Proficient',   borderColor: '#A4D007', glowColor: 'rgba(164,208,7,0.3)',    backgroundColor: 'rgba(164,208,7,0.08)',   gradient: 'linear-gradient(135deg,#A4D007,#8AB904)' },
  // 25-29 Orange — Advanced (glow)
  { min: 25,  max: 29,  name: 'Advanced',     borderColor: '#F39C12', glowColor: 'rgba(243,156,18,0.5)',   backgroundColor: 'rgba(243,156,18,0.1)',   gradient: 'linear-gradient(135deg,#F39C12,#E67E22)' },
  // 30-34 Red — Expert (glow)
  { min: 30,  max: 34,  name: 'Expert',       borderColor: '#E74C3C', glowColor: 'rgba(231,76,60,0.6)',    backgroundColor: 'rgba(231,76,60,0.1)',    gradient: 'linear-gradient(135deg,#E74C3C,#C0392B)' },
  // 35-39 Purple — Elite (glow)
  { min: 35,  max: 39,  name: 'Elite',        borderColor: '#9B59B6', glowColor: 'rgba(155,89,182,0.5)',   backgroundColor: 'rgba(155,89,182,0.1)',   gradient: 'linear-gradient(135deg,#9B59B6,#8E44AD)' },
  // 40-44 Pink — Master (glow)
  { min: 40,  max: 44,  name: 'Master',       borderColor: '#E91E63', glowColor: 'rgba(233,30,99,0.6)',    backgroundColor: 'rgba(233,30,99,0.1)',    gradient: 'linear-gradient(135deg,#E91E63,#C2185B)' },
  // 45-49 Gold — Grandmaster (glow)
  { min: 45,  max: 49,  name: 'Grandmaster',  borderColor: '#FFD700', glowColor: 'rgba(255,215,0,0.6)',    backgroundColor: 'rgba(255,215,0,0.1)',    gradient: 'linear-gradient(135deg,#FFD700,#FFA500)' },
  // 50-74 Platinum (shimmer)
  { min: 50,  max: 74,  name: 'Platinum',     borderColor: '#E5E4E2', glowColor: 'rgba(229,228,226,0.6)',  backgroundColor: 'rgba(229,228,226,0.1)',  gradient: 'linear-gradient(135deg,#E5E4E2,#BCC6CC,#E5E4E2)', shimmer: true },
  // 75-99 Diamond (shimmer)
  { min: 75,  max: 99,  name: 'Diamond',      borderColor: '#00D4FF', glowColor: 'rgba(0,212,255,0.7)',    backgroundColor: 'rgba(0,212,255,0.1)',    gradient: 'linear-gradient(135deg,#00D4FF,#0099CC)', shimmer: true },
  // 100-124 Emerald (shimmer)
  { min: 100, max: 124, name: 'Emerald',      borderColor: '#00FF88', glowColor: 'rgba(0,255,136,0.7)',    backgroundColor: 'rgba(0,255,136,0.1)',    gradient: 'linear-gradient(135deg,#00FF88,#00CC6A)', shimmer: true },
  // 125-149 Inferno (shimmer)
  { min: 125, max: 149, name: 'Inferno',      borderColor: '#FF8C00', glowColor: 'rgba(255,140,0,0.8)',    backgroundColor: 'rgba(255,140,0,0.12)',   gradient: 'linear-gradient(135deg,#FF8C00,#FF6347)', shimmer: true },
  // 150+ Legendary (rainbow)
  { min: 150, max: Infinity, name: 'Legendary', borderColor: '#ffd700', glowColor: 'rgba(255,215,0,0.8)', backgroundColor: 'rgba(255,215,0,0.15)', rainbow: true },
];

/** Use the Steam bracket system (from steamXP) to derive level from XP. */
export function getLevelFromXP(xp: number): number {
  return calculateLevelFromXP(xp).level;
}

export function getLevelStyle(level: number): LevelStyle {
  const tier = levelTiers.find((t) => level >= t.min && level <= t.max) ?? levelTiers[0];
  return {
    borderColor: tier.borderColor,
    glowColor: tier.glowColor,
    backgroundColor: tier.backgroundColor,
    name: tier.name,
    shimmer: tier.shimmer,
    rainbow: tier.rainbow,
    gradient: tier.gradient,
  };
}

/** XP breakdown for the current level (delegates to steamXP). */
export function getXPForNextLevel(currentXP: number): {
  current: number;
  required: number;
  progress: number;
} {
  const info = calculateLevelFromXP(currentXP);
  return {
    current: info.currentLevelXP,
    required: info.nextLevelXP,
    progress: info.progress,
  };
}

export function getLevelBorderStyle(level: number): CSSProperties {
  const { borderColor, glowColor } = getLevelStyle(level);
  return {
    border: `2px solid ${borderColor}`,
    boxShadow: `0 0 12px ${glowColor}, 0 0 4px ${glowColor}`,
  };
}
