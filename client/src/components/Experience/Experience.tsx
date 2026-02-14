import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useTilt } from '../../hooks/useTilt';
import SectionHeader from '../SectionHeader/SectionHeader';
import type { Experience as ExperienceType } from '../../types';
import styles from './Experience.module.css';

export default function Experience() {
  const [items, setItems] = useState<ExperienceType[]>([]);
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const tilt = useTilt(3);

  useEffect(() => {
    api.getExperience().then(setItems).catch(console.error);
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="services"
    >
      <SectionHeader number="02" title="My " accent="Services" visible={isInView} />
      <div className={styles.grid}>
        {items.map((exp, i) => (
          <div
            key={exp.id}
            className={styles.card}
            style={{ transitionDelay: `${i * 0.12}s` }}
            onMouseMove={tilt.onMove}
            onMouseLeave={tilt.onLeave}
            onMouseEnter={tilt.onEnter}
          >
            <div className={styles.cardSpotlight} />
            <div className={styles.glare} data-glare />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{exp.company}</h3>
              <p className={styles.cardRole}>{exp.role}</p>
              <p className={styles.cardDesc}>{exp.description}</p>
              <ul className={styles.cardHighlights}>
                {exp.highlights.map((h, hi) => (
                  <li key={hi} style={{ transitionDelay: `${i * 0.12 + hi * 0.06}s` }}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
