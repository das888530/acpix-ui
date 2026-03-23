
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { VideoContent } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Play, Lock, Layers } from 'lucide-react';

interface VideoCardProps {
  video: VideoContent;
  userIsSubscribed?: boolean;
}

export function VideoCard({ video, userIsSubscribed = false }: VideoCardProps) {
  const canWatchFull = video.isFree || userIsSubscribed;
  const isSeries = (video.type || 'movie') === 'series';

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 shadow-xl">
      <div className="relative aspect-video">
        <Image 
          src={video.thumbnailUrl} 
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="video thumbnail"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link 
            href={`/watch/${video.id}`}
            className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full scale-90 group-hover:scale-100 transition-transform"
          >
            {canWatchFull ? <Play fill="white" size={24} /> : <Lock size={24} />}
          </Link>
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          {isSeries && (
            <Badge variant="secondary" className="bg-primary/80 backdrop-blur-sm text-white border-none text-[10px] flex items-center gap-1">
              <Layers size={10} /> Series ({video.episodes?.length || 0})
            </Badge>
          )}
          {!canWatchFull && (
            <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-xs flex items-center gap-1">
              <Lock size={12} /> Premium
            </Badge>
          )}
          {video.isFree && (
            <Badge className="bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider">Free</Badge>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-headline font-bold text-lg line-clamp-1 group-hover:text-accent transition-colors">
            {video.title}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 h-10">
          {video.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {(video.genres || []).slice(0, 2).map((genre) => (
            <span key={genre} className="text-[10px] uppercase font-bold tracking-widest text-accent/80 px-2 py-0.5 rounded border border-accent/20">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
