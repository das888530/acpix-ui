
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { logoutAction } from '@/app/actions/auth';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { useStreamStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  LogOut, 
  Settings, 
  CreditCard,
  LayoutDashboard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navbar() {
  const router = useRouter();
  const { user, setUser } = useStreamStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Play className="text-white fill-white" size={20} />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white">
            STREAM<span className="text-accent">VAULT</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Browse</Link>
          <Link href="/subscription" className="text-sm font-medium hover:text-accent transition-colors">Subscription</Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-sm font-medium text-accent hover:brightness-110 transition-all flex items-center gap-1">
              <Settings size={14} /> Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarFallback className="bg-secondary text-white">
                    {user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.role.toUpperCase()} ACCOUNT</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/subscription" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{user.isSubscribed ? 'Manage Subscription' : 'Upgrade to Premium'}</span>
                </Link>
              </DropdownMenuItem>
              {user.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await logoutAction();
                  setUser(null);
                  router.refresh();
                }}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <AuthDialog />
        )}
      </div>
    </nav>
  );
}
