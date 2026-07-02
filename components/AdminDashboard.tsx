"use client";

import { useState } from "react";

interface AdminActionButtonProps {
  label: string;
  action: string;
  onComplete?: (message: string) => void;
}

function AdminActionButton({ label, action, onComplete }: AdminActionButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await response.json()) as Record<string, unknown>;
      onComplete?.(
        response.ok
          ? `${label}: ${JSON.stringify(data).slice(0, 200)}`
          : `${label} failed`,
      );
    } catch {
      onComplete?.(`${label} failed`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-sm hover:opacity-80 transition-opacity disabled:opacity-50"
    >
      {loading ? "Running..." : label}
    </button>
  );
}

interface AdminDashboardProps {
  stats: {
    newsCount: number;
    eventsCount: number;
    opportunitiesCount: number;
    subscribersCount: number;
    applicationsCount: number;
    usersCount: number;
    savedArticlesCount: number;
  };
  news: Array<{ id: string; title: string; featured: boolean; slug: string; image_url: string | null }>;
  applications: Array<{ id: string; name: string; email: string; role: string; status: string }>;
  logs: Array<{ id: string; job_type: string; status: string; message: string | null; started_at: string; processing_time_ms: number | null }>;
  subscribers: Array<{ email: string; subscribed_at: string; active: boolean }>;
  readingAnalytics: Array<Record<string, unknown>>;
}

export function AdminDashboard({
  stats,
  news,
  applications,
  logs,
  subscribers,
  readingAnalytics,
}: AdminDashboardProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadArticleId, setUploadArticleId] = useState("");

  async function handleArticleAction(action: string, articleId: string) {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, articleId }),
    });
    setMessage(response.ok ? `${action} completed` : `${action} failed`);
  }

  async function handleApproveApplication(id: string, status: "approved" | "rejected") {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve-application", id, status }),
    });
    setMessage(response.ok ? `Application ${status}` : "Failed to update application");
  }

  async function handleUploadImage() {
    if (!uploadArticleId || !uploadUrl) return;
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upload-image",
        articleId: uploadArticleId,
        updates: { image_url: uploadUrl },
      }),
    });
    setMessage(response.ok ? "Image updated" : "Failed to update image");
  }

  async function handleRetryFailed(job: string) {
    const response = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "retry-failed", updates: { job } }),
    });
    setMessage(response.ok ? `Retry ${job}: done` : `Retry ${job} failed`);
  }

  return (
    <div className="space-y-xl">
      <section className="space-y-md">
        <h1 className="font-headline-lg text-headline-lg">Admin Dashboard</h1>
        <p className="text-on-surface-variant font-body-md">
          Manage content, trigger ingestion jobs, and monitor system activity.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {[
          { label: "News", value: stats.newsCount },
          { label: "Events", value: stats.eventsCount },
          { label: "Opportunities", value: stats.opportunitiesCount },
          { label: "Subscribers", value: stats.subscribersCount },
          { label: "Applications", value: stats.applicationsCount },
          { label: "Users", value: stats.usersCount },
          { label: "Saved Articles", value: stats.savedArticlesCount },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-md text-center">
            <p className="font-headline-md text-headline-md text-primary">{stat.value}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <h2 className="font-headline-md text-headline-md">Trigger Jobs</h2>
        <div className="flex flex-wrap gap-sm">
          <AdminActionButton label="News Ingestion" action="ingest-news" onComplete={setMessage} />
          <AdminActionButton label="Opportunities Update" action="ingest-opportunities" onComplete={setMessage} />
          <AdminActionButton label="Events Update" action="ingest-events" onComplete={setMessage} />
          <button
            onClick={() => handleRetryFailed("news")}
            className="border border-white/10 text-on-surface px-4 py-2 rounded-full font-label-sm hover:bg-white/5 transition-colors"
          >
            Retry Failed Jobs
          </button>
          <a
            href="/api/admin/export-newsletter"
            className="border border-white/10 text-on-surface px-4 py-2 rounded-full font-label-sm hover:bg-white/5 transition-colors inline-block"
          >
            Export Subscribers
          </a>
        </div>
        {message && <p className="text-primary font-body-md text-sm">{message}</p>}
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <h2 className="font-headline-md text-headline-md">Upload Article Image</h2>
        <div className="flex flex-col sm:flex-row gap-sm">
          <input
            className="bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface flex-1"
            placeholder="Article ID"
            value={uploadArticleId}
            onChange={(e) => setUploadArticleId(e.target.value)}
          />
          <input
            className="bg-surface-container-low border border-white/10 rounded-xl px-md py-sm text-on-surface flex-1"
            placeholder="Image URL"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
          />
          <button
            onClick={handleUploadImage}
            className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-sm hover:opacity-80 transition-opacity"
          >
            Upload Image
          </button>
        </div>
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <h2 className="font-headline-md text-headline-md">News Management</h2>
        <div className="space-y-sm max-h-64 overflow-y-auto">
          {news.map((article) => (
            <div key={article.id} className="flex justify-between items-center gap-sm p-sm border-b border-white/5">
              <div className="min-w-0">
                <p className="text-on-surface text-sm truncate">
                  {article.featured && "★ "}{article.title}
                </p>
              </div>
              <div className="flex gap-xs shrink-0">
                <button
                  onClick={() => handleArticleAction("feature-article", article.id)}
                  className="text-primary font-label-sm text-xs hover:underline"
                >
                  Feature
                </button>
                <button
                  onClick={() => handleArticleAction("delete-article", article.id)}
                  className="text-error font-label-sm text-xs hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <h2 className="font-headline-md text-headline-md">Join Us Applications</h2>
        <div className="space-y-sm max-h-64 overflow-y-auto">
          {applications.map((app) => (
            <div key={app.id} className="flex justify-between items-center gap-sm p-sm border-b border-white/5">
              <div>
                <p className="text-on-surface text-sm">{app.name} — {app.role}</p>
                <p className="text-on-surface-variant text-xs">{app.email} • {app.status}</p>
              </div>
              {app.status === "pending" && (
                <div className="flex gap-xs shrink-0">
                  <button
                    onClick={() => handleApproveApplication(app.id, "approved")}
                    className="text-primary font-label-sm text-xs hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveApplication(app.id, "rejected")}
                    className="text-error font-label-sm text-xs hover:underline"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <h2 className="font-headline-md text-headline-md">System Logs</h2>
        <div className="space-y-sm max-h-64 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="p-sm border-b border-white/5">
              <p className="text-on-surface text-sm">
                [{log.job_type}] {log.status} — {log.message}
              </p>
              <p className="text-on-surface-variant text-xs">
                {new Date(log.started_at).toLocaleString()}
                {log.processing_time_ms ? ` • ${log.processing_time_ms}ms` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <h2 className="font-headline-md text-headline-md">Newsletter Subscribers</h2>
        <p className="text-on-surface-variant text-sm">{subscribers.length} active subscribers</p>
      </section>

      <section className="glass-card rounded-xl p-md space-y-md">
        <h2 className="font-headline-md text-headline-md">Reading Analytics</h2>
        <p className="text-on-surface-variant text-sm">{readingAnalytics.length} recent views tracked</p>
      </section>
    </div>
  );
}
