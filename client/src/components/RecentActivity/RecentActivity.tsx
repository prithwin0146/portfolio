import { useEffect, useState } from 'react';
import { fetchGitHubActivity, type GitHubActivity } from '../../services/github';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './RecentActivity.module.css';

/** Turn an ISO timestamp into a relative "2 hours ago" string. */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function RecentActivity() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const [activities, setActivities] = useState<GitHubActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGitHubActivity(8)
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`${styles.section} ${visible ? styles.visible : ''}`}
    >
      <SectionHeader number="11" title={t('section.recentActivity.title')} accent={t('section.recentActivity.accent')} subtitle={t('section.recentActivity.sub') || undefined} visible={visible} />

      <div className={styles.timeline}>
        {loading && (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`${styles.item} ${styles.skeleton}`}>
              <span className={styles.itemIcon}>⏳</span>
              <div className={styles.itemContent}>
                <span className={styles.itemAction}>Loading</span>{' '}
                <span className={styles.itemDetail}>fetching GitHub activity…</span>
              </div>
            </div>
          ))
        )}

        {!loading && activities.length === 0 && (
          <div className={styles.item}>
            <span className={styles.itemIcon}>😴</span>
            <div className={styles.itemContent}>
              <span className={styles.itemAction}>No recent activity</span>{' '}
              <span className={styles.itemDetail}>Check back later!</span>
            </div>
          </div>
        )}

        {!loading && activities.map((a, i) => (
          <div
            key={`${a.time}-${i}`}
            className={styles.item}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <span className={styles.itemIcon}>{a.icon}</span>
            <div className={styles.itemContent}>
              <span className={styles.itemAction}>{a.action}</span>{' '}
              <span className={styles.itemDetail}>{a.detail}</span>
            </div>
            <span className={styles.itemTime}>{timeAgo(a.time)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
