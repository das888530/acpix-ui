
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, VideoContent } from './types';
import { PlaceHolderImages } from './placeholder-images';

interface StreamState {
  user: User | null;
  videos: VideoContent[];
  setUser: (user: User | null) => void;
  toggleSubscription: () => void;
  addVideo: (video: VideoContent) => void;
  updateVideo: (id: string, updates: Partial<VideoContent>) => void;
  deleteVideo: (id: string) => void;
}

const INITIAL_VIDEOS: VideoContent[] = [
  {
    id: '1',
    type: 'movie',
    title: 'Neon Pulse: Tokyo Nights',
    description: 'A visually stunning exploration of Tokyo’s futuristic architecture and neon-lit streets.',
    genres: ['Documentary', 'Cinematic'],
    tags: ['Travel', 'Cyberpunk', 'Urban'],
    thumbnailUrl: PlaceHolderImages[1].imageUrl,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    isFree: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    type: 'series',
    title: 'Stellar Frontiers',
    description: 'Humanity’s first steps beyond the solar system. An epic saga of survival and discovery.',
    genres: ['Sci-Fi', 'Action'],
    tags: ['Space', 'Adventure', 'Future'],
    thumbnailUrl: PlaceHolderImages[2].imageUrl,
    isFree: false,
    createdAt: '2024-01-02T00:00:00.000Z',
    episodes: [
      {
        id: 'ep1',
        title: 'The Departure',
        description: 'The mission begins as the crew leaves Earth orbit.',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        order: 1
      },
      {
        id: 'ep2',
        title: 'Void of Silence',
        description: 'Deep space reveals its first mystery.',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        order: 2
      }
    ]
  }
];

export const useStreamStore = create<StreamState>()(
  persist(
    (set) => ({
      user: null,
      videos: INITIAL_VIDEOS,
      setUser: (user) => set({ user }),
      toggleSubscription: () => set((state) => ({
        user: state.user ? { ...state.user, isSubscribed: !state.user.isSubscribed } : null
      })),
      addVideo: (video) => set((state) => ({ videos: [video, ...state.videos] })),
      updateVideo: (id, updates) => set((state) => ({
        videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
      })),
      deleteVideo: (id) => set((state) => ({
        videos: state.videos.filter(v => v.id !== id)
      })),
    }),
    {
      name: 'stream-vault-storage',
      partialize: (state) => ({ videos: state.videos }),
    }
  )
);
