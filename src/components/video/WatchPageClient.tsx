'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Info,
  Lock,
  PlayCircle,
  Share2,
} from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Episode, VideoContent } from '@/lib/types';

export function WatchPageClient({
  video,
  recommendations,
  userIsSubscribed,
}: {
  video: VideoContent;
  recommendations: VideoContent[];
  userIsSubscribed?: boolean;
}) {
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    if ((video.type || 'movie') === 'series' && video.episodes && video.episodes.length > 0) {
      setActiveEpisode(video.episodes[0]);
    }
  }, [video]);

  const canWatchFull = video.isFree || userIsSubscribed;
  const isSeries = (video.type || 'movie') === 'series';
  const currentVideoUrl = !isSeries ? video.videoUrl : activeEpisode?.videoUrl;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl group border border-white/10">
              {canWatchFull ? (
                <video
                  key={currentVideoUrl}
                  src={currentVideoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={video.thumbnailUrl}
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8 text-center bg-zinc-900/50 backdrop-blur-sm">
                  <div className="bg-secondary p-8 rounded-full">
                    <Lock size={64} className="text-accent" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-3xl font-headline font-bold text-white">Premium Content</h2>
                    <p className="text-muted-foreground">
                      This content is exclusive to StreamVault subscribers. Upgrade your account to start watching.
                    </p>
                  </div>
                  <Link href="/subscription">
                    <Button className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-full font-bold text-lg">
                      Get Unlimited Access
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {isSeries && (
            <div className="lg:col-span-1 bg-card rounded-2xl border border-white/5 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-secondary/20">
                <h3 className="font-headline font-bold flex items-center gap-2">
                  <PlayCircle size={18} className="text-primary" /> Episodes
                </h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {video.episodes?.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setActiveEpisode(ep)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex gap-3 group ${
                        activeEpisode?.id === ep.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="h-10 w-10 shrink-0 bg-secondary rounded-lg flex items-center justify-center font-bold text-xs">
                        {ep.order}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold truncate ${activeEpisode?.id === ep.id ? 'text-primary' : ''}`}>
                            {ep.title}
                          </h4>
                          {activeEpisode?.id === ep.id && <CheckCircle2 size={12} className="text-primary" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                          {ep.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-headline font-bold text-white">
                    {isSeries && activeEpisode ? `${video.title}: ${activeEpisode.title}` : video.title}
                  </h1>
                  {video.isFree && <Badge className="bg-accent text-accent-foreground font-bold">FREE</Badge>}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <span>{new Date(video.createdAt).getFullYear()}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1">
                    {isSeries ? 'TV Series' : 'Feature Film'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="flex gap-2">
                    {(video.genres || []).map((g) => <span key={g} className="text-accent">{g}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="glass h-12 w-12 rounded-full p-0 border-white/10 hover:bg-white/5">
                  <Heart size={20} />
                </Button>
                <Button variant="outline" className="glass h-12 w-12 rounded-full p-0 border-white/10 hover:bg-white/5">
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-headline font-bold flex items-center gap-2">
                <Info size={18} className="text-primary" /> Storyline
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {isSeries && activeEpisode ? activeEpisode.description : video.description}
              </p>
              {isSeries && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-4 py-1 italic">
                    Original Series: {video.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {(video.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10">
                  #{tag.replace(/\s/g, '').toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-headline font-bold">Recommendations</h3>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Link key={rec.id} href={`/watch/${rec.id}`} className="flex gap-4 group cursor-pointer">
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/5">
                    <Image src={rec.thumbnailUrl} alt={rec.title} fill className="object-cover transition-transform group-hover:scale-110" data-ai-hint="recommendation thumbnail" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-sm line-clamp-1 group-hover:text-accent transition-colors">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-accent font-bold uppercase tracking-wider">{(rec.genres || [])[0]}</div>
                      {(rec.type || 'movie') === 'series' && <Badge className="text-[8px] h-4 bg-primary/20 text-primary border-none">SERIES</Badge>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="outline" className="w-full glass border-white/10 text-muted-foreground">Show More</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
