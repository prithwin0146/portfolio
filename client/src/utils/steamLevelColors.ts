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
  // 0-9   Grey
  { min: 0,   max: 9,   name: 'Novice',       borderColor: '#9b9b9b', glowColor: 'rgba(155,155,155,0.3)',  backgroundColor: 'rgba(155,155,155,0.08)' },
  // 10-19 Red
  { min: 10,  max: 19,  name: 'Apprentice',   borderColor: '#c02942', glowColor: 'rgba(192,41,66,0.3)',    backgroundColor: 'rgba(192,41,66,0.08)' },
  // 20-29 Orange
  { min: 20,  max: 29,  name: 'Intermediate', borderColor: '#d95b43', glowColor: 'rgba(217,91,67,0.3)',    backgroundColor: 'rgba(217,91,67,0.08)' },
  // 30-39 Yellow
  { min: 30,  max: 39,  name: 'Experienced',  borderColor: '#ecd078', glowColor: 'rgba(236,208,120,0.3)',  backgroundColor: 'rgba(236,208,120,0.08)' },
  // 40-49 Green
  { min: 40,  max: 49,  name: 'Proficient',   borderColor: '#54a54b', glowColor: 'rgba(84,165,75,0.3)',    backgroundColor: 'rgba(84,165,75,0.08)' },
  // 50-59 Blue
  { min: 50,  max: 59,  name: 'Advanced',     borderColor: '#3381a5', glowColor: 'rgba(51,129,165,0.4)',   backgroundColor: 'rgba(51,129,165,0.1)' },
  // 60-69 Purple
  { min: 60,  max: 69,  name: 'Expert',       borderColor: '#824ca0', glowColor: 'rgba(130,76,160,0.4)',   backgroundColor: 'rgba(130,76,160,0.1)' },
  // 70-79 Pink
  { min: 70,  max: 79,  name: 'Elite',        borderColor: '#c4538d', glowColor: 'rgba(196,83,141,0.4)',   backgroundColor: 'rgba(196,83,141,0.1)' },
  // 80-89 Maroon
  { min: 80,  max: 89,  name: 'Master',       borderColor: '#8e3544', glowColor: 'rgba(142,53,68,0.5)',    backgroundColor: 'rgba(142,53,68,0.1)' },
  // 90-99 Bronze
  { min: 90,  max: 99,  name: 'Grandmaster',  borderColor: '#987556', glowColor: 'rgba(152,117,86,0.5)',   backgroundColor: 'rgba(152,117,86,0.1)' },
  // 100+ Legendary (shimmer)
  { min: 100, max: Infinity, name: 'Legendary', borderColor: '#e1e1e1', glowColor: 'rgba(225,225,225,0.7)', backgroundColor: 'rgba(225,225,225,0.15)', shimmer: true, gradient: 'linear-gradient(135deg,#e1e1e1,#b0b0b0,#e1e1e1)' },
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
