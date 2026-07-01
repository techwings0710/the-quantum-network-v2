import Link from "next/link";
import type { NewsArticle } from "@/lib/types";

interface HeroSectionProps {
  featured: NewsArticle | null;
  secondary: NewsArticle[];
}

export function HeroSection({ featured, secondary }: HeroSectionProps) {
  if (!featured && secondary.length === 0) {
    return null;
  }

  const featuredArticle = featured ?? secondary[0];
  const secondaryArticles = featured
    ? secondary.slice(0, 3)
    : secondary.slice(1, 4);

  if (!featuredArticle) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter min-h-[600px]">
      <Link
        href={`/news/${featuredArticle.slug}`}
        className="lg:col-span-8 relative group cursor-pointer glass-card rounded-xl overflow-hidden flex flex-col justify-end p-xl"
      >
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('${featuredArticle.image_url}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 space-y-md">
          <div className="flex items-center gap-sm">
            <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
              {featuredArticle.category}
            </span>
            <div className="status-pulse" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white leading-tight">
            {featuredArticle.title}
          </h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">
            {featuredArticle.summary}
          </p>
          <p className="font-label-sm text-label-sm text-on-surface-variant/80">
            {featuredArticle.source_name}
          </p>
        </div>
      </Link>

      {secondaryArticles.length > 0 && (
        <div className="lg:col-span-4 grid grid-cols-1 gap-gutter">
          {secondaryArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="glass-card rounded-xl p-md flex flex-col justify-between hover-glow transition-all group cursor-pointer"
            >
              <span className="font-label-sm text-label-sm text-primary mb-base">
                {article.category}
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-on-surface-variant text-sm mt-xs">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
