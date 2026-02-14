import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useTilt } from '../../hooks/useTilt';
import SectionHeader from '../SectionHeader/SectionHeader';
import ProjectModal from '../ProjectModal/ProjectModal';
import type { Project } from '../../types';
import styles from './Projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const tilt = useTilt(4);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="projects"
    >
      <SectionHeader number="03" title="My " accent="Projects" visible={isInView} />

      {/* Featured project — big hero card */}
      {featured && (
        <div
          className={styles.featured}
          data-card
          style={{ transitionDelay: '0.1s' }}
          onMouseMove={tilt.onMove}
          onMouseLeave={tilt.onLeave}
          onMouseEnter={tilt.onEnter}
          onClick={() => setSelected(featured)}
          data-cursor-hover
          data-cursor-label="View"
        >
          <div className={styles.featuredSpotlight} />
          <div className={styles.glare} data-glare />
          <div className={styles.featuredBorder} />
          <div className={styles.featuredInner}>
            <div className={styles.featuredBadge}>Featured Project</div>
            <h3 className={styles.featuredTitle}>{featured.title}</h3>
            <p className={styles.featuredDesc}>{featured.description}</p>
            <div className={styles.tags}>
              {featured.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <div className={styles.cardLinks}>
              <span className={styles.caseStudyLink} data-cursor-hover>
                View Case Study →
              </span>
              {featured.liveUrl && featured.liveUrl !== '#' && (
                <a href={featured.liveUrl} target="_blank" rel="noreferrer" className={styles.cardLink} data-cursor-hover onClick={(e) => e.stopPropagation()}>
                  <span className={styles.linkIcon}>↗</span> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other projects grid */}
      <div className={styles.grid}>
        {rest.map((p, i) => (
          <div
            key={p.id}
            className={styles.card}
            data-card
            style={{ transitionDelay: `${(i + 1) * 0.12}s` }}
            onMouseMove={tilt.onMove}
            onMouseLeave={tilt.onLeave}
            onMouseEnter={tilt.onEnter}
            onClick={() => setSelected(p)}
            data-cursor-hover
            data-cursor-label="View"
          >
            <div className={styles.cardSpotlight} />
            <div className={styles.glare} data-glare />
            <div className={styles.cardBorder} />
            <div className={styles.cardInner}>
              <div className={styles.cardNumber}>0{i + 2}</div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.description}</p>
              <div className={styles.tags}>
                {p.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.cardLinks}>
                <span className={styles.caseStudyLink} data-cursor-hover>
                  View Details →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project detail modal */}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
