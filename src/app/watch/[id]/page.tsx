import { notFound } from 'next/navigation';

import { WatchPageClient } from '@/components/video/WatchPageClient';
import { getCurrentUser } from '@/lib/auth';
import { getVideoById, getVideos } from '@/lib/db/video-content';

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [video, videos, user] = await Promise.all([
    getVideoById(id),
    getVideos(),
    getCurrentUser(),
  ]);

  if (!video) {
    notFound();
  }

  return (
    <WatchPageClient
      video={video}
      recommendations={videos.filter((item) => item.id !== video.id).slice(0, 3)}
      userIsSubscribed={user?.isSubscribed}
    />
  );
}
