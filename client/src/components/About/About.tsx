import type React from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import { motion } from 'motion/react';



const SERVICES_PREVIEW = [
  {
    label: 'Frontend Engineering',
    detail: 'Pixel-perfect UIs with React, Next.js & TypeScript. Fast, accessible, production-ready.',
    tags: ['React', 'Next.js', 'Tailwind'],
  },
  {
    label: 'Backend & APIs',
    detail: 'Scalable REST APIs with .NET 8 & Node.js. From database schema to deployment.',
    tags: ['.NET 8', 'Node.js', 'SQL Server'],
  },
  {
    label: 'UI/UX Design',
    detail: 'Clean design systems in Figma that translate 1:1 into code. No handoff gaps.',
    tags: ['Figma', 'Design Systems', 'Prototyping'],
  },
  {
    label: 'Full-Stack Delivery',
    detail: 'I own the entire product — from wireframe to live URL. One person, zero coordination overhead.',
    tags: ['End-to-end', 'Solo ownership', 'Fast turnaround'],
  },
];

export default function About() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const { t } = useLanguage();

  const projectCount      = useCountUp(12,  1800, 0, isInView);
  const satisfactionCount = useCountUp(100, 2200, 0, isInView);
  const responseCount     = useCountUp(24,  1500, 0, isInView);

  const anim = (i: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className="relative z-10 w-full py-24 lg:py-32"
      id="about"
    >
      <SectionHeader
        number="01"
        title={t('section.about.title')}
        accent={t('section.about.accent')}
        subtitle={t('section.about.sub') || undefined}
        visible={isInView}
      />

      <div className="mt-16 space-y-20">

        {/* ── ROW 1: Large quote + Stats ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-12 xl:gap-0 items-start">

          {/* Quote block */}
          <motion.div {...anim(0)} className="relative z-10 xl:pr-12">
            <div className="absolute -top-10 -left-6 font-display text-[12rem] leading-none text-steam-blue/5 select-none pointer-events-none">"</div>
            <h2 className="relative font-display text-4xl md:text-[3.5rem] lg:text-[4.5rem] font-black tracking-tighter text-white leading-[0.95] pl-6 border-l-[4px] border-steam-blue">
              I turn concepts into{' '}
              <em className="not-italic text-steam-blue">polished,{' '}
              production-ready</em>{' '}software.
            </h2>
            <div className="mt-12 pl-6 border-l-2 border-white/10">
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl font-medium tracking-tight">
                {t('about.bio')}
              </p>
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                <span className="inline-flex items-center gap-3 px-5 py-2.5 hud-card neon-border text-emerald-400 font-mono text-[11px] font-black uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(52,211,153,0.15)] bg-emerald-500/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  Available for work
                </span>
                <span className="font-mono text-xs text-zinc-500 font-bold tracking-[0.2em] uppercase">📍 {t('about.location')}</span>
              </div>
            </div>
          </motion.div>

          {/* Stat stack - responsive grid on mobile, vertical stack on XL */}
          <div className="grid grid-cols-3 gap-3 xl:flex xl:flex-col xl:gap-6 xl:shrink-0 xl:-ml-12 z-20 mt-8 xl:mt-0">
            {[
              { formatted: `${projectCount}+`,      label: t('about.statProjects'),     accent: '#a78bfa' },
              { formatted: `${satisfactionCount}%`,  label: t('about.statSatisfaction'), accent: '#34d399' },
              { formatted: `<${responseCount}h`,     label: t('about.statResponse'),     accent: '#fbbf24' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                {...anim(i + 1)}
                className="flex flex-col gap-1.5 px-3 py-3 sm:px-6 sm:py-5 xl:min-w-[200px] hud-card backdrop-blur-xl bg-[#09090b]/90 border border-white/5 transition-transform hover:-translate-y-1 hover:border-white/20"
                style={{ borderTopColor: stat.accent, borderTopWidth: 3 }}
              >
                <span className="font-display text-2xl sm:text-4xl xl:text-5xl font-black tracking-tighter" style={{ color: stat.accent, textShadow: `0 0 24px ${stat.accent}50` }}>
                  {stat.formatted}
                </span>
                <span className="font-mono text-[8px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400 uppercase whitespace-pre-line leading-relaxed">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── ROW 2: What I Build — 2x2 service grid ── */}
        <motion.div {...anim(4)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICES_PREVIEW.map((svc, i) => (
            <div
              key={i}
              className="group flex flex-col gap-3 p-6 hud-card transition-all duration-300 hover:border-steam-blue/30 steam-glow cursor-default relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-steam-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold tracking-widest text-zinc-400 uppercase group-hover:text-steam-blue transition-colors">
                  {svc.label}
                </span>
                <span className="text-steam-blue/20 text-base leading-none group-hover:text-steam-blue/60 transition-colors">⬡</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">{svc.detail}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {svc.tags.map(tag => (
                  <span key={tag} className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-zinc-500 group-hover:border-steam-blue/30 group-hover:bg-steam-blue/10 group-hover:text-steam-blue transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── ROW 3: CTA strip ── */}
        <motion.div
          {...anim(5)}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-white/5"
        >
          <p className="text-zinc-500 text-sm max-w-xs font-medium">
            Interested in working together? Let's talk about your next project.
          </p>
          <div className="flex gap-3 sm:ml-auto">
            <a
              href="https://github.com/prithwin0146"
              target="_blank" rel="noreferrer"
              className="px-5 py-2.5 hud-card text-zinc-400 font-mono text-xs font-bold tracking-widest uppercase hover:text-white hover:border-white/20 transition-all"
            >
              GitHub ↗
            </a>
            <a
              href="#contact"
              className="px-6 py-2.5 bg-steam-blue text-zinc-950 font-mono text-xs font-black tracking-widest uppercase hover:brightness-110 hover:shadow-[0_0_15px_rgba(102,192,244,0.4)] transition-all"
            >
              Hire Me →
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
