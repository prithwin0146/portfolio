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
  // Real Friends (Satire)
  { type: 'playing',      name: 'Dwight',           message: 'is now playing',          action: 'Beet Farm Simulator 2025',         avatar: 'https://avatars.akamai.steamstatic.com/348bfcc2f5e138027a503aabe6fcc456920c2ffc_full.jpg' },
  { type: 'invite',       name: 'Jomar',            message: 'has invited you to',      action: 'the parlor (no escape)',           avatar: 'https://avatars.akamai.steamstatic.com/292cd01bfcde8d57f15f0c5916ccd6c01a324d99_full.jpg' },
  { type: 'achievement',  name: 'Banjo',            message: 'unlocked achievement:',   action: 'Actually Touched Grass',           avatar: 'https://avatars.akamai.steamstatic.com/84445a5904b524abdc0ba160401d7b125ec649eb_full.jpg' },
  // Friend Online
  { type: 'friend-online', name: 'Bill Gates',       message: 'is now online',           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BillGates' },
  { type: 'friend-online', name: 'Elon Musk',        message: 'is now online',           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElonMusk' },
  { type: 'friend-online', name: 'Mark Zuckerberg',  message: 'is now online in the Metaverse', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zuckerberg' },
  { type: 'friend-online', name: 'Steve Jobs',       message: 'is now online',           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SteveJobs' },
  // Playing Games
  { type: 'playing',      name: 'Elon Musk',        message: 'is now playing',          action: 'Twitter Takeover Simulator',       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElonMusk' },
  { type: 'playing',      name: 'Mark Zuckerberg',  message: 'is now playing',          action: 'Metaverse: Population 1',          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zuckerberg' },
  { type: 'playing',      name: 'Jeff Bezos',       message: 'is now playing',          action: 'Rocket League (literally)',        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bezos' },
  { type: 'playing',      name: 'Bill Gates',       message: 'is now playing',          action: 'Minesweeper (Classic)',            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BillGates' },
  { type: 'playing',      name: 'Satoshi Nakamoto', message: 'is now playing',          action: 'Hide and Seek',                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Satoshi' },
  // Invites
  { type: 'invite',       name: 'Roaring Kitty',   message: 'has invited you to trade', action: 'GameStop shares',                 avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RoaringKitty' },
  { type: 'invite',       name: 'Warren Buffett',  message: 'has invited you to play',  action: 'The Long Game',                   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WarrenBuffett' },
  { type: 'invite',       name: 'Vitalik Buterin', message: 'has invited you to',       action: 'merge the mainnet',               avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalik' },
  // Achievements
  { type: 'achievement',  name: 'Linus Torvalds',  message: 'unlocked achievement:',    action: 'Built Different',                 avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linus' },
  { type: 'achievement',  name: 'Ada Lovelace',    message: 'unlocked achievement:',    action: 'First Programmer',                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ada' },
  // Messages
  { type: 'message',      name: 'Tim Cook',        message: 'sent you a message:',      action: '"Sent from my iPhone"',           avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TimCook' },
  { type: 'message',      name: 'John Carmack',    message: 'sent you a message:',      action: '"Need more FPS"',                 avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carmack' },
  { type: 'message',      name: 'Gabe Newell',     message: 'sent you a message:',      action: '"Half-Life 3 confirmed?"',        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gaben' },
  // Trade Offers
  { type: 'trade',        name: 'Steve Wozniak',   message: 'wants to trade',           action: 'vintage Apple I for your code',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wozniak' },
  { type: 'trade',        name: 'Jack Dorsey',     message: 'wants to trade',           action: 'first tweet NFT',                 avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dorsey' },
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
        const delay = 5000 + Math.random() * 7000;
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
