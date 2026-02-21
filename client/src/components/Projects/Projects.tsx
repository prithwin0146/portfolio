import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useTilt } from '../../hooks/useTilt';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import ProjectModal from '../ProjectModal/ProjectModal';
import type { Project } from '../../types';
import styles from './Projects.module.css';

export default function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const tilt = useTilt(4);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="projects"
    >
      <SectionHeader number="03" title={t('section.projects.title')} accent={t('section.projects.accent')} subtitle={t('section.projects.sub') || undefined} visible={isInView} />

      <div className={styles.grid}>
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={styles.card}
            data-card
            style={{ transitionDelay: `${i * 0.1}s` }}
            onMouseMove={tilt.onMove}
            onMouseLeave={tilt.onLeave}
            onMouseEnter={tilt.onEnter}
            onClick={() => setSelected(p)}
            data-cursor-hover
            data-cursor-label="View"
          >
            <div className={styles.cardSpotlight} />
            <div className={styles.cardBorder} />
            <div className={styles.cardInner}>
              {p.imageUrl && (
                <div className={styles.cardImageWrap}>
                  <img src={p.imageUrl} alt={p.title} className={styles.cardImage} loading="lazy" />
                  <div className={styles.cardStats}>
                    {p.stars > 0 && <span className={styles.stat}>⭐{p.stars}</span>}
                    {p.forks > 0 && <span className={styles.stat}>🍴{p.forks}</span>}
                  </div>
                </div>
              )}
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.description}</p>
              <div className={styles.tags}>
                {p.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.cardActions}>
                {p.gitHubUrl && p.gitHubUrl !== '#' && (
                  <a
                    href={p.gitHubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.actionLink}
                    data-cursor-hover
                    onClick={(e) => e.stopPropagation()}
                  >
                    Code
                  </a>
                )}
                {p.liveUrl && p.liveUrl !== '#' && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.actionLink}
                    data-cursor-hover
                    onClick={(e) => e.stopPropagation()}
                  >
                    Demo ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
