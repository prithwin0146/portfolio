import { useEffect } from 'react';
import type React from 'react';
import { useInView } from '../../hooks/useInView';
import { useGitHubXP } from '../../hooks/useGitHubXP';
import { trackStatsView } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';

/** Converts an ISO timestamp to a short relative string like "2h ago". */
function timeAgo(iso: string): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  SCSS: '#c6538c',
  CSS: '#264de4',
  HTML: '#e34f26',
  'C#': '#239120',
  Python: '#3572A5',
};

function getLangColor(name: string): string {
  return LANG_COLORS[name] ?? '#6c63ff';
}

export default function GitHubStats() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const gh = useGitHubXP();

  useEffect(() => {
    if (visible) trackStatsView();
  }, [visible]);

  const loading = gh.loading;

  const STAT_CARDS = [
    { label: 'REPOSITORIES', value: loading ? '—' : String(gh.repos),              sub: 'public', color: '#a78bfa' },
    { label: 'TOTAL STARS',  value: loading ? '—' : String(gh.stars),              sub: 'earned',  color: '#fbbf24' },
    { label: 'TOTAL FORKS',  value: loading ? '—' : String(gh.forks),              sub: 'count',   color: '#34d399' },
    { label: 'FOLLOWERS',    value: loading ? '—' : String(gh.followers),           sub: 'devs',    color: '#60a5fa' },
    { label: 'FOLLOWING',    value: loading ? '—' : String(gh.following),           sub: 'devs',    color: '#60a5fa' },
    { label: 'ACTIVE REPOS', value: loading ? '—' : `${gh.activePercent}%`,        sub: 'this yr', color: '#f87171' },
  ];

  return (
    <section ref={ref as React.Ref<HTMLElement>} id="github-stats">
      <SectionHeader
        number="08"
        title={t('section.githubStats.title')}
        accent={t('section.githubStats.accent')}
        subtitle={t('section.githubStats.sub') || undefined}
        visible={visible}
      />

      <div className="flex flex-col gap-6">

        {/* ── Live Status Bar ── */}
        <div
          className="flex flex-wrap items-center gap-4 px-4 py-3 border border-white/[0.06] bg-zinc-950"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s 0.2s' }}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Live</span>
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono text-[10px] text-zinc-500">
            Last push: <span className="text-zinc-300">{loading ? '…' : timeAgo(gh.lastPushAt)}</span>
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono text-[10px] text-zinc-500">
            Commits (30d): <span className="text-zinc-300">{loading ? '…' : gh.commitsLastMonth}</span>
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono text-[10px] text-zinc-500">
            Member since: <span className="text-zinc-300">{loading ? '…' : gh.memberSince || '—'}</span>
          </span>
          <a
            href={`https://github.com/prithwin0146`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto font-mono text-[10px] text-zinc-500 hover:text-steam-blue transition-colors tracking-wider"
          >
            prithwin0146 ↗
          </a>
        </div>

        {/* ── Stat Cards Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/[0.04]">
          {STAT_CARDS.map((card, i) => (
            <div
              key={card.label}
              className="group flex flex-col gap-2 p-5 bg-zinc-950 hover:bg-zinc-900/60 transition-colors"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.45s ${i * 0.07}s, transform 0.45s ${i * 0.07}s`,
                borderTop: `2px solid ${card.color}20`,
              }}
            >
              <span
                className="font-display text-4xl font-black tracking-tight tabular-nums transition-colors"
                style={{ color: card.color }}
              >
                {loading ? (
                  <span className="inline-block w-12 h-8 bg-white/5 animate-pulse rounded" />
                ) : card.value}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase">{card.label}</span>
                <span className="font-mono text-[9px] text-zinc-600">{card.sub}</span>
              </div>
              <div className="mt-auto h-px w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: card.color }} />
            </div>
          ))}
        </div>

        {/* ── Top Languages ── */}
        {(loading || gh.topLanguages.length > 0) && (
          <div
            className="flex flex-col gap-4 p-5 border border-white/[0.06] bg-zinc-950"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s 0.5s' }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Top Languages</span>
              <span className="font-mono text-[9px] text-zinc-600">
                {loading ? '…' : `${gh.topLanguages.length} languages detected`}
              </span>
            </div>

            {/* Segmented bar */}
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-900">
              {loading ? (
                <div className="h-full w-full animate-pulse bg-white/5" />
              ) : (
                gh.topLanguages.map((lang) => (
                  <div
                    key={lang.name}
                    className="h-full transition-all duration-700"
                    style={{
                      width: visible ? `${lang.percent}%` : '0%',
                      backgroundColor: getLangColor(lang.name),
                      transitionDelay: '0.6s',
                    }}
                  />
                ))
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {loading
                ? [1, 2, 3].map(i => (
                    <span key={i} className="h-3 w-20 rounded animate-pulse bg-white/5" />
                  ))
                : gh.topLanguages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: getLangColor(lang.name) }}
                      />
                      <span className="font-mono text-[10px] text-zinc-400">{lang.name}</span>
                      <span className="font-mono text-[10px] text-zinc-600">{lang.percent}%</span>
                    </div>
                  ))
              }
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
