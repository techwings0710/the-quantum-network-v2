"use client";

import { useEffect } from "react";

interface ReadingHistoryTrackerProps {
  articleId: string;
  userId: string | undefined;
}

export function ReadingHistoryTracker({
  articleId,
  userId,
}: ReadingHistoryTrackerProps) {
  useEffect(() => {
    if (!userId) return;

    void fetch("/api/reading-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    }).catch(() => {
      // Silent fail — reading history is non-critical
    });
  }, [articleId, userId]);

  return null;
}
