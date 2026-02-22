import { useEffect, useState, useMemo, useCallback } from 'react';
import { getAchievementStats } from '../../services/achievementService';
import { RARITY_ORDER, RARITY_LABELS } from '../../config/achievements.config';
import type { AchievementWithStatus, AchievementRarity } from '../../types/achievements';
import styles from './AchievementModal.module.css';

interface AchievementModalProps {
  open: boolean;
  onClose: () => void;
}

type Filter = 'all' | 'unlocked' | 'locked';

/** Group achievements by rarity, preserving RARITY_ORDER (legendary → common). */
function groupByRarity(items: AchievementWithStatus[]) {
  const groups: { rarity: AchievementRarity; label: string; items: AchievementWithStatus[] }[] = [];
  for (const rarity of RARITY_ORDER) {
    const matched = items.filter((a) => a.rarity === rarity);
    if (matched.length > 0) {
      groups.push({ rarity, label: RARITY_LABELS[rarity], items: matched });
    }
  }
  return groups;
}

export default function AchievementModal({ open, onClose }: AchievementModalProps) {
  const [stats, setStats] = useState(() => getAchievementStats());
  const [filter, setFilter] = useState<Filter>('all');
  const [animating, setAnimating] = useState(false);

  const refreshStats = useCallback(() => setStats(getAchievementStats()), []);

  useEffect(() => {
    if (!open) return;
    setAnimating(true);
    refreshStats();

    // Pause Lenis AND lock body scroll so native scroll works inside modal
    window.dispatchEvent(new Event('lenis:stop'));
    document.body.style.overflow = 'hidden';

    const handler = () => refreshStats();
    window.addEventListener('achievement-unlocked', handler);
    return () => {
      window.removeEventListener('achievement-unlocked', handler);
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('lenis:start'));
    };
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
    if (filter === 'unlocked') return stats.achievements.filter((a) => a.unlocked);
    if (filter === 'locked') return stats.achievements.filter((a) => !a.unlocked);
    return stats.achievements;
  }, [stats.achievements, filter]);

  const rarityGroups = useMemo(() => groupByRarity(filtered), [filtered]);

  if (!open) return null;

  let cardIndex = 0;

  return (
    <div
      className={`${styles.overlay} ${animating ? styles.overlayVisible : ''}`}
      onClick={onClose}
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
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

        {/* Tab filters — clean Zyon-style */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${filter === 'all' ? styles.tabActive : ''}`}
            onClick={() => setFilter('all')}
          >
            All <span className={styles.tabCount}>({stats.totalCount})</span>
          </button>
          <button
            className={`${styles.tab} ${filter === 'unlocked' ? styles.tabActive : ''}`}
            onClick={() => setFilter('unlocked')}
          >
            Unlocked <span className={styles.tabCount}>({unlockedCount})</span>
          </button>
          <button
            className={`${styles.tab} ${filter === 'locked' ? styles.tabActive : ''}`}
            onClick={() => setFilter('locked')}
          >
            Locked <span className={styles.tabCount}>({lockedCount})</span>
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

        {/* Achievement grid — grouped by rarity */}
        <div className={styles.scrollArea}>
          {rarityGroups.map((group) => (
            <div key={group.rarity}>
              <div className={`${styles.rarityHeader} ${styles[`rarity_${group.rarity}`]}`}>
                <span className={styles.rarityLabel}>{group.label} ({group.items.length})</span>
              </div>
              <div className={styles.grid}>
                {group.items.map((a) => {
                  const idx = cardIndex++;
                  return (
                    <div
                      key={a.id}
                      className={`${styles.card} ${a.unlocked ? styles.cardUnlocked : styles.cardLocked} ${styles[`border_${a.rarity}`]}`}
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      {/* XP badge */}
                      {a.unlocked && (
                        <span className={`${styles.xpBadge} ${styles[`xp_${a.rarity}`]}`}>
                          +{a.xp} XP
                        </span>
                      )}

                      {/* Unlocked checkmark */}
                      {a.unlocked && <span className={styles.checkmark}>✓</span>}

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
                              Unlocked {new Date(a.unlockedAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
