export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  image_url: string | null;
  source: string;
  author: string | null;
  published_at: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
  organization: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeminiRewriteResult {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  slug: string;
  india_relevant: boolean;
}

export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  category?: string;
  enabled: boolean;
}

export interface IngestResult {
  processed: number;
  saved: number;
  skipped: number;
  errors: string[];
}
