import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getResearchArticles, formatArticleDate } from "@/lib/news/db";

export default async function ResearchPage() {
  const articles = await getResearchArticles(30);

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <section className="space-y-md border-b border-white/5 pb-sm">
          <h1 className="font-headline-lg text-headline-lg">Research Highlights</h1>
          <p className="text-on-surface-variant font-body-md">
            Peer-reviewed research, academic papers, and breakthrough findings
            from the quantum science community.
          </p>
        </section>

        {articles.length === 0 ? (
          <div className="glass-card rounded-xl p-xl text-center space-y-md">
            <p className="text-on-surface-variant font-body-md">
              Research articles will appear here after ingestion.
            </p>
          </div>
        ) : (
          <div className="space-y-gutter">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="group border-l-2 border-primary/20 hover:border-primary pl-md transition-all"
              >
                <p className="text-primary font-label-sm mb-xs">
                  {article.source_name}
                </p>
                <Link
                  href={`/news/${article.slug}`}
                  className="block cursor-pointer"
                >
                  <h4 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                    {article.summary}
                  </p>
                  <p className="text-on-surface-variant text-sm mt-xs">
                    {article.author ? `${article.author} | ` : ""}
                    Published {formatArticleDate(article.published_at)}
                  </p>
                </Link>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label-sm text-label-sm text-primary mt-xs inline-block hover:underline"
                >
                  Read original source →
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
