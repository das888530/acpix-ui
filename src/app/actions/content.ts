"use server";

import { revalidatePath } from "next/cache";

import { createVideo, deleteVideoById } from "@/lib/db/video-content";
import { getCurrentUser } from "@/lib/auth";
import type { VideoInput } from "@/lib/types";

export async function createVideoAction(input: VideoInput) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const video = await createVideo({
    ...input,
    uploadedById: user.id,
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return video;
}

export async function deleteVideoAction(id: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await deleteVideoById(id, user.id);

  revalidatePath("/");
  revalidatePath("/admin");
}
