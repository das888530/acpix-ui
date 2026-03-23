
export type Role = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  role: Role;
  isSubscribed: boolean;
}

export type ContentType = 'movie' | 'series';

export interface Episode {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
}

export interface VideoContent {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  genres: string[];
  tags: string[];
  thumbnailUrl: string;
  videoUrl?: string; // Optional for series as they use episodes
  isFree: boolean;
  createdAt: string;
  episodes?: Episode[];
}

export type VideoInput = Omit<VideoContent, 'id' | 'createdAt'>;
