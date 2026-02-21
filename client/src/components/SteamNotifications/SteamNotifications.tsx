import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './SteamNotifications.module.css';

interface Notification {
  id: number;
  type: NotifType;
  icon: string;
  label: string;
  avatar: string;
  name: string;
  action: string;
  detail: string;
}

type NotifType = 'friend-online' | 'now-playing' | 'message' | 'invite' | 'achievement' | 'trade-offer';

interface NotifTemplate {
  type: NotifType;
  label: string;
  icon: string;
  avatar: string;
  name: string;
  action: string;
  detail: string;
}

const NOTIFICATIONS: NotifTemplate[] = [
  // ── Friend Online ──
  { type: 'friend-online', label: 'FRIEND ONLINE', icon: '👤', avatar: '🤖', name: 'GitHub Copilot', action: 'is now online', detail: 'Ready to autocomplete your life' },
  { type: 'friend-online', label: 'FRIEND ONLINE', icon: '👤', avatar: '☕', name: 'Coffee Machine', action: 'is now online', detail: 'Brewing dark roast...' },
  { type: 'friend-online', label: 'FRIEND ONLINE', icon: '👤', avatar: '💀', name: 'localhost:3000', action: 'came back online', detail: 'False alarm, port was busy' },
  { type: 'friend-online', label: 'FRIEND ONLINE', icon: '👤', avatar: '💤', name: 'Sleep Schedule', action: 'went offline', detail: 'Last seen 3 days ago' },
  { type: 'friend-online', label: 'FRIEND ONLINE', icon: '👤', avatar: '🧹', name: 'Clean Code', action: 'is now online', detail: 'Judging your variable names' },
  // ── Now Playing ──
  { type: 'now-playing', label: 'NOW PLAYING', icon: '🎮', avatar: '🐛', name: 'Bug #4092', action: 'is now playing', detail: '"Hide & Seek in Production"' },
  { type: 'now-playing', label: 'NOW PLAYING', icon: '🎮', avatar: '🎮', name: 'Stack Overflow', action: 'is now playing', detail: '"Copy Pasta Simulator 2026"' },
  { type: 'now-playing', label: 'NOW PLAYING', icon: '🎮', avatar: '🔥', name: 'Production Server', action: 'is now playing', detail: '"Everything Is Fine"' },
  { type: 'now-playing', label: 'NOW PLAYING', icon: '🎮', avatar: '📦', name: 'node_modules', action: 'is now playing', detail: '"Disk Space Destroyer"' },
  { type: 'now-playing', label: 'NOW PLAYING', icon: '🎮', avatar: '⚙️', name: 'Webpack', action: 'is now playing', detail: '"Loading Screen Simulator"' },
  { type: 'now-playing', label: 'NOW PLAYING', icon: '🎮', avatar: '🎯', name: 'TypeScript', action: 'is now playing', detail: '"Type Error: The Game"' },
  // ── Messages ──
  { type: 'message', label: 'NEW MESSAGE', icon: '💬', avatar: '😅', name: 'Junior Dev', action: 'sent a message', detail: '"Is it okay if I push to main?"' },
  { type: 'message', label: 'NEW MESSAGE', icon: '💬', avatar: '📝', name: 'TODO Comments', action: 'sent a message', detail: '"Please fix me... — 2019"' },
  { type: 'message', label: 'NEW MESSAGE', icon: '💬', avatar: '🤯', name: 'CSS', action: 'sent a message', detail: '"Why am I not centering??"' },
  { type: 'message', label: 'NEW MESSAGE', icon: '💬', avatar: '📧', name: 'Recruiter Bot', action: 'sent a message', detail: '"Exciting opportunity at..."' },
  { type: 'message', label: 'NEW MESSAGE', icon: '💬', avatar: '🧑‍💻', name: 'Senior Dev', action: 'sent a message', detail: '"LGTM 👍" (didn\'t read it)' },
  // ── Invites ──
  { type: 'invite', label: 'GAME INVITE', icon: '📩', avatar: '🍕', name: 'Pizza Delivery', action: 'invited you to', detail: '"Lunch Break Speedrun"' },
  { type: 'invite', label: 'GAME INVITE', icon: '📩', avatar: '⏰', name: 'Deadline', action: 'invited you to', detail: '"Crunch Time: The Sprint"' },
  { type: 'invite', label: 'GAME INVITE', icon: '📩', avatar: '🎓', name: 'Tutorial Hell', action: 'invited you to', detail: '"Just One More Course"' },
  { type: 'invite', label: 'GAME INVITE', icon: '📩', avatar: '🔄', name: 'Refactor Loop', action: 'invited you to', detail: '"Rewrite Everything Again"' },
  // ── Achievements ──
  { type: 'achievement', label: 'ACHIEVEMENT', icon: '🏆', avatar: '📦', name: 'node_modules', action: 'earned achievement', detail: '"Exceeded 1 GB (Again)"' },
  { type: 'achievement', label: 'ACHIEVEMENT', icon: '🏆', avatar: '🍕', name: 'Pizza Delivery', action: 'earned achievement', detail: '"Fed the Developer"' },
  { type: 'achievement', label: 'ACHIEVEMENT', icon: '🏆', avatar: '📝', name: 'TODO Comments', action: 'milestone reached', detail: '"100+ Unresolved TODOs"' },
  { type: 'achievement', label: 'ACHIEVEMENT', icon: '🏆', avatar: '☕', name: 'Coffee Machine', action: 'earned achievement', detail: '"10,000 Cups Served"' },
  { type: 'achievement', label: 'ACHIEVEMENT', icon: '🏆', avatar: '🐛', name: 'That One Bug', action: 'earned achievement', detail: '"Survived 6 Sprints"' },
  // ── Trade Offers ──
  { type: 'trade-offer', label: 'TRADE OFFER', icon: '🔄', avatar: '⏰', name: 'Deadline', action: 'wants to trade', detail: 'Your weekend for "scope creep"' },
  { type: 'trade-offer', label: 'TRADE OFFER', icon: '🔄', avatar: '💀', name: 'Legacy Code', action: 'wants to trade', detail: 'Your sanity for "job security"' },
  { type: 'trade-offer', label: 'TRADE OFFER', icon: '🔄', avatar: '🧹', name: 'Tech Debt', action: 'wants to trade', detail: 'Your sprint for "clean code"' },
  { type: 'trade-offer', label: 'TRADE OFFER', icon: '🔄', avatar: '🔧', name: 'DevOps', action: 'wants to trade', detail: 'Freedom for "pipeline fixes"' },
  { type: 'trade-offer', label: 'TRADE OFFER', icon: '🔄', avatar: '📊', name: 'Manager', action: 'wants to trade', detail: 'Coding time for "more meetings"' },
];

