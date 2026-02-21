import { useEffect, useState } from 'react';
import { getAchievementStats } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './SteamHeader.module.css';

const NAV_ITEMS = [
  { id: 'about', tKey: 'nav.profile', subKey: 'nav.profile.sub' },
  { id: 'services', tKey: 'nav.services', subKey: 'nav.services.sub' },
  { id: 'projects', tKey: 'nav.projects', subKey: 'nav.projects.sub' },
  { id: 'skills', tKey: 'nav.skills', subKey: 'nav.skills.sub' },
  { id: 'contact', tKey: 'nav.contact', subKey: 'nav.contact.sub' },
];

interface SteamHeaderProps {
  username: string;
  activeSection?: string;
  onOpenAchievements?: () => void;
  onOpenInfo?: () => void;
}

export default function SteamHeader({ username, activeSection, onOpenAchievements, onOpenInfo }: SteamHeaderProps) {
  const [stats, setStats] = useState(() => getAchievementStats());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onUnlock = () => setStats(getAchievementStats());
    window.addEventListener('achievement-unlocked', onUnlock);
    return () => window.removeEventListener('achievement-unlocked', onUnlock);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <>
      <header className={styles.bar}>
        <div className={styles.left}>
          <span className={styles.logo}>{t('logo')}</span>
          <span className={styles.divider} />
          <nav className={styles.navLinks}>
            {NAV_ITEMS.map((item) => {
              const sub = t(item.subKey);
              return (
                <button
                  key={item.id}
                  className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                  onClick={() => scrollTo(item.id)}
                >
                  {t(item.tKey)} {sub && <span className={styles.navSubtitle}>{sub}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className={styles.right}>
          {onOpenInfo && (
            <button className={styles.infoBtn} onClick={onOpenInfo}>{t('header.info')}</button>
          )}
          <button className={styles.achievement} onClick={onOpenAchievements}>
            <span className={styles.trophyIcon}>🏆</span>
            <span className={styles.achievementCount}>
              {stats.unlockedCount}/{stats.totalCount}
            </span>
          </button>
          <span className={styles.username}>{username}</span>
          <LanguageSwitcher />
          <button className={styles.cmdHint} onClick={openCommandPalette}>
            ⌘K
          </button>
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={`${styles.overlay} ${mobileOpen ? styles.overlayVisible : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <nav className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerUser}>{username}</span>
          <button className={styles.achievement} onClick={() => { setMobileOpen(false); onOpenAchievements?.(); }}>
            <span className={styles.trophyIcon}>🏆</span>
            <span className={styles.achievementCount}>{stats.unlockedCount}/{stats.totalCount}</span>
          </button>
        </div>
        {NAV_ITEMS.map((item) => {
          const sub = t(item.subKey);
          return (
            <button
              key={item.id}
              className={`${styles.drawerLink} ${activeSection === item.id ? styles.drawerActive : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {t(item.tKey)} {sub && <span className={styles.drawerSubtitle}>{sub}</span>}
            </button>
          );
        })}
        <div className={styles.drawerActions}>
          {onOpenInfo && (
            <button className={styles.drawerInfoBtn} onClick={() => { setMobileOpen(false); onOpenInfo(); }}>
              {t('header.info')}
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
