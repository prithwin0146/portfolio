import { useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';
import { trackResumeView } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './ResumeViewer.module.css';

const RESUME_URL = '/resume.pdf';

export default function ResumeViewer() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (visible) trackResumeView();
  }, [visible]);

  return (
    <>
      <section
        ref={ref as React.Ref<HTMLElement>}
        className={`${styles.section} ${visible ? styles.visible : ''}`}
        id="resume"
      >
        <SectionHeader number="12" title={t('section.resume.title')} accent={t('section.resume.accent')} subtitle={t('section.resume.sub') || undefined} visible={visible} />

        <div className={styles.previewWrap}>
          <iframe
            src={`${RESUME_URL}#toolbar=0&navpanes=0`}
            className={styles.iframe}
            title="Resume Preview"
          />
          <div className={styles.overlay}>
            <div className={styles.actions}>
              <a
                href={RESUME_URL}
                download
                className={styles.downloadBtn}
                data-cursor-hover
              >
                ⬇ Download
              </a>
              <button
                className={styles.expandBtn}
                onClick={() => setExpanded(true)}
                data-cursor-hover
              >
                ⛶ Expand
              </button>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.fullScreenBtn}
                data-cursor-hover
              >
                Open Full Screen ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded modal */}
      {expanded && (
        <div className={styles.modalOverlay} onClick={() => setExpanded(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>📄 Resume</span>
              <button className={styles.modalClose} onClick={() => setExpanded(false)}>✕</button>
            </div>
            <iframe
              src={`${RESUME_URL}#toolbar=1`}
              className={styles.modalIframe}
              title="Resume Full"
            />
          </div>
        </div>
      )}
    </>
  );
}
