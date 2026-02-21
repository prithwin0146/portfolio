import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import TextReveal from '../TextReveal/TextReveal';
import type { Profile } from '../../types';
import styles from './About.module.css';

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const { t } = useLanguage();

  useEffect(() => {
    api.getProfile().then(setProfile).catch(console.error);
  }, []);

  const projectCount = useCountUp(2, 1800, 0, isInView);
  const satisfactionCount = useCountUp(100, 2200, 0, isInView);
  const responseCount = useCountUp(24, 1500, 0, isInView);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="about"
    >
      <SectionHeader number="01" title={t('section.about.title')} accent={t('section.about.accent')} subtitle={t('section.about.sub') || undefined} visible={isInView} />

      <div className={styles.bento}>
        {/* Main bio card — spans 2 columns */}
        <div className={`${styles.card} ${styles.cardBio}`} style={{ transitionDelay: '0.1s' }}>
          <div className={styles.cardGlow} />
          <TextReveal className={styles.bioText} delay={200} stagger={40}>
            {t('about.bio')}
          </TextReveal>
          <div className={styles.bioAccent}>
            <span className={styles.accentLine} />
            <span className={styles.accentLabel}>{t('about.location')}</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className={`${styles.card} ${styles.cardStat}`} style={{ transitionDelay: '0.2s' }}>
          <div className={styles.cardGlow} />
          <span className={styles.statNumber} data-mono>{projectCount}+</span>
          <span className={styles.statLabel}>Projects<br />Delivered</span>
        </div>

        <div className={`${styles.card} ${styles.cardStat}`} style={{ transitionDelay: '0.3s' }}>
          <div className={styles.cardGlow} />
          <span className={styles.statNumber} data-mono>{satisfactionCount}%</span>
          <span className={styles.statLabel}>Client<br />Satisfaction</span>
        </div>

        <div className={`${styles.card} ${styles.cardStat}`} style={{ transitionDelay: '0.4s' }}>
          <div className={styles.cardGlow} />
          <span className={styles.statNumber} data-mono>&lt;{responseCount}h</span>
          <span className={styles.statLabel}>Response<br />Time</span>
        </div>

        {/* Tech stack marquee card */}
        <div className={`${styles.card} ${styles.cardMarquee}`} style={{ transitionDelay: '0.5s' }}>
          <div className={styles.cardGlow} />
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {['React', 'TypeScript', '.NET', 'Node.js', 'PostgreSQL', 'Tailwind', 'Next.js', 'Figma', 'React', 'TypeScript', '.NET', 'Node.js', 'PostgreSQL', 'Tailwind', 'Next.js', 'Figma'].map((t, i) => (
                <span key={i} className={styles.marqueeItem}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
