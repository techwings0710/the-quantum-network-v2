import type { RawOpportunity } from "../../types";

export function getInitials(name: string): string {
  if (!name) return "QN";

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // Multiple words → IBM Quantum = IQ
  if (words.length > 1) {
    return words
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  // Single word → PsiQuantum = PS
  return words[0]
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

export function inferOpportunityType(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("intern")) return "Internship";
  if (text.includes("phd") || text.includes("doctoral")) return "PhD";
  if (text.includes("postdoc") || text.includes("post-doc") || text.includes("postdoctoral")) {
    return "Postdoc";
  }
  if (text.includes("research assistant") || text.includes("research associate")) {
    return "Research Assistant";
  }
  if (text.includes("fellowship")) return "Fellowship";
  return "Full Time";
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function validateOpportunity(item: RawOpportunity): boolean {
  return (
    Boolean(item.title?.trim()) &&
    Boolean(item.organization?.trim()) &&
    Boolean(item.apply_url?.trim()) &&
    item.apply_url.startsWith("http") &&
    Boolean(item.source_url?.trim())
  );
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
