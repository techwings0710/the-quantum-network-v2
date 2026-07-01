import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShareButtons } from "@/components/ShareButtons";
import {
  getNewsBySlug,
  getRelatedArticles,
  formatArticleDate,
} from "@/lib/news/db";
import { estimateReadingTime } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | The Quantum Network" };
  }

  return {
    title: `${article.title} | The Quantum Network`,
    description: article.seo_description ?? article.summary,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const [relatedArticles] = await Promise.all([
    getRelatedArticles(article, 3),
  ]);

  const paragraphs = article.content.split(/\n\n+/);
  const readingTime = estimateReadingTime(article.content);
  const articleUrl = `${process.env.NEXTAUTH_URL ?? "https://thequantumnetwork.com"}/news/${article.slug}`;

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

          <div className="flex flex-wrap items-center gap-sm">
            <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-on-surface-variant text-xs">
              • {formatArticleDate(article.published_at)}
            </span>
            <span className="text-on-surface-variant text-xs">
              • {readingTime} min read
            </span>
          </div>

          <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
            {article.title}
          </h1>

          <p className="text-on-surface-variant font-body-lg">
            {article.summary}
          </p>

          <div className="glass-card rounded-xl p-md space-y-xs">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              SOURCE ATTRIBUTION
            </p>
            <p className="font-body-md text-on-surface">
              <span className="text-on-surface-variant">Source: </span>
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {article.source_name}
              </a>
            </p>
            {article.author && (
              <p className="font-body-md text-on-surface-variant text-sm">
                Author: {article.author}
              </p>
            )}
            <p className="font-body-md text-on-surface-variant text-sm">
              Published: {formatArticleDate(article.published_at)}
            </p>
          </div>

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

          <ShareButtons title={article.title} url={articleUrl} />

          {relatedArticles.length > 0 && (
            <section className="space-y-md pt-xl border-t border-white/5">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 gap-md">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/news/${related.slug}`}
                    className="glass-card rounded-xl p-md hover-glow transition-all group cursor-pointer flex gap-md"
                  >
                    {related.image_url && (
                      <div
                        className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: `url('${related.image_url}')`,
                        }}
                      />
                    )}
                    <div className="space-y-xs">
                      <span className="font-label-sm text-label-sm text-tertiary">
                        {related.category}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm line-clamp-2">
                        {related.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
