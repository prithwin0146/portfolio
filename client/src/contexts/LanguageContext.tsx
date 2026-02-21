import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Language = 'english' | 'sarcasm' | 'binary' | 'emoji' | 'lorem' | 'stunnah';

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
  'nav.profile': '👤',
  'nav.projects': '⭐ 📦',
  'nav.contact': '📧',
  'nav.skills': '💻',
  'nav.services': '⚙️',
  // Logo
  'logo': '🔥 PRITHWIN 🚀',
  // Section headers
  'section.about.title': '👤',
  'section.about.accent': '📋',
  'section.services.title': '⚙️',
  'section.services.accent': '🛠️',
  'section.projects.title': '⭐',
  'section.projects.accent': '📦',
  'section.skills.title': '💻',
  'section.skills.accent': '🧠',
  'section.testimonials.title': '💬',
  'section.testimonials.accent': '👥',
  'section.contact.title': '📧',
  'section.contact.accent': '🤝',
  'section.devLevel.title': '🎮',
  'section.devLevel.accent': '📊',
  'section.achievements.title': '🏆',
  'section.achievements.accent': '🎖️',
  'section.githubStats.title': '📊',
  'section.githubStats.accent': '📈',
  'section.githubReplay.title': '📈',
  'section.githubReplay.accent': '🎬',
  'section.recentActivity.title': '📋',
  'section.recentActivity.accent': '⏱️',
  'section.resume.title': '📄',
  'section.resume.accent': '📝',
  'section.hobbies.title': '✨',
  'section.hobbies.accent': '🎯',
  // Stats
  'stats.repos': '📁',
  'stats.followers': '👥',
  'stats.stars': '⭐',
  'stats.experience': '⏰ 📅',
  'stats.achievements': '🏆',
  // Dev level
  'devLevel.title': '🎮 📊',
  'devLevel.status': '🟢 💼',
  // Info
  'header.info': '🔍',
  // Bio
  'about.bio': '👨‍💻 🌐 ✨ 🚀 💼 🎯 ...',
  'about.location': '📍 🇮🇳 · 🌍',
  'about.statProjects': '📦',
  'about.statSatisfaction': '😊',
  'about.statResponse': '⚡',
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
  'header.info': 'THE TEA',
  // Section headers
  'section.about.title': "Who's ",
  'section.about.accent': 'This Guy',
  'section.services.title': 'The ',
  'section.services.accent': 'Grind',
  'section.projects.title': 'The ',
  'section.projects.accent': 'Drops',
  'section.skills.title': "What's the ",
  'section.skills.accent': 'Sauce',
  'section.testimonials.title': 'Real Ones ',
  'section.testimonials.accent': 'Speaking',
  'section.contact.title': 'Holla ',
  'section.contact.accent': 'At Me',
  'section.devLevel.title': 'Gamer ',
  'section.devLevel.accent': 'Stats',
  'section.achievements.title': 'The ',
  'section.achievements.accent': 'Flex',
  'section.githubStats.title': 'Git ',
  'section.githubStats.accent': 'Clout',
  'section.githubReplay.title': 'The ',
  'section.githubReplay.accent': 'Highlights',
  'section.recentActivity.title': 'Recent ',
  'section.recentActivity.accent': 'Moves',
  'section.resume.title': 'The ',
  'section.resume.accent': 'Receipt',
  'section.hobbies.title': 'Off the ',
  'section.hobbies.accent': 'Clock',
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
  'about.bio': "Yo, I build fire websites that make businesses pop off online — landing pages, full-stack apps, the whole nine. Let's cook something crazy.",
  'about.location': 'Based in India · shipping worldwide no cap',
  'about.statProjects': 'Projects\nShipped',
  'about.statSatisfaction': "They're\nHappy",
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
  const [language, setLanguage] = useState<Language>('english');

  const t = useCallback(
    (key: string): string => {
      // Special modes: binary, emoji, lorem, stunnah
      if (language === 'binary') {
        const english = TRANSLATIONS.english[key];
        if (!english) return key;
        return toBinary(english.replace(/\n/g, ' ').trim());
      }

      if (language === 'emoji') {
        return EMOJI_MAP[key] ?? TRANSLATIONS.english[key] ?? key;
      }

      if (language === 'lorem') {
        // For sub keys return empty
        if (key.endsWith('.sub')) return '';
        return loremShort();
      }

      if (language === 'stunnah') {
        return STUNNAH_MAP[key] ?? TRANSLATIONS.english[key] ?? key;
      }

      // English or sarcasm — look up in table
      const table = TRANSLATIONS[language] ?? TRANSLATIONS.english;
      return table[key] ?? TRANSLATIONS.english[key] ?? key;
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