const TYPE_COLORS: Record<NotifType, string> = {
  'friend-online': '#4ade80',
  'now-playing': '#60a5fa',
  'message': '#a78bfa',
  'invite': '#f472b6',
  'achievement': '#facc15',
  'trade-offer': '#fb923c',
};

let notifId = 0;

export default function SteamNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const usedRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spawnNotification = useCallback(() => {
    let available = NOTIFICATIONS.map((_, i) => i).filter((i) => !usedRef.current.has(i));
    if (available.length === 0) {
      usedRef.current = new Set();
      available = NOTIFICATIONS.map((_, i) => i);
    }

    const idx = available[Math.floor(Math.random() * available.length)];
    const template = NOTIFICATIONS[idx];
    const notif: Notification = { ...template, id: ++notifId };

    usedRef.current.add(idx);
    setNotifications((prev) => [...prev.slice(-2), notif]); // max 3 visible

    // Auto-dismiss after 6s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 6000);
  }, []);

  useEffect(() => {
    // Initial delay 5s, then random 5-12s intervals
    const initialTimer = setTimeout(() => {
      spawnNotification();

      const scheduleNext = () => {
        const delay = 5000 + Math.random() * 7000; // 5-12s
        intervalRef.current = setTimeout(() => {
          spawnNotification();
          scheduleNext();
        }, delay);
      };
      scheduleNext();
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [spawnNotification]);

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container}>
      {notifications.map((n) => {
        const accentColor = TYPE_COLORS[n.type];
        return (
          <div
            key={n.id}
            className={styles.toast}
            onClick={() => dismiss(n.id)}
            style={{ '--accent': accentColor } as React.CSSProperties}
          >
            <div className={styles.toastHeader}>
              <span className={styles.steamIcon}>{n.icon}</span>
              <span className={styles.toastLabel}>{n.label}</span>
            </div>
            <div className={styles.toastBody}>
              <span className={styles.avatar}>{n.avatar}</span>
              <div className={styles.toastContent}>
                <span className={styles.friendName}>{n.name}</span>
                <span className={styles.friendAction}>{n.action}</span>
                <span className={styles.friendDetail}>{n.detail}</span>
              </div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
