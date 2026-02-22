/**
 * Steam-like XP Calculation System
 *
 * Based on Steam's actual leveling system (same as Zyon portfolio):
 * - XP required per level increases every 10 levels:
 *   - Levels 1-10:  100 XP per level
 *   - Levels 11-20: 200 XP per level
 *   - Levels 21-30: 300 XP per level
 *   - And so on... (+100 per bracket)
 */

/** XP required to go from `level` to `level + 1`. */
export function getXPRequiredForLevel(level: number): number {
  const bracket = Math.floor((level - 1) / 10) + 1;
  return bracket * 100;
}

/** Total cumulative XP required to reach a given level (from level 1). */
export function getTotalXPForLevel(targetLevel: number): number {
  let total = 0;
  for (let lvl = 1; lvl < targetLevel; lvl++) {
    total += getXPRequiredForLevel(lvl);
  }
  return total;
}

/** Derive the current level + progress from raw total XP. */
export function calculateLevelFromXP(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  totalXP: number;
} {
  let level = 1;
  let consumed = 0;

  while (level < 10_000) {
    const needed = getXPRequiredForLevel(level);
    if (consumed + needed > totalXP) {
      const current = totalXP - consumed;
      return {
        level,
        currentLevelXP: Math.floor(current),
        nextLevelXP: needed,
        progress: current / needed,
        totalXP,
      };
    }
    consumed += needed;
    level++;
  }

  return { level: 1, currentLevelXP: 0, nextLevelXP: 100, progress: 0, totalXP: 0 };
}

/**
 * Calculate total XP from all sources (same multipliers as Zyon portfolio).
 *
 * repos     × 100   — like "games owned"
 * followers ×  50   — community engagement
 * stars     ×  10   — recognition
 * years     × 500   — experience
 * achievementsXP    — variable (10-200 per achievement)
 */
export function calculateXPFromSources(sources: {
  repos: number;
  followers: number;
  stars: number;
  years: number;
  achievementsXP?: number;
}): number {
  return (
    sources.repos * 100 +
    sources.followers * 50 +
    sources.stars * 10 +
    sources.years * 500 +
    (sources.achievementsXP ?? 0)
  );
}
