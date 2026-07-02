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
  image_generated: boolean;
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
  research_interests: string[];
  favourite_topics: string[];
  notification_preferences: NotificationPreferences;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  newsletter: boolean;
  opportunities: boolean;
  events: boolean;
}

export interface ReadingHistoryEntry {
  id: string;
  user_id: string;
  article_id: string;
  viewed_at: string;
  article?: NewsArticle;
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

export interface AgentIngestResult {
  success: boolean;
  sources_processed: number;
  sources_failed: number;
  fetched: number;
  saved: number;
  updated: number;
  deactivated: number;
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
  logo: string | null;
  location: string;
  country: string | null;
  type: string;
  description: string | null;
  deadline: string | null;
  skills: string[];
  salary: string | null;
  tags: string[];
  apply_url: string | null;
  logo_initials: string | null;
  logo_color: string | null;
  source_url: string | null;
  source_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  venue: string | null;
  city: string | null;
  country: string | null;
  type: string;
  event_url: string | null;
  registration_url: string | null;
  organiser: string | null;
  speaker: string | null;
  image: string | null;
  tags: string[];
  start_date: string;
  end_date: string | null;
  source_url: string | null;
  source_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JoinUsApplication {
  id: string;
  name: string;
  email: string;
  country: string;
  organization: string | null;
  role: string;
  area_of_interest: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface RawOpportunity {
  title: string;
  organization: string;
  logo?: string | null;
  location: string;
  country?: string | null;
  type: string;
  description?: string | null;
  deadline?: string | null;
  skills?: string[];
  salary?: string | null;
  tags?: string[];
  apply_url: string;
  source_url: string;
  source_id?: string;
}

export interface RawEvent {
  title: string;
  description?: string | null;
  date: string;
  end_date?: string | null;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  location: string;
  type: string;
  registration_url: string;
  organiser?: string | null;
  speaker?: string | null;
  image?: string | null;
  tags?: string[];
  source_url: string;
  source_id?: string;
}

export interface SourceAdapter<T, R = RawOpportunity | RawEvent> {
  id: string;
  name: string;
  fetch(): Promise<T[]>;
  normalize(raw: T): R | null;
  validate(item: R): boolean;
}
