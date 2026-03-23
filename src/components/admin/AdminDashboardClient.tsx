'use client';

import { Navbar } from '@/components/layout/Navbar';
import { AdminContentPanel } from '@/components/admin/AdminContentPanel';
import {
  Users,
  Film,
  BarChart3,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VideoContent } from '@/lib/types';

export function AdminDashboardClient({ videos }: { videos: VideoContent[] }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-20 space-y-10">
        <header className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutDashboard className="text-primary" size={24} />
          </div>
          <h1 className="text-4xl font-headline font-bold">Admin Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Library</CardTitle>
              <Film className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videos.length}</div>
              <p className="text-xs text-muted-foreground">Active streaming titles</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">67% retention rate</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,490</div>
              <p className="text-xs text-muted-foreground">+8.2% monthly growth</p>
            </CardContent>
          </Card>
        </div>

        <div className="pt-4">
          <AdminContentPanel initialVideos={videos} />
        </div>
      </main>
    </div>
  );
}
