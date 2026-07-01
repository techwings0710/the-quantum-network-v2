import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { formatArticleDate } from "@/lib/news/db";
import { getRelativeTime } from "@/lib/utils";

interface ResearchIndustrySectionProps {
  researchArticles: NewsArticle[];
  industryArticles: NewsArticle[];
}

export function ResearchIndustrySection({
  researchArticles,
  industryArticles,
}: ResearchIndustrySectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
      <section className="space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm">
          <h2 className="font-headline-md text-headline-md">Research Highlights</h2>
          <Link
            href="/research"
            className="font-label-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            PEER-REVIEWED
          </Link>
        </div>
        <div className="space-y-gutter">
          {researchArticles.length === 0 ? (
            <p className="text-on-surface-variant text-sm">
              Research articles will appear here after ingestion.
            </p>
          ) : (
            researchArticles.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group border-l-2 border-primary/20 hover:border-primary pl-md transition-all cursor-pointer block"
              >
                <p className="text-primary font-label-sm mb-xs">
                  {article.source_name}
                </p>
                <h4 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                <p className="text-on-surface-variant text-sm mt-xs">
                  {article.author ? `${article.author} | ` : ""}
                  Published {formatArticleDate(article.published_at)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm">
          <h2 className="font-headline-md text-headline-md">Industry Watch</h2>
          <span className="font-label-sm text-on-surface-variant">
            CAPITAL FLOW
          </span>
        </div>
        <div className="grid grid-cols-1 gap-md">
          {industryArticles.length === 0 ? (
            <p className="text-on-surface-variant text-sm">
              Industry news will appear here after ingestion.
            </p>
          ) : (
            industryArticles.slice(0, 3).map((article, index) => {
              const labelColors = ["text-primary", "text-secondary", "text-tertiary"];
              const labelColor = labelColors[index % labelColors.length];
              return (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="glass-card p-md rounded-xl flex items-center justify-between group hover:border-primary/40 transition-colors"
                >
                  <div>
                    <h4 className="font-headline-md text-on-surface">
                      {article.title}
                    </h4>
                    <p className="text-on-surface-variant text-sm line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-md">
                    <span className={`font-label-md ${labelColor}`}>
                      {article.category}
                    </span>
                    <p className="text-xs text-on-surface-variant mt-xs">
                      {getRelativeTime(article.published_at)}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
