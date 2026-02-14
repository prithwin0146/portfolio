import { useEffect, useState, useCallback } from 'react';
import styles from './Preloader.module.css';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [exit, setExit] = useState(false);

  const finish = useCallback(() => {
    setTimeout(() => setExit(true), 300);
    setTimeout(() => onComplete(), 1200);
  }, [onComplete]);

  useEffect(() => {
    let frame: number;
    let current = 0;

    const tick = () => {
      current += Math.random() * 6 + 2;
      if (current >= 100) {
        current = 100;
        setCount(100);
        finish();
        return;
      }
      setCount(Math.floor(current));
      frame = requestAnimationFrame(tick);
    };

    // Small delay before starting
    const timer = setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, 600);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [finish]);

  return (
    <div className={`${styles.preloader} ${exit ? styles.exit : ''}`}>
      <div className={styles.content}>
        <div className={styles.nameRow}>
          {'Prithwin'.split('').map((char, i) => (
            <span
              key={i}
              className={styles.letter}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {char}
            </span>
          ))}
        </div>
        <div className={styles.tagline}>Freelance Web Designer</div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(count, 100)}%` }}
            />
          </div>
          <span className={styles.counter}>{Math.min(count, 100)}</span>
        </div>
      </div>
    </div>
  );
}
