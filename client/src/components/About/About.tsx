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
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-start">

          {/* Quote block */}
          <motion.div {...anim(0)} className="relative">
            <div className="absolute -top-2 -left-1 font-display text-[7rem] leading-none text-steam-blue/10 select-none pointer-events-none">"</div>
            <h2 className="relative font-display text-3xl md:text-[2.6rem] lg:text-5xl font-bold tracking-tight text-white leading-[1.1] pl-4 border-l-[3px] border-steam-blue">
              I turn concepts into{' '}
              <em className="not-italic text-steam-blue">polished,{' '}
              production-ready</em>{' '}software.
            </h2>
            <div className="mt-8 pl-4 border-l border-white/10">
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl">
                {t('about.bio')}
              </p>
              <div className="mt-6 flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available for work
                </span>
                <span className="font-mono text-xs text-zinc-500">📍 {t('about.location')}</span>
              </div>
            </div>
          </motion.div>

          {/* Stat stack */}
          <div className="flex flex-row xl:flex-col gap-4 shrink-0">
            {[
              { formatted: `${projectCount}+`,      label: t('about.statProjects'),     accent: '#a78bfa' },
              { formatted: `${satisfactionCount}%`,  label: t('about.statSatisfaction'), accent: '#34d399' },
              { formatted: `<${responseCount}h`,     label: t('about.statResponse'),     accent: '#fbbf24' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                {...anim(i + 1)}
                className="flex flex-col gap-1 px-5 py-4 border border-white/5 min-w-[130px] xl:min-w-[160px]"
                style={{ borderTopColor: stat.accent, borderTopWidth: 2 }}
              >
                <span className="font-display text-3xl xl:text-4xl font-black tracking-tight" style={{ color: stat.accent }}>
                  {stat.formatted}
                </span>
                <span className="font-mono text-[9px] font-semibold tracking-widest text-zinc-500 uppercase whitespace-pre-line leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── ROW 2: What I Build — 2x2 service grid ── */}
        <motion.div {...anim(4)} className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
          {SERVICES_PREVIEW.map((svc, i) => (
            <div
              key={i}
              className="group flex flex-col gap-3 p-6 bg-zinc-950 transition-colors hover:bg-zinc-900/80 cursor-default"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase group-hover:text-steam-blue transition-colors">
                  {svc.label}
                </span>
                <span className="text-steam-blue/30 text-base leading-none group-hover:text-steam-blue/60 transition-colors">⬡</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">{svc.detail}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {svc.tags.map(tag => (
                  <span key={tag} className="font-mono text-[9px] tracking-wider px-2 py-0.5 border border-white/[0.06] text-zinc-600 group-hover:border-steam-blue/20 group-hover:text-zinc-500 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="h-px w-0 bg-steam-blue transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </motion.div>

        {/* ── ROW 3: CTA strip ── */}
        <motion.div
          {...anim(5)}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 border-t border-white/5"
        >
          <p className="text-zinc-500 text-sm max-w-xs">
            Interested in working together? Let's talk about your next project.
          </p>
          <div className="flex gap-3 sm:ml-auto">
            <a
              href="https://github.com/prithwin0146"
              target="_blank" rel="noreferrer"
              className="px-5 py-2.5 border border-white/10 text-zinc-400 font-mono text-xs hover:border-white/30 hover:text-white transition-all"
            >
              GitHub ↗
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 bg-steam-blue text-zinc-950 font-mono text-xs font-bold hover:brightness-110 transition-all"
            >
              Hire Me →
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
