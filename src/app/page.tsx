import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Info, Play } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { VideoCard } from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import { getVideos } from '@/lib/db/video-content';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function HomePage() {
  const [videos, user] = await Promise.all([getVideos(), getCurrentUser()]);
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-bg') || PlaceHolderImages[0];

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      <section className="relative h-[85vh] w-full flex items-end">
        <div className="absolute inset-0 z-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Hero Background"
              fill
              className="object-cover brightness-50"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="bg-primary px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">Streaming Now</span>
              <span className="text-accent text-sm font-medium">New Release</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tighter">
              Stellar <span className="text-accent">Exploration</span>
            </h1>
            <p className="text-lg text-muted-foreground line-clamp-3 leading-relaxed">
              Experience the cinematic journey of a lifetime. Dive into high-definition worlds with StreamVault&apos;s premium collection of exclusive series and films.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full font-bold gap-2 group">
                <Play fill="black" size={20} className="group-hover:scale-110 transition-transform" /> Watch Trailer
              </Button>
              <Button variant="outline" className="glass text-white border-white/20 px-8 py-6 rounded-full font-bold gap-2">
                <Info size={20} /> More Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12 space-y-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-bold tracking-tight">Recently Added</h2>
            <Link href="#" className="text-accent text-sm font-medium flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} userIsSubscribed={user?.isSubscribed} />
            ))}
          </div>
        </div>

        {!user?.isSubscribed && (
          <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 glass border border-accent/20">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-4">
                <h3 className="text-3xl font-headline font-bold">Unlock the Full Cinematic Vault</h3>
                <p className="text-muted-foreground max-w-xl">
                  Get unlimited access to our entire premium library, including 4K streams and exclusive behind-the-scenes content.
                </p>
              </div>
              <Link href="/subscription">
                <Button className="bg-accent text-accent-foreground hover:brightness-110 px-10 py-6 rounded-full font-bold text-lg shadow-lg shadow-accent/20">
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-headline font-bold tracking-tight">Free To Stream</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.filter((v) => v.isFree).map((video) => (
              <VideoCard key={video.id} video={video} userIsSubscribed={user?.isSubscribed} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
