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
  { tier: 'Novice', range: '1 – 4', color: '#8B8B8B', desc: 'Just getting started' },
  { tier: 'Apprentice', range: '5 – 9', color: '#4A90E2', desc: 'Exploring the craft' },
  { tier: 'Intermediate', range: '10 – 14', color: '#5BC0DE', desc: 'Building momentum' },
  { tier: 'Experienced', range: '15 – 19', color: '#5CB85C', desc: 'Solid foundations' },
  { tier: 'Proficient', range: '20 – 24', color: '#A4D007', desc: 'Real skills showing' },
  { tier: 'Advanced', range: '25 – 29', color: '#F39C12', desc: 'Glow effect unlocked' },
  { tier: 'Expert', range: '30 – 34', color: '#E74C3C', desc: 'Serious dedication' },
  { tier: 'Elite', range: '35 – 39', color: '#9B59B6', desc: 'Top percentile' },
  { tier: 'Master', range: '40 – 44', color: '#E91E63', desc: 'Near legendary' },
  { tier: 'Grandmaster', range: '45 – 49', color: '#FFD700', desc: 'Almost the summit' },
  { tier: 'Platinum', range: '50 – 74', color: '#E5E4E2', desc: 'Shimmer effect' },
  { tier: 'Diamond', range: '75 – 99', color: '#00D4FF', desc: 'Brilliant shine' },
  { tier: 'Legendary', range: '100+', color: '#ffd700', desc: 'Rainbow prestige' },
];

const XP_SOURCES = [
  { source: 'Repositories', xp: '+100 XP each', desc: 'Every public GitHub repo' },
  { source: 'Followers', xp: '+50 XP each', desc: 'GitHub community engagement' },
  { source: 'Stars', xp: '+10 XP each', desc: 'Recognition across repos' },
  { source: 'Years of Experience', xp: '+500 XP / year', desc: 'Time in the field' },
  { source: 'Achievements', xp: '10 – 200 XP', desc: 'Visitor achievements (variable by rarity)' },
];

const ACHIEVEMENT_INFO = [
  { label: '19 Total', desc: 'Achievements to discover' },
  { label: '490 Max XP', desc: 'If you unlock them all' },
  { label: '5 Rarities', desc: 'Common, Uncommon, Rare, Epic, Legendary' },
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
    window.dispatchEvent(new Event('lenis:stop'));
    document.body.style.overflow = 'hidden';
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
      window.dispatchEvent(new Event('lenis:start'));
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
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
                XP is earned from GitHub activity &amp; visitor achievements. Levelling uses bracket
                scaling — levels 1–10 need 100 XP each, 11–20 need 200 XP each, and so on.
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
