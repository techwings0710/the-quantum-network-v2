import type { NewsArticle } from "../types";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBAk5nQAEf4GclwdCIBHqymKr6km9oAak4h2hvuO0EVUi5e9OgRE-_LaG35xXpCJXsUbYxWrttcZ29TdENxEaitMNT_vVFxinHgwj-FUrRVPtKkrIb-TKvv4b3HdyuZEOuDag_uo97cAPUFBvOgH2x91YiXDkqE62LYoBW6Hh994aq0quq8p0U4MQHg796C-D-t7uy9xYs1A-Sk0lziyeHIJbKE0_EKIv1A-3aC0-YSkB_Xu7hUMwdm8YRhgf2iSgxRutgZp6RZ7ZY";

export function normalizeArticle(row: Record<string, unknown>): NewsArticle {
  return {
    ...(row as unknown as NewsArticle),
    source_name:
      (row.source_name as string) ??
      (row.author as string) ??
      "Unknown Source",
    source_url:
      (row.source_url as string) ?? (row.source as string) ?? "",
    india_relevance: Boolean(row.india_relevance),
    image_generated: Boolean(row.image_generated),
    tags: (row.tags as string[]) ?? [],
  };
}

export function getDefaultImageUrl(): string {
  return DEFAULT_IMAGE;
}
