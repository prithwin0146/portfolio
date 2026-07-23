import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import type { Service } from '../../types';

export default function Experience() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Service[]>([]);
  const { ref, isInView } = useInView({ threshold: 0.15 });

  useEffect(() => {
    api.getServices().then(setItems).catch(console.error);
  }, []);

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`mx-auto max-w-5xl px-4 py-24 sm:px-6 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      id="services"
    >
      <SectionHeader number="03" title={t('section.services.title')} accent={t('section.services.accent')} subtitle={t('section.services.sub') || undefined} visible={isInView} />
      
      <div className="mt-16 flex flex-col border-l-2 border-white/5">
        {items.map((svc, i) => (
          <div
            key={svc.id}
            className="group relative flex flex-col gap-6 py-10 pl-6 sm:pl-10 md:flex-row md:gap-12"
            style={{ transitionDelay: `${i * 0.12}s`, opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(16px)', transitionProperty: 'opacity, transform', transitionDuration: '500ms' }}
          >
            {/* Timeline node */}
            <div className="absolute -left-[5px] top-[48px] h-2 w-2 rounded-full bg-zinc-700 transition-colors group-hover:bg-steam-blue" />
            
            <div className="flex-shrink-0 md:w-1/3">
              <span className="mb-4 inline-block text-4xl opacity-80 transition-transform duration-300 group-hover:scale-110">{svc.icon}</span>
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">{svc.name}</h3>
              <p className="mt-1 font-mono text-xs font-semibold tracking-wider text-steam-blue uppercase">{svc.tagline}</p>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-zinc-400 leading-relaxed mb-6">{svc.description}</p>
              <ul className="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
                {svc.deliverables.map((d, di) => (
                  <li key={di} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-emerald-500 mt-[2px]">✓</span>
                    <span className="opacity-90">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
