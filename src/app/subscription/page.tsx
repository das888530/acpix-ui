import { SubscriptionPageClient } from '@/components/subscription/SubscriptionPageClient';
import { getCurrentUser } from '@/lib/auth';

export default async function SubscriptionPage() {
  const user = await getCurrentUser();

  return <SubscriptionPageClient user={user} />;
}
