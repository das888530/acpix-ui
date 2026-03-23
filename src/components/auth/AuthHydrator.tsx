"use client";

import { useEffect } from "react";

import { useStreamStore } from "@/lib/store";
import type { User } from "@/lib/types";

export function AuthHydrator({ user }: { user: User | null }) {
  const setUser = useStreamStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);

  return null;
}
