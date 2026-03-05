import { useEffect } from 'react';
import type React from 'react';
import { useInView } from '../../hooks/useInView';
import { useGitHubXP } from '../../hooks/useGitHubXP';
import { trackStatsView } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './GitHubStats.module.css';

/** Converts an ISO timestamp to a short relative string like "2h ago". */
function timeAgo(iso: string): string {
  if (!iso) return '—';
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

export default function GitHubStats() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const gh = useGitHubXP();

  useEffect(() => {
    if (visible) trackStatsView();
  }, [visible]);

  const stats = [
    { icon: '📁', value: gh.loading ? '...' : gh.repos,              label: 'Repositories' },
    { icon: '⭐', value: gh.loading ? '...' : gh.stars,              label: 'Total Stars' },
    { icon: '🍴', value: gh.loading ? '...' : gh.forks,              label: 'Total Forks' },
    { icon: '👥', value: gh.loading ? '...' : gh.followers,          label: 'Followers' },
    { icon: '👣', value: gh.loading ? '...' : gh.following,          label: 'Following' },
    { icon: '🔥', value: gh.loading ? '...' : `${gh.activePercent}%`, label: 'Active Repos' },
  ];

  const liveStats = [
    {
      icon: '🟢',
      label: 'Last Push',
      value: gh.loading ? '...' : timeAgo(gh.lastPushAt),
      pulse: true,
    },
    {
      icon: '📦',
      label: 'Commits (30d)',
      value: gh.loading ? '...' : `${gh.commitsLastMonth}`,
      pulse: false,
    },
    {
      icon: '📅',
      label: 'Member Since',
      value: gh.loading ? '...' : (gh.memberSince ? `${gh.memberSince}` : '—'),
      pulse: false,
    },
  ];

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={styles.section} id="github-stats">
      <SectionHeader number="09" title={t('section.githubStats.title')} accent={t('section.githubStats.accent')} subtitle={t('section.githubStats.sub') || undefined} visible={visible} />

      {/* Main stats grid */}
      <div className={styles.statsGrid}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={styles.statCard}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.4s ${i * 0.08}s, transform 0.4s ${i * 0.08}s`,
            }}
          >
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Live activity strip */}
      <div
        className={styles.liveStrip}
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s 0.5s' }}
      >
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} />
          LIVE
        </span>
        {liveStats.map((ls) => (
          <div key={ls.label} className={styles.liveItem}>
            <span className={styles.liveIcon}>{ls.icon}</span>
            <span className={styles.liveLabel}>{ls.label}</span>
            <span className={styles.liveValue}>{ls.value}</span>
          </div>
        ))}
      </div>

      {/* Top languages */}
      {gh.topLanguages.length > 0 && (
        <div
          className={styles.langSection}
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s 0.6s',
          }}
        >
          <div className={styles.langHeader}>
            <span className={styles.langTitle}>Top Languages</span>
            <span className={styles.langCount}>
              {gh.topLanguages.length} languages
            </span>
          </div>
          <div className={styles.langBar}>
            {gh.topLanguages.map((lang) => (
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
            {gh.topLanguages.map((lang) => (
              <div key={lang.name} className={styles.langItem}>
                <span className={styles.langDot} style={{ backgroundColor: lang.color }} />
                <span>{lang.name}</span>
                <span className={styles.langPercent}>{lang.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

