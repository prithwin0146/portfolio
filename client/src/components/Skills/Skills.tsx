import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { trackSectionVisit } from '../../services/achievementService';
import SectionHeader from '../SectionHeader/SectionHeader';
import type { Skill } from '../../types';
import styles from './Skills.module.css';

const levelLabel = (n: number) =>
  n >= 3 ? 'Advanced' : n >= 2 ? 'Proficient' : 'Familiar';

const levelClass = (n: number) =>
  n >= 3 ? styles.advanced : n >= 2 ? styles.proficient : styles.familiar;

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const { ref, isInView } = useInView({ threshold: 0.15 });

  useEffect(() => {
    if (isInView) trackSectionVisit('skills');
  }, [isInView]);

  useEffect(() => {
    api.getSkills().then(setSkills).catch(console.error);
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  // Create two rows for marquee effect
  const allSkills = Object.values(grouped).flat();
  const mid = Math.ceil(allSkills.length / 2);
  const row1 = allSkills.slice(0, mid);
  const row2 = allSkills.slice(mid);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="skills"
    >
      <SectionHeader number="04" title="My " accent="Skills" visible={isInView} />

      {/* Marquee rows */}
      <div className={styles.marqueeSection}>
        <div className={styles.marqueeRow}>
          <div className={`${styles.marqueeTrack} ${styles.trackLeft}`}>
            {[...row1, ...row1].map((skill, i) => (
              <div key={i} className={`${styles.skillPill} ${levelClass(skill.proficiency)}`}>
                <span className={styles.skillName}>{skill.name}</span>
                <span className={styles.levelBadge}>{levelLabel(skill.proficiency)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.marqueeRow}>
          <div className={`${styles.marqueeTrack} ${styles.trackRight}`}>
            {[...row2, ...row2].map((skill, i) => (
              <div key={i} className={`${styles.skillPill} ${levelClass(skill.proficiency)}`}>
                <span className={styles.skillName}>{skill.name}</span>
                <span className={styles.levelBadge}>{levelLabel(skill.proficiency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category labels */}
      <div className={styles.categories}>
        {Object.entries(grouped).map(([category, items], ci) => (
          <div
            key={category}
            className={styles.category}
            style={{ transitionDelay: `${ci * 0.1}s` }}
          >
            <span className={styles.categoryDot} />
            <span className={styles.categoryName}>{category}</span>
            <span className={styles.categoryCount}>{items.length}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
