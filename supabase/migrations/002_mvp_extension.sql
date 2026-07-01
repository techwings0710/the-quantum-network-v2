-- The Quantum Network - MVP Extension

-- Extend news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS india_relevance BOOLEAN DEFAULT FALSE;
ALTER TABLE news ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS source_url TEXT;

UPDATE news SET source_url = source WHERE source_url IS NULL AND source IS NOT NULL;
UPDATE news SET source_name = COALESCE(author, 'Unknown Source') WHERE source_name IS NULL;

ALTER TABLE news ALTER COLUMN source_name SET DEFAULT 'Unknown Source';
ALTER TABLE news ALTER COLUMN source_url SET DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_news_india_relevance ON news (india_relevance) WHERE india_relevance = TRUE;
CREATE INDEX IF NOT EXISTS idx_news_tags ON news USING gin (tags);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  active BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers (email);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Newsletter subscribers are not publicly readable"
  ON newsletter_subscribers FOR SELECT
  USING (false);

-- Opportunities
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  apply_url TEXT,
  logo_initials TEXT,
  logo_color TEXT DEFAULT 'primary',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities (type);
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities (active) WHERE active = TRUE;

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Opportunities are publicly readable"
  ON opportunities FOR SELECT
  USING (active = true);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  event_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON events (start_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events (type);
CREATE INDEX IF NOT EXISTS idx_events_active ON events (active) WHERE active = TRUE;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are publicly readable"
  ON events FOR SELECT
  USING (active = true);

-- Seed opportunities
INSERT INTO opportunities (title, organization, location, type, description, apply_url, logo_initials, logo_color)
VALUES
  ('Quantum Software Engineering Intern', 'Qubit Technologies', 'Remote / India', 'Internship', 'Build quantum algorithms and software tools for enterprise clients.', '#', 'TQN', 'primary'),
  ('Post-Doctoral Fellowship: Photonics', 'Ministry of Science & Tech', 'Delhi', 'Fellowship', 'Research fellowship in photonic quantum communication systems.', '#', 'GNT', 'secondary'),
  ('Quantum Startup Launchpad Grant', 'National Quantum Mission', 'India', 'Scholarship', 'Up to ₹50 Lakhs equity-free funding for early-stage quantum startups.', '#', 'DST', 'tertiary'),
  ('Research Assistant — Quantum Algorithms', 'IISc Bangalore', 'Bangalore', 'Research Assistantship', 'Assist faculty on NISQ-era algorithm optimization research.', '#', 'IIS', 'primary'),
  ('PhD Position in Quantum Error Correction', 'TIFR Mumbai', 'Mumbai', 'PhD', 'Doctoral research in topological quantum error correction codes.', '#', 'TIF', 'secondary'),
  ('Quantum Hardware Engineer', 'QpiAI', 'Bangalore', 'Job', 'Design and test superconducting qubit control electronics.', '#', 'QPI', 'tertiary'),
  ('Startup Opening — Quantum Security', 'QNu Labs', 'Bangalore', 'Startup Opening', 'Join a leading Indian QKD commercialization team.', '#', 'QNU', 'primary')
ON CONFLICT DO NOTHING;

-- Seed events
INSERT INTO events (title, location, type, description, event_url, start_date, end_date)
VALUES
  ('Q-Nexus India 2026', 'International Exhibition Center, Bangalore', 'Conference', 'India''s premier quantum technology exhibition and conference.', '#', '2026-06-12', '2026-06-14'),
  ('Workshop: Quantum Algorithms for Finance', 'Virtual Session • Free Registration', 'Workshop', 'Hands-on workshop on variational quantum algorithms for portfolio optimization.', '#', '2026-07-05', NULL),
  ('The Quantum Global Summit', 'New Delhi • Ministerial Keynote', 'Conference', 'Global summit on quantum policy, research, and industry collaboration.', '#', '2026-09-20', NULL),
  ('Quantum Hackathon — IIT Madras', 'IIT Madras, Chennai', 'Hackathon', '48-hour hackathon building quantum software on cloud QPUs.', '#', '2026-08-15', '2026-08-17'),
  ('Qiskit Fall Fest India', 'Multiple cities across India', 'Meetup', 'Community meetups for quantum computing enthusiasts and developers.', '#', '2026-10-01', '2026-10-31'),
  ('NQM Proposal Submission Deadline', 'Online', 'Deadline', 'Final deadline for National Quantum Mission pilot project proposals.', '#', '2026-11-30', NULL)
ON CONFLICT DO NOTHING;
