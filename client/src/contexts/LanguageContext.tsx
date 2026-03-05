import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getLanguage as getStoredLanguage, setLanguage as persistLanguage, onLanguageChange, type Language as ServiceLanguage } from '../services/languageService';

export type Language = ServiceLanguage;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// ── Binary encoder ──
function toBinary(text: string): string {
  return text
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

// ── Emoji map ──
const EMOJI_MAP: Record<string, string> = {
  // Nav & sections
  'nav.profile': '👤 Profile',
  'nav.projects': '📦 Projects',
  'nav.contact': '📧 Contact',
  'nav.skills': '🧠 Skills',
  'nav.services': '⚙️ Services',
  'nav.profile.sub': '',
  'nav.projects.sub': '',
  'nav.contact.sub': '',
  'nav.skills.sub': '',
  'nav.services.sub': '',
  // Logo
  'logo': '🎮 PRITHWIN',
  // Section headers
  'section.about.title': '👤 About ',
  'section.about.accent': 'Me',
  'section.about.sub': '🔎 The human behind the pixels',
  'section.services.title': '⚙️ What I ',
  'section.services.accent': 'Build',
  'section.services.sub': '🛠️ Turning ☕ into 💻',
  'section.projects.title': '📦 My ',
  'section.projects.accent': 'Work',
  'section.projects.sub': '⭐ Ship it!',
  'section.skills.title': '🧠 Tech ',
  'section.skills.accent': 'Stack',
  'section.skills.sub': '💪 Tools of the trade',
  'section.testimonials.title': '💬 What People ',
  'section.testimonials.accent': 'Say',
  'section.testimonials.sub': '🗣️ Word on the street',
  'section.contact.title': '📧 Say ',
  'section.contact.accent': 'Hello',
  'section.contact.sub': '🤝 Let\'s connect!',
  'section.devLevel.title': '🎮 Developer ',
  'section.devLevel.accent': 'Level',
  'section.devLevel.sub': '📊 XP grinding since 2024',
  'section.achievements.title': '🏆 Achievement ',
  'section.achievements.accent': 'Showcase',
  'section.achievements.sub': '🎖️ Badges unlocked',
  'section.githubStats.title': '📊 GitHub ',
  'section.githubStats.accent': 'Stats',
  'section.githubStats.sub': '📈 Commit = Life',
  'section.githubReplay.title': '🎬 GitHub ',
  'section.githubReplay.accent': 'Replay',
  'section.githubReplay.sub': '📈 Rewind the code',
  'section.recentActivity.title': '⏱️ Recent ',
  'section.recentActivity.accent': 'Activity',
  'section.recentActivity.sub': '📋 Latest moves',
  'section.resume.title': '📄 ',
  'section.resume.accent': 'Resume',
  'section.resume.sub': '📝 The receipts',
  'section.hobbies.title': '✨ Hobbies & ',
  'section.hobbies.accent': 'Interests',
  'section.hobbies.sub': '🎯 Off-duty mode',
  // Stats
  'stats.repos': '📁 REPOS',
  'stats.followers': '👥 SQUAD',
  'stats.stars': '⭐ STARS',
  'stats.experience': '⏰ YEARS',
  'stats.achievements': '🏆 BADGES',
  // Dev level
  'devLevel.title': '🎮 Level {level} Developer',
  'devLevel.status': '🟢 Ready to 🤝',
  // Info
  'header.info': 'ℹ️',
  // Bio
  'about.bio': '👨‍💻 Building 🌐 with ☕ and ✨ — from landing pages 📄 to full-stack apps 🚀. Let\'s make something amazing 💫 together!',
  'about.location': '📍 India 🇮🇳 · 🌍 Working everywhere',
  'about.statProjects': '📦\nShipped',
  'about.statSatisfaction': '😊\nHappy',
  'about.statResponse': '⚡\nFast',
};

// ── Lorem Ipsum pool ──
const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.';

function loremShort(): string {
  return LOREM.slice(0, 30 + Math.floor(Math.random() * 20)) + '...';
}

// ── Young Stunnah slang ──
const STUNNAH_MAP: Record<string, string> = {
  'logo': "PRITHWIN'S CRIB",
  'nav.profile': 'Who Dis',
  'nav.projects': 'My Drops',
  'nav.contact': 'Holla At Me',
  'nav.skills': 'The Sauce',
  'nav.services': 'The Grind',
  'nav.profile.sub': '',
  'nav.projects.sub': '',
  'nav.contact.sub': '',
  'nav.skills.sub': '',
  'nav.services.sub': '',
  'header.info': 'THE TEA',
  // Section headers
  'section.about.title': "Who's ",
  'section.about.accent': 'This Guy',
  'section.about.sub': 'The origin story, no cap',
  'section.services.title': 'The ',
  'section.services.accent': 'Grind',
  'section.services.sub': 'What I bring to the table frfr',
  'section.projects.title': 'The ',
  'section.projects.accent': 'Drops',
  'section.projects.sub': 'Certified bangers only',
  'section.skills.title': "What's the ",
  'section.skills.accent': 'Sauce',
  'section.skills.sub': 'The full toolkit, bussin',
  'section.testimonials.title': 'Real Ones ',
  'section.testimonials.accent': 'Speaking',
  'section.testimonials.sub': 'Straight fax no printer',
  'section.contact.title': 'Holla ',
  'section.contact.accent': 'At Me',
  'section.contact.sub': "Slide into my inbox, let's cook",
  'section.devLevel.title': 'Gamer ',
  'section.devLevel.accent': 'Stats',
  'section.devLevel.sub': 'XP grind never stops',
  'section.achievements.title': 'The ',
  'section.achievements.accent': 'Flex',
  'section.achievements.sub': 'Trophies go brrrr',
  'section.githubStats.title': 'Git ',
  'section.githubStats.accent': 'Clout',
  'section.githubStats.sub': 'The numbers speak, fam',
  'section.githubReplay.title': 'The ',
  'section.githubReplay.accent': 'Highlights',
  'section.githubReplay.sub': 'Season recap, sheesh',
  'section.recentActivity.title': 'Recent ',
  'section.recentActivity.accent': 'Moves',
  'section.recentActivity.sub': "Peep what I've been up to",
  'section.resume.title': 'The ',
  'section.resume.accent': 'Receipt',
  'section.resume.sub': 'Proof of the grind',
  'section.hobbies.title': 'Off the ',
  'section.hobbies.accent': 'Clock',
  'section.hobbies.sub': 'Touch grass mode activated',
  // Stats
  'stats.repos': 'CODE DROPS',
  'stats.followers': 'THE SQUAD',
  'stats.stars': 'CLOUT POINTS',
  'stats.experience': 'TIME IN THE GAME',
  'stats.achievements': 'TROPHIES',
  // Dev level
  'devLevel.title': 'Lvl {level} Goat',
  'devLevel.status': 'Ready to collab frfr',
  // Bio
  'about.bio': "Yo, I build fire websites that make businesses pop off online — landing pages, full-stack apps, the whole nine. Clean code, sick designs, deployed and bussin. Let's cook something crazy together, no cap.",
  'about.location': 'Based in India · shipping worldwide no cap',
  'about.statProjects': 'Projects\nShipped',
  'about.statSatisfaction': "They're\nVibing",
  'about.statResponse': 'Reply\nSpeed',
};

// ── Translation tables ──
const TRANSLATIONS: Record<string, Record<string, string>> = {
  english: {
    'logo': "PRITHWIN'S PORTFOLIO",
    'nav.profile': 'Profile',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.skills': 'Skills',
    'nav.services': 'Services',
    'nav.profile.sub': '',
    'nav.projects.sub': '',
    'nav.contact.sub': '',
    'nav.skills.sub': '',
    'nav.services.sub': '',
    'header.info': 'INFO',
    // Section headers — title, accent, subtitle
    'section.about.title': 'About ',
    'section.about.accent': 'Me',
    'section.about.sub': '',
    'section.services.title': 'My ',
    'section.services.accent': 'Services',
    'section.services.sub': '',
    'section.projects.title': 'Featured ',
    'section.projects.accent': 'Projects',
    'section.projects.sub': '',
    'section.skills.title': 'Technical ',
    'section.skills.accent': 'Skills',
    'section.skills.sub': '',
    'section.testimonials.title': 'What People ',
    'section.testimonials.accent': 'Say',
    'section.testimonials.sub': '',
    'section.contact.title': "Let's ",
    'section.contact.accent': 'Work Together',
    'section.contact.sub': '',
    'section.devLevel.title': 'Developer ',
    'section.devLevel.accent': 'Level',
    'section.devLevel.sub': '',
    'section.achievements.title': 'Achievement ',
    'section.achievements.accent': 'Showcase',
    'section.achievements.sub': '',
    'section.githubStats.title': 'GitHub ',
    'section.githubStats.accent': 'Stats',
    'section.githubStats.sub': '',
    'section.githubReplay.title': 'GitHub ',
    'section.githubReplay.accent': 'Replay',
    'section.githubReplay.sub': '',
    'section.recentActivity.title': 'Recent ',
    'section.recentActivity.accent': 'Activity',
    'section.recentActivity.sub': '',
    'section.resume.title': '',
    'section.resume.accent': 'Resume',
    'section.resume.sub': '',
    'section.hobbies.title': 'Hobbies & ',
    'section.hobbies.accent': 'Interests',
    'section.hobbies.sub': '',
    // Stats sidebar
    'stats.repos': 'REPOSITORIES',
    'stats.followers': 'FOLLOWERS',
    'stats.stars': 'TOTAL STARS',
    'stats.experience': 'YEARS OF EXPERIENCE',
    'stats.achievements': 'ACHIEVEMENTS',
    // Dev level
    'devLevel.title': 'Level {level} Developer',
    'devLevel.status': 'Open to opportunities',
    // About bio
    'about.bio': "I design and build modern websites that help businesses stand out online — from landing pages to full-stack web apps. Let's bring your vision to life.",
    'about.location': 'Based in India · Working globally',
    'about.statProjects': 'Projects\nDelivered',
    'about.statSatisfaction': 'Client\nSatisfaction',
    'about.statResponse': 'Response\nTime',
  },
  sarcasm: {
    'logo': "PRITHWIN'S HUMBLE\nPORTFOLIO",
    'nav.profile': 'Profile',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.skills': 'Skills',
    'nav.services': 'Services',
    'nav.profile.sub': '(Totally Unique)',
    'nav.projects.sub': '(Revolutionary)',
    'nav.contact.sub': "(I'll Respond... Promise)",
    'nav.skills.sub': '(Allegedly)',
    'nav.services.sub': '(Groundbreaking)',
    'header.info': 'INFO (SPOILERS)',
    // Section headers
    'section.about.title': 'About ',
    'section.about.accent': 'Me',
    'section.about.sub': 'Totally Unique',
    'section.services.title': 'My ',
    'section.services.accent': 'Services',
    'section.services.sub': 'Groundbreaking',
    'section.projects.title': 'Featured ',
    'section.projects.accent': 'Experiments',
    'section.projects.sub': 'Revolutionary',
    'section.skills.title': 'Technical ',
    'section.skills.accent': 'Skills',
    'section.skills.sub': 'Allegedly',
    'section.testimonials.title': 'What People ',
    'section.testimonials.accent': 'Say',
    'section.testimonials.sub': 'Definitely Not Fake',
    'section.contact.title': "Let's ",
    'section.contact.accent': 'Work Together',
    'section.contact.sub': "I'll Respond... Promise",
    'section.devLevel.title': 'Developer ',
    'section.devLevel.accent': 'Level',
    'section.devLevel.sub': 'Self-Proclaimed',
    'section.achievements.title': 'Achievement ',
    'section.achievements.accent': 'Showcase',
    'section.achievements.sub': 'Participation Trophies',
    'section.githubStats.title': 'GitHub ',
    'section.githubStats.accent': 'Stats',
    'section.githubStats.sub': 'Inflated',
    'section.githubReplay.title': 'GitHub ',
    'section.githubReplay.accent': 'Replay',
    'section.githubReplay.sub': 'Reliving The Glory',
    'section.recentActivity.title': 'Recent ',
    'section.recentActivity.accent': 'Activity',
    'section.recentActivity.sub': "Proof I'm Alive",
    'section.resume.title': '',
    'section.resume.accent': 'Resume',
    'section.resume.sub': 'Exaggerated',
    'section.hobbies.title': 'Hobbies & ',
    'section.hobbies.accent': 'Interests',
    'section.hobbies.sub': 'Procrastination Methods',
    // Stats sidebar
    'stats.repos': 'CODE DUMPS',
    'stats.followers': 'STALKERS',
    'stats.stars': 'PITY STARS',
    'stats.experience': 'YEARS OF PRETENDING',
    'stats.achievements': 'PARTICIPATION TROPHIES',
    // Dev level
    'devLevel.title': 'Imaginary Level {level} Code Monkey',
    'devLevel.status': 'Definitely not desperate for opportunities',
    // About bio
    'about.bio': "Just another genius from India (humble brag) — allegedly building websites while mostly Googling errors. Got some certificates once, got some PDFs to prove it.",
    'about.location': 'Based in India · "Working" globally',
    'about.statProjects': 'Projects\n"Delivered"',
    'about.statSatisfaction': "They're\n\"Happy\"",
    'about.statResponse': 'Response\n(Eventually)',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  // Subscribe to external language changes (e.g. other tabs via service)
  useEffect(() => {
    const unsubscribe = onLanguageChange((newLang) => {
      setLanguageState(newLang);
    });
    return unsubscribe;
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    persistLanguage(lang);       // persist to localStorage + notify listeners
    setLanguageState(lang);      // update local React state immediately
  }, []);

  const t = useCallback(
    (key: string): string => {
      const english = TRANSLATIONS.english[key] ?? key;

      // Only section headings get transformed — everything else stays English
      const isSectionKey =
        key.startsWith('section.') &&
        (key.endsWith('.title') || key.endsWith('.accent') || key.endsWith('.sub'));

      if (language === 'english') return english;

      // For non-heading keys, always return English so nav/logo/stats stay readable
      if (!isSectionKey) {
        // Sarcasm gets full translation for non-heading keys too (they're still readable)
        if (language === 'sarcasm') {
          const table = TRANSLATIONS.sarcasm;
          return table[key] ?? english;
        }
        return english;
      }

      // — Section headings only below —

      if (language === 'binary') {
        if (key.endsWith('.sub')) return '';
        return toBinary(english.replace(/\n/g, ' ').trim());
      }

      if (language === 'emoji') {
        return EMOJI_MAP[key] ?? english;
      }

      if (language === 'lorem') {
        if (key.endsWith('.sub')) return '';
        return loremShort();
      }

      if (language === 'youngStunnah') {
        return STUNNAH_MAP[key] ?? english;
      }

      if (language === 'sarcasm') {
        const table = TRANSLATIONS.sarcasm;
        return table[key] ?? english;
      }

      return english;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
