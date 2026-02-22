/**
 * useGitHubXP — shared hook that fetches live GitHub stats,
 * combines them with achievement XP, and computes the Steam-style level.
 *
 * Every component that needs XP / level data should use this hook.
 * Achievement unlocks trigger a real-time re-calculation.
 */

import { useEffect, useState, useCallback } from 'react';
import { fetchUserProfile, getRepoStats } from '../services/github';
import { getAchievementStats } from '../services/achievementService';
import { calculateXPFromSources, calculateLevelFromXP } from '../utils/steamXP';
import { getLevelStyle } from '../utils/steamLevelColors';
import { YEARS_OF_EXPERIENCE, deriveTopLanguages } from '../config/github.config';
import type { GitHubStatsData } from '../config/github.config';

export interface GitHubXPState {
  /** Raw GitHub numbers */
  repos: number;
  followers: number;
  stars: number;
  forks: number;
  activePercent: number;
  topLanguages: GitHubStatsData['topLanguages'];
  yearsOfExperience: number;

  /** Achievement system */
  achievementsXP: number;
  achievementsUnlocked: number;
  achievementsTotal: number;

  /** Derived XP / Level */
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  tierName: string;
  borderColor: string;
  glowColor: string;

  /** Loading state */
  loading: boolean;
}

export function useGitHubXP(): GitHubXPState {
  const [repos, setRepos] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [stars, setStars] = useState(0);
  const [forks, setForks] = useState(0);
  const [activePercent, setActivePercent] = useState(0);
  const [topLanguages, setTopLanguages] = useState<GitHubStatsData['topLanguages']>([]);
  const [achievementsXP, setAchievementsXP] = useState(() => getAchievementStats().totalXP);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState(() => getAchievementStats().unlockedCount);
  const [achievementsTotal] = useState(() => getAchievementStats().totalCount);
  const [loading, setLoading] = useState(true);

  // Fetch live GitHub data once
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profile, repoStats] = await Promise.all([
          fetchUserProfile(),
          getRepoStats(),
        ]);

        if (cancelled) return;

        if (profile) {
          setRepos(profile.public_repos);
          setFollowers(profile.followers);
        }
        if (repoStats) {
          setStars(repoStats.totalStars);
          setForks(repoStats.totalForks);
          const totalRepos = profile?.public_repos ?? 0;
          setActivePercent(totalRepos > 0 ? Math.round((repoStats.activeRepos / totalRepos) * 100) : 0);
          setTopLanguages(deriveTopLanguages(repoStats.languages));
        }
      } catch (err) {
        console.error('Failed to load GitHub stats:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Listen for achievement unlocks → update XP in real-time
  const refreshAchievements = useCallback(() => {
    const stats = getAchievementStats();
    setAchievementsXP(stats.totalXP);
    setAchievementsUnlocked(stats.unlockedCount);
  }, []);

  useEffect(() => {
    window.addEventListener('achievement-unlocked', refreshAchievements);
    return () => window.removeEventListener('achievement-unlocked', refreshAchievements);
  }, [refreshAchievements]);

  // Derived calculations
  const totalXP = calculateXPFromSources({
    repos,
    followers,
    stars,
    years: YEARS_OF_EXPERIENCE,
    achievementsXP,
  });

  const levelInfo = calculateLevelFromXP(totalXP);
  const style = getLevelStyle(levelInfo.level);

  return {
    repos,
    followers,
    stars,
    forks,
    activePercent,
    topLanguages,
    yearsOfExperience: YEARS_OF_EXPERIENCE,

    achievementsXP,
    achievementsUnlocked,
    achievementsTotal,

    totalXP,
    level: levelInfo.level,
    currentLevelXP: levelInfo.currentLevelXP,
    nextLevelXP: levelInfo.nextLevelXP,
    progress: levelInfo.progress,
    tierName: style.name,
    borderColor: style.borderColor,
    glowColor: style.glowColor,

    loading,
  };
}
