import type { RawEvent } from "../../types";

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateEvent(item: RawEvent): boolean {
  return (
    Boolean(item.title?.trim()) &&
    Boolean(item.date) &&
    Boolean(item.registration_url?.trim()) &&
    item.registration_url.startsWith("http") &&
    Boolean(item.source_url?.trim())
  );
}

export function inferEventType(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("hackathon")) return "Hackathon";
  if (text.includes("workshop")) return "Workshop";
  if (text.includes("meetup")) return "Meetup";
  if (text.includes("deadline")) return "Deadline";
  if (text.includes("webinar")) return "Webinar";
  if (text.includes("summit")) return "Conference";
  return "Conference";
}

export function isFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "User-Agent": "TheQuantumNetwork/1.0",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json() as Promise<T>;
}

function isEventRelevant(title: string, content: string): boolean {
  const text = `${title} ${content}`.toLowerCase();
  const keywords = [
    "quantum",
    "qubit",
    "conference",
    "workshop",
    "symposium",
    "summit",
    "hackathon",
    "webinar",
    "meetup",
    "congress",
    "event",
  ];
  return keywords.some((kw) => text.includes(kw));
}

export function filterRelevantEvents<T extends { title: string; content?: string }>(
  items: T[],
): T[] {
  return items.filter((item) =>
    isEventRelevant(item.title, item.content ?? ""),
  );
}
