import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSavedArticles, formatArticleDate } from "@/lib/news/db";

export default async function SavedArticlesPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const articles = await getSavedArticles(session.user.email);

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <section className="space-y-md">
          <Link
            href="/"
            className="text-primary font-label-md flex items-center gap-xs hover:gap-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            BACK TO HOME
          </Link>
          <h1 className="font-headline-lg text-headline-lg">Saved Articles</h1>
          <p className="text-on-surface-variant font-body-md">
            {articles.length} article{articles.length !== 1 ? "s" : ""} you have saved.
          </p>
        </section>

        {articles.length === 0 ? (
          <div className="glass-card rounded-3xl p-xl max-w-lg mx-auto space-y-md text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              bookmark
            </span>
            <p className="text-on-surface-variant font-body-md">
              You haven&apos;t saved any articles yet. Browse the latest quantum news
              and bookmark articles to read later.
            </p>
            <Link
              href="/news"
              className="bg-primary text-on-primary font-label-md px-xl py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all inline-block"
            >
              Browse News
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group cursor-pointer space-y-sm"
              >
                <div className="aspect-video rounded-xl overflow-hidden glass-card">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('${article.image_url}')`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-sm">
                  <span className="font-label-sm text-label-sm text-tertiary">
                    {article.category}
                  </span>
                  <span className="text-on-surface-variant text-xs">
                    • {formatArticleDate(article.published_at)}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md leading-snug group-hover:text-primary transition-colors">
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
      </main>
      <Footer />
    </>
  );
}
