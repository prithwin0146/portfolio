import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGitHubXP } from '../../hooks/useGitHubXP';
import SectionHeader from '../SectionHeader/SectionHeader';
import LevelBadge from '../LevelBadge/LevelBadge';
import XPProgressBar from '../XPProgressBar/XPProgressBar';
import styles from './DeveloperLevel.module.css';

export default function DeveloperLevel() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const gh = useGitHubXP();

  const sources = [
    { key: 'REPOSITORIES',        label: t('stats.repos'),       value: gh.loading ? '...' : `${gh.repos}`,               xp: `+${(gh.repos * 100).toLocaleString()} XP` },
    { key: 'FOLLOWERS',           label: t('stats.followers'),   value: gh.loading ? '...' : `${gh.followers}`,            xp: `+${(gh.followers * 50).toLocaleString()} XP` },
    { key: 'TOTAL STARS',         label: t('stats.stars'),       value: gh.loading ? '...' : `${gh.stars}`,                xp: `+${(gh.stars * 10).toLocaleString()} XP` },
    { key: 'YEARS OF EXPERIENCE', label: t('stats.experience'),  value: `${gh.yearsOfExperience}+`,                        xp: `+${(gh.yearsOfExperience * 500).toLocaleString()} XP` },
    { key: 'ACHIEVEMENTS',        label: t('stats.achievements'), value: `${gh.achievementsUnlocked}/${gh.achievementsTotal}`, xp: `+${gh.achievementsXP.toLocaleString()} XP` },
  ];

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={styles.section} id="developer-level">
      <SectionHeader number="07" title={t('section.devLevel.title')} accent={t('section.devLevel.accent')} subtitle={t('section.devLevel.sub') || undefined} visible={visible} />

      <div
        className={styles.topRow}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      >
        <div className={styles.badgeWrap}>
          <LevelBadge size="large" />
        </div>
        <div className={styles.info}>
          <div className={styles.levelTitle}>
            {t('devLevel.title').replace('{level}', gh.loading ? '...' : String(gh.level))}
          </div>
          <div className={styles.subtitle}>
            {gh.tierName} · {gh.loading ? '...' : `${gh.currentLevelXP} / ${gh.nextLevelXP} XP`} to next level
          </div>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            {t('devLevel.status')}
          </div>
        </div>
      </div>

      <div className={styles.xpBarWrap}>
        <XPProgressBar />
      </div>

      <div className={styles.sourcesGrid}>
        {sources.map((source, i) => (
          <div
            key={source.key}
            className={styles.sourceCard}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.4s ${0.2 + i * 0.08}s, transform 0.4s ${0.2 + i * 0.08}s`,
            }}
          >
            <div className={styles.sourceLeft}>
              <span className={styles.sourceLabel}>{source.label}</span>
              <span className={styles.sourceValue}>{source.value}</span>
            </div>
            <span className={styles.sourceXP}>{source.xp}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
