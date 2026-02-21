import { useEffect, useState } from 'react';
import { getLevelFromXP, getLevelStyle, getXPForNextLevel } from '../../utils/steamLevelColors';
import { getAchievementStats } from '../../services/achievementService';
import styles from './XPProgressBar.module.css';

interface XPProgressBarProps {
  compact?: boolean;
}

export default function XPProgressBar({ compact = false }: XPProgressBarProps) {
  const [xp, setXp] = useState(() => getAchievementStats().totalXP);

  useEffect(() => {
    const onUnlock = () => setXp(getAchievementStats().totalXP);
    window.addEventListener('achievement-unlocked', onUnlock);
    return () => window.removeEventListener('achievement-unlocked', onUnlock);
  }, []);

  const level = getLevelFromXP(xp);
  const { current, required, progress } = getXPForNextLevel(xp);
  const levelStyle = getLevelStyle(level);

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      {!compact && (
        <div className={styles.labels}>
          <span className={styles.levelLabel} style={{ color: levelStyle.borderColor }}>
            Level {level}
          </span>
          <span className={styles.xpText}>
            {current} / {required} XP
          </span>
          <span className={styles.levelLabel} style={{ color: '#475569' }}>
            Level {level + 1}
          </span>
        </div>
      )}
      <div
        className={styles.track}
        style={{ borderColor: `${levelStyle.borderColor}33` }}
      >
        <div
          className={styles.fill}
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${levelStyle.borderColor}99, ${levelStyle.borderColor})`,
            boxShadow: `0 0 8px ${levelStyle.glowColor}`,
          }}
        />
      </div>
      {compact && (
        <div className={styles.compactLabels}>
          <span className={styles.compactLevel} style={{ color: levelStyle.borderColor }}>
            Lv.{level}
          </span>
          <span className={styles.compactXP}>
            {current}/{required} XP
          </span>
        </div>
      )}
    </div>
  );
}
