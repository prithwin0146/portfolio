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
    id: 'angular-prod',
    title: 'Angular Developer',
    issuer: 'JobBuddy · Employee Mgmt System',
    rarity: 'EPIC',
    description: 'Built 2 production Angular apps with SSR, RBAC & real client usage',
    year: 2024,
    icon: '🅰️',
  },
  {
    id: 'dotnet-api',
    title: '.NET API Developer',
    issuer: 'Professional Experience',
    rarity: 'EPIC',
    description: 'ASP.NET Core REST APIs powering 3+ live applications',
    year: 2024,
    icon: '💜',
  },
  {
    id: 'freelance-web',
    title: 'Freelance Web Designer',
    issuer: 'JK Travels · Client Work',
    rarity: 'LEGENDARY',
    description: 'End-to-end website design & delivery for real paying clients',
    year: 2024,
    icon: '🎨',
  },
  {
    id: 'react-ts',
    title: 'React + TypeScript',
    issuer: 'This Portfolio · Side Projects',
    rarity: 'RARE',
    description: 'Built this Steam-themed portfolio with React 19, Vite & TypeScript',
    year: 2025,
    icon: '⚛️',
  },
  {
    id: 'sql-server',
    title: 'SQL Server',
    issuer: 'Production Databases',
    rarity: 'RARE',
    description: 'CTE-optimized queries, server-side pagination & schema design',
    year: 2024,
    icon: '🗄️',
  },
  {
    id: 'responsive-design',
    title: 'Responsive Design',
    issuer: 'Mobile-First on Every Project',
    rarity: 'COMMON',
    description: 'Every project ships responsive — tested on real devices',
    year: 2024,
    icon: '📱',
  },
];
