import { useEffect, useState } from 'react';
import styles from './InfoModal.module.css';

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'tiers' | 'xp' | 'achievements' | 'notifications';

const TABS: { id: Tab; label: string }[] = [
  { id: 'tiers', label: 'Level Tiers' },
  { id: 'xp', label: 'XP System' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'notifications', label: 'Notifications' },
];

const LEVEL_TIERS = [
  { tier: 'Novice', range: '0 – 4', color: '#94a3b8', desc: 'Just getting started' },
  { tier: 'Apprentice', range: '5 – 9', color: '#60a5fa', desc: 'Exploring the portfolio' },
  { tier: 'Adept', range: '10 – 19', color: '#a78bfa', desc: 'Making good progress' },
  { tier: 'Expert', range: '20 – 34', color: '#f472b6', desc: 'Serious dedication' },
  { tier: 'Master', range: '35 – 49', color: '#fb923c', desc: 'Almost legendary' },
  { tier: 'Legendary', range: '50+', color: '#facc15', desc: 'Maximum prestige' },
];

const XP_SOURCES = [
  { source: 'Visit sections', xp: '10 XP each', desc: 'About, Skills, Projects, etc.' },
  { source: 'View all projects', xp: '15 XP', desc: 'Browse through every featured project' },
  { source: 'Use Command Palette', xp: '10 XP', desc: 'Press Ctrl+K / ⌘K' },
  { source: 'Stay 2+ minutes', xp: '10 XP', desc: 'Show some commitment' },
  { source: 'Konami Code', xp: '25 XP', desc: '↑↑↓↓←→←→BA — the classic' },
  { source: 'Scroll 10,000+ px', xp: '15 XP', desc: 'Really explore the content' },
  { source: 'Night Owl / Early Bird', xp: '10 XP each', desc: 'Visit at unusual hours' },
  { source: 'Meta achievements', xp: '25–50 XP', desc: 'Unlock 10+ or all achievements' },
];

const ACHIEVEMENT_INFO = [
  { label: '19 Total', desc: 'Achievements to discover' },
  { label: '265 Max XP', desc: 'If you unlock them all' },
  { label: '5 Categories', desc: 'Exploration, Special, Secret, Meta, and more' },
  { label: 'localStorage', desc: 'Progress saved in your browser' },
];

const NOTIFICATION_TYPES = [
  { icon: '👤', label: 'Friend Online', color: '#4ade80' },
  { icon: '🎮', label: 'Now Playing', color: '#60a5fa' },
  { icon: '💬', label: 'Messages', color: '#a78bfa' },
  { icon: '📩', label: 'Invites', color: '#f472b6' },
  { icon: '🏆', label: 'Achievements', color: '#facc15' },
  { icon: '🔄', label: 'Trade Offers', color: '#fb923c' },
];

const NOTIFICATION_STATS = [
  { value: '5–12s', label: 'Random Interval' },
  { value: '6s', label: 'Display Duration' },
  { value: '30+', label: 'Unique Messages' },
  { value: '5s', label: 'Initial Delay' },
];

export default function InfoModal({ open, onClose }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tiers');

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>ℹ️</span>
            <div>
              <h2 className={styles.headerTitle}>Portfolio Behind the Scenes</h2>
              <p className={styles.headerSub}>
                Portfolio mechanics, XP systems, and hidden features
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.content}>
          {activeTab === 'tiers' && (
            <div className={styles.tabPanel}>
              <p className={styles.panelDesc}>
                Your visitor level increases as you earn XP. Each tier unlocks a new badge color on the
                developer level display.
              </p>
              <div className={styles.tierTable}>
                {LEVEL_TIERS.map((t) => (
                  <div key={t.tier} className={styles.tierRow}>
                    <span className={styles.tierDot} style={{ background: t.color }} />
                    <span className={styles.tierName} style={{ color: t.color }}>{t.tier}</span>
                    <span className={styles.tierRange}>Level {t.range}</span>
                    <span className={styles.tierDesc}>{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'xp' && (
            <div className={styles.tabPanel}>
              <p className={styles.panelDesc}>
                Every interaction earns XP. Here&apos;s how the XP system works — 50 XP per level.
              </p>
              <div className={styles.xpTable}>
                {XP_SOURCES.map((s) => (
                  <div key={s.source} className={styles.xpRow}>
                    <div className={styles.xpRowLeft}>
                      <span className={styles.xpSource}>{s.source}</span>
                      <span className={styles.xpRowDesc}>{s.desc}</span>
                    </div>
                    <span className={styles.xpValue}>{s.xp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className={styles.tabPanel}>
              <p className={styles.panelDesc}>
                Achievements are tracked in your browser using localStorage. Explore the portfolio to
                discover and unlock all 19 hidden achievements.
              </p>
              <div className={styles.statCards}>
                {ACHIEVEMENT_INFO.map((a) => (
                  <div key={a.label} className={styles.statCard}>
                    <span className={styles.statValue}>{a.label}</span>
                    <span className={styles.statLabel}>{a.desc}</span>
                  </div>
                ))}
              </div>
              <div className={styles.note}>
                <span className={styles.noteIcon}>💡</span>
                <span className={styles.noteText}>
                  Some achievements are secret and can only be discovered by experimenting.
                  The Konami Code is a good place to start!
                </span>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.tabPanel}>
              <p className={styles.panelDesc}>
                Steam-style satirical notifications appear randomly while you browse.
                They&apos;re fake — but entertaining. Here&apos;s how they work.
              </p>
              <div className={styles.statCards}>
                {NOTIFICATION_STATS.map((s) => (
                  <div key={s.label} className={styles.statCard}>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
              <h3 className={styles.subHeading}>Notification Types</h3>
              <div className={styles.notifGrid}>
                {NOTIFICATION_TYPES.map((n) => (
                  <div key={n.label} className={styles.notifCard}>
                    <span className={styles.notifIcon} style={{ background: `${n.color}18` }}>
                      {n.icon}
                    </span>
                    <span className={styles.notifLabel} style={{ color: n.color }}>
                      {n.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.note}>
                <span className={styles.noteIcon}>💡</span>
                <span className={styles.noteText}>
                  Notifications are randomized from 30+ unique messages across 6 categories.
                  Each notification is displayed for 6 seconds before auto-dismissing.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
