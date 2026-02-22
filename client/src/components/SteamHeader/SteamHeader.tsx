import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAchievementStats } from '../../services/achievementService';
import { useLanguage, type Language } from '../../contexts/LanguageContext';
import Avatar from '../Avatar/Avatar';
import styles from './SteamHeader.module.css';

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'english', label: 'English', flag: '🇬🇧' },
  { id: 'sarcasm', label: 'Sarcasm', flag: '😏' },
  { id: 'binary', label: 'Binary', flag: '🤖' },
  { id: 'emoji', label: 'Emoji Only', flag: '😀' },
  { id: 'lorem', label: 'Lorem Ipsum', flag: '📜' },
  { id: 'stunnah', label: 'Young Stunnah', flag: '🔥' },
];

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langSubmenu, setLangSubmenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

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

  // Close dropdown on click outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
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
          <nav className={styles.navLinks}>
            {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.navLink} ${activeSection === item.id ? styles.active : ''}`}
                  onClick={() => scrollTo(item.id)}
                >
                  {t(item.tKey)}
                </button>
            ))}
          </nav>
        </div>
        <div className={styles.right}>
          {onOpenInfo && (
            <button className={styles.infoBtn} onClick={onOpenInfo}>
              <span className={styles.infoCircle}>⊙</span> {t('header.info')}
            </button>
          )}
          <button className={styles.achievement} onClick={onOpenAchievements}>
            <span className={styles.trophyIcon}>🏆</span>
            <span className={styles.achievementCount}>
              {stats.unlockedCount}/{stats.totalCount}
            </span>
          </button>
          <div className={styles.usernameWrap} ref={dropdownRef}>
            <button
              className={styles.username}
              onClick={() => setDropdownOpen((o) => !o)}
            >
              {username} ▾
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={() => { setDropdownOpen(false); scrollTo('about'); }}>
                  Account details
                </button>
                <button className={styles.dropdownItem} onClick={() => { setDropdownOpen(false); onOpenInfo?.(); }}>
                  View portfolio info
                </button>
                <div className={styles.dropdownDivider} />
                <div
                  className={styles.langTriggerWrap}
                  onMouseEnter={() => setLangSubmenu(true)}
                  onMouseLeave={() => setLangSubmenu(false)}
                >
                  <button
                    className={`${styles.dropdownItem} ${styles.langTrigger}`}
                    onClick={() => setLangSubmenu((o) => !o)}
                  >
                    <span>🌐 Change language</span>
                    <span className={styles.langArrow}>▸</span>
                  </button>
                  {langSubmenu && (
                    <div className={styles.langSubmenu}>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          className={`${styles.langOption} ${language === lang.id ? styles.langActive : ''}`}
                          onClick={() => { setLanguage(lang.id); setLangSubmenu(false); setDropdownOpen(false); }}
                        >
                          <span>{lang.flag} {lang.label}</span>
                          {language === lang.id && <span className={styles.langCheck}>✓</span>}
                        </button>
                      ))}
                      <div className={styles.langSubmenuDivider} />
                      <span className={styles.langReport}>Report a translation problem</span>
                    </div>
                  )}
                </div>
                <div className={styles.dropdownDivider} />
                <button className={styles.dropdownItem} onClick={() => { setDropdownOpen(false); navigate('/signout'); }}>
                  Sign out of account…
                </button>
              </div>
            )}
          </div>
          <button className={styles.avatarBtn} onClick={() => setDropdownOpen((o) => !o)}>
            <Avatar size="sm" showRing={false} showStatus className={styles.navAvatar} />
          </button>
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
        <div className={styles.drawerProfile}>
          <Avatar size="sm" showRing showStatus />
          <div className={styles.drawerProfileInfo}>
            <span className={styles.drawerUser}>{username}</span>
            <span className={styles.drawerStatus}>Available for hire</span>
          </div>
        </div>
        <div className={styles.drawerHeader}>
          <button className={styles.achievement} onClick={() => { setMobileOpen(false); onOpenAchievements?.(); }}>
            <span className={styles.trophyIcon}>🏆</span>
            <span className={styles.achievementCount}>{stats.unlockedCount}/{stats.totalCount}</span>
          </button>
        </div>
        {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.drawerLink} ${activeSection === item.id ? styles.drawerActive : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {t(item.tKey)}
            </button>
        ))}
        <div className={styles.drawerActions}>
          {onOpenInfo && (
            <button className={styles.drawerInfoBtn} onClick={() => { setMobileOpen(false); onOpenInfo(); }}>
              {t('header.info')}
            </button>
          )}
          <div className={styles.drawerLangSection}>
            <span className={styles.drawerLangLabel}>🌐 Language</span>
            <div className={styles.drawerLangGrid}>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  className={`${styles.drawerLangBtn} ${language === lang.id ? styles.drawerLangActive : ''}`}
                  onClick={() => { setLanguage(lang.id); }}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
