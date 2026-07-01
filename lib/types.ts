export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  india_relevance: boolean;
  seo_description: string | null;
  image_url: string | null;
  source_name: string;
  source_url: string;
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
  rewritten_article: string;
  category: string;
  tags: string[];
  india_relevance: boolean;
  seo_description: string;
  slug: string;
}

export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  category?: string;
  enabled: boolean;
}

export interface IngestResult {
  success: boolean;
  feeds_processed: number;
  feeds_failed: number;
  processed: number;
  saved: number;
  skipped: number;
  duplicates: number;
  errors: string[];
  processing_time_ms: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  description: string | null;
  apply_url: string | null;
  logo_initials: string | null;
  logo_color: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string | null;
  event_url: string | null;
  start_date: string;
  end_date: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}
