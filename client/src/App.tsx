import { useEffect, useRef, useState } from 'react';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { useLenis } from './hooks/useLenis';
import { useActiveSection } from './hooks/useActiveSection';
import { useScrollSkew } from './hooks/useScrollSkew';
import Preloader from './components/Preloader/Preloader';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import CommandPalette from './components/CommandPalette/CommandPalette';
import KonamiEaster from './components/KonamiEaster/KonamiEaster';
import LevelUpToast from './components/LevelUpToast/LevelUpToast';
import AchievementToast from './components/AchievementToast/AchievementToast';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import SteamHeader from './components/SteamHeader/SteamHeader';
import SteamNotifications from './components/SteamNotifications/SteamNotifications';
import AchievementModal from './components/AchievementModal/AchievementModal';
import InfoModal from './components/InfoModal/InfoModal';
import Navbar from './components/Navbar/Navbar';
import SidePanel from './components/SidePanel/SidePanel';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import DeveloperLevel from './components/DeveloperLevel/DeveloperLevel';
import Experience from './components/Experience/Experience';
import AchievementShowcase from './components/AchievementShowcase/AchievementShowcase';
import Projects from './components/Projects/Projects';
import GitHubReplay from './components/GitHubReplay/GitHubReplay';
import Skills from './components/Skills/Skills';
import ResumeViewer from './components/ResumeViewer/ResumeViewer';
import GitHubStats from './components/GitHubStats/GitHubStats';
import RecentActivity from './components/RecentActivity/RecentActivity';
import Hobbies from './components/Hobbies/Hobbies';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import SectionDivider from './components/SectionDivider/SectionDivider';

const SECTIONS = ['about', 'services', 'projects', 'skills', 'contact'];

function App() {
  const [loaded, setLoaded] = useState(false);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSection(SECTIONS);

  // Lenis smooth scroll
  useLenis();

  // Scroll velocity skew effect
  useScrollSkew();

  // Track mouse for spotlight effect via CSS custom properties (perf-friendly)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (wrapperRef.current) {
        wrapperRef.current.style.setProperty('--mx', `${e.clientX}px`);
        wrapperRef.current.style.setProperty('--my', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <LanguageProvider>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <ScrollProgress />
      <CommandPalette />
      <KonamiEaster />
      <LevelUpToast />
      <AchievementToast />
      <SteamNotifications />
      <AchievementModal open={achievementModalOpen} onClose={() => setAchievementModalOpen(false)} />
      <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
      <div className="appWrapper" ref={wrapperRef}>
        <ParticleBackground />
        {/* Steam-style sticky header */}
        <SteamHeader
          username="Prithwin M"
          activeSection={activeSection}
          onOpenAchievements={() => setAchievementModalOpen(true)}
          onOpenInfo={() => setInfoModalOpen(true)}
        />
        {/* Mobile-only top navbar */}
        <Navbar />
        {/* Mobile-only hero section */}
        <Hero />
        {/* Two-column layout (desktop) / stacked (mobile) */}
        <div className="layout">
          <SidePanel activeSection={activeSection} visible={loaded} />
          <main className="mainContent">
            <About />
            <SectionDivider />
            <DeveloperLevel />
            <SectionDivider />
            <Experience />
            <SectionDivider />
            <AchievementShowcase />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <GitHubReplay />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <ResumeViewer />
            <SectionDivider />
            <GitHubStats />
            <SectionDivider />
            <RecentActivity />
            <SectionDivider />
            <Hobbies />
            <SectionDivider />
            <Contact />
            <Footer />
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
