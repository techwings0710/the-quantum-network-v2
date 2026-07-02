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

2. Run all Supabase migrations in order:
   - `supabase/migrations/001_initial.sql`
   - `supabase/migrations/002_mvp_extension.sql`
   - `supabase/migrations/003_features_extension.sql`

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
| `/api/ingest-news` | GET/POST | Run RSS ingestion pipeline |
| `/api/ingest-opportunities` | GET/POST | Sync opportunities from sources |
| `/api/ingest-events` | GET/POST | Sync events from sources |
| `/api/newsletter` | POST | Subscribe `{ "email": "..." }` |
| `/api/opportunities` | GET | List opportunities (`?type=`) |
| `/api/events` | GET | List events (`?type=`) |
| `/api/saved-articles` | GET/POST/DELETE | Saved articles |
| `/api/profile` | GET/PATCH/POST | User profile |
| `/api/reading-history` | POST | Record article view |
| `/api/join-us` | POST | Submit join us application |
| `/api/admin` | GET/POST | Admin actions |
| `/api/admin/export-newsletter` | GET | Export subscribers CSV |
| `/api/auth/[...nextauth]` | GET/POST | Authentication |

## RSS Feeds

All feeds are configured in `lib/rss/feeds.ts`. Add or disable feeds in that single file.

## Automation

Cron schedule is configured in `config/cron.ts` (6:00 AM IST = `0 30 * * *` UTC).

Vercel Cron jobs (see `vercel.json`):
- `/api/ingest-news` — daily news ingestion
- `/api/ingest-opportunities` — daily opportunities sync
- `/api/ingest-events` — daily events sync

Set `CRON_SECRET` in production. Cron endpoints accept:
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
| `/profile` | User profile with editing, reading history |
| `/profile/saved` | Saved articles |
| `/join-us` | Community join page with application form |
| `/admin` | Admin dashboard (admin only) |

## Admin Setup

Set `ADMIN_EMAILS` in environment variables to a comma-separated list of admin email addresses. Only these users can access `/admin`.

## Project Structure

```
app/                  # Pages and API routes
components/           # Stitch UI components (design preserved)
config/cron.ts        # Central cron schedule configuration
lib/
  auth.ts             # Auth.js configuration
  supabase.ts         # Supabase clients
  gemini.ts           # Gemini rewrite helper
  images/generate.ts  # AI image generation
  rss/feeds.ts        # RSS source configuration
  rss/parser.ts       # RSS parsing
  news/db.ts          # News queries
  ingest/pipeline.ts  # Ingestion pipeline
  opportunities/      # Opportunities agent + sources
  events/             # Events agent + sources
  users/db.ts         # User profile + reading history
  join-us/db.ts       # Join us applications
  admin/              # Admin auth + queries
  logs/db.ts          # System/cron logs
supabase/migrations/  # Database schema
```

## Verification

```bash
npm run build
npm run lint
```
