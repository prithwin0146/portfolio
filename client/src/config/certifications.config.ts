export interface Certification {
  id: string;
  title: string;
  issuer: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  description: string;
  year: number;
  icon: string;
  imageUrl?: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'angular-cert',
    title: 'Angular Developer',
    issuer: 'Self-taught & Production Use',
    rarity: 'EPIC',
    description: 'Built production apps with Angular + TypeScript',
    year: 2024,
    icon: '🅰️',
  },
  {
    id: 'dotnet-developer',
    title: '.NET Full-Stack Developer',
    issuer: 'Professional Experience',
    rarity: 'EPIC',
    description: 'ASP.NET Core Web APIs & MVC Applications',
    year: 2024,
    icon: '💜',
  },
  {
    id: 'freelance-designer',
    title: 'Freelance Web Designer',
    issuer: 'Independent Practice',
    rarity: 'LEGENDARY',
    description: 'Designing & building client websites from scratch',
    year: 2024,
    icon: '🎨',
  },
  {
    id: 'react-developer',
    title: 'React + TypeScript Developer',
    issuer: 'Portfolio & Projects',
    rarity: 'RARE',
    description: 'Modern React development with TypeScript & Vite',
    year: 2025,
    icon: '⚛️',
  },
  {
    id: 'sql-server',
    title: 'SQL Server Proficient',
    issuer: 'Professional Experience',
    rarity: 'RARE',
    description: 'Database design, queries & optimization',
    year: 2024,
    icon: '🗄️',
  },
  {
    id: 'responsive-design',
    title: 'Responsive Design Expert',
    issuer: 'All Projects',
    rarity: 'COMMON',
    description: 'Mobile-first, pixel-perfect responsive layouts',
    year: 2024,
    icon: '📱',
  },
];
