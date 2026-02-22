import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useTilt } from '../../hooks/useTilt';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import type { Service } from '../../types';
import styles from './Experience.module.css';

export default function Experience() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Service[]>([]);
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const tilt = useTilt(3);

  useEffect(() => {
    api.getServices().then(setItems).catch(console.error);
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="services"
    >
      <SectionHeader number="02" title={t('section.services.title')} accent={t('section.services.accent')} subtitle={t('section.services.sub') || undefined} visible={isInView} />
      <div className={styles.grid}>
        {items.map((svc, i) => (
          <div
            key={svc.id}
            className={styles.card}
            style={{ transitionDelay: `${i * 0.12}s` }}
            onMouseMove={tilt.onMove}
            onMouseLeave={tilt.onLeave}
            onMouseEnter={tilt.onEnter}
          >
            <div className={styles.cardSpotlight} />
            <div className={styles.glare} data-glare />
            <div className={styles.cardContent}>
              <span className={styles.cardIcon}>{svc.icon}</span>
              <h3 className={styles.cardTitle}>{svc.name}</h3>
              <p className={styles.cardRole}>{svc.tagline}</p>
              <p className={styles.cardDesc}>{svc.description}</p>
              <ul className={styles.cardHighlights}>
                {svc.deliverables.map((d, di) => (
                  <li key={di} style={{ transitionDelay: `${i * 0.12 + di * 0.06}s` }}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
