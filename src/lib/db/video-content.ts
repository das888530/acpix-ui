import "server-only";

import { backendFetch } from "@/lib/backend-api";
import type { VideoContent, VideoInput } from "@/lib/types";

type CreateVideoInput = VideoInput & {
  uploadedById?: string;
};

export async function getVideos(): Promise<VideoContent[]> {
  const response = await backendFetch<{ videos: VideoContent[] }>("/api/videos");
  return response.videos;
}

export async function getVideoById(id: string): Promise<VideoContent | null> {
  try {
    const response = await backendFetch<{ video: VideoContent }>(`/api/videos/${id}`);
    return response.video;
  } catch {
    return null;
  }
}

export async function createVideo(input: CreateVideoInput): Promise<VideoContent> {
  const response = await backendFetch<{ video: VideoContent }>("/api/videos", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      userId: input.uploadedById,
    }),
  });

  return response.video;
}

export async function deleteVideoById(id: string, userId?: string) {
  await backendFetch<void>(`/api/videos/${id}`, {
    method: "DELETE",
    headers: userId ? { "x-user-id": userId } : undefined,
  });
}
