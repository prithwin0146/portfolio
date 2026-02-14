import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const navItems = ['About', 'Services', 'Projects', 'Skills', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > 300 && y > lastY && !menuOpen);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY, menuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={[
          styles.navbar,
          scrolled ? styles.scrolled : '',
          hidden ? styles.hidden : '',
        ].join(' ')}
      >
        <div className={styles.logo}>
          &lt;<span>Prithwin</span> /&gt;
        </div>

        <ul className={styles.links}>
          {navItems.map((item, i) => (
            <li key={item} style={{ animationDelay: `${i * 0.1}s` }}>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </li>
          ))}
        </ul>

        <div className={styles.status} data-cursor-hover>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>Available</span>
        </div>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileLinks}>
          {navItems.map((item, i) => (
            <li key={item} style={{ transitionDelay: menuOpen ? `${i * 0.08 + 0.15}s` : '0s' }}>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.mobileStatus}>
          <span className={styles.statusDot} />
          Available for freelance work
        </div>
      </div>
    </>
  );
}
