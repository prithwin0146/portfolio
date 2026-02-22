import type { Profile, Project, Skill, Experience, Service, ContactMessage } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getProfile: () => fetchJson<Profile>(`${API_BASE}/profile`),
  getProjects: () => fetchJson<Project[]>(`${API_BASE}/projects`),
  getSkills: () => fetchJson<Skill[]>(`${API_BASE}/skills`),
  getExperience: () => fetchJson<Experience[]>(`${API_BASE}/experience`),
  getServices: () => fetchJson<Service[]>(`${API_BASE}/services`),

  sendContact: async (message: ContactMessage) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  },
};
