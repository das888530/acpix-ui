import { redirect } from "next/navigation";

import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { getVideos } from "@/lib/db/video-content";

export default async function AdminPage() {
  const [user, videos] = await Promise.all([getCurrentUser(), getVideos()]);

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return <AdminDashboardClient videos={videos} />;
}
