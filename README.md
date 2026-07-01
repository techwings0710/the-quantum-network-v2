# The Quantum Network

India's Quantum Technology ecosystem platform — AI-powered news, research, opportunities, and community.

## Tech Stack

- Next.js 16 (App Router)
- React 19 · TypeScript · Tailwind CSS v4
- Supabase · Auth.js (Google OAuth) · Google Gemini · RSS Parser · Vercel Cron

## Getting Started

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Run both Supabase migrations in order:
   - `supabase/migrations/001_initial.sql`
   - `supabase/migrations/002_mvp_extension.sql`

3. Install and start:

```bash
npm install
npm run dev
```

4. Ingest real quantum news:

```bash
curl -X POST http://localhost:3000/api/ingest-news
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/news` | GET | Latest articles (`?limit=15`) or search (`?q=`) |
| `/api/news/[slug]` | GET | Single article |
| `/api/search` | GET | Search articles (`?q=`) |
| `/api/ingest-news` | GET/POST | Run RSS → Gemini → Supabase pipeline |
| `/api/newsletter` | POST | Subscribe `{ "email": "..." }` |
| `/api/opportunities` | GET | List opportunities (`?type=`) |
| `/api/events` | GET | List events (`?type=`) |
| `/api/auth/[...nextauth]` | GET/POST | Authentication |

## RSS Feeds

All feeds are configured in `lib/rss/feeds.ts`. Add or disable feeds in that single file.

## Automation

Vercel Cron runs daily at midnight UTC (`vercel.json`). Set `CRON_SECRET` in production. The ingest endpoint accepts:
- `Authorization: Bearer <CRON_SECRET>`
- `x-vercel-cron: 1` header (Vercel Cron)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — featured + latest news, research, industry, opportunities, events |
| `/news` | Full news archive |
| `/news/[slug]` | Article detail with attribution, sharing, related articles |
| `/research` | Research & academic articles |
| `/opportunities` | Jobs, internships, fellowships |
| `/events` | Conferences, workshops, deadlines |
| `/search?q=` | Search results |
| `/auth/signin` | Google OAuth sign-in |
| `/profile` | User profile |
| `/profile/saved` | Saved articles |

## Project Structure

```
app/                  # Pages and API routes
components/           # Stitch UI components (design preserved)
lib/
  auth.ts             # Auth.js configuration
  supabase.ts         # Supabase clients
  gemini.ts           # Gemini rewrite helper
  rss/feeds.ts        # RSS source configuration (single file)
  rss/parser.ts       # RSS parsing
  news/db.ts          # News queries
  ingest/pipeline.ts  # Ingestion pipeline
  newsletter/db.ts    # Newsletter subscriptions
  opportunities/db.ts # Opportunities queries
  events/db.ts        # Events queries
supabase/migrations/  # Database schema
```

## Verification

```bash
npm run build
npm run lint
```
