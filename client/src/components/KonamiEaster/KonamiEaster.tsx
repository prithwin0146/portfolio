import { useEffect, useState, useCallback } from 'react';
import { trackKonamiKey } from '../../services/achievementService';
import styles from './KonamiEaster.module.css';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function KonamiEaster() {
  const [triggered, setTriggered] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Bridge to achievement service so "konami-master" unlocks
      trackKonamiKey(e.key);

      if (e.key === KONAMI[pos]) {
        const next = pos + 1;
        if (next === KONAMI.length) {
          setTriggered(true);
          setPos(0);
        } else {
          setPos(next);
        }
      } else {
        setPos(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pos]);

  // Auto dismiss after 5s
  useEffect(() => {
    if (!triggered) return;
    const t = setTimeout(() => setTriggered(false), 5000);
    return () => clearTimeout(t);
  }, [triggered]);

  const createParticles = useCallback(() => {
    const particles: React.ReactNode[] = [];
    const emojis = ['🎉', '✨', '🚀', '⭐', '💜', '🔥', '🎊', '💫', '🎯', '⚡'];
    for (let i = 0; i < 50; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const duration = 2 + Math.random() * 2;
      const size = 0.6 + Math.random() * 1.2;
      particles.push(
        <span
          key={i}
          className={styles.particle}
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            fontSize: `${size}rem`,
          }}
        >
          {emoji}
        </span>
      );
    }
    return particles;
  }, []);

  if (!triggered) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.particles}>{createParticles()}</div>
      <div className={styles.message}>
        <p className={styles.code} data-mono>↑↑↓↓←→←→BA</p>
        <h2 className={styles.title}>🎮 You found it!</h2>
        <p className={styles.subtitle}>
          You know the Konami Code — you're clearly awesome.
          <br />
          Thanks for exploring my portfolio!
        </p>
      </div>
    </div>
  );
}
