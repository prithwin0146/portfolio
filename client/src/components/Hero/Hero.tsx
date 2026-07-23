import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../../services/api';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { useLanguage } from '../../contexts/LanguageContext';
import Avatar from '../Avatar/Avatar';
import type { Profile } from '../../types';
import { motion } from 'motion/react';

const fallback: Profile = {
  name: 'Prithwin M',
  title: 'Freelance Web Designer & Developer',
  bio: "I design and build modern websites that help businesses stand out online — from landing pages to full-stack web apps. Let's bring your vision to life.",
  email: 'Prithwin0146@gmail.com',
  gitHubUrl: 'https://github.com/prithwin0146',
  linkedInUrl: 'https://www.linkedin.com/in/prithwin-m',
  avatarUrl: '',
};

// Typing titles stay English — they're a character element, not translated content
const TYPING_TITLES = [
  'Freelance Web Designer',
  'Full-Stack Developer',
  'I Build Websites That Convert',
  'Your Next Web Partner',
];

export default function Hero() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile>(fallback);
  const [loaded, setLoaded] = useState(false);

  const typedTitle = useTypingEffect(TYPING_TITLES, 80, 40, 2000);

  useEffect(() => {
    api.getProfile().then((p) => {
      setProfile(p);
    }).catch(console.error);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  // Magnetic button effect using spring physics via motion/react would be better, but inline transforms are okay if kept snappy.
  const magnetRef1 = useRef<HTMLAnchorElement>(null);
  const magnetRef2 = useRef<HTMLAnchorElement>(null);

  const handleMagnet = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }, []);

  const resetMagnet = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-20 text-center" id="home">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <Avatar size="lg" showRing showStatus />
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-mono text-sm font-semibold tracking-widest text-steam-blue uppercase mb-4"
      >
        {t('hero.greeting')}
      </motion.p>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 animate-gradient-shift"
      >
        {profile.name}
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="font-mono text-base md:text-lg text-zinc-400 mb-8 h-8"
      >
        {typedTitle}<span className="animate-pulse text-steam-blue">|</span>
      </motion.p>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[50ch] text-base md:text-lg text-zinc-500 leading-relaxed mb-12"
      >
        {t('about.bio')}
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
      >
        {/* Primary CTA: Hire Me */}
        <a
          ref={magnetRef1}
          href="#contact"
          className="group relative flex h-12 min-w-[180px] items-center justify-center overflow-hidden bg-steam-blue transition-all duration-300 hover:scale-[0.97] active:scale-[0.94] active:duration-75"
          onMouseMove={handleMagnet}
          onMouseLeave={resetMagnet}
          style={{
            clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'linear-gradient(180deg, #66c0f4 0%, #4a90e2 100%)',
          }}
        >
          {/* Top-left flare on hover */}
          <div className="absolute -top-4 -left-4 h-8 w-8 rotate-45 bg-white opacity-0 transition-opacity duration-150 group-hover:opacity-40" />
          
          <div className="flex items-center gap-3">
            <span className="w-px h-4 bg-zinc-950/20" />
            <span className="font-mono text-sm font-bold tracking-widest text-zinc-950 uppercase">Hire Me</span>
            <span className="font-mono text-sm font-bold text-zinc-950/50">›</span>
          </div>
        </a>

        {/* Secondary CTA: View My Work */}
        <a
          ref={magnetRef2}
          href="#projects"
          className="group relative flex h-12 min-w-[180px] items-center justify-center overflow-hidden transition-all duration-300 hover:scale-[0.97] active:scale-[0.94] active:duration-75 bg-steam-blue/40 hover:bg-steam-blue"
          onMouseMove={handleMagnet}
          onMouseLeave={resetMagnet}
          style={{
            clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s',
          }}
        >
          <div 
            className="absolute inset-[1px] bg-zinc-950 transition-colors duration-300 group-hover:bg-[#101e36]"
            style={{
              clipPath: 'polygon(9px 0%, 100% 0%, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0% 100%, 0% 9px)',
            }}
          />
          
          {/* Left edge rail */}
          <div className="absolute left-[1px] top-0 bottom-0 w-[2px] bg-steam-blue z-10" />
          
          {/* Scanner sweep line on hover */}
          <div 
            className="absolute left-0 w-8 h-[2px] bg-steam-blue opacity-0 shadow-[0_0_8px_2px_#66c0f4] group-hover:opacity-100 group-hover:animate-[scan-x_1.5s_ease-in-out_infinite_alternate] z-10"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />

          <div className="relative z-20 flex items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-widest text-zinc-300 uppercase transition-colors group-hover:text-white">View My Work</span>
            <span className="font-mono text-sm text-steam-blue transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">↗</span>
          </div>
        </a>
      </motion.div>
      <style>{`
        @keyframes scan-x {
          0% { transform: translateY(-50%) translateX(0); }
          100% { transform: translateY(-50%) translateX(148px); }
        }
      `}</style>
    </section>
  );
}
