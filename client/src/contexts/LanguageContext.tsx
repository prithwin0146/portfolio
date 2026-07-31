import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getLanguage as getStoredLanguage, setLanguage as persistLanguage, onLanguageChange, type Language as ServiceLanguage } from '../services/languageService';

export type Language = ServiceLanguage;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

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
    // Section headers
    'section.about.title': 'About ',
    'section.about.accent': 'Me',
    'section.about.sub': 'The human behind the pixels',
    'section.services.title': 'My ',
    'section.services.accent': 'Services',
    'section.services.sub': 'What I can do for you',
    'section.projects.title': 'Featured ',
    'section.projects.accent': 'Projects',
    'section.projects.sub': 'Selected works',
    'section.skills.title': 'Technical ',
    'section.skills.accent': 'Skills',
    'section.skills.sub': 'Tools of the trade',
    'section.testimonials.title': 'What People ',
    'section.testimonials.accent': 'Say',
    'section.testimonials.sub': 'Client feedback',
    'section.contact.title': "Let's ",
    'section.contact.accent': 'Work Together',
    'section.contact.sub': 'Get in touch',
    'section.devLevel.title': 'Developer ',
    'section.devLevel.accent': 'Level',
    'section.devLevel.sub': 'Current progression',
    'section.achievements.title': 'Achievement ',
    'section.achievements.accent': 'Showcase',
    'section.achievements.sub': 'Unlocked badges',
    'section.githubStats.title': 'GitHub ',
    'section.githubStats.accent': 'Stats',
    'section.githubStats.sub': 'Code analytics',
    'section.githubReplay.title': 'GitHub ',
    'section.githubReplay.accent': 'Replay',
    'section.githubReplay.sub': 'Code history visualization',
    'section.recentActivity.title': 'Recent ',
    'section.recentActivity.accent': 'Activity',
    'section.recentActivity.sub': 'Latest events',
    'section.resume.title': '',
    'section.resume.accent': 'Resume',
    'section.resume.sub': 'Professional experience',
    'section.hobbies.title': 'Hobbies & ',
    'section.hobbies.accent': 'Interests',
    'section.hobbies.sub': 'Beyond the screen',
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
    'hero.greeting': "Hello, I'm",
    'hero.title1': 'Freelance Web Designer',
    'hero.title2': 'Full-Stack Developer',
    'hero.title3': 'I Build Websites That Convert',
    'hero.title4': 'Your Next Web Partner',
  },
  sarcasm: {
    'logo': "PRITHWIN'S EGO",
    'nav.profile': 'Narcissism',
    'nav.projects': 'Shiny Things',
    'nav.contact': 'Spam Me',
    'nav.skills': 'Buzzwords',
    'nav.services': 'Overpriced Gigs',
    'nav.profile.sub': '(Who cares)',
    'nav.projects.sub': '(Copy-pasted from SO)',
    'nav.contact.sub': "(I won't read it)",
    'nav.skills.sub': '(I googled these once)',
    'nav.services.sub': '(Give me money)',
    'header.info': 'TOS (IGNORED)',
    // Section headers
    'section.about.title': 'Behold ',
    'section.about.accent': 'Me',
    'section.about.sub': 'The main character syndrome',
    'section.services.title': 'Ways to ',
    'section.services.accent': 'Pay Me',
    'section.services.sub': 'Empty promises included',
    'section.projects.title': 'Glorified ',
    'section.projects.accent': 'Tutorials',
    'section.projects.sub': 'I barely understand this code',
    'section.skills.title': 'Acronym ',
    'section.skills.accent': 'Soup',
    'section.skills.sub': 'Things I listed to pass HR filters',
    'section.testimonials.title': 'Paid ',
    'section.testimonials.accent': 'Actors',
    'section.testimonials.sub': 'My mom thinks I\'m great',
    'section.contact.title': "Please ",
    'section.contact.accent': 'Hire Me',
    'section.contact.sub': 'I have server bills to pay',
    'section.devLevel.title': 'Imaginary ',
    'section.devLevel.accent': 'Status',
    'section.devLevel.sub': 'Meaningless gamification',
    'section.achievements.title': 'Participation ',
    'section.achievements.accent': 'Trophies',
    'section.achievements.sub': 'For doing the bare minimum',
    'section.githubStats.title': 'Green Square ',
    'section.githubStats.accent': 'Farming',
    'section.githubStats.sub': 'Changing typos in READMEs',
    'section.githubReplay.title': 'Commit ',
    'section.githubReplay.accent': 'Forgery',
    'section.githubReplay.sub': 'Pushing to main on Fridays',
    'section.recentActivity.title': 'Desperate ',
    'section.recentActivity.accent': 'Moves',
    'section.recentActivity.sub': 'Trying to stay relevant',
    'section.resume.title': 'Exaggerated ',
    'section.resume.accent': 'History',
    'section.resume.sub': 'ChatGPT wrote this entire thing',
    'section.hobbies.title': 'Touching ',
    'section.hobbies.accent': 'Grass',
    'section.hobbies.sub': 'A completely foreign concept',
    // Stats sidebar
    'stats.repos': 'ABANDONED APPS',
    'stats.followers': 'BOTS',
    'stats.stars': 'SYMPATHY VOTES',
    'stats.experience': 'YEARS OF IMPOSTER SYNDROME',
    'stats.achievements': 'USELESS PIXELS',
    // Dev level
    'devLevel.title': 'Level {level} Fraud',
    'devLevel.status': 'Googling how to center a div... still',
    // About bio
    'about.bio': "Just another self-proclaimed 'Full-Stack Developer' who spends 90% of the time fixing npm dependency errors and 10% asking ChatGPT to fix the code I broke. Hire me before AI actually takes my job.",
    'about.location': 'Earth · Probably inside',
    'about.statProjects': 'Projects\n"Finished"',
    'about.statSatisfaction': 'Clients\nFooled',
    'about.statResponse': 'Anxiety\nSpikes',
    'hero.greeting': "Brace yourself, I'm",
    'hero.title1': 'Professional Googler',
    'hero.title2': 'StackOverflow Copier',
    'hero.title3': 'I Break Production Daily',
    'hero.title4': 'Your Next Headache',
  },
  brainrot: {
    'logo': "PRITHWIN.W",
    'nav.profile': 'The Lore',
    'nav.projects': 'Cook Session',
    'nav.contact': 'Slide In',
    'nav.skills': 'The Sauce',
    'nav.services': 'The Hustle',
    'nav.profile.sub': '(No cap)',
    'nav.projects.sub': '(Let him cook)',
    'nav.contact.sub': '(DMs open)',
    'nav.skills.sub': '(Built different)',
    'nav.services.sub': '(W Rizz)',
    'header.info': 'THE TEA',
    // Section headers
    'section.about.title': 'Main Character ',
    'section.about.accent': 'Energy',
    'section.about.sub': 'Aura level: over 9000',
    'section.services.title': 'Catching ',
    'section.services.accent': 'Dubs',
    'section.services.sub': 'Securing the bag fr fr',
    'section.projects.title': 'Certified ',
    'section.projects.accent': 'Bangers',
    'section.projects.sub': 'I cooked these up',
    'section.skills.title': 'Gigachad ',
    'section.skills.accent': 'Stack',
    'section.skills.sub': 'Valid tools only',
    'section.testimonials.title': 'Vibe ',
    'section.testimonials.accent': 'Check',
    'section.testimonials.sub': 'Passed with flying colors',
    'section.contact.title': "Drop A ",
    'section.contact.accent': 'Ping',
    'section.contact.sub': 'Don\'t leave me on read bro',
    'section.devLevel.title': 'Sigma ',
    'section.devLevel.accent': 'Grindset',
    'section.devLevel.sub': 'Maxing out stats rn',
    'section.achievements.title': 'Massive ',
    'section.achievements.accent': 'W\'s',
    'section.achievements.sub': 'Collecting Ws like Infinity Stones',
    'section.githubStats.title': 'Git ',
    'section.githubStats.accent': 'Rizz',
    'section.githubStats.sub': 'Green squares hitting different',
    'section.githubReplay.title': 'Code ',
    'section.githubReplay.accent': 'Rewind',
    'section.githubReplay.sub': 'Core memories unlocked',
    'section.recentActivity.title': 'Current ',
    'section.recentActivity.accent': 'Era',
    'section.recentActivity.sub': 'What\'s the move',
    'section.resume.title': 'The ',
    'section.resume.accent': 'Receipts',
    'section.resume.sub': 'Proof of the grind no cap',
    'section.hobbies.title': 'Side ',
    'section.hobbies.accent': 'Quests',
    'section.hobbies.sub': 'NPC activities',
    // Stats sidebar
    'stats.repos': 'REPO DUBS',
    'stats.followers': 'THE SQUAD',
    'stats.stars': 'GLAZE POINTS',
    'stats.experience': 'YEARS LOCKED IN',
    'stats.achievements': 'FLEXES',
    // Dev level
    'devLevel.title': 'Level {level} Sigma',
    'devLevel.status': 'Locked in 🔒',
    // About bio
    'about.bio': "Yo, I'm literally just out here building sites that have insane aura. If your current website is giving NPC energy, hit me up and we'll hit it with that W rizz. Skibidi toilet sigma grindset, strictly vibes.",
    'about.location': 'Ohio · Living in your walls',
    'about.statProjects': 'Cooks\nDelivered',
    'about.statSatisfaction': 'Vibes\nChecked',
    'about.statResponse': 'Speedrun\nTime',
    'hero.greeting': "What's good, I'm",
    'hero.title1': 'Aesthetic Architect',
    'hero.title2': 'Code Alchemist',
    'hero.title3': 'I Build Sites With Aura',
    'hero.title4': 'Your Next W',
  },
  corpo: {
    'logo': "PRITHWIN ENTERPRISES",
    'nav.profile': 'Executive Summary',
    'nav.projects': 'Deliverables',
    'nav.contact': 'Touch Base',
    'nav.skills': 'Core Competencies',
    'nav.services': 'Value Add',
    'nav.profile.sub': '(Synergy)',
    'nav.projects.sub': '(KPIs met)',
    'nav.contact.sub': '(Circle back)',
    'nav.skills.sub': '(Leveraged)',
    'nav.services.sub': '(Paradigm shift)',
    'header.info': 'MEMO',
    // Section headers
    'section.about.title': 'Strategic ',
    'section.about.accent': 'Overview',
    'section.about.sub': 'Holistic perspective',
    'section.services.title': 'Value ',
    'section.services.accent': 'Proposition',
    'section.services.sub': 'Synergistic solutions',
    'section.projects.title': 'Actionable ',
    'section.projects.accent': 'Deliverables',
    'section.projects.sub': 'Optimized workflows',
    'section.skills.title': 'Core ',
    'section.skills.accent': 'Competencies',
    'section.skills.sub': 'Leveraging technology',
    'section.testimonials.title': 'Stakeholder ',
    'section.testimonials.accent': 'Feedback',
    'section.testimonials.sub': 'Q3 Performance Review',
    'section.contact.title': "Let's ",
    'section.contact.accent': 'Circle Back',
    'section.contact.sub': 'Take this offline',
    'section.devLevel.title': 'Corporate ',
    'section.devLevel.accent': 'Ladder',
    'section.devLevel.sub': 'Quarterly growth',
    'section.achievements.title': 'Performance ',
    'section.achievements.accent': 'Metrics',
    'section.achievements.sub': 'OKRs achieved',
    'section.githubStats.title': 'Version Control ',
    'section.githubStats.accent': 'Analytics',
    'section.githubStats.sub': 'ROI on commits',
    'section.githubReplay.title': 'Sprint ',
    'section.githubReplay.accent': 'Retrospective',
    'section.githubReplay.sub': 'Agile methodologies',
    'section.recentActivity.title': 'Bandwidth ',
    'section.recentActivity.accent': 'Allocation',
    'section.recentActivity.sub': 'Current action items',
    'section.resume.title': 'Curriculum ',
    'section.resume.accent': 'Vitae',
    'section.resume.sub': 'Career trajectory',
    'section.hobbies.title': 'Work-Life ',
    'section.hobbies.accent': 'Balance',
    'section.hobbies.sub': 'Mandatory wellness',
    // Stats sidebar
    'stats.repos': 'ASSETS DEPLOYED',
    'stats.followers': 'NETWORK CONNECTIONS',
    'stats.stars': 'ENDORSEMENTS',
    'stats.experience': 'FISCAL YEARS',
    'stats.achievements': 'KPIs HIT',
    // Dev level
    'devLevel.title': 'Tier {level} Resource',
    'devLevel.status': 'Aligning paradigms',
    // About bio
    'about.bio': "As a proactive, solutions-oriented professional, I leverage cross-functional paradigms to deliver robust, scalable web assets that drive ROI and synergize with enterprise-level objectives. Let's touch base and drill down on your KPIs.",
    'about.location': 'India · Remote hybrid model',
    'about.statProjects': 'Assets\nDeployed',
    'about.statSatisfaction': 'Stakeholder\nBuy-in',
    'about.statResponse': 'Turnaround\nTime',
    'hero.greeting': "Greetings, I am",
    'hero.title1': 'Digital Solutions Architect',
    'hero.title2': 'Full-Stack Synergist',
    'hero.title3': 'I Maximize Digital ROI',
    'hero.title4': 'Your Next Asset',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    const unsubscribe = onLanguageChange((newLang) => {
      setLanguageState(newLang);
    });
    return unsubscribe;
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    // If the language selected from the UI isn't in our new dict, fallback to english
    const safeLang = TRANSLATIONS[lang] ? lang : 'english';
    persistLanguage(safeLang as Language);
    setLanguageState(safeLang as Language);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const english = TRANSLATIONS.english[key] ?? key;
      const dict = TRANSLATIONS[language];
      if (dict && dict[key]) {
        return dict[key];
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

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
