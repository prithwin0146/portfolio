export interface Hobby {
  id: string;
  icon: string;
  title: string;
  description: string;
  active?: boolean;
}

export const HOBBIES: Hobby[] = [
  {
    id: 'gaming',
    icon: '🎮',
    title: 'Gaming',
    description: 'Casual gamer — love story-driven games and indie titles',
    active: true,
  },
  {
    id: 'music',
    icon: '🎵',
    title: 'Music',
    description: 'Always listening to something — lo-fi, hip-hop, or ambient',
  },
  {
    id: 'coffee',
    icon: '☕',
    title: 'Coffee Enthusiast',
    description: 'Fuelled by filter coffee — the stronger, the better',
  },
  {
    id: 'horse-riding',
    icon: '🐴',
    title: 'Horse Riding',
    description: 'Finding balance and freedom in the saddle — nothing clears the mind like a good ride',
  },
  {
    id: 'travel',
    icon: '🗺️',
    title: 'Explorer',
    description: 'Chasing new cities, cultures, and cuisines — every trip is a new level unlocked',
    active: true,
  },
  {
    id: 'astrophotography',
    icon: '🔭',
    title: 'Astrophotography',
    description: 'Capturing deep-sky objects at night — where code meets cosmos',
  },
];

