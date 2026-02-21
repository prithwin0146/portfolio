import { useEffect, useState } from 'react';
import { getLevelFromXP, getLevelStyle, getXPForNextLevel, getLevelBorderStyle } from '../../utils/steamLevelColors';
import { getAchievementStats } from '../../services/achievementService';
import styles from './LevelBadge.module.css';

interface LevelBadgeProps {
  size?: 'small' | 'large';
}

export default function LevelBadge({ size = 'small' }: LevelBadgeProps) {
  const [xp, setXp] = useState(() => getAchievementStats().totalXP);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const onUnlock = () => setXp(getAchievementStats().totalXP);
    window.addEventListener('achievement-unlocked', onUnlock);
    return () => window.removeEventListener('achievement-unlocked', onUnlock);
  }, []);

  const level = getLevelFromXP(xp);
  const levelStyle = getLevelStyle(level);
  const { current, required } = getXPForNextLevel(xp);
  const borderStyle = getLevelBorderStyle(level);

  return (
    <div
      className={`${styles.badge} ${styles[size]} ${level >= 50 ? styles.pulse : ''}`}
      style={{ ...borderStyle, backgroundColor: levelStyle.backgroundColor }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={`Level ${level} — ${levelStyle.name}`}
    >
      <span className={styles.number} style={{ color: levelStyle.borderColor }}>
        {level}
      </span>

      {showTooltip && (
        <div className={styles.tooltip}>
          <span className={styles.tooltipName} style={{ color: levelStyle.borderColor }}>
            {levelStyle.name}
          </span>
          <span className={styles.tooltipXP}>Level {level}</span>
          <span className={styles.tooltipProgress}>
            {current} / {required} XP to next level
          </span>
        </div>
      )}
    </div>
  );
}
