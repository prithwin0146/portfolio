import { useState, useEffect, useRef } from 'react';
import { useInView } from '../../hooks/useInView';
import { GITHUB_STATS } from '../../config/github.config';
import { trackReplayWatch } from '../../services/achievementService';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './GitHubReplay.module.css';

const REPLAY_SLIDES = [
  {
    icon: '📊',
    label: 'Your Year in Code',
    value: '2025',
    subtitle: 'A developer\'s journey, replayed.',
    color: '#6c63ff',
  },
  {
    icon: '📁',
    label: 'Repositories Created',
    value: `${GITHUB_STATS.totalRepos}`,
    subtitle: 'Each one a new adventure.',
    color: '#a78bfa',
  },
  {
    icon: '⭐',
    label: 'Stars Earned',
    value: `${GITHUB_STATS.totalStars}`,
    subtitle: 'Community recognition for your work.',
    color: '#fbbf24',
  },
  {
    icon: '🔥',
    label: 'Activity Rate',
    value: `${GITHUB_STATS.activePercent}%`,
    subtitle: 'Of your repos saw recent updates.',
    color: '#f97316',
  },
  {
    icon: '💻',
    label: 'Top Language',
    value: GITHUB_STATS.topLanguages[0]?.name ?? 'TypeScript',
    subtitle: `${GITHUB_STATS.topLanguages[0]?.percent ?? 42}% of your codebase.`,
    color: '#3b82f6',
  },
  {
    icon: '🎯',
    label: 'Years of Experience',
    value: `${GITHUB_STATS.yearsOfExperience}+`,
    subtitle: 'And counting. Keep shipping.',
    color: '#10b981',
  },
];

export default function GitHubReplay() {
  const { t } = useLanguage();
  const { ref, isInView: visible } = useInView({ threshold: 0.2 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (visible && !completed && !playing) {
      setPlaying(true);
    }
  }, [visible, completed, playing]);

  useEffect(() => {
    if (!playing) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= REPLAY_SLIDES.length - 1) {
          clearInterval(timerRef.current);
          setPlaying(false);
          setCompleted(true);
          trackReplayWatch();
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timerRef.current);
  }, [playing]);

  const restart = () => {
    setCurrentSlide(0);
    setCompleted(false);
    setPlaying(true);
  };

  const slide = REPLAY_SLIDES[currentSlide];

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`${styles.section} ${visible ? styles.visible : ''}`}
    >
      <SectionHeader number="10" title={t('section.githubReplay.title')} accent={t('section.githubReplay.accent')} subtitle={t('section.githubReplay.sub') || undefined} visible={visible} />

      <div className={styles.player}>
        {!playing && !completed && (
          <div className={styles.intro}>
            <div className={styles.introIcon}>▶</div>
            <p className={styles.introText}>Loading your replay...</p>
          </div>
        )}

        {(playing || completed) && (
          <div
            className={styles.slide}
            key={currentSlide}
            style={{ '--accent': slide.color } as React.CSSProperties}
          >
            <span className={styles.slideIcon}>{slide.icon}</span>
            <span className={styles.slideLabel}>{slide.label}</span>
            <span className={styles.slideValue}>{slide.value}</span>
            <span className={styles.slideSubtitle}>{slide.subtitle}</span>
          </div>
        )}

        {/* Progress dots */}
        <div className={styles.dots}>
          {REPLAY_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === currentSlide ? styles.dotActive : ''} ${i < currentSlide ? styles.dotDone : ''}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((currentSlide + 1) / REPLAY_SLIDES.length) * 100}%` }}
          />
        </div>

        {completed && (
          <button className={styles.replayBtn} onClick={restart}>
            🔄 Replay
          </button>
        )}
      </div>
    </section>
  );
}
