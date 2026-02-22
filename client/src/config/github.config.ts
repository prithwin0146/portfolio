export interface GitHubStatsData {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  activePercent: number;
  followers: number;
  yearsOfExperience: number;
  topLanguages: { name: string; percent: number; color: string }[];
}

/** Years of professional experience (update as needed). */
export const YEARS_OF_EXPERIENCE = 2;

/** Fallback values used before the GitHub API responds. */
export const DEFAULT_GITHUB_STATS: GitHubStatsData = {
  totalRepos: 0,
  totalStars: 0,
  totalForks: 0,
  activePercent: 0,
  followers: 0,
  yearsOfExperience: YEARS_OF_EXPERIENCE,
  topLanguages: [],
};

/** Well-known language colours for the top-languages bar. */
export const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  'C#': '#68217a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Dockerfile: '#384d54',
};

/** Derive top languages (sorted, percentage) from a bytes-per-language map. */
export function deriveTopLanguages(
  langBytes: Record<string, number>,
): GitHubStatsData['topLanguages'] {
  const total = Object.values(langBytes).reduce((s, v) => s + v, 0);
  if (total === 0) return [];

  return Object.entries(langBytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      percent: Math.round((bytes / total) * 100),
      color: LANG_COLORS[name] ?? '#8b8b8b',
    }));
}
