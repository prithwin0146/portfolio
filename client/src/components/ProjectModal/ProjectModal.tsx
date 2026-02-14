import { useEffect, useCallback } from 'react';
import type { Project } from '../../types';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [project, handleEsc]);

  if (!project) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} data-cursor-hover aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.spotlight} />

        <div className={styles.header}>
          <span className={styles.badge}>Case Study</span>
          <h2 className={styles.title}>{project.title}</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.descriptionBlock}>
            <h3 className={styles.sectionLabel}>Overview</h3>
            <p className={styles.description}>{project.description}</p>
          </div>

          <div className={styles.techBlock}>
            <h3 className={styles.sectionLabel}>Tech Stack</h3>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.linksBlock}>
            {project.liveUrl && project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.linkBtn}
                data-cursor-hover
              >
                <span className={styles.linkIcon}>↗</span>
                View Live Demo
              </a>
            )}
            {project.gitHubUrl && project.gitHubUrl !== '#' && (
              <a
                href={project.gitHubUrl}
                target="_blank"
                rel="noreferrer"
                className={`${styles.linkBtn} ${styles.linkBtnSecondary}`}
                data-cursor-hover
              >
                <span className={styles.linkIcon}>⟨/⟩</span>
                View Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
