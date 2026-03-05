import { useState, useEffect } from 'react';
import type React from 'react';
import { useInView } from '../../hooks/useInView';
import { trackResumeView } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './ResumeViewer.module.css';

const RESUME_URL = '/resume.pdf';

export default function ResumeViewer() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  // iframe is only mounted after the user clicks "Load Preview"
  // This prevents PDF compositing inside the scroll-skew transform context
  const [previewLoaded, setPreviewLoaded] = useState(false);
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
          {previewLoaded ? (
            <iframe
              src={`${RESUME_URL}#toolbar=0&navpanes=0`}
              className={styles.iframe}
              title="Resume Preview"
            />
          ) : (
            /* Placeholder shown until user requests the preview */
            <div className={styles.placeholder}>
              <svg className={styles.placeholderIcon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="4" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M28 4v10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="22" x2="34" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="34" x2="26" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className={styles.placeholderText}>Resume Preview</span>
              <button
                className={styles.loadBtn}
                onClick={() => setPreviewLoaded(true)}
                data-cursor-hover
              >
                Load Preview
              </button>
            </div>
          )}

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
              {previewLoaded && (
                <button
                  className={styles.expandBtn}
                  onClick={() => setExpanded(true)}
                  data-cursor-hover
                >
                  ⛶ Expand
                </button>
              )}
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

      {/* Expanded modal — iframe is outside the skewed mainContent transform */}
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
