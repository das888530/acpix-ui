"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { updateUserSubscription } from "@/lib/db/users";

export async function toggleSubscriptionAction() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await updateUserSubscription({
    userId: user.id,
    isSubscribed: !user.isSubscribed,
  });

  revalidatePath("/");
  revalidatePath("/subscription");

  return updatedUser;
}
