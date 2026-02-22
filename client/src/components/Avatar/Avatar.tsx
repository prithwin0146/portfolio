import { useState } from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  /** 'sm' = 40px, 'md' = 64px, 'lg' = 120px, 'xl' = 160px */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show the animated ring & glow */
  showRing?: boolean;
  /** Show the online status dot */
  showStatus?: boolean;
  className?: string;
}

const AVATAR_URL = '/avatar.svg';
const FALLBACK_INITIALS = 'PM';

export default function Avatar({
  size = 'md',
  showRing = true,
  showStatus = false,
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`${styles.wrap} ${styles[size]} ${showRing ? styles.ring : ''} ${className}`}
      data-cursor-hover
    >
      {/* Animated gradient ring */}
      {showRing && <div className={styles.ringGlow} />}

      <div className={styles.inner}>
        {!imgError ? (
          <img
            src={AVATAR_URL}
            alt="Prithwin M"
            className={styles.img}
            onError={() => setImgError(true)}
            loading="eager"
            draggable={false}
          />
        ) : (
          <div className={styles.fallback}>
            <span className={styles.initials}>{FALLBACK_INITIALS}</span>
          </div>
        )}
      </div>

      {/* Online status indicator */}
      {showStatus && (
        <span className={styles.statusDot}>
          <span className={styles.statusPing} />
        </span>
      )}
    </div>
  );
}
