import { useCallback } from 'react';
import { useInView } from '../../hooks/useInView';
import styles from './Footer.module.css';

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

  const handleMagnetic = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }, []);

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.currentTarget.style.transform = '';
  }, []);

  return (
    <footer ref={ref} className={`${styles.footer} ${isInView ? styles.visible : ''}`}>
      {/* CTA Section */}
      <div className={styles.cta}>
        <p className={styles.ctaLabel} data-mono>Got a project?</p>
        <a
          href="#contact"
          className={styles.ctaHeading}
          data-cursor-hover
          data-cursor-label="Let's go"
          onMouseMove={handleMagnetic}
          onMouseLeave={handleMagneticLeave}
        >
          Let's work together
          <span className={styles.ctaArrow}>↗</span>
        </a>
        <div className={styles.ctaGlow} />
      </div>

      <div className={styles.divider} />

      <div className={styles.content}>
        <div className={styles.left}>
          <p className={styles.credit}>
            Designed & Built by <span className={styles.name}>Prithwin</span>
          </p>
          <p className={styles.year} data-mono>© {new Date().getFullYear()}</p>
        </div>

        <div className={styles.links}>
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
              data-cursor-hover
            >
              {s.label}
            </a>
          ))}
        </div>

        <button
          className={styles.backToTop}
          onClick={scrollToTop}
          data-cursor-hover
          aria-label="Back to top"
          onMouseMove={handleMagnetic}
          onMouseLeave={handleMagneticLeave}
        >
          <span className={styles.backToTopArrow}>↑</span>
          <span className={styles.backToTopLabel} data-mono>Top</span>
        </button>
      </div>
    </footer>
  );
}
