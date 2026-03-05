import { useState } from 'react';
import type React from 'react';
import { useInView } from '../../hooks/useInView';
import GitHubStats from '../GitHubStats/GitHubStats';
import GitHubReplay from '../GitHubReplay/GitHubReplay';
import RecentActivity from '../RecentActivity/RecentActivity';
import styles from './GitHubHub.module.css';

const PAGES = [
  { id: 'stats',    icon: '📊', label: 'GitHub Stats' },
  { id: 'replay',   icon: '🎬', label: 'GitHub Replay' },
  { id: 'activity', icon: '⚡', label: 'Recent Activity' },
] as const;

export default function GitHubHub() {
  const [current, setCurrent] = useState(0);
  const { ref, isInView: visible } = useInView({ threshold: 0.05 });

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(PAGES.length - 1, c + 1));

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`${styles.hub} ${visible ? styles.visible : ''}`}
    >
      {/* Tab navigation */}
      <div className={styles.tabs}>
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            className={`${styles.tab} ${i === current ? styles.tabActive : ''}`}
            onClick={() => setCurrent(i)}
          >
            <span className={styles.tabIcon}>{p.icon}</span>
            <span className={styles.tabLabel}>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Pages — all mounted so hooks/data stay alive */}
      <div className={styles.content}>
        <div className={current === 0 ? styles.pageActive : styles.pageHidden}>
          <GitHubStats />
        </div>
        <div className={current === 1 ? styles.pageActive : styles.pageHidden}>
          <GitHubReplay />
        </div>
        <div className={current === 2 ? styles.pageActive : styles.pageHidden}>
          <RecentActivity />
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className={styles.nav}>
        <button
          className={styles.navBtn}
          onClick={prev}
          disabled={current === 0}
        >
          ← Previous
        </button>

        <div className={styles.dots}>
          {PAGES.map((p, i) => (
            <button
              key={p.id}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to ${p.label}`}
            />
          ))}
        </div>

        <button
          className={styles.navBtn}
          onClick={next}
          disabled={current === PAGES.length - 1}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
