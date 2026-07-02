import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminDashboard } from "@/components/AdminDashboard";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getAdminStats,
  getAllNewsAdmin,
  getNewsletterSubscribersAdmin,
  getReadingAnalyticsAdmin,
} from "@/lib/admin/db";
import { getJoinUsApplications } from "@/lib/join-us/db";
import { getRecentSystemLogs } from "@/lib/logs/db";

export default async function AdminPage() {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    redirect("/auth/signin");
  }

  const [stats, news, applications, logs, subscribers, readingAnalytics] =
    await Promise.all([
      getAdminStats(),
      getAllNewsAdmin(30),
      getJoinUsApplications(),
      getRecentSystemLogs(30),
      getNewsletterSubscribersAdmin(),
      getReadingAnalyticsAdmin(),
    ]);

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto min-h-[70vh]">
        <AdminDashboard
          stats={stats}
          news={news.map((a) => ({
            id: a.id,
            title: a.title,
            featured: a.featured,
            slug: a.slug,
            image_url: a.image_url,
          }))}
          applications={applications.map((a) => ({
            id: a.id,
            name: a.name,
            email: a.email,
            role: a.role,
            status: a.status,
          }))}
          logs={logs.map((l) => ({
            id: l.id,
            job_type: l.job_type,
            status: l.status,
            message: l.message,
            started_at: l.started_at,
            processing_time_ms: l.processing_time_ms,
          }))}
          subscribers={subscribers as Array<{ email: string; subscribed_at: string; active: boolean }>}
          readingAnalytics={readingAnalytics as Array<Record<string, unknown>>}
        />
      </main>
      <Footer />
    </>
  );
}
