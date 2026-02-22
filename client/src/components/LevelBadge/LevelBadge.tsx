import { useState } from 'react';
import { getLevelBorderStyle } from '../../utils/steamLevelColors';
import { useGitHubXP } from '../../hooks/useGitHubXP';
import styles from './LevelBadge.module.css';

interface LevelBadgeProps {
  size?: 'small' | 'large';
}

export default function LevelBadge({ size = 'small' }: LevelBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { level, currentLevelXP, nextLevelXP, tierName, borderColor, loading } = useGitHubXP();
  const borderStyle = getLevelBorderStyle(level);

  return (
    <div
      className={`${styles.badge} ${styles[size]} ${level >= 50 ? styles.pulse : ''}`}
      style={{ ...borderStyle, backgroundColor: `${borderColor}15` }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label={`Level ${level} — ${tierName}`}
    >
      <span className={styles.number} style={{ color: borderColor }}>
        {loading ? '...' : level}
      </span>

      {showTooltip && (
        <div className={styles.tooltip}>
          <span className={styles.tooltipName} style={{ color: borderColor }}>
            {tierName}
          </span>
          <span className={styles.tooltipXP}>Level {level}</span>
          <span className={styles.tooltipProgress}>
            {currentLevelXP} / {nextLevelXP} XP to next level
          </span>
        </div>
      )}
    </div>
  );
}
