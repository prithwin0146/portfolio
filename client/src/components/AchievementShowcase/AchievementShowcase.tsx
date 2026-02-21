import { CERTIFICATIONS, type Certification } from '../../config/certifications.config';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './AchievementShowcase.module.css';

function RarityBadge({ rarity }: { rarity: Certification['rarity'] }) {
  const cls = rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary';
  return <span className={`${styles.rarity} ${styles[cls]}`}>{rarity}</span>;
}

export default function AchievementShowcase() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={styles.section} id="achievements">
      <SectionHeader number="08" title={t('section.achievements.title')} accent={t('section.achievements.accent')} subtitle={t('section.achievements.sub') || undefined} visible={visible} />
      <div className={styles.grid}>
        {CERTIFICATIONS.map((cert, i) => (
          <div
            key={cert.id}
            className={`${styles.card} ${cert.rarity === 'LEGENDARY' ? styles.legendaryCard : ''}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`,
            }}
          >
            <div className={styles.cardIcon}>{cert.icon}</div>
            <div className={styles.cardContent}>
              <div className={styles.cardTop}>
                <span className={styles.cardTitle}>{cert.title}</span>
                <RarityBadge rarity={cert.rarity} />
              </div>
              <div className={styles.issuer}>{cert.issuer}</div>
              <p className={styles.description}>{cert.description}</p>
              <span className={styles.year}>Earned in {cert.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
