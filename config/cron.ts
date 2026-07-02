/**
 * Central cron schedule configuration.
 * 6:00 AM IST = 00:30 UTC (Vercel Cron uses UTC).
 * Keep vercel.json schedules in sync with these values.
 */
export const CRON_SCHEDULE = "0 30 * * *";

export const CRON_JOBS = {
  news: {
    path: "/api/ingest-news",
    schedule: CRON_SCHEDULE,
    description: "Daily RSS news ingestion at 6:00 AM IST",
  },
  opportunities: {
    path: "/api/ingest-opportunities",
    schedule: CRON_SCHEDULE,
    description: "Daily opportunities sync at 6:00 AM IST",
  },
  events: {
    path: "/api/ingest-events",
    schedule: CRON_SCHEDULE,
    description: "Daily events sync at 6:00 AM IST",
  },
} as const;
