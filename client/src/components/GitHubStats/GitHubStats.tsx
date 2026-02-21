import { useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import { GITHUB_STATS } from '../../config/github.config';
import { trackStatsView } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './GitHubStats.module.css';

export default function GitHubStats() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (visible) trackStatsView();
  }, [visible]);

  const stats = [
    { icon: '📁', value: GITHUB_STATS.totalRepos, label: 'Total Projects' },
    { icon: '⭐', value: GITHUB_STATS.totalStars, label: 'Total Stars' },
    { icon: '🍴', value: GITHUB_STATS.totalForks, label: 'Total Forks' },
    { icon: '🔥', value: `${GITHUB_STATS.activePercent}%`, label: 'Active Projects' },
  ];

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={styles.section} id="github-stats">
      <SectionHeader number="09" title={t('section.githubStats.title')} accent={t('section.githubStats.accent')} subtitle={t('section.githubStats.sub') || undefined} visible={visible} />

      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={styles.statCard}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.4s ${i * 0.1}s, transform 0.4s ${i * 0.1}s`,
            }}
          >
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div
        className={styles.langSection}
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s 0.4s',
        }}
      >
        <div className={styles.langHeader}>
          <span className={styles.langTitle}>Top Languages</span>
          <span className={styles.langCount}>
            {GITHUB_STATS.topLanguages.length} languages
          </span>
        </div>
        <div className={styles.langBar}>
          {GITHUB_STATS.topLanguages.map((lang) => (
            <div
              key={lang.name}
              className={styles.langSegment}
              style={{
                width: visible ? `${lang.percent}%` : '0%',
                backgroundColor: lang.color,
              }}
            />
          ))}
        </div>
        <div className={styles.langList}>
          {GITHUB_STATS.topLanguages.map((lang) => (
            <div key={lang.name} className={styles.langItem}>
              <span className={styles.langDot} style={{ backgroundColor: lang.color }} />
              <span>{lang.name}</span>
              <span className={styles.langPercent}>{lang.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
