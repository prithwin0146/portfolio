import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignOut.module.css';

const COUNTDOWN_SECONDS = 5;
const CIRCLE_RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function SignOut() {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, navigate]);

  // SVG dash offset for circular progress
  const dashOffset = useMemo(
    () => CIRCUMFERENCE * (secondsLeft / COUNTDOWN_SECONDS),
    [secondsLeft],
  );

  // Floating particles
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className={styles.page}>
      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className={styles.card}>
        <span className={styles.doorIcon}>🚪</span>

        <h1 className={styles.heading}>Sign Out</h1>

        <p className={styles.subtitle}>
          Wait… you were never signed in!
        </p>

        {/* Circular countdown */}
        <div className={styles.timerWrap}>
          <svg className={styles.timerSvg} viewBox="0 0 100 100">
            <circle
              className={styles.timerTrack}
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
            />
            <circle
              className={styles.timerProgress}
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className={styles.timerNumber}>{secondsLeft}</span>
        </div>

        <p className={styles.redirectText}>
          Redirecting in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}…
        </p>

        <button className={styles.goBackBtn} onClick={() => navigate('/')}>
          ← Go Back Now
        </button>

        <p className={styles.proTip}>
          Pro tip: You can't sign out of something you never signed into! 🐸
        </p>
      </div>
    </div>
  );
}
