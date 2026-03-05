import type React from 'react';
import { CERTIFICATIONS, type Certification } from '../../config/certifications.config';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './AchievementShowcase.module.css';

const RARITY_ORDER: Certification['rarity'][] = ['LEGENDARY', 'EPIC', 'RARE', 'COMMON'];

function groupByRarity(items: Certification[]) {
  return RARITY_ORDER
    .map((rarity) => ({ rarity, items: items.filter((c) => c.rarity === rarity) }))
    .filter((g) => g.items.length > 0);
}

export default function AchievementShowcase() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const groups = groupByRarity(CERTIFICATIONS);

  let cardIndex = 0;

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={styles.section} id="achievements">
      <SectionHeader
        number="08"
        title={t('section.achievements.title')}
        accent={t('section.achievements.accent')}
        subtitle={t('section.achievements.sub') || undefined}
        visible={visible}
      />

      {groups.map((group) => (
        <div key={group.rarity} className={styles.rarityGroup}>
          {/* Rarity section header */}
          <div className={`${styles.rarityHeader} ${styles[`rarity_${group.rarity}`]}`}>
            <span className={styles.rarityLabel}>
              {group.rarity} ({group.items.length})
            </span>
          </div>

          <div className={styles.grid}>
            {group.items.map((cert) => {
              const idx = cardIndex++;
              const rarityLower = cert.rarity.toLowerCase() as 'legendary' | 'epic' | 'rare' | 'common';
              return (
                <div
                  key={cert.id}
                  className={`${styles.card} ${styles[`border_${rarityLower}`]}`}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.45s ${idx * 0.07}s, transform 0.45s ${idx * 0.07}s`,
                  }}
                >
                  {/* Legendary shimmer */}
                  {cert.rarity === 'LEGENDARY' && <div className={styles.shimmer} />}

                  {/* Year badge — top right */}
                  <span className={`${styles.yearBadge} ${styles[`year_${rarityLower}`]}`}>
                    {cert.year}
                  </span>

                  {/* Earned checkmark — bottom right */}
                  <span className={styles.checkmark}>✓</span>

                  <div className={styles.cardInner}>
                    {/* Icon circle */}
                    <div className={`${styles.iconCircle} ${styles[`iconCircle_${rarityLower}`]}`}>
                      <span className={styles.icon}>{cert.icon}</span>
                    </div>

                    <div className={styles.cardText}>
                      <span className={styles.cardTitle}>{cert.title}</span>
                      <span className={styles.cardIssuer}>{cert.issuer}</span>
                      <p className={styles.cardDesc}>{cert.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

