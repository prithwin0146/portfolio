import { useEffect, useState, useRef } from 'react';
import type { AchievementWithStatus } from '../../types/achievements';
import styles from './AchievementToast.module.css';

interface ToastItem {
  id: number;
  achievement: AchievementWithStatus;
}

let toastSeq = 0;

export default function AchievementToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);
  const showingRef = useRef(false);

  useEffect(() => {
    const processQueue = () => {
      if (queueRef.current.length === 0) {
        showingRef.current = false;
        return;
      }

      showingRef.current = true;
      const next = queueRef.current.shift()!;
      setToasts((prev) => [...prev, next]);

      // Auto-dismiss after 4s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== next.id));
        processQueue();
      }, 4000);
    };

    const onUnlock = (e: Event) => {
      const detail = (e as CustomEvent).detail as AchievementWithStatus;
      const item: ToastItem = { id: ++toastSeq, achievement: detail };

      if (showingRef.current) {
        queueRef.current.push(item);
      } else {
        queueRef.current.push(item);
        processQueue();
      }
    };

    window.addEventListener('achievement-unlocked', onUnlock);
    return () => window.removeEventListener('achievement-unlocked', onUnlock);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={styles.toast}
          onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
        >
          <div className={styles.toastHeader}>
            <span className={styles.headerLabel}>ACHIEVEMENT UNLOCKED!</span>
            <span className={styles.headerXp}>+{t.achievement.xp} XP</span>
          </div>
          <div className={styles.toastBody}>
            <span className={styles.icon}>{t.achievement.icon}</span>
            <div className={styles.info}>
              <span className={styles.name}>{t.achievement.name}</span>
              <span className={styles.desc}>{t.achievement.description}</span>
            </div>
            <button
              className={styles.closeBtn}
              onClick={(e) => {
                e.stopPropagation();
                setToasts((prev) => prev.filter((x) => x.id !== t.id));
              }}
            >
              ×
            </button>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} />
          </div>
        </div>
      ))}
    </div>
  );
}
