import { useEffect, useState } from 'react';
import { getLevelFromXP, getLevelStyle, getXPForNextLevel } from '../../utils/steamLevelColors';
import { getAchievementStats } from '../../services/achievementService';
import { XP_SOURCES } from '../../config/github.config';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import LevelBadge from '../LevelBadge/LevelBadge';
import XPProgressBar from '../XPProgressBar/XPProgressBar';
import styles from './DeveloperLevel.module.css';

export default function DeveloperLevel() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const [xp, setXp] = useState(() => getAchievementStats().totalXP);

  useEffect(() => {
    const onUnlock = () => setXp(getAchievementStats().totalXP);
    window.addEventListener('achievement-unlocked', onUnlock);
    return () => window.removeEventListener('achievement-unlocked', onUnlock);
  }, []);

  const level = getLevelFromXP(xp);
  const levelStyle = getLevelStyle(level);
  const { current, required } = getXPForNextLevel(xp);

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
            {t('devLevel.title').replace('{level}', String(level))}
          </div>
          <div className={styles.subtitle}>
            {levelStyle.name} · {current} / {required} XP to next level
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
        {XP_SOURCES.map((source, i) => {
          const labelKey: Record<string, string> = {
            'REPOSITORIES': 'stats.repos',
            'FOLLOWERS': 'stats.followers',
            'TOTAL STARS': 'stats.stars',
            'YEARS OF EXPERIENCE': 'stats.experience',
            'ACHIEVEMENTS': 'stats.achievements',
          };
          return (
            <div
              key={source.label}
              className={styles.sourceCard}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.4s ${0.2 + i * 0.08}s, transform 0.4s ${0.2 + i * 0.08}s`,
              }}
            >
              <div className={styles.sourceLeft}>
                <span className={styles.sourceLabel}>{t(labelKey[source.label] ?? source.label)}</span>
                <span className={styles.sourceValue}>{source.value}</span>
              </div>
              <span className={styles.sourceXP}>{source.xpLabel}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
