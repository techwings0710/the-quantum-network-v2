export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function sanitizeSearchTerm(term: string): string {
  return term.trim().replace(/[%_\\]/g, "");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatEventDate(startDate: string, endDate: string | null): {
  month: string;
  dayRange: string;
} {
  const start = new Date(startDate);
  const month = start.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const startDay = start.getDate();

  if (endDate) {
    const end = new Date(endDate);
    if (start.getMonth() === end.getMonth()) {
      return { month, dayRange: `${startDay}-${end.getDate()}` };
    }
  }

  return { month, dayRange: String(startDay) };
}
