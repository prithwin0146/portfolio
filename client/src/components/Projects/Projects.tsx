import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import ProjectModal from '../ProjectModal/ProjectModal';
import type { Project } from '../../types';
import { motion } from 'motion/react';

export default function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    api.getProjects().then(setProjects).catch(console.error);
  }, []);

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`mx-auto max-w-6xl px-4 py-24 sm:px-6 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      id="projects"
    >
      <SectionHeader number="05" title={t('section.projects.title')} accent={t('section.projects.accent')} subtitle={t('section.projects.sub') || undefined} visible={isInView} />

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.015, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col p-6 sm:p-8 text-left hud-card border border-white/5 steam-glow cursor-default overflow-hidden"
            onClick={() => setSelected(p)}
            data-cursor-hover
            data-cursor-label="VIEW"
          >
            {/* Top accent glow */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-steam-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {p.imageUrl && (
              <div className="relative mb-6 aspect-video w-full overflow-hidden border border-white/5 bg-[#09090b] rounded-[2px]">
                {/* Inner vignette overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_#09090b_120%)] z-10 pointer-events-none opacity-80" />
                
                <img 
                  src={p.imageUrl} 
                  alt={p.title} 
                  className="relative z-0 h-full w-full object-cover object-[center_20%] opacity-70 mix-blend-luminosity transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-[1.03]" 
                  loading="lazy" 
                />
                
                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                  {p.stars > 0 && <span className="rounded-[2px] bg-black/80 backdrop-blur-md px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-zinc-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">⭐ {p.stars}</span>}
                  {p.forks > 0 && <span className="rounded-[2px] bg-black/80 backdrop-blur-md px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-zinc-300 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">🍴 {p.forks}</span>}
                </div>
              </div>
            )}
            <h3 className="font-display text-3xl font-black tracking-tighter text-white mb-2 transition-colors group-hover:text-steam-blue">{p.title}</h3>
            <p className="text-sm text-zinc-400 mb-6 line-clamp-2 leading-relaxed transition-colors group-hover:text-zinc-300">{p.description}</p>
            
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-5 w-full">
              <div className="flex flex-wrap gap-2">
                {p.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-mono text-[9px] font-bold tracking-[0.2em] text-steam-blue uppercase px-2 py-1 rounded-sm bg-steam-blue/5 border border-steam-blue/20">#{tag}</span>
                ))}
                {p.tags.length > 3 && <span className="font-mono text-[10px] font-bold text-zinc-500">+{p.tags.length - 3}</span>}
              </div>
              <span className="font-mono text-[11px] font-black tracking-[0.2em] text-zinc-500 transition-all group-hover:text-white flex items-center gap-2 uppercase">
                View Project 
                <span className="text-steam-blue opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
