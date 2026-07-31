import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './SteamNotifications.module.css';

type NotifType = 'friend-online' | 'playing' | 'invite' | 'achievement' | 'trade' | 'message';

interface SteamNotif {
  id: number;
  type: NotifType;
  name: string;
  message: string;
  action?: string;
  avatar?: string;
}

interface NotifTemplate {
  type: NotifType;
  name: string;
  message: string;
  action?: string;
  avatar?: string;
}

const NOTIFICATIONS: NotifTemplate[] = [
  // Friend Online
  { type: 'friend-online', name: 'xX_Sniper_Dev_Xx', message: 'is now online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sniper' },
  { type: 'friend-online', name: 'StackOverflow Rep', message: 'is now online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stack' },
  { type: 'friend-online', name: 'Gabe Newell', message: 'is now online', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gaben' },
  
  // Playing Games
  { type: 'playing', name: 'Senior Dev', message: 'is now playing', action: 'Fixing Production: Survival Horror', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Senior' },
  { type: 'playing', name: 'Junior Dev', message: 'is now playing', action: 'npm install Simulator 2026', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Junior' },
  { type: 'playing', name: 'Todd Howard', message: 'is now playing', action: 'Skyrim: Vercel Edition', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Todd' },
  { type: 'playing', name: 'The Intern', message: 'is now playing', action: 'git rebase --hard (Permadeath)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Intern' },
  
  // Invites
  { type: 'invite', name: 'Project Manager', message: 'has invited you to play', action: '10 AM Standup (Ranked Match)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PM' },
  { type: 'invite', name: 'Gabe Newell', message: 'has invited you to play', action: 'Half-Life 3 (Closed Beta)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gaben2' },
  
  // Achievements
  { type: 'achievement', name: 'Junior Dev', message: 'unlocked achievement:', action: 'Pushed to Main without breaking it', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Junior' },
  { type: 'achievement', name: 'Senior Dev', message: 'unlocked achievement:', action: 'It Compiles on the First Try!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Senior2' },
  { type: 'achievement', name: 'You', message: 'unlocked achievement:', action: 'Found a missing semicolon after 3 hours', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' },
  
  // Messages
  { type: 'message', name: 'Client', message: 'sent you a message:', action: '"Can we add blockchain to the CSS?"', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Client' },
  { type: 'message', name: 'Code Reviewer', message: 'sent you a message:', action: '"What does this regex even do?"', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reviewer' },
  
  // Trade Offers
  { type: 'trade', name: 'Startup CEO', message: 'wants to trade', action: '"Exposure & Equity" for your "Time"', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CEO' },
];

const TYPE_CLASS: Record<NotifType, string> = {
  'friend-online': styles.typeFriendOnline,
  'playing':       styles.typePlaying,
  'invite':        styles.typeInvite,
  'achievement':   styles.typeAchievement,
  'trade':         styles.typeTrade,
  'message':       styles.typeMessage,
};

let notifId = 0;

export default function SteamNotifications() {
  const [notifications, setNotifications] = useState<SteamNotif[]>([]);
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
    const notif: SteamNotif = { ...template, id: ++notifId };

    usedRef.current.add(idx);
    setNotifications((prev) => [...prev.slice(-2), notif]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 6000);
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      spawnNotification();

      const scheduleNext = () => {
        // Notification every 30-45 seconds
        const delay = 30000 + Math.random() * 15000;
        intervalRef.current = setTimeout(() => {
          spawnNotification();
          scheduleNext();
        }, delay);
      };
      scheduleNext();
    }, 15000); // Wait 15s before first one

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
      {notifications.map((n) => (
        <div key={n.id} className={`${styles.toast} ${TYPE_CLASS[n.type]}`}>
          <div className={styles.avatarWrap}>
            {n.avatar ? (
              <img src={n.avatar} alt={n.name} />
            ) : (
              <div className={styles.avatarPlaceholder}>👤</div>
            )}
          </div>
          <div className={styles.content}>
            <div className={styles.name}>{n.name}</div>
            <div className={styles.messageText}>
              {n.message}
              {n.action && <span className={styles.action}> {n.action}</span>}
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => dismiss(n.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
