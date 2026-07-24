import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAchievementStats } from '../../services/achievementService';
import { useLanguage, type Language } from '../../contexts/LanguageContext';
import Avatar from '../Avatar/Avatar';

const LANGUAGES: { id: Language; label: string; flag: string; preview: string }[] = [
  { id: 'english',      label: 'English',       flag: '🇬🇧', preview: 'Normal mode' },
  { id: 'sarcasm',      label: 'Sarcasm',        flag: '😏', preview: 'Obviously genius' },
  { id: 'binary',       label: 'Binary',         flag: '🤖', preview: '01001000 01101001' },
  { id: 'emoji',        label: 'Emoji Only',     flag: '😀', preview: '📦 🚀 ⭐ 💻' },
  { id: 'lorem',        label: 'Lorem Ipsum',    flag: '📜', preview: 'Lorem ipsum...' },
  { id: 'youngStunnah', label: 'Young Stunnah',  flag: '🔥', preview: 'Petmalu, no cap!' },
];

const NAV_ITEMS = [
  { id: 'about', tKey: 'nav.profile' },
  { id: 'services', tKey: 'nav.services' },
  { id: 'projects', tKey: 'nav.projects' },
  { id: 'skills', tKey: 'nav.skills' },
  { id: 'contact', tKey: 'nav.contact' },
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

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-[100] flex h-12 w-full items-center justify-between border-b border-white/5 bg-[#09090b] px-3 lg:px-6 shadow-sm">
        <div className="flex h-full items-center">
          <nav className="hidden h-full md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex h-full items-center border-b-2 px-4 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  activeSection === item.id
                    ? 'border-steam-blue bg-white/5 text-white'
                    : 'border-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t(item.tKey)}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex h-full items-center gap-2">
          {onOpenInfo && (
            <button
              onClick={onOpenInfo}
              className="hidden items-center gap-1.5 rounded px-2 py-1 text-[11px] font-semibold tracking-wider text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:flex"
            >
              <span className="font-mono opacity-70">⊙</span> {t('header.info')}
            </button>
          )}

          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <span>🏆</span>
            <span className="font-mono font-semibold text-zinc-200">
              {stats.unlockedCount}/{stats.totalCount}
            </span>
          </button>

          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              {username} <span className="text-[10px]">▾</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 min-w-[200px] animate-in fade-in slide-in-from-top-2 rounded border border-white/10 bg-zinc-900 py-1 shadow-xl">
                <button
                  onClick={() => { setDropdownOpen(false); scrollTo('about'); }}
                  className="flex w-full items-center px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  Account details
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); onOpenInfo?.(); }}
                  className="flex w-full items-center px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  View portfolio info
                </button>
                <div className="my-1 h-px w-full bg-white/5" />
                
                <div
                  className="relative"
                  onMouseEnter={() => setLangSubmenu(true)}
                  onMouseLeave={() => setLangSubmenu(false)}
                >
                  <button
                    onClick={() => setLangSubmenu((o) => !o)}
                    className="flex w-full items-center justify-between px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <span>🌐 Change language</span>
                    <span className="text-[10px] text-zinc-500">▶</span>
                  </button>

                  {langSubmenu && (
                    <div className="absolute right-full top-0 mr-1 min-w-[220px] pt-0">
                      <div className="rounded border border-white/10 bg-zinc-900 py-1 shadow-xl relative after:content-[''] after:absolute after:-right-2 after:top-0 after:h-full after:w-4">
                        <div className="border-b border-white/5 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                          Select Language
                        </div>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => { setLanguage(lang.id); setLangSubmenu(false); setDropdownOpen(false); }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-white/10 ${
                            language === lang.id ? 'text-steam-blue' : 'text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{lang.flag}</span>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold">{lang.label}</span>
                              <span className="text-[10px] text-zinc-500">{lang.preview}</span>
                            </div>
                          </div>
                          {language === lang.id && <span>✓</span>}
                        </button>
                      ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="my-1 h-px w-full bg-white/5" />
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/signout'); }}
                  className="flex w-full items-center px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  Sign out of account…
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setDropdownOpen((o) => !o)} className="hidden md:flex">
            <Avatar size="sm" showRing={false} className="h-7 w-7" />
          </button>

          <button
            className="flex flex-col justify-center gap-1 p-1 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`block h-[2px] w-6 rounded-full bg-zinc-400 transition-transform ${mobileOpen ? 'translate-y-[6px] rotate-45 bg-white' : ''}`} />
            <span className={`block h-[2px] w-6 rounded-full bg-zinc-400 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-6 rounded-full bg-zinc-400 transition-transform ${mobileOpen ? '-translate-y-[6px] -rotate-45 bg-white' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[199] bg-black/60 transition-opacity md:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />
      <nav
        className={`fixed right-0 top-0 z-[200] flex h-full w-[280px] max-w-[80vw] flex-col border-l border-white/5 bg-zinc-950 px-5 py-6 transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-4">
          <Avatar size="sm" showRing showStatus />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{username}</span>
            <span className="font-mono text-[10px] font-semibold tracking-wide text-emerald-400">Available for hire</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`block w-full border-l-2 py-2.5 pl-3 text-left text-[13px] font-semibold tracking-wider uppercase transition-colors ${
                activeSection === item.id
                  ? 'border-steam-blue bg-white/5 text-white'
                  : 'border-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t(item.tKey)}
            </button>
          ))}
        </div>

        <div className="mt-auto border-t border-white/5 pt-4">
          <div className="mb-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            🌐 Language
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`flex items-center gap-2 rounded border px-3 py-2 text-xs transition-colors ${
                  language === lang.id
                    ? 'border-steam-blue/50 bg-steam-blue/10 text-steam-blue'
                    : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </div>

          <div className="my-4 h-px w-full bg-white/5" />
          
          <button
            onClick={() => { setMobileOpen(false); navigate('/signout'); }}
            className="flex w-full items-center justify-between rounded border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <span>Sign out of account…</span>
            <span className="opacity-70">⎋</span>
          </button>
        </div>
      </nav>
    </>
  );
}
