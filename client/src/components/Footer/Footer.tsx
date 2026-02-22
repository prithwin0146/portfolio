import { useCallback } from 'react';
import { useInView } from '../../hooks/useInView';
import { trackSocialClick } from '../../services/achievementService';
import styles from './Footer.module.css';

const quickLinks = [
  { label: 'Profile', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Contact', id: 'contact' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/prithwin0146' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prithwin-m' },
  { label: 'Email', href: 'mailto:Prithwin0146@gmail.com' },
];

export default function Footer() {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer ref={ref} className={`${styles.footer} ${isInView ? styles.visible : ''}`}>
      <div className={styles.dividerTop} />

      <div className={styles.columns}>
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.colList}>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <button
                  className={styles.colLink}
                  data-cursor-hover
                  onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>Connect With Me</h4>
          <ul className={styles.colList}>
            {socialLinks.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.colLink}
                  data-cursor-hover
                  onClick={trackSocialClick}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>About</h4>
          <p className={styles.aboutText}>
            Steam-inspired portfolio showcasing projects and achievements
          </p>
        </div>
      </div>

      <div className={styles.dividerBottom} />

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Prithwin M. All rights reserved.
        </p>
        <p className={styles.madeWith}>
          Made with Steam profile inspiration 🎮
        </p>
        <button
          className={styles.backToTop}
          onClick={scrollToTop}
          data-cursor-hover
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      </div>
    </footer>
  );
}
