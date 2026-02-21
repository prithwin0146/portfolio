import { useEffect, useState, useMemo, useCallback } from 'react';
import { getAchievementStats } from '../../services/achievementService';
import type { AchievementWithStatus } from '../../types/achievements';
import styles from './AchievementModal.module.css';

interface AchievementModalProps {
  open: boolean;
  onClose: () => void;
}

type Filter = 'all' | 'unlocked' | 'locked';

export default function AchievementModal({ open, onClose }: AchievementModalProps) {
  const [stats, setStats] = useState(() => getAchievementStats());
  const [filter, setFilter] = useState<Filter>('all');
  const [animating, setAnimating] = useState(false);

  const refreshStats = useCallback(() => setStats(getAchievementStats()), []);

  useEffect(() => {
    if (!open) return;
    setAnimating(true);
    refreshStats();
    const handler = () => refreshStats();
    window.addEventListener('achievement-unlocked', handler);
    return () => window.removeEventListener('achievement-unlocked', handler);
  }, [open, refreshStats]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  const unlockedCount = stats.unlockedCount;
  const lockedCount = stats.totalCount - stats.unlockedCount;

  const filtered = useMemo(() => {
    if (filter === 'unlocked') return stats.achievements.filter((a: AchievementWithStatus) => a.unlocked);
    if (filter === 'locked') return stats.achievements.filter((a: AchievementWithStatus) => !a.unlocked);
    return stats.achievements;
  }, [stats.achievements, filter]);

  if (!open) return null;

  return (
    <div
      className={`${styles.overlay} ${animating ? styles.overlayVisible : ''}`}
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>🏆</span>
            <div>
              <h2 className={styles.headerTitle}>Visitor Achievements</h2>
              <p className={styles.headerSub}>
                {unlockedCount} / {stats.totalCount} Unlocked ({stats.percentage}%) &bull; {stats.totalXP} XP Earned
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Satirical tab filters */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${filter === 'all' ? styles.tabActive : ''}`}
            onClick={() => setFilter('all')}
          >
            Everything <span className={styles.tabHint}>(Overwhelming)</span>{' '}
            <span className={styles.tabCount}>{stats.totalCount}</span>
          </button>
          <button
            className={`${styles.tab} ${filter === 'unlocked' ? styles.tabActive : ''}`}
            onClick={() => setFilter('unlocked')}
          >
            My Sad Victories{' '}
            <span className={styles.tabCount}>{unlockedCount}</span>
          </button>
          <button
            className={`${styles.tab} ${filter === 'locked' ? styles.tabActive : ''}`}
            onClick={() => setFilter('locked')}
          >
            Future Disappointments{' '}
            <span className={styles.tabCount}>{lockedCount}</span>
          </button>
        </div>

        {/* Achievement grid */}
        <div className={styles.grid}>
          {filtered.map((a: AchievementWithStatus, i: number) => (
            <div
              key={a.id}
              className={`${styles.card} ${a.unlocked ? styles.cardUnlocked : styles.cardLocked}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* XP badge */}
              <span className={`${styles.xpBadge} ${a.unlocked ? styles.xpBadgeUnlocked : ''}`}>
                +{a.xp} XP
              </span>

              <div className={styles.cardInner}>
                <div className={`${styles.iconCircle} ${a.unlocked ? styles.iconCircleUnlocked : ''}`}>
                  <span className={styles.icon}>{a.unlocked ? a.icon : '🔒'}</span>
                </div>

                <div className={styles.cardText}>
                  <span className={styles.cardName}>
                    {a.unlocked ? a.name : '???'}
                  </span>
                  <span className={styles.cardDesc}>
                    {a.unlocked ? a.description : 'Hidden achievement'}
                  </span>
                  {a.unlocked && a.unlockedAt && (
                    <span className={styles.cardDate}>
                      Unlocked {new Date(a.unlockedAt).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
