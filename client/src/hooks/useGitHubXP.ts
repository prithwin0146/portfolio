/**
 * useGitHubXP — shared hook that fetches live GitHub stats,
 * combines them with achievement XP, and computes the Steam-style level.
 *
 * Every component that needs XP / level data should use this hook.
 * Achievement unlocks trigger a real-time re-calculation.
 */

import { useEffect, useState, useCallback } from 'react';
import { fetchUserProfile, getRepoStats, fetchLiveActivity } from '../services/github';
import { getAchievementStats } from '../services/achievementService';
import { calculateXPFromSources, calculateLevelFromXP } from '../utils/steamXP';
import { getLevelStyle } from '../utils/steamLevelColors';
import { YEARS_OF_EXPERIENCE, deriveTopLanguages } from '../config/github.config';
import type { GitHubStatsData } from '../config/github.config';

export interface GitHubXPState {
  /** Raw GitHub numbers */
  repos: number;
  followers: number;
  following: number;
  memberSince: number;    // year (e.g. 2021)
  stars: number;
  forks: number;
  activePercent: number;
  topLanguages: GitHubStatsData['topLanguages'];
  yearsOfExperience: number;

  /** Live activity */
  lastPushAt: string;        // ISO timestamp
  commitsLastMonth: number;

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
  const [following, setFollowing] = useState(0);
  const [memberSince, setMemberSince] = useState(0);
  const [stars, setStars] = useState(0);
  const [forks, setForks] = useState(0);
  const [activePercent, setActivePercent] = useState(0);
  const [topLanguages, setTopLanguages] = useState<GitHubStatsData['topLanguages']>([]);
  const [lastPushAt, setLastPushAt] = useState('');
  const [commitsLastMonth, setCommitsLastMonth] = useState(0);
  const [achievementsXP, setAchievementsXP] = useState(() => getAchievementStats().totalXP);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState(() => getAchievementStats().unlockedCount);
  const [achievementsTotal] = useState(() => getAchievementStats().totalCount);
  const [loading, setLoading] = useState(true);

  // Fetch live GitHub data once
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profile, repoStats, liveActivity] = await Promise.all([
          fetchUserProfile(),
          getRepoStats(),
          fetchLiveActivity(),
        ]);

        if (cancelled) return;

        if (profile) {
          setRepos(profile.public_repos);
          setFollowers(profile.followers);
          setFollowing(profile.following);
          if (profile.createdAt) {
            setMemberSince(new Date(profile.createdAt).getFullYear());
          }
        }
        if (repoStats) {
          setStars(repoStats.totalStars);
          setForks(repoStats.totalForks);
          const totalRepos = profile?.public_repos ?? 0;
          setActivePercent(totalRepos > 0 ? Math.round((repoStats.activeRepos / totalRepos) * 100) : 0);
          setTopLanguages(deriveTopLanguages(repoStats.languages));
        }
        if (liveActivity) {
          setLastPushAt(liveActivity.lastPushAt);
          setCommitsLastMonth(liveActivity.commitsLastMonth);
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
    following,
    memberSince,
    stars,
    forks,
    activePercent,
    topLanguages,
    yearsOfExperience: YEARS_OF_EXPERIENCE,

    lastPushAt,
    commitsLastMonth,

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
