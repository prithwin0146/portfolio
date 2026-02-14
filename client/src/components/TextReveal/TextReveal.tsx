import { useEffect, useRef, useState } from 'react';
import styles from './TextReveal.module.css';

interface TextRevealProps {
  children: string;
  tag?: 'p' | 'span' | 'h2' | 'h3';
  className?: string;
  delay?: number; // base delay in ms
  stagger?: number; // per-word stagger in ms
}

export default function TextReveal({
  children,
  tag: Tag = 'p',
  className = '',
  delay = 0,
  stagger = 50,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = children.split(' ');

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`${styles.container} ${className}`}>
      {words.map((word, i) => (
        <span key={i} className={styles.wordWrap}>
          <span
            className={`${styles.word} ${revealed ? styles.visible : ''}`}
            style={{ transitionDelay: `${delay + i * stagger}ms` }}
          >
            {word}
          </span>
        </span> 
      ))}
    </Tag>
  );
}
