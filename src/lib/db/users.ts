import "server-only";

import { backendFetch } from "@/lib/backend-api";
import type { User } from "@/lib/types";

export type UserAuthRecord = User & {
  passwordHash?: string;
};

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await backendFetch<{ user: User }>(`/api/users/${id}`);
    return response.user;
  } catch {
    return null;
  }
}

export async function signupUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await backendFetch<{ user: User }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.user;
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await backendFetch<{ user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.user;
}

export async function updateUserSubscription(input: {
  userId: string;
  isSubscribed: boolean;
}): Promise<User> {
  const response = await backendFetch<{ user: User }>(`/api/users/${input.userId}/subscription/toggle`, {
    method: "POST",
    body: JSON.stringify({ isSubscribed: input.isSubscribed }),
  });
  return response.user;
}
