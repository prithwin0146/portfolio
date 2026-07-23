import { useEffect } from 'react';
import { HOBBIES } from '../../config/hobbies.config';
import { useInView } from '../../hooks/useInView';
import { trackHobbiesView } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './Hobbies.module.css';

export default function Hobbies() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (visible) trackHobbiesView();
  }, [visible]);

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={styles.section} id="hobbies">
      <SectionHeader number="11" title={t('section.hobbies.title')} accent={t('section.hobbies.accent')} subtitle={t('section.hobbies.sub') || undefined} visible={visible} />
      <div className={styles.grid}>
        {HOBBIES.map((hobby, i) => (
          <div
            key={hobby.id}
            className={styles.card}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.4s ${i * 0.08}s, transform 0.4s ${i * 0.08}s`,
            }}
          >
            <span className={styles.cardIcon}>{hobby.icon}</span>
            <div className={styles.cardContent}>
              <div className={styles.cardTop}>
                <span className={styles.cardTitle}>{hobby.title}</span>
                {hobby.active && (
                  <span className={styles.activeTag}>
                    <span className={styles.activeDot} />
                    Active
                  </span>
                )}
              </div>
              <p className={styles.cardDesc}>{hobby.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
