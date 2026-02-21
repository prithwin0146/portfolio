export interface GitHubStatsData {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  activePercent: number;
  followers: number;
  yearsOfExperience: number;
  topLanguages: { name: string; percent: number; color: string }[];
}

/** Static GitHub stats — update periodically or fetch from GitHub API */
export const GITHUB_STATS: GitHubStatsData = {
  totalRepos: 10,
  totalStars: 5,
  totalForks: 2,
  activePercent: 80,
  followers: 3,
  yearsOfExperience: 2,
  topLanguages: [
    { name: 'TypeScript', percent: 42, color: '#3178c6' },
    { name: 'C#', percent: 28, color: '#68217a' },
    { name: 'JavaScript', percent: 18, color: '#f7df1e' },
    { name: 'HTML/CSS', percent: 12, color: '#e34c26' },
  ],
};

export interface XPSource {
  label: string;
  value: string;
  xpLabel: string;
}

export const XP_SOURCES: XPSource[] = [
  { label: 'REPOSITORIES', value: `${GITHUB_STATS.totalRepos}+`, xpLabel: `${GITHUB_STATS.totalRepos * 100} XP` },
  { label: 'FOLLOWERS', value: `${GITHUB_STATS.followers}+`, xpLabel: `${GITHUB_STATS.followers * 50} XP` },
  { label: 'TOTAL STARS', value: `${GITHUB_STATS.totalStars}+`, xpLabel: `${GITHUB_STATS.totalStars * 40} XP` },
  { label: 'YEARS OF EXPERIENCE', value: `${GITHUB_STATS.yearsOfExperience}+`, xpLabel: `+${GITHUB_STATS.yearsOfExperience * 500} XP` },
  { label: 'ACHIEVEMENTS', value: '1/12', xpLabel: '+10 XP' },
];
