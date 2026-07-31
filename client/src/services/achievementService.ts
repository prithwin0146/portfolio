import { ACHIEVEMENTS } from '../config/achievements.config';
import type { AchievementWithStatus, AchievementStats } from '../types/achievements';

const STORAGE_KEY = 'portfolio-achievements';
const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

type UnlockListener = (achievement: AchievementWithStatus) => void;

interface StoredData {
  [id: string]: string; // id -> ISO timestamp
}

let listeners: UnlockListener[] = [];
let visitedSections = new Set<string>();
let viewedProjects = new Set<string>();
let konamiProgress = 0;
let pageLoadTime = Date.now();
let totalScrollPixels = 0;

const MAIN_SECTIONS = ['about', 'services', 'projects', 'skills', 'contact'];

function loadStorage(): StoredData {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveStorage(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

function isUnlocked(id: string): boolean {
  return id in loadStorage();
}

export function unlockAchievement(id: string): void {
  if (isUnlocked(id)) return;

  const achievement = ACHIEVEMENTS.find((a) => a.id === id);
  if (!achievement) return;

  const data = loadStorage();
  const unlockedAt = new Date().toISOString();
  data[id] = unlockedAt;
  saveStorage(data);

  const withStatus: AchievementWithStatus = { ...achievement, unlocked: true, unlockedAt };

  // Dispatch custom event for toast
  window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: withStatus }));

  // Notify listeners
  listeners.forEach((cb) => cb(withStatus));

  // Check meta-achievements
  const unlockedCount = Object.keys(data).length;
  if (unlockedCount >= 10 && !isUnlocked('achievement-hunter')) {
    unlockAchievement('achievement-hunter');
  }
  if (unlockedCount >= ACHIEVEMENTS.length && !isUnlocked('completionist')) {
    unlockAchievement('completionist');
  }
}

export function getAchievementStats(): AchievementStats {
  const data = loadStorage();
  const achievements: AchievementWithStatus[] = ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: a.id in data,
    unlockedAt: data[a.id],
  }));
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  const totalXP = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  return { achievements, unlockedCount, totalCount, percentage, totalXP };
}

export function trackSectionVisit(sectionId: string): void {
  visitedSections.add(sectionId);

  if (sectionId === 'about' && !isUnlocked('detail-oriented')) {
    unlockAchievement('detail-oriented');
  }
  if (sectionId === 'skills' && !isUnlocked('tech-savvy')) {
    unlockAchievement('tech-savvy');
  }

  const allVisited = MAIN_SECTIONS.every((s) => visitedSections.has(s));
  if (allVisited && !isUnlocked('curious-mind')) {
    unlockAchievement('curious-mind');
  }

  // Speed reader — scroll to bottom within 30 seconds
  if (sectionId === 'contact') {
    const elapsed = Date.now() - pageLoadTime;
    if (elapsed < 30000 && !isUnlocked('speed-reader')) {
      unlockAchievement('speed-reader');
    }
  }
}

export function trackProjectView(projectId: string): void {
  viewedProjects.add(projectId);
}

export function trackProjectsSection(totalProjects: number): void {
  if (totalProjects > 0 && viewedProjects.size >= totalProjects && !isUnlocked('project-hunter')) {
    unlockAchievement('project-hunter');
  }
}

export function trackKonamiKey(key: string): void {
  if (key === KONAMI_SEQUENCE[konamiProgress]) {
    konamiProgress += 1;
    if (konamiProgress === KONAMI_SEQUENCE.length) {
      konamiProgress = 0;
      unlockAchievement('konami-master');
    }
  } else {
    konamiProgress = key === KONAMI_SEQUENCE[0] ? 1 : 0;
  }
}

export function trackLogoClick(): void {
  // Reserved for future click-based achievements
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function trackAchievementHover(_achievementId: string): void {
  // Reserved for future hover-based achievements
}

export function trackCommandPaletteUse(): void {
  if (!isUnlocked('command-pro')) {
    unlockAchievement('command-pro');
  }
}

/** New trackers for expanded achievements */

export function trackStatsView(): void {
  if (!isUnlocked('stats-enthusiast')) {
    unlockAchievement('stats-enthusiast');
  }
}

export function trackHobbiesView(): void {
  if (!isUnlocked('hobby-explorer')) {
    unlockAchievement('hobby-explorer');
  }
}

export function trackResumeView(): void {
  if (!isUnlocked('resume-reviewer')) {
    unlockAchievement('resume-reviewer');
  }
}

export function trackReplayWatch(): void {
  if (!isUnlocked('replay-watcher')) {
    unlockAchievement('replay-watcher');
  }
}

export function trackSocialClick(): void {
  if (!isUnlocked('social-butterfly')) {
    unlockAchievement('social-butterfly');
  }
}

export function trackScroll(deltaPixels: number): void {
  totalScrollPixels += Math.abs(deltaPixels);
  if (totalScrollPixels >= 10000 && !isUnlocked('scroll-master')) {
    unlockAchievement('scroll-master');
  }
}

export function onAchievementUnlock(callback: UnlockListener): () => void {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
}

export function initializeAchievementSystem(): void {
  pageLoadTime = Date.now();
  visitedSections = new Set();
  viewedProjects = new Set();
  konamiProgress = 0;
  totalScrollPixels = 0;

  // Auto-unlock first-steps
  if (!isUnlocked('first-steps')) {
    unlockAchievement('first-steps');
  }

  // Night owl — check time of day
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5 && !isUnlocked('night-owl')) {
    unlockAchievement('night-owl');
  }

  // Early bird — visit between 5 AM and 8 AM
  if (hour >= 5 && hour < 8 && !isUnlocked('early-bird')) {
    unlockAchievement('early-bird');
  }

  // Committed visitor — 2 minutes timer
  const committedTimer = setTimeout(() => {
    if (!isUnlocked('committed-visitor')) {
      unlockAchievement('committed-visitor');
    }
  }, 120000);

  // Scroll tracking
  let lastScrollY = window.scrollY;
  const onScroll = () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    trackScroll(delta);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Clean up timer if page unloads before firing
  window.addEventListener('beforeunload', () => {
    clearTimeout(committedTimer);
    window.removeEventListener('scroll', onScroll);
  }, { once: true });
}
