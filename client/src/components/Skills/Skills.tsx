import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import type { Skill } from '../../types';
import styles from './Skills.module.css';

const CATEGORY_ICONS: Record<string, string> = {
  'Languages & Frameworks': '💻',
  'Front-end & UI': '🎨',
  'Database': '🗄️',
  'Tools & Platforms': '🛠️',
  'Practices': '📋',
};

export default function Skills() {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });

  useEffect(() => {
    api.getSkills().then(setSkills).catch(console.error);
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section ref={ref as React.Ref<HTMLElement>} className={styles.section} id="skills">
      <SectionHeader number="04" title={t('section.skills.title')} accent={t('section.skills.accent')} subtitle={t('section.skills.sub') || undefined} visible={visible} />

      <div className={styles.categoryGrid}>
        {Object.entries(grouped).map(([category, items], ci) => (
          <div
            key={category}
            className={styles.categoryCard}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.5s ${ci * 0.12}s, transform 0.5s ${ci * 0.12}s`,
            }}
          >
            <h3 className={styles.categoryTitle}>
              <span className={styles.categoryIcon}>{CATEGORY_ICONS[category] ?? '📦'}</span>
              {category}
            </h3>
            <div className={styles.pills}>
              {items.map((skill) => (
                <span key={skill.id} className={styles.pill}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
