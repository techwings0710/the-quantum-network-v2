import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { formatArticleDate } from "@/lib/news/db";

const FALLBACK_ARTICLES = [
  {
    slug: "breakthrough-in-qubit-coherence-times-reported",
    category: "RESEARCH",
    title: "Breakthrough in Qubit Coherence Times Reported",
    summary:
      "Researchers at ETH Zurich demonstrate a new error-correction method that extends coherence by 400%, pushing the boundaries of stable computation.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAk5nQAEf4GclwdCIBHqymKr6km9oAak4h2hvuO0EVUi5e9OgRE-_LaG35xXpCJXsUbYxWrttcZ29TdENxEaitMNT_vVFxinHgwj-FUrRVPtKkrIb-TKvv4b3HdyuZEOuDag_uo97cAPUFBvOgH2x91YiXDkqE62LYoBW6Hh994aq0quq8p0U4MQHg796C-D-t7uy9xYs1A-Sk0lziyeHIJbKE0_EKIv1A-3aC0-YSkB_Xu7hUMwdm8YRhgf2iSgxRutgZp6RZ7ZY",
    published_at: "2024-05-24T00:00:00Z",
  },
  {
    slug: "cloud-quantum-platforms-expand-global-footprint",
    category: "ENTERPRISE",
    title: "Cloud Quantum Platforms Expand Global Footprint",
    summary:
      "Major cloud providers announce the rollout of next-gen QPU access for enterprise clients in Southeast Asia and the Middle East.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_wI4SuJMnbGvvXcuMjxjGgyNVKIF0bTgiQgz8_NpG1PokksN4G2FPsVrp0zBvIWrScLXzqNV5tHZ-gdIbYdTrDqObGAZxdKapdAJ3VjMlaaapDKoQO6PBL5IwHY5-uC38FSnk0rzYO8fUpwz3adN_eI_goiqfm7Z37XVGNVQK9ySH0_5QVQ3-JAamvQpTGx7V8ephh_xl3b63-e3lSYCcCTh8VLFAfLroBY_t6mD8pp0G1hWG7abL9yFEEe1h3M_d2qfaY3chMsg",
    published_at: "2024-05-22T00:00:00Z",
  },
  {
    slug: "open-source-quantum-libraries-get-performance-boost",
    category: "SOFTWARE",
    title: "Open-Source Quantum Libraries Get Performance Boost",
    summary:
      "The latest update to major quantum SDKs introduces automated circuit optimization, reducing noise overhead in NISQ-era devices.",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVVB-j4Q4yoRkLr2W4lHx9EiKy7BsCEDZatJfgAJZ_YU7DFxhIym3rYyicFNFdYYskW09Lnvr7WMwZuY39cSx1IK-jN9J2xZFpQOkF0fYDtMK-p6nbNjf6oOuzQjsqkkG6eEgfHdVW5tkM1MuyQzRLUjO7xNCB99FipMAlVVOk4FLQHQpkgaVSHqf8MVjkpY6oVGlWa5NPUbe6r390dY7JHEyrajpaFnL3SHNFl0bG4TL5oAHgDPOwb8XJMNFeDr1dTg2eoApueRU",
    published_at: "2024-05-20T00:00:00Z",
  },
];

interface LatestNewsProps {
  articles: NewsArticle[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  const displayArticles =
    articles.length >= 3
      ? articles.slice(0, 3)
      : [
          ...articles,
          ...FALLBACK_ARTICLES.slice(articles.length),
        ].slice(0, 3);

  return (
    <section className="space-y-md">
      <div className="flex items-end justify-between border-b border-white/5 pb-sm">
        <h2 className="font-headline-lg text-headline-lg">Latest Quantum News</h2>
        <a
          className="text-primary font-label-md flex items-center gap-xs hover:gap-sm transition-all"
          href="#"
        >
          VIEW ALL{" "}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {displayArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="group cursor-pointer space-y-sm"
          >
            <div className="aspect-video rounded-xl overflow-hidden glass-card">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${article.image_url ?? FALLBACK_ARTICLES[0].image_url}')`,
                }}
              />
            </div>
            <div className="flex items-center gap-sm">
              <span className="font-label-sm text-label-sm text-tertiary">
                {article.category}
              </span>
              <span className="text-on-surface-variant text-xs">
                •{" "}
                {formatArticleDate(
                  article.published_at ?? FALLBACK_ARTICLES[0].published_at,
                )}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md leading-snug group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-on-surface-variant text-sm line-clamp-3">
              {article.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
