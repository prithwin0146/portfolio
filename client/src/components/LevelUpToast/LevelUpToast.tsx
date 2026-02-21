import { useEffect, useRef, useState } from 'react';
import { getLevelFromXP, getLevelStyle } from '../../utils/steamLevelColors';
import { getAchievementStats } from '../../services/achievementService';
import styles from './LevelUpToast.module.css';

const PARTICLE_SYMBOLS = ['⭐', '✨', '💫', '🌟', '⚡', '🔥', '💎', '🎯'];

interface LevelUpInfo {
  oldLevel: number;
  newLevel: number;
  tierChanged: boolean;
  tierName: string;
  borderColor: string;
  glowColor: string;
  particles: React.JSX.Element[];
}

function buildParticles(color: string): React.JSX.Element[] {
  return Array.from({ length: 20 }, (_, i) => (
    <span
      key={i}
      className={styles.particle}
      style={{
        left: `${10 + Math.random() * 80}%`,
        animationDelay: `${Math.random() * 0.5}s`,
        animationDuration: `${1.2 + Math.random() * 0.8}s`,
        color,
      }}
    >
      {PARTICLE_SYMBOLS[Math.floor(Math.random() * PARTICLE_SYMBOLS.length)]}
    </span>
  ));
}

export default function LevelUpToast() {
  const [toast, setToast] = useState<LevelUpInfo | null>(null);
  const prevLevelRef = useRef(getLevelFromXP(getAchievementStats().totalXP));
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onUnlock = () => {
      const newXP = getAchievementStats().totalXP;
      const newLevel = getLevelFromXP(newXP);
      const oldLevel = prevLevelRef.current;

      if (newLevel > oldLevel) {
        const oldStyle = getLevelStyle(oldLevel);
        const newStyle = getLevelStyle(newLevel);
        const tierChanged = oldStyle.name !== newStyle.name;

        if (dismissTimer.current) clearTimeout(dismissTimer.current);

        setToast({
          oldLevel,
          newLevel,
          tierChanged,
          tierName: newStyle.name,
          borderColor: newStyle.borderColor,
          glowColor: newStyle.glowColor,
          particles: buildParticles(newStyle.borderColor),
        });

        dismissTimer.current = setTimeout(() => setToast(null), 4500);
      }

      prevLevelRef.current = newLevel;
    };

    window.addEventListener('achievement-unlocked', onUnlock);
    return () => {
      window.removeEventListener('achievement-unlocked', onUnlock);
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  if (!toast) return null;

  return (
    <div
      className={styles.wrap}
      style={{
        borderColor: toast.borderColor,
        boxShadow: `0 0 24px ${toast.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      <div className={styles.particles}>{toast.particles}</div>
      <div className={styles.glow} style={{ background: toast.glowColor }} />
      <div className={styles.content}>
        <p className={styles.label} style={{ color: toast.borderColor }}>
          ⬆ LEVEL UP!
        </p>
        <p className={styles.levels}>
          <span className={styles.oldLevel}>{toast.oldLevel}</span>
          <span className={styles.arrow}>→</span>
          <span className={styles.newLevel} style={{ color: toast.borderColor }}>
            {toast.newLevel}
          </span>
        </p>
        {toast.tierChanged && (
          <p className={styles.tierName} style={{ color: toast.borderColor }}>
            {toast.tierName} unlocked
          </p>
        )}
      </div>
    </div>
  );
}
