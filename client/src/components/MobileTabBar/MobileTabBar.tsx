import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './MobileTabBar.module.css';

const TABS = [
  { id: 'about',    icon: '👤', tKey: 'nav.profile' },
  { id: 'projects', icon: '🚀', tKey: 'nav.projects' },
  { id: 'skills',   icon: '⚙️', tKey: 'nav.skills' },
  { id: 'contact',  icon: '✉️', tKey: 'nav.contact' },
];

interface MobileTabBarProps {
  activeSection: string;
}

export default function MobileTabBar({ activeSection }: MobileTabBarProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide tab bar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`${styles.tabBar} ${!isVisible ? styles.hidden : ''}`}>
      {TABS.map(({ id, icon, tKey }) => {
        const isActive = activeSection === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            aria-label={t(tKey)}
          >
            {isActive && <div className={styles.indicator} />}
            <span className={`text-xl mb-0.5 ${isActive ? styles.activeIcon : 'opacity-70'}`}>
              {icon}
            </span>
            <span className={styles.label}>{t(tKey)}</span>
          </a>
        );
      })}
    </nav>
  );
}
