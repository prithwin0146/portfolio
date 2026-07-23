import { useState } from 'react';
import type React from 'react';
import { useInView } from '../../hooks/useInView';
import GitHubStats from '../GitHubStats/GitHubStats';
import GitHubReplay from '../GitHubReplay/GitHubReplay';
import RecentActivity from '../RecentActivity/RecentActivity';

const PAGES = [
  { id: 'stats',    icon: '📊', label: 'GitHub Stats' },
  { id: 'replay',   icon: '🎬', label: 'GitHub Replay' },
  { id: 'activity', icon: '⚡', label: 'Recent Activity' },
] as const;

export default function GitHubHub() {
  const [current, setCurrent] = useState(0);
  const { ref, isInView: visible } = useInView({ threshold: 0.05 });

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(PAGES.length - 1, c + 1));

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`mx-auto max-w-5xl px-4 py-24 sm:px-6 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="flex flex-col overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl">
        {/* Tab navigation */}
        <div className="flex w-full overflow-x-auto border-b border-white/10 bg-zinc-950/50">
          {PAGES.map((p, i) => (
            <button
              key={p.id}
              className={`flex min-w-max flex-1 items-center justify-center gap-2 border-b-2 px-6 py-4 text-xs font-semibold tracking-widest uppercase transition-colors ${
                i === current
                  ? 'border-steam-blue bg-white/5 text-white'
                  : 'border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
              }`}
              onClick={() => setCurrent(i)}
            >
              <span className="text-sm">{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Pages — all mounted so hooks/data stay alive */}
        <div className="relative w-full overflow-hidden bg-zinc-950">
          <div className={`transition-opacity duration-300 ${current === 0 ? 'block opacity-100' : 'hidden opacity-0'}`}>
            <GitHubStats />
          </div>
          <div className={`transition-opacity duration-300 ${current === 1 ? 'block opacity-100' : 'hidden opacity-0'}`}>
            <GitHubReplay />
          </div>
          <div className={`transition-opacity duration-300 ${current === 2 ? 'block opacity-100' : 'hidden opacity-0'}`}>
            <RecentActivity />
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between border-t border-white/10 bg-zinc-950/50 px-6 py-4">
          <button
            className="font-mono text-xs font-semibold tracking-wider text-zinc-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
            onClick={prev}
            disabled={current === 0}
          >
            ← PREV
          </button>

          <div className="flex items-center gap-3">
            {PAGES.map((p, i) => (
              <button
                key={p.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-6 bg-steam-blue' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                }`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to ${p.label}`}
              />
            ))}
          </div>

          <button
            className="font-mono text-xs font-semibold tracking-wider text-zinc-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
            onClick={next}
            disabled={current === PAGES.length - 1}
          >
            NEXT →
          </button>
        </div>
      </div>
    </section>
  );
}
