import { useEffect, useState, useCallback } from 'react';
import type { AchievementWithStatus } from '../../types/achievements';
import styles from './AchievementToast.module.css';

interface ToastItem {
  achievement: AchievementWithStatus;
  id: number;
}

let toastCounter = 0;

export default function AchievementToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((achievement: AchievementWithStatus) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { achievement, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const achievement = (e as CustomEvent<AchievementWithStatus>).detail;
      addToast(achievement);
    };
    window.addEventListener('achievement-unlocked', handler);
    return () => window.removeEventListener('achievement-unlocked', handler);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map(({ achievement, id }) => (
        <div
          key={id}
          className={`${styles.toast} ${styles[achievement.rarity]}`}
        >
          <div className={styles.iconWrap}>
            <span className={styles.icon}>{achievement.icon}</span>
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.label}>Achievement Unlocked!</span>
              <span className={`${styles.rarity} ${styles[`rarity_${achievement.rarity}`]}`}>
                {achievement.rarity}
              </span>
            </div>
            <p className={styles.title}>{achievement.title}</p>
            <p className={styles.description}>{achievement.description}</p>
          </div>
          <div className={styles.xp}>+{achievement.xp} XP</div>
          <div className={styles.progressBar}>
            <div className={styles.progress} />
          </div>
        </div>
      ))}
    </div>
  );
}
