import { useInView } from '../../hooks/useInView';
import { useLanguage } from '../../contexts/LanguageContext';
import { useGitHubXP } from '../../hooks/useGitHubXP';
import SectionHeader from '../SectionHeader/SectionHeader';
import LevelBadge from '../LevelBadge/LevelBadge';
import XPProgressBar from '../XPProgressBar/XPProgressBar';

export default function DeveloperLevel() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.1 });
  const gh = useGitHubXP();

  const sources = [
    { key: 'REPOSITORIES',        label: t('stats.repos'),       value: gh.loading ? '...' : `${gh.repos}`,               xp: `+${(gh.repos * 100).toLocaleString()} XP` },
    { key: 'FOLLOWERS',           label: t('stats.followers'),   value: gh.loading ? '...' : `${gh.followers}`,            xp: `+${(gh.followers * 50).toLocaleString()} XP` },
    { key: 'TOTAL STARS',         label: t('stats.stars'),       value: gh.loading ? '...' : `${gh.stars}`,                xp: `+${(gh.stars * 10).toLocaleString()} XP` },
    { key: 'YEARS OF EXPERIENCE', label: t('stats.experience'),  value: `${gh.yearsOfExperience}+`,                        xp: `+${(gh.yearsOfExperience * 500).toLocaleString()} XP` },
    { key: 'ACHIEVEMENTS',        label: t('stats.achievements'), value: `${gh.achievementsUnlocked}/${gh.achievementsTotal}`, xp: `+${gh.achievementsXP.toLocaleString()} XP` },
  ];

  return (
    <section ref={ref as React.Ref<HTMLElement>} id="developer-level" className="py-24">
      <SectionHeader number="02" title={t('section.devLevel.title')} accent={t('section.devLevel.accent')} subtitle={t('section.devLevel.sub') || undefined} visible={visible} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div
          className="mb-12 flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.5s, transform 0.5s',
          }}
        >
          <div className="shrink-0">
            <LevelBadge size="large" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white sm:mb-2">
              {t('devLevel.title').replace('{level}', gh.loading ? '...' : String(gh.level))}
            </div>
            <div className="font-mono text-sm sm:text-base font-semibold uppercase tracking-wider text-steam-blue">
              {gh.tierName} <span className="mx-2 text-zinc-600">·</span> <span className="text-zinc-400">{gh.loading ? '...' : `${gh.currentLevelXP.toLocaleString()} / ${gh.nextLevelXP.toLocaleString()} XP`} to next level</span>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <XPProgressBar />
        </div>

        <div className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source, i) => (
            <div
              key={source.key}
              className="flex flex-col border-b border-white/10 p-6 sm:border-r"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.4s ${0.2 + i * 0.08}s, transform 0.4s ${0.2 + i * 0.08}s`,
              }}
            >
              <span className="mb-1 font-mono text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{source.label}</span>
              <div className="mt-auto flex items-end justify-between">
                <span className="font-display text-2xl font-bold tracking-tight text-zinc-200">{source.value}</span>
                <span className="font-mono text-xs font-semibold tracking-wider text-emerald-400">{source.xp}</span>
              </div>
            </div>
          ))}
          {/* Empty filler cell for grid rhythm on lg screens */}
          <div className="hidden border-b border-white/10 p-6 lg:block" />
        </div>
      </div>
    </section>
  );
}
