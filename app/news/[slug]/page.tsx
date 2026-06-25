import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getNewsBySlug, formatArticleDate } from "@/lib/news/db";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content.split(/\n\n+/);

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl">
        <article className="max-w-3xl mx-auto space-y-lg">
          <Link
            href="/"
            className="text-primary font-label-md flex items-center gap-xs hover:gap-sm transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            BACK TO NEWS
          </Link>

          <div className="flex items-center gap-sm">
            <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-on-surface-variant text-xs">
              • {formatArticleDate(article.published_at)}
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            {article.title}
          </h1>

          <p className="text-on-surface-variant font-body-lg">
            {article.summary}
          </p>

          {article.image_url && (
            <div className="aspect-video rounded-xl overflow-hidden glass-card">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${article.image_url}')` }}
              />
            </div>
          )}

          <div className="space-y-md text-on-surface font-body-md">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-sm pt-md border-t border-white/5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-label-sm text-label-sm text-primary border border-primary/20 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {article.author && (
            <p className="text-on-surface-variant text-sm">
              Source: {article.author}
            </p>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
