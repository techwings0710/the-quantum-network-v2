import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { searchNews, formatArticleDate } from "@/lib/news/db";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchNews(query) : [];

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <section className="space-y-md">
          <h1 className="font-headline-lg text-headline-lg">Search Results</h1>
          {query ? (
            <p className="text-on-surface-variant font-body-md">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;
              {query}&rdquo;
            </p>
          ) : (
            <p className="text-on-surface-variant font-body-md">
              Enter a search term in the header to find articles.
            </p>
          )}
        </section>

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {results.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="glass-card rounded-xl p-md hover-glow transition-all group cursor-pointer space-y-sm"
              >
                <div className="flex items-center gap-sm">
                  <span className="font-label-sm text-label-sm text-tertiary">
                    {article.category}
                  </span>
                  <span className="text-on-surface-variant text-xs">
                    • {formatArticleDate(article.published_at)}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-3">
                  {article.summary}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/70">
                  {article.source_name}
                </p>
              </Link>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="glass-card rounded-xl p-xl text-center space-y-md">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              search_off
            </span>
            <p className="text-on-surface-variant font-body-md">
              No articles found matching your search.
            </p>
            <Link
              href="/"
              className="text-primary font-label-md hover:underline inline-block"
            >
              Return to homepage
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
