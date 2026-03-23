'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Crown, ShieldCheck, Zap } from 'lucide-react';

import { toggleSubscriptionAction } from '@/app/actions/subscription';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

export function SubscriptionPageClient({ user }: { user: User | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSubscribed, setIsSubscribed] = useState(Boolean(user?.isSubscribed));

  const handleSubscribe = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login required',
        description: 'Create an account or sign in before managing a subscription.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const updatedUser = await toggleSubscriptionAction();
        setIsSubscribed(updatedUser.isSubscribed);
        toast({
          title: updatedUser.isSubscribed ? 'Welcome to Premium!' : 'Subscription Cancelled',
          description: updatedUser.isSubscribed
            ? 'You now have unlimited access to StreamVault.'
            : "We're sorry to see you go.",
        });
        router.refresh();
      } catch {
        toast({
          variant: 'destructive',
          title: 'Subscription update failed',
          description: 'We could not update your subscription right now.',
        });
      }
    });
  };

  const plans = [
    {
      name: 'Standard',
      price: '$9.99',
      icon: <Zap className="text-blue-400" size={24} />,
      features: ['Full HD (1080p) Streaming', 'Access to 500+ Titles', 'Watch on 2 Devices', 'Monthly Ad-free Experience'],
      highlight: false,
    },
    {
      name: 'Ultra Premium',
      price: '$14.99',
      icon: <Crown className="text-accent" size={24} />,
      features: ['4K HDR + Dolby Vision', 'Exclusive Originals', 'Watch on 5 Devices', 'Offline Downloads', 'Priority AI Support'],
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      <main className="pt-32 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-1">Limited Time Offer</Badge>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-white">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Join thousands of cinephiles and enjoy the best of global streaming content.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.highlight ? 'bg-primary/5 border-primary shadow-2xl shadow-primary/10' : 'bg-card border-white/5'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col h-full space-y-8">
                <div className="space-y-4">
                  <div className="p-3 bg-secondary rounded-2xl inline-block">
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <p className="text-sm font-medium text-white/60">Includes:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="text-accent shrink-0" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={isPending}
                  className={`w-full py-8 rounded-2xl font-bold text-lg shadow-xl ${
                    plan.highlight ? 'bg-primary hover:bg-primary/90' : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {isPending ? 'Updating...' : isSubscribed ? 'Manage Current Plan' : 'Get Started Now'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-card/50 border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-full">
            <ShieldCheck className="text-accent" size={24} />
          </div>
          <div>
            <p className="font-bold">Secure Checkout & Privacy</p>
            <p className="text-sm text-muted-foreground">Your payment information is encrypted. You can cancel your subscription at any time without hidden fees.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
