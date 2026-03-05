import { useState, useRef, useEffect } from 'react';
import { useLanguage, type Language } from '../../contexts/LanguageContext';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'english', label: 'English' },
  { id: 'sarcasm', label: 'Sarcasm' },
  { id: 'binary', label: 'Binary' },
  { id: 'emoji', label: 'Emoji Only' },
  { id: 'lorem', label: 'Lorem Ipsum' },
  { id: 'youngStunnah', label: 'Young Stunnah' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div ref={ref} className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        🌐
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.dropdownHeader}>Change language</div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              className={`${styles.option} ${language === lang.id ? styles.active : ''}`}
              role="option"
              aria-selected={language === lang.id}
              onClick={() => {
                setLanguage(lang.id);
                setOpen(false);
              }}
            >
              <span>{lang.label}</span>
              {language === lang.id && <span className={styles.check}>✓</span>}
            </button>
          ))}
          <div className={styles.divider} />
          <button className={styles.reportLink}>Report a translation problem</button>
        </div>
      )}
    </div>
  );
}
