import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { formatArticleDate } from "@/lib/news/db";

interface LatestNewsProps {
  articles: NewsArticle[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="space-y-md">
      <div className="flex items-end justify-between border-b border-white/5 pb-sm">
        <h2 className="font-headline-lg text-headline-lg">Latest Quantum News</h2>
        <Link
          className="text-primary font-label-md flex items-center gap-xs hover:gap-sm transition-all"
          href="/news"
        >
          VIEW ALL{" "}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
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
    </section>
  );
}
