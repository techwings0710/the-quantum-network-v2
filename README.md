# The Quantum Network

India's Quantum Technology ecosystem platform — news, research, opportunities, and community.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- Auth.js (NextAuth) with Google OAuth
- Google Gemini for article rewriting
- RSS Parser for news ingestion

## Getting Started

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Fill in your Supabase, Google OAuth, and Gemini API credentials.

3. Run the Supabase migration in `supabase/migrations/001_initial.sql`.

4. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

5. Ingest news from RSS feeds:

```bash
curl -X POST http://localhost:3000/api/ingest-news
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/news` | GET | Latest articles (`?limit=10`) |
| `/api/news?q=query` | GET | Search articles |
| `/api/news/[slug]` | GET | Single article |
| `/api/ingest-news` | POST | Run RSS ingestion pipeline |
| `/api/auth/[...nextauth]` | GET/POST | Authentication |

## Project Structure

```
app/                  # Next.js App Router pages and API routes
components/           # React components (Stitch design preserved)
lib/
  auth.ts             # Auth.js configuration
  supabase.ts         # Supabase client
  gemini.ts           # Gemini rewrite helper
  rss/                # RSS feed config and parser
  news/               # News database helpers
  ingest/             # Ingestion pipeline
supabase/migrations/  # Database schema
stitch-export/        # Original Google Stitch export (design source of truth)
```

## Deployment

Deploy to Vercel. Set all environment variables from `.env.local.example` in your Vercel project settings.

For automated ingestion, configure a Vercel Cron job to POST to `/api/ingest-news` with the `CRON_SECRET` bearer token.
