import { useTypingEffect } from '../../hooks/useTypingEffect';
import { useLanguage } from '../../contexts/LanguageContext';
import Avatar from '../Avatar/Avatar';
import LevelBadge from '../LevelBadge/LevelBadge';
import XPProgressBar from '../XPProgressBar/XPProgressBar';

// Typing titles stay English — character/brand element, not translatable content
const TYPING_TITLES = [
  'Freelance Web Designer',
  'Full-Stack Developer',
  'I Build Websites That Convert',
  'Your Next Web Partner',
];

const NAV_IDS = [
  { id: 'about',    tKey: 'nav.profile'  },
  { id: 'services', tKey: 'nav.services' },
  { id: 'projects', tKey: 'nav.projects' },
  { id: 'skills',   tKey: 'nav.skills'   },
  { id: 'contact',  tKey: 'nav.contact'  },
];

interface SidePanelProps {
  activeSection: string;
  visible: boolean;
}

export default function SidePanel({ activeSection, visible }: SidePanelProps) {
  const { t } = useLanguage();
  const typedTitle = useTypingEffect(TYPING_TITLES, 80, 40, 2000);

  return (
    <aside
      className={`
        hidden lg:flex flex-col
        sticky top-0 h-screen w-[44%] max-w-[460px] shrink-0
        pl-10 pr-14
        transition-all duration-1000
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Inner wrapper — controls vertical distribution without overflow:hidden */}
      <div className="flex flex-col h-full pt-28 pb-8 justify-between" style={{ overflow: 'visible' }}>

        {/* ── IDENTITY ── */}
        <div className="flex flex-col gap-5" style={{ overflow: 'visible' }}>
          {/* Avatar — needs overflow visible so speech bubble isn't clipped */}
          <div style={{ overflow: 'visible', paddingTop: '48px' }}>
            <Avatar size="lg" showRing speechBubble="DOMAIN EXPANSION" />
          </div>

          {/* Name + badge */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-[2.5rem] font-bold tracking-[-2.5px] leading-none">
                <a href="#home" className="animate-gradient-shift" data-cursor-hover>
                  Prithwin M
                </a>
              </h1>
              <LevelBadge size="small" />
            </div>

            {/* Typing title */}
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 shrink-0 bg-gradient-to-r from-steam-blue to-purple-500 rounded-full" />
              <p className="font-mono text-[0.8rem] text-zinc-400 font-medium min-h-[1.4em]">
                {typedTitle}<span className="text-steam-blue animate-pulse">|</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── NAV ── naturally sits in the middle via justify-between */}
        <nav className="flex flex-col gap-0">
          {NAV_IDS.map(({ id, tKey }) => {
            const label = t(tKey);
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className="group flex items-center gap-4 py-2.5 text-[10px] font-bold tracking-[0.28em] uppercase transition-all"
                data-cursor-hover
              >
                <span
                  className={`h-px shrink-0 transition-all duration-300 ease-out ${
                    isActive
                      ? 'w-14 bg-white'
                      : 'w-5 bg-zinc-700 group-hover:w-14 group-hover:bg-zinc-400'
                  }`}
                />
                <span
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'text-white translate-x-2'
                      : 'text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1'
                  }`}
                >
                  {label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* ── FOOTER ── */}
        <div className="flex flex-col gap-4 pt-4 border-t border-white/[0.06]">
          {/* Socials + cmd hint */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/prithwin0146"
              target="_blank" rel="noreferrer"
              className="text-zinc-500 transition-all hover:text-white hover:-translate-y-0.5"
              aria-label="GitHub" data-cursor-hover
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/prithwin-m"
              target="_blank" rel="noreferrer"
              className="text-zinc-500 transition-all hover:text-white hover:-translate-y-0.5"
              aria-label="LinkedIn" data-cursor-hover
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="mailto:Prithwin0146@gmail.com"
              className="text-zinc-500 transition-all hover:text-white hover:-translate-y-0.5"
              aria-label="Email" data-cursor-hover
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>

            <div className="ml-auto flex items-center gap-1.5 group cursor-pointer" data-cursor-hover>
              <kbd className="font-mono text-[9px] text-zinc-600 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 transition-colors group-hover:border-steam-blue/30 group-hover:text-steam-blue">
                ⌘K
              </kbd>
              <span className="font-mono text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors">CMD</span>
            </div>
          </div>

          {/* XP bar */}
          <div className="w-full max-w-[220px]">
            <XPProgressBar compact />
          </div>
        </div>

      </div>
    </aside>
  );
}
