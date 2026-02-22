import { useGitHubXP } from '../../hooks/useGitHubXP';
import styles from './XPProgressBar.module.css';

interface XPProgressBarProps {
  compact?: boolean;
}

export default function XPProgressBar({ compact = false }: XPProgressBarProps) {
  const { level, currentLevelXP, nextLevelXP, progress, borderColor, glowColor, loading } = useGitHubXP();

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      {!compact && (
        <div className={styles.labels}>
          <span className={styles.levelLabel} style={{ color: borderColor }}>
            Level {loading ? '...' : level}
          </span>
          <span className={styles.xpText}>
            {loading ? '...' : `${currentLevelXP} / ${nextLevelXP} XP`}
          </span>
          <span className={styles.levelLabel} style={{ color: '#475569' }}>
            Level {loading ? '...' : level + 1}
          </span>
        </div>
      )}
      <div
        className={styles.track}
        style={{ borderColor: `${borderColor}33` }}
      >
        <div
          className={styles.fill}
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${borderColor}99, ${borderColor})`,
            boxShadow: `0 0 8px ${glowColor}`,
          }}
        />
      </div>
      {compact && (
        <div className={styles.compactLabels}>
          <span className={styles.compactLevel} style={{ color: borderColor }}>
            Lv.{loading ? '...' : level}
          </span>
          <span className={styles.compactXP}>
            {loading ? '...' : `${currentLevelXP}/${nextLevelXP} XP`}
          </span>
        </div>
      )}
    </div>
  );
}
