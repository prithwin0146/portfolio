export interface Hobby {
  id: string;
  icon: string;
  title: string;
  description: string;
  active?: boolean;
}

export const HOBBIES: Hobby[] = [
  {
    id: 'coding',
    icon: '💻',
    title: 'Building Side Projects',
    description: 'Always tinkering with new frameworks and shipping pet projects',
    active: true,
  },
  {
    id: 'gaming',
    icon: '🎮',
    title: 'Gaming',
    description: 'Casual gamer — love story-driven games and indie titles',
  },
  {
    id: 'design',
    icon: '🎨',
    title: 'UI/UX Design',
    description: 'Exploring design trends and creating mockups for fun',
  },
  {
    id: 'music',
    icon: '🎵',
    title: 'Music',
    description: 'Always listening to something — lo-fi, hip-hop, or ambient',
  },
  {
    id: 'learning',
    icon: '📚',
    title: 'Continuous Learning',
    description: 'Online courses, docs, and tutorials — always levelling up',
    active: true,
  },
  {
    id: 'coffee',
    icon: '☕',
    title: 'Coffee Enthusiast',
    description: 'Fuelled by filter coffee — the stronger, the better',
  },
];
