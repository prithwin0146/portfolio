import { useState, useEffect } from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  /** 'sm' = 40px, 'md' = 64px, 'lg' = 120px, 'xl' = 160px */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show the animated ring & glow */
  showRing?: boolean;
  /** Show the online status dot */
  showStatus?: boolean;
  className?: string;
  /** Hover speech bubble text (e.g. "DOMAIN EXPANSION") */
  speechBubble?: string;
}

const AVATAR_URL = '/avatar.png';
const AVATAR_VIDEO = '/avatar.webm';
const FALLBACK_INITIALS = 'PM';

export default function Avatar({
  size = 'md',
  showRing = true,
  showStatus = false,
  className = '',
  speechBubble = '',
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [videoExists, setVideoExists] = useState(false);

  useEffect(() => {
    fetch(AVATAR_VIDEO, { method: 'HEAD' })
      .then(r => { if (r.ok) setVideoExists(true); })
      .catch(() => {});
  }, []);

  return (
    <div
      className={`${styles.wrap} ${styles[size]} ${className}`}
      data-cursor-hover
    >
      <div className={styles.inner}>
        {videoExists ? (
          <video
            src={AVATAR_VIDEO}
            className={styles.media}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : !imgError ? (
          <img
            src={AVATAR_URL}
            alt="Prithwin M"
            className={styles.media}
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

      {/* Steam fire frame overlay — matches Zyon's exact implementation */}
      {showRing && <div className={styles.frame} />}

      {/* Domain Expansion speech bubble */}
      {speechBubble && (
        <div className={styles.speechBubble}>{speechBubble}</div>
      )}

      {showStatus && (
        <span className={styles.statusDot}>
          <span className={styles.statusPing} />
        </span>
      )}
    </div>
  );
}
