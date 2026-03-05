import type React from 'react';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { useLanguage } from '../../contexts/LanguageContext';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './About.module.css';

const FRIENDS = [
  { initials: 'TS', color: '#3178c6', name: 'TypeScript', status: 'ingame', statusText: 'In Game: Portfolio',  unread: 2 },
  { initials: 'BG', color: '#7f1d1d', name: 'The Bug',    status: 'ingame', statusText: 'In Game: Production', unread: 0 },
  { initials: 'GH', color: '#24292f', name: 'GitHub',     status: 'online', statusText: 'Online',              unread: 3 },
  { initials: 'CF', color: '#78350f', name: 'Coffee',     status: 'away',   statusText: 'Away',                unread: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  online: '#34d399',
  ingame: '#60a5fa',
  away:   '#fbbf24',
};

const MESSAGES = [
  { sender: 'GitHub',     color: '#60a5fa', text: '3 PRs waiting for review 👀' },
  { sender: 'TypeScript', color: '#3178c6', text: 'Implicit any detected. Fix it.' },
  { sender: 'The Bug',    color: '#f87171', text: 'Found you. See you in prod 🙃' },
];

const TECH = [
  'React', 'TypeScript', '.NET 8', 'Node.js', 'SQL Server',
  'Tailwind', 'Next.js', 'Figma', 'Angular', 'PostgreSQL',
  'React', 'TypeScript', '.NET 8', 'Node.js', 'SQL Server',
  'Tailwind', 'Next.js', 'Figma', 'Angular', 'PostgreSQL',
];

export default function About() {
  const { ref, isInView } = useInView({ threshold: 0.15 });
  const { t } = useLanguage();

  const projectCount      = useCountUp(12,  1800, 0, isInView);
  const satisfactionCount = useCountUp(100, 2200, 0, isInView);
  const responseCount     = useCountUp(24,  1500, 0, isInView);
  const onlineCount       = FRIENDS.filter(f => f.status !== 'away').length;

  return (
    <section
      ref={ref as React.Ref<HTMLElement>}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id="about"
    >
      <SectionHeader
        number="01"
        title={t('section.about.title')}
        accent={t('section.about.accent')}
        subtitle={t('section.about.sub') || undefined}
        visible={isInView}
      />

      <div className={styles.bento}>

        {/* ── Statement / Bio card ── */}
        <div className={`${styles.card} ${styles.cardBio}`} style={{ transitionDelay: '0.05s' }}>
          <div className={styles.bioCornerGlow} />
          <p className={styles.statement}>
            &ldquo;I turn ideas into polished,
            <br />
            <span className={styles.statementAccent}>production-ready software.</span>
            &rdquo;
          </p>
          <p className={styles.bioText}>{t('about.bio')}</p>
          <div className={styles.bioFooter}>
            <div className={styles.footerMeta}>
              <span className={styles.statusBadge}>
                <span className={styles.statusDot} />
                Available for work
              </span>
              <span className={styles.location}>📍 {t('about.location')}</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="https://github.com/prithwin0146" target="_blank" rel="noreferrer" className={styles.linkBtn} data-cursor-hover>
                GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/prithwin-m" target="_blank" rel="noreferrer" className={styles.linkBtn} data-cursor-hover>
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>

        {/* ── Friends Online (Steam-style) ── */}
        <div className={`${styles.card} ${styles.cardFriends}`} style={{ transitionDelay: '0.1s' }}>
          <div className={styles.friendsHeader}>
            <span className={styles.friendsTitle}>Friends</span>
            <span className={styles.onlineBadge}>
              <span className={styles.onlinePulse} />
              {onlineCount} online
            </span>
          </div>
          <div className={styles.friendsList}>
            {FRIENDS.map((f) => (
              <div key={f.name} className={styles.friendRow}>
                <div className={styles.friendAvatarWrap}>
                  <div className={styles.friendAvatar} style={{ background: f.color }}>
                    {f.initials}
                  </div>
                  <span className={styles.friendStatusDot} style={{ background: STATUS_COLORS[f.status] }} />
                </div>
                <div className={styles.friendInfo}>
                  <span className={styles.friendName}>{f.name}</span>
                  <span className={styles.friendStatusText} style={{ color: STATUS_COLORS[f.status] }}>
                    {f.statusText}
                  </span>
                </div>
                {f.unread > 0 && (
                  <span className={styles.unreadBadge}>{f.unread}</span>
                )}
              </div>
            ))}
          </div>
          <hr className={styles.msgDivider} />
          <div className={styles.msgList}>
            {MESSAGES.map((m) => (
              <div key={m.sender} className={styles.msgBubble}>
                <span className={styles.msgSender} style={{ color: m.color }}>{m.sender}</span>
                <p className={styles.msgText}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stat cards ── */}
        {([
          { value: `${projectCount}+`,      label: 'Projects Delivered', color: '#6c63ff', delay: '0.15s', icon: '🚀' },
          { value: `${satisfactionCount}%`, label: 'Client Satisfaction', color: '#22c55e', delay: '0.2s',  icon: '⭐' },
          { value: `<${responseCount}h`,    label: 'Response Time',       color: '#f59e0b', delay: '0.25s', icon: '⚡' },
        ] as const).map((s) => (
          <div
            key={s.label}
            className={`${styles.card} ${styles.cardStat}`}
            style={{ transitionDelay: s.delay, '--c': s.color } as React.CSSProperties}
          >
            <div className={styles.statTopBar} />
            <span className={styles.statEmoji}>{s.icon}</span>
            <span className={styles.statNumber}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}

        {/* ── Marquee ── */}
        <div className={`${styles.card} ${styles.cardMarquee}`} style={{ transitionDelay: '0.3s' }}>
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {TECH.map((item, i) => (
                <span key={i} className={styles.marqueeItem}>
                  <span className={styles.marqueeSep}>/</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
