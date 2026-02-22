import { useMemo } from 'react';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { useLanguage } from '../../contexts/LanguageContext';
import Avatar from '../Avatar/Avatar';
import TextReveal from '../TextReveal/TextReveal';
import LevelBadge from '../LevelBadge/LevelBadge';
import XPProgressBar from '../XPProgressBar/XPProgressBar';
import styles from './SidePanel.module.css';

const NAV_IDS = [
  { id: 'about', tKey: 'nav.profile', subKey: 'nav.profile.sub' },
  { id: 'services', tKey: 'nav.services', subKey: 'nav.services.sub' },
  { id: 'projects', tKey: 'nav.projects', subKey: 'nav.projects.sub' },
  { id: 'skills', tKey: 'nav.skills', subKey: 'nav.skills.sub' },
  { id: 'contact', tKey: 'nav.contact', subKey: 'nav.contact.sub' },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Late night, huh?';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

interface SidePanelProps {
  activeSection: string;
  visible: boolean;
}

export default function SidePanel({ activeSection, visible }: SidePanelProps) {
  const { t } = useLanguage();
  const typedTitle = useTypingEffect(
    ['Freelance Web Designer', 'Full-Stack Developer', 'I Build Websites That Convert', 'Your Next Web Partner'],
    80, 40, 2000
  );

  const greeting = useMemo(() => getGreeting(), []);

  return (
    <aside className={`${styles.panel} ${visible ? styles.visible : ''}`}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.greeting} data-mono>{greeting} 👋</span>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>{t('devLevel.status')}</span>
          </div>
          <div className={styles.avatarRow}>
            <Avatar size="md" showRing showStatus />
          </div>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>
              <a href="#home" className={styles.nameLink} data-cursor-hover>
                Prithwin M
              </a>
            </h1>
            <LevelBadge size="small" />
          </div>
          <div className={styles.titleWrap}>
            <span className={styles.titleLine} />
            <p className={styles.title}>
              {typedTitle}<span className={styles.cursor}>|</span>
            </p>
          </div>
          <TextReveal className={styles.bio} delay={600} stagger={50}>
            {t('about.bio')}
          </TextReveal>
        </div>

        <nav className={styles.nav}>
          {NAV_IDS.map(({ id, tKey, subKey }) => {
            const label = t(tKey);
            const sub = t(subKey);
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`${styles.navLink} ${activeSection === id ? styles.active : ''}`}
                data-cursor-hover
              >
                <span className={styles.navLine} />
                <span className={styles.navLabel}>
                  {label}
                  {sub && <span className={styles.navSubtitle}> {sub}</span>}
                </span>
              </a>
            );
          })}
        </nav>

        <div className={styles.bottom}>
          <div className={styles.socials}>
            <a
              href="https://github.com/prithwin0146"
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
              data-cursor-hover
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/prithwin-m"
              target="_blank"
              rel="noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
              data-cursor-hover
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="mailto:Prithwin0146@gmail.com"
              className={styles.socialLink}
              aria-label="Email"
              data-cursor-hover
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
          </div>
          <div className={styles.cmdHint} data-cursor-hover>
            <kbd className={styles.cmdKbd}>⌘K</kbd>
            <span className={styles.cmdLabel}>Command palette</span>
          </div>
          <div className={styles.xpBar}>
            <XPProgressBar compact />
          </div>
        </div>
      </div>
    </aside>
  );
}
