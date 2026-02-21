import type { CSSProperties } from 'react';

export interface LevelStyle {
  borderColor: string;
  glowColor: string;
  backgroundColor: string;
  name: string;
}

const levelTiers = [
  { min: 0,   max: 4,        name: 'Novice',       borderColor: '#898989', glowColor: 'rgba(137,137,137,0.3)', backgroundColor: 'rgba(137,137,137,0.1)' },
  { min: 5,   max: 9,        name: 'Apprentice',   borderColor: '#c0392b', glowColor: 'rgba(192,57,43,0.3)',   backgroundColor: 'rgba(192,57,43,0.1)' },
  { min: 10,  max: 14,       name: 'Intermediate', borderColor: '#e67e22', glowColor: 'rgba(230,126,34,0.3)',  backgroundColor: 'rgba(230,126,34,0.1)' },
  { min: 15,  max: 19,       name: 'Experienced',  borderColor: '#f1c40f', glowColor: 'rgba(241,196,15,0.3)',  backgroundColor: 'rgba(241,196,15,0.1)' },
  { min: 20,  max: 24,       name: 'Proficient',   borderColor: '#2ecc71', glowColor: 'rgba(46,204,113,0.3)',  backgroundColor: 'rgba(46,204,113,0.1)' },
  { min: 25,  max: 29,       name: 'Advanced',     borderColor: '#3498db', glowColor: 'rgba(52,152,219,0.3)',  backgroundColor: 'rgba(52,152,219,0.1)' },
  { min: 30,  max: 39,       name: 'Expert',       borderColor: '#9b59b6', glowColor: 'rgba(155,89,182,0.3)',  backgroundColor: 'rgba(155,89,182,0.1)' },
  { min: 40,  max: 49,       name: 'Master',       borderColor: '#e84393', glowColor: 'rgba(232,67,147,0.3)',  backgroundColor: 'rgba(232,67,147,0.1)' },
  { min: 50,  max: 99,       name: 'Grandmaster',  borderColor: '#6c63ff', glowColor: 'rgba(108,99,255,0.4)',  backgroundColor: 'rgba(108,99,255,0.15)' },
  { min: 100, max: Infinity, name: 'Legendary',    borderColor: '#ffd700', glowColor: 'rgba(255,215,0,0.5)',   backgroundColor: 'rgba(255,215,0,0.15)' },
];

/** 1 level per 50 XP */
export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.max(0, xp) / 50);
}

export function getLevelStyle(level: number): LevelStyle {
  const tier = levelTiers.find(t => level >= t.min && level <= t.max) ?? levelTiers[0];
  return {
    borderColor: tier.borderColor,
    glowColor: tier.glowColor,
    backgroundColor: tier.backgroundColor,
    name: tier.name,
  };
}

export function getXPForNextLevel(currentXP: number): { current: number; required: number; progress: number } {
  const xp = Math.max(0, currentXP);
  const level = getLevelFromXP(xp);
  const levelStartXP = level * 50;
  const current = xp - levelStartXP;
  const required = 50;
  const progress = Math.min(current / required, 1);
  return { current, required, progress };
}

export function getLevelBorderStyle(level: number): CSSProperties {
  const { borderColor, glowColor } = getLevelStyle(level);
  return {
    border: `2px solid ${borderColor}`,
    boxShadow: `0 0 12px ${glowColor}, 0 0 4px ${glowColor}`,
  };
}
