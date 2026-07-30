import { useEffect, useState, useRef } from 'react';
import { api } from '../../services/api';
import { useTypingEffect } from '../../hooks/useTypingEffect';
import { useLanguage } from '../../contexts/LanguageContext';
import Avatar from '../Avatar/Avatar';
import Magnetic from '../Magnetic/Magnetic';
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

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 py-20 text-center" id="home">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <Avatar size="lg" showRing showStatus />
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="font-mono text-xs md:text-sm font-bold tracking-[0.25em] text-steam-blue uppercase mb-6 steam-glow px-5 py-2 rounded-full bg-steam-blue/5 border border-steam-blue/20 inline-block shadow-[0_0_15px_rgba(102,192,244,0.1)]"
      >
        {t('hero.greeting')}
      </motion.p>

      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-4 animate-gradient-shift leading-[0.9]"
      >
        {profile.name}
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="font-mono text-lg md:text-2xl text-zinc-300 mb-8 h-8 font-medium tracking-tight"
      >
        {typedTitle}<span className="animate-pulse text-steam-blue font-bold text-2xl">|</span>
      </motion.p>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[45ch] text-base md:text-xl text-zinc-400 leading-relaxed mb-16"
      >
        {t('about.bio')}
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
      >
        <Magnetic stiffness={200} damping={15} strength={0.3}>
          <a
            href="#contact"
            className="group relative flex h-[60px] min-w-[220px] items-center justify-center overflow-hidden bg-steam-blue transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
            style={{
              clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)',
              background: 'linear-gradient(180deg, #8ad3ff 0%, #4a90e2 100%)',
              boxShadow: '0 0 30px rgba(102,192,244,0.4)'
            }}
            data-cursor-hover
            data-cursor-label="CONTACT"
          >
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] transition-all duration-700 group-hover:left-[200%]" />
            <div className="relative z-10 flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse shadow-[0_0_8px_rgba(9,9,11,0.8)]" />
              <span className="font-mono text-[14px] font-black tracking-[0.15em] text-zinc-950 uppercase">Hire Me</span>
              <span className="font-mono text-sm font-bold text-zinc-950/60 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </a>
        </Magnetic>

        <Magnetic stiffness={200} damping={15} strength={0.3}>
          <a
            href="#projects"
            className="group relative flex h-[60px] min-w-[220px] items-center justify-center overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] hud-card steam-glow"
            style={{
              clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)',
            }}
            data-cursor-hover
            data-cursor-label="WORK"
          >
            <div className="absolute left-[2px] top-0 bottom-0 w-[3px] bg-steam-blue opacity-70 group-hover:opacity-100 z-10 transition-opacity" />
            <div 
              className="absolute left-0 w-16 h-[2px] bg-steam-blue opacity-0 shadow-[0_0_15px_4px_rgba(102,192,244,0.6)] group-hover:opacity-100 group-hover:animate-[scan-x_1.2s_ease-in-out_infinite_alternate] z-10"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            />
            <div className="relative z-20 flex items-center gap-3">
              <span className="font-mono text-[14px] font-bold tracking-[0.15em] text-zinc-300 uppercase transition-colors group-hover:text-white">View My Work</span>
              <span className="font-mono text-[11px] text-steam-blue transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]">↗</span>
            </div>
          </a>
        </Magnetic>
      </motion.div>
      <style>{`
        @keyframes scan-x {
          0% { transform: translateY(-50%) translateX(0); }
          100% { transform: translateY(-50%) translateX(150px); }
        }
      `}</style>
    </section>
  );
}
