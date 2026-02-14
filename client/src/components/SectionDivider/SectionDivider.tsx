import { useEffect, useRef, useState } from 'react';
import styles from './SectionDivider.module.css';

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.divider} ${visible ? styles.visible : ''}`}>
      <span className={styles.line} />
      <span className={styles.dot} />
      <span className={styles.line} />
    </div>
  );
}
