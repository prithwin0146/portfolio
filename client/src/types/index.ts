export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  gitHubUrl: string;
  linkedInUrl: string;
  avatarUrl: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  gitHubUrl: string;
  tags: string[];
  stars: number;
  forks: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  highlights: string[];
}

export interface Service {
  id: number;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  deliverables: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
