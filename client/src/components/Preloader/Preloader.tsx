import { useEffect, useState, useCallback } from 'react';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete: () => void;
}

const BOOT_SEQUENCE = [
  'maxplayers set to 1',
  'Steam config directory: /Users/prithwin/Library/Application Support/Steam',
  'ConVarRef r_renderoverlayfragment doesn\'t point to an existing ConVar',
  'Mounting VPK: /portfolio/materials.vpk... [OK]',
  'Mounting VPK: /portfolio/models.vpk... [OK]',
  'Mounting VPK: /portfolio/sounds.vpk... [OK]',
  'Connecting to local server...',
  'Welcome to PrithwinOS v1.0.0',
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [exit, setExit] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogo, setShowLogo] = useState(false);

  const finish = useCallback(() => {
    setTimeout(() => setExit(true), 600);
    setTimeout(() => onComplete(), 1500);
  }, [onComplete]);

  useEffect(() => {
    // 1. Terminal Boot Sequence
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < BOOT_SEQUENCE.length) {
        setLogs((prev) => [...prev, BOOT_SEQUENCE[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
        setTimeout(() => setShowLogo(true), 300);
      }
    }, 150);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    // 2. Download Progress Bar (only starts after logo shows)
    if (!showLogo) return;

    let frame: number;
    let current = 0;

    const tick = () => {
      current += Math.random() * 4 + 1.5;
      if (current >= 100) {
        current = 100;
        setCount(100);
        finish();
        return;
      }
      setCount(Math.floor(current));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [showLogo, finish]);

  return (
    <div className={`${styles.preloader} ${exit ? styles.exit : ''}`}>
      
      {/* Terminal Phase */}
      {!showLogo && (
        <div className={styles.terminal}>
          {logs.map((log, i) => (
            <div key={i} className={styles.logLine}>
              <span className={styles.prompt}>&gt;</span> {log}
            </div>
          ))}
          <div className={styles.cursor} />
        </div>
      )}

      {/* Steam Deck Phase */}
      {showLogo && (
        <div className={styles.steamPhase}>
          <div className={styles.logoWrap}>
            <div className={styles.spinner} />
            <div className={styles.brandText}>Prithwin</div>
          </div>
          
          <div className={styles.downloadSection}>
            <div className={styles.downloadHeader}>
              <span className={styles.downloadLabel}>DOWNLOADING...</span>
              <span className={styles.downloadRate}>{Math.floor(Math.random() * 50 + 10)} MB/s</span>
            </div>
            <div className={styles.steamBarContainer}>
              <div
                className={styles.steamBarFill}
                style={{ width: `${Math.min(count, 100)}%` }}
              />
              <div className={styles.steamBarGlow} style={{ width: `${Math.min(count, 100)}%` }} />
            </div>
            <div className={styles.downloadFooter}>
              <span>{count}%</span>
              <span>10.2 GB / 10.2 GB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
