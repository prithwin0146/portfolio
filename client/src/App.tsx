import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useLenis } from './hooks/useLenis';
import { useActiveSection } from './hooks/useActiveSection';
import { useScrollSkew } from './hooks/useScrollSkew';
import Preloader from './components/Preloader/Preloader';
import CustomCursor from './components/CustomCursor/CustomCursor';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import CommandPalette from './components/CommandPalette/CommandPalette';
import KonamiEaster from './components/KonamiEaster/KonamiEaster';
import LevelUpToast from './components/LevelUpToast/LevelUpToast';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import Navbar from './components/Navbar/Navbar';
import SidePanel from './components/SidePanel/SidePanel';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Testimonials from './components/Testimonials/Testimonials';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import SectionDivider from './components/SectionDivider/SectionDivider';

const SECTIONS = ['about', 'services', 'projects', 'skills', 'contact'];

function App() {
  const [loaded, setLoaded] = useState(false);
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
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <ScrollProgress />
      <CommandPalette />
      <KonamiEaster />
      <LevelUpToast />
      <div className="appWrapper" ref={wrapperRef}>
        <ParticleBackground />
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
            <Experience />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Testimonials />
            <SectionDivider />
            <Contact />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
