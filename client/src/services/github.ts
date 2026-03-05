/**
 * GitHub API service — fetches live stats for the developer level system.
 * Uses the public GitHub REST API (no auth token required for basic data).
 *
 * Caches responses in sessionStorage so we only hit the API once per session.
 */

const GITHUB_USERNAME = 'prithwin0146';
const API_BASE = 'https://api.github.com';
const CACHE_KEY = 'gh-profile';
const REPO_CACHE_KEY = 'gh-repos';
const EVENTS_CACHE_KEY = 'gh-events';
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// ── Types ──────────────────────────────────────────
export interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
  createdAt: string;  // ISO date string
}

export interface RepoStats {
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>; // language → byte count
  activeRepos: number;               // repos updated in last 12 months
}

// ── Helpers ────────────────────────────────────────
function getCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw) as { ts: number; data: T };
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch { /* ignore quota errors */ }
}

// ── Public API ─────────────────────────────────────

/** Fetch the user's public GitHub profile (repos count, followers). */
export async function fetchUserProfile(): Promise<GitHubProfile | null> {
  const cached = getCache<GitHubProfile>(CACHE_KEY);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}`);
    if (!res.ok) return null;
    const json = await res.json();
    const profile: GitHubProfile = {
      public_repos: json.public_repos ?? 0,
      followers: json.followers ?? 0,
      following: json.following ?? 0,
      createdAt: json.created_at ?? '',
    };
    setCache(CACHE_KEY, profile);
    return profile;
  } catch {
    return null;
  }
}

/** Aggregate star/fork counts and language stats across all public repos. */
export async function getRepoStats(): Promise<RepoStats | null> {
  const cached = getCache<RepoStats>(REPO_CACHE_KEY);
  if (cached) return cached;

  try {
    // Fetch up to 100 repos (pagination page 1 — should cover most portfolios)
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    );
    if (!res.ok) return null;

    const repos = (await res.json()) as Array<{
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      size: number;
      pushed_at: string;
    }>;

    let totalStars = 0;
    let totalForks = 0;
    let activeRepos = 0;
    const languages: Record<string, number> = {};
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;

    for (const repo of repos) {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;

      if (new Date(repo.pushed_at).getTime() > oneYearAgo) {
        activeRepos++;
      }

      if (repo.language && repo.size > 0) {
        languages[repo.language] = (languages[repo.language] ?? 0) + repo.size;
      }
    }

    const stats: RepoStats = { totalStars, totalForks, languages, activeRepos };
    setCache(REPO_CACHE_KEY, stats);
    return stats;
  } catch {
    return null;
  }
}

// ── Live activity summary ──────────────────────────

export interface LiveActivity {
  lastPushAt: string;       // ISO timestamp of the most recent push
  commitsLastMonth: number; // estimated commits in the last 30 days
}

const LIVE_CACHE_KEY = 'gh-live';

/** Derive last-push time and recent commit count from public events. */
export async function fetchLiveActivity(): Promise<LiveActivity> {
  const cached = getCache<LiveActivity>(LIVE_CACHE_KEY);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`,
    );
    if (!res.ok) return { lastPushAt: '', commitsLastMonth: 0 };

    const events = (await res.json()) as Array<Record<string, unknown>>;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    let lastPushAt = '';
    let commitsLastMonth = 0;

    for (const event of events) {
      const created = event.created_at as string;
      if (event.type === 'PushEvent') {
        if (!lastPushAt) lastPushAt = created; // events are newest-first
        const commits = (event.payload as Record<string, unknown>).commits as unknown[];
        if (new Date(created).getTime() > thirtyDaysAgo) {
          commitsLastMonth += Array.isArray(commits) ? commits.length : 1;
        }
      }
    }

    const result: LiveActivity = { lastPushAt, commitsLastMonth };
    setCache(LIVE_CACHE_KEY, result);
    return result;
  } catch {
    return { lastPushAt: '', commitsLastMonth: 0 };
  }
}

// ── Activity Feed ──────────────────────────────────

export interface GitHubActivity {
  icon: string;
  action: string;
  detail: string;
  time: string;      // ISO timestamp
  url?: string;
}

/** Map GitHub event types to a human-readable icon + action string. */
function mapEvent(event: Record<string, unknown>): GitHubActivity | null {
  const type = event.type as string;
  const repo = (event.repo as { name: string })?.name ?? '';
  const payload = event.payload as Record<string, unknown>;
  const created = event.created_at as string;

  switch (type) {
    case 'PushEvent': {
      const commits = (payload.commits as Array<{ message: string }>) ?? [];
      const msg = commits[0]?.message?.split('\n')[0] ?? 'code changes';
      return { icon: '🚀', action: 'Pushed to', detail: `${repo} — "${msg}"`, time: created };
    }
    case 'CreateEvent': {
      const refType = payload.ref_type as string;
      if (refType === 'repository')
        return { icon: '📦', action: 'Created repo', detail: repo, time: created };
      return { icon: '🌿', action: `Created ${refType}`, detail: `${payload.ref} in ${repo}`, time: created };
    }
    case 'WatchEvent':
      return { icon: '⭐', action: 'Starred', detail: repo, time: created };
    case 'ForkEvent':
      return { icon: '🍴', action: 'Forked', detail: repo, time: created };
    case 'PullRequestEvent': {
      const pr = payload.pull_request as { title: string; number: number } | undefined;
      const act = payload.action as string;
      return { icon: '🔀', action: `${act === 'opened' ? 'Opened' : act === 'closed' ? 'Merged' : 'Updated'} PR`, detail: `#${pr?.number} — "${pr?.title}"` , time: created };
    }
    case 'IssuesEvent': {
      const issue = payload.issue as { title: string; number: number } | undefined;
      return { icon: '📝', action: 'Opened issue', detail: `#${issue?.number} — "${issue?.title}"`, time: created };
    }
    case 'DeleteEvent':
      return { icon: '🗑️', action: 'Deleted', detail: `${payload.ref_type} ${payload.ref} from ${repo}`, time: created };
    case 'IssueCommentEvent':
      return { icon: '💬', action: 'Commented on', detail: repo, time: created };
    case 'ReleaseEvent':
      return { icon: '🏷️', action: 'Released', detail: `${(payload.release as { tag_name: string })?.tag_name} in ${repo}`, time: created };
    default:
      return null;
  }
}

/** Fetch the latest public GitHub activity events. */
export async function fetchGitHubActivity(limit = 8): Promise<GitHubActivity[]> {
  const cached = getCache<GitHubActivity[]>(EVENTS_CACHE_KEY);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=30`,
    );
    if (!res.ok) return [];

    const events = (await res.json()) as Array<Record<string, unknown>>;
    const mapped = events
      .map(mapEvent)
      .filter((e): e is GitHubActivity => e !== null)
      .slice(0, limit);

    setCache(EVENTS_CACHE_KEY, mapped);
    return mapped;
  } catch {
    return [];
  }
}
