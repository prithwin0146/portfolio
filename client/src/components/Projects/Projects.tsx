import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import ProjectModal from '../ProjectModal/ProjectModal';
import type { Project } from '../../types';

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

      <div className="mt-16 grid grid-cols-1 gap-1 sm:grid-cols-2 bg-white/5 border border-white/5 p-[1px]">
        {projects.map((p, i) => (
          <button
            key={p.id}
            className="group relative flex flex-col bg-zinc-950 p-6 sm:p-8 text-left transition-colors hover:bg-zinc-900"
            style={{
              transitionDelay: `${i * 0.1}s`,
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transitionProperty: 'opacity, transform, background-color',
              transitionDuration: '500ms'
            }}
            onClick={() => setSelected(p)}
            data-cursor-hover
            data-cursor-label="View"
          >
            {p.imageUrl && (
              <div className="relative mb-6 aspect-video w-full overflow-hidden border border-white/5 bg-zinc-900">
                <img 
                  src={p.imageUrl} 
                  alt={p.title} 
                  className="h-full w-full object-cover object-[center_20%] opacity-80 mix-blend-luminosity transition-all duration-500 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105" 
                  loading="lazy" 
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {p.stars > 0 && <span className="rounded bg-black/80 px-2 py-1 font-mono text-[10px] font-semibold tracking-widest text-zinc-300">⭐ {p.stars}</span>}
                  {p.forks > 0 && <span className="rounded bg-black/80 px-2 py-1 font-mono text-[10px] font-semibold tracking-widest text-zinc-300">🍴 {p.forks}</span>}
                </div>
              </div>
            )}
            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">{p.title}</h3>
            <p className="text-sm text-zinc-400 mb-6 line-clamp-2 leading-relaxed">{p.description}</p>
            
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
              <div className="flex flex-wrap gap-2">
                {p.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="font-mono text-[10px] font-semibold tracking-wider text-steam-blue uppercase">#{tag}</span>
                ))}
                {p.tags.length > 3 && <span className="font-mono text-[10px] font-semibold text-zinc-500">+{p.tags.length - 3}</span>}
              </div>
              <span className="font-mono text-xs font-semibold tracking-wider text-zinc-500 transition-colors group-hover:text-white">VIEW PROJECT →</span>
            </div>
          </button>
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
