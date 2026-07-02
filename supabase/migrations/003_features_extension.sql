-- The Quantum Network - Features Extension

-- Saved articles (referenced by existing code)
CREATE TABLE IF NOT EXISTS saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  article_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_email, article_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_articles_user ON saved_articles (user_email);

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Saved articles are not publicly readable"
  ON saved_articles FOR SELECT
  USING (false);

-- News image generation tracking
ALTER TABLE news ADD COLUMN IF NOT EXISTS image_generated BOOLEAN DEFAULT FALSE;

-- Extend users profile
ALTER TABLE users ADD COLUMN IF NOT EXISTS research_interests TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS favourite_topics TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"newsletter": true, "opportunities": true, "events": true}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Reading history
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_history_user ON reading_history (user_id, viewed_at DESC);

ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reading history is not publicly readable"
  ON reading_history FOR SELECT
  USING (false);

-- Extend opportunities
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS salary TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS source_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_opportunities_source_url ON opportunities (source_url) WHERE source_url IS NOT NULL;

-- Extend events
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS organiser TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS speaker TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE events ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS source_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_source_url ON events (source_url) WHERE source_url IS NOT NULL;

-- Join Us applications
CREATE TABLE IF NOT EXISTS join_us_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  organization TEXT,
  role TEXT NOT NULL,
  area_of_interest TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_join_us_status ON join_us_applications (status);

ALTER TABLE join_us_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Join us applications are not publicly readable"
  ON join_us_applications FOR SELECT
  USING (false);

-- System / cron logs
CREATE TABLE IF NOT EXISTS system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  finished_at TIMESTAMPTZ,
  processing_time_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_system_logs_job_type ON system_logs (job_type, started_at DESC);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System logs are not publicly readable"
  ON system_logs FOR SELECT
  USING (false);

-- Storage bucket for generated news images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "News images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Service role can upload news images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Service role can update news images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'news-images');
