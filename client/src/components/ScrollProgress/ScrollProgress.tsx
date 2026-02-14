import { useEffect, useState } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
      {progress > 5 && (
        <div className={styles.indicator} data-mono>
          <svg className={styles.ring} viewBox="0 0 36 36">
            <circle className={styles.ringBg} cx="18" cy="18" r="15.5" />
            <circle
              className={styles.ringFill}
              cx="18"
              cy="18"
              r="15.5"
              strokeDasharray="97.4"
              strokeDashoffset={97.4 - (97.4 * progress) / 100}
            />
          </svg>
          <span className={styles.percent}>{Math.round(progress)}</span>
        </div>
      )}
    </>
  );
}
