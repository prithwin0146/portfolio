import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './RecentActivity.module.css';

interface ActivityItem {
  icon: string;
  action: string;
  detail: string;
  time: string;
}

const ACTIVITIES: ActivityItem[] = [
  { icon: '🚀', action: 'Pushed to', detail: 'portfolio/main — "Added Steam-inspired level system"', time: '2 hours ago' },
  { icon: '⭐', action: 'Starred', detail: 'framer/motion — Animation library for React', time: '1 day ago' },
  { icon: '🔀', action: 'Merged PR', detail: '#2 — "Add achievement showcase component"', time: '2 days ago' },
  { icon: '📝', action: 'Opened issue', detail: '#12 — "Add theme switcher support"', time: '3 days ago' },
  { icon: '🍴', action: 'Forked', detail: 'lenis/smooth-scroll — Smooth scroll library', time: '5 days ago' },
];

export default function RecentActivity() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`${styles.section} ${visible ? styles.visible : ''}`}
    >
      <SectionHeader number="11" title={t('section.recentActivity.title')} accent={t('section.recentActivity.accent')} subtitle={t('section.recentActivity.sub') || undefined} visible={visible} />

      <div className={styles.timeline}>
        {ACTIVITIES.map((a, i) => (
          <div
            key={i}
            className={styles.item}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <span className={styles.itemIcon}>{a.icon}</span>
            <div className={styles.itemContent}>
              <span className={styles.itemAction}>{a.action}</span>{' '}
              <span className={styles.itemDetail}>{a.detail}</span>
            </div>
            <span className={styles.itemTime}>{a.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
