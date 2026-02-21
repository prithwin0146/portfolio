import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { trackCommandPaletteUse } from '../../services/achievementService';
import styles from './CommandPalette.module.css';

interface PaletteItem {
  id: string;
  label: string;
  section: string;
  icon: string;
  action: () => void;
  keywords?: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items: PaletteItem[] = useMemo(() => [
    // Navigation
    { id: 'nav-about', label: 'Go to About', section: 'Navigation', icon: '👤', action: () => scrollTo('about'), keywords: 'bio intro' },
    { id: 'nav-projects', label: 'Go to Projects', section: 'Navigation', icon: '🚀', action: () => scrollTo('projects'), keywords: 'work portfolio' },
    { id: 'nav-skills', label: 'Go to Skills', section: 'Navigation', icon: '⚡', action: () => scrollTo('skills'), keywords: 'tech stack' },
    { id: 'nav-contact', label: 'Go to Contact', section: 'Navigation', icon: '✉️', action: () => scrollTo('contact'), keywords: 'email message' },
    { id: 'nav-top', label: 'Back to Top', section: 'Navigation', icon: '⬆️', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    // Links
    { id: 'link-github', label: 'Open GitHub', section: 'Links', icon: '🐙', action: () => window.open('https://github.com/prithwin0146', '_blank') },
    { id: 'link-linkedin', label: 'Open LinkedIn', section: 'Links', icon: '💼', action: () => window.open('https://www.linkedin.com/in/prithwin-m', '_blank') },
    { id: 'link-email', label: 'Send Email', section: 'Links', icon: '📧', action: () => window.open('mailto:Prithwin0146@gmail.com') },
    // Actions
    { id: 'action-resume', label: 'Download Resume', section: 'Actions', icon: '📄', action: () => window.open('/resume.pdf', '_blank'), keywords: 'cv pdf' },
    { id: 'action-source', label: 'View Source Code', section: 'Actions', icon: '🔗', action: () => window.open('https://github.com/prithwin0146', '_blank'), keywords: 'code repo' },
  ], []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.toLowerCase().includes(q))
    );
  }, [query, items]);

  // Group by section
  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    filtered.forEach((item) => {
      const arr = map.get(item.section) || [];
      arr.push(item);
      map.set(item.section, arr);
    });
    return map;
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) trackCommandPaletteUse();
          return !prev;
        });
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keep selected in view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selected}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((prev) => Math.min(prev + 1, flatList.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && flatList[selected]) {
        e.preventDefault();
        flatList[selected].action();
        setOpen(false);
      }
    },
    [flatList, selected]
  );

  if (!open) return null;

  let itemIndex = -1;

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className={styles.inputWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className={styles.kbd}>ESC</kbd>
        </div>

        {/* Results */}
        <div className={styles.list} ref={listRef}>
          {flatList.length === 0 && (
            <p className={styles.empty}>No results found</p>
          )}
          {Array.from(grouped.entries()).map(([section, sectionItems]) => (
            <div key={section}>
              <p className={styles.sectionLabel}>{section}</p>
              {sectionItems.map((item) => {
                itemIndex++;
                const idx = itemIndex;
                return (
                  <button
                    key={item.id}
                    data-index={idx}
                    className={`${styles.item} ${idx === selected ? styles.selected : ''}`}
                    onClick={() => {
                      item.action();
                      setOpen(false);
                    }}
                    onMouseEnter={() => setSelected(idx)}
                  >
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <span className={styles.itemLabel}>{item.label}</span>
                    {idx === selected && <span className={styles.itemArrow}>↵</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className={styles.footer}>
          <span className={styles.footerHint}><kbd className={styles.kbdSmall}>↑↓</kbd> navigate</span>
          <span className={styles.footerHint}><kbd className={styles.kbdSmall}>↵</kbd> select</span>
          <span className={styles.footerHint}><kbd className={styles.kbdSmall}>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
