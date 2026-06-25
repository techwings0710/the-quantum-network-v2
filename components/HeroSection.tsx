import Link from "next/link";
import type { NewsArticle } from "@/lib/types";

const FEATURED_FALLBACK = {
  slug: "indias-national-quantum-mission-reaches-major-milestone",
  category: "MISSION UPDATE",
  title: "India's National Quantum Mission Reaches Major Milestone",
  summary:
    "The Department of Science and Technology reports a breakthrough in domestic qubit development, signaling a significant leap for the country's $750M quantum initiative.",
  image_url:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBfwZXzB3EPp5v8w2NjzWL5tTNXByboq-LapFkyyw3_FvrFS69HrCKTwKo2CRV7Tqod1VK5TUCmFK0Y-Tx05RwfHGjr4NIAxBlvCfhjY0X342GJ5lT_JyReoN7Wha6ZKvjB4dVVogbyI7VgiVxi7efXnaPqZT7O7QPQgwx7vqS7nO6CRPCrjfDzwdHMadsGXs9oMgTuufCizo7HC8niFa1ubdFSZito-Z33symz2RRgmCCeQyzHDzyoHwHgVwj77uWJ5JUlu6qo_QA",
};

const SECONDARY_FALLBACK = [
  {
    slug: "qpiai-unveils-new-quantum-processor-unit",
    category: "HARDWARE",
    title: "QpiAI Unveils New Quantum Processor Unit",
    summary:
      "A new 25-qubit hybrid AI-quantum processor designed for enterprise logistics optimization.",
  },
  {
    slug: "iit-madras-announces-quantum-research-center",
    category: "ECOSYSTEM",
    title: "IIT Madras Announces Quantum Research Center",
    summary:
      "A state-of-the-art facility focused on post-quantum cryptography and material science.",
  },
  {
    slug: "global-funding-surges-for-early-stage-startups",
    category: "VENTURE",
    title: "Global Funding Surges for Early-Stage Startups",
    summary:
      "Over $2.4B invested in Q1 2024, focusing on error-correction and room-temp systems.",
  },
];

interface HeroSectionProps {
  featured: NewsArticle | null;
  secondary: NewsArticle[];
}

export function HeroSection({ featured, secondary }: HeroSectionProps) {
  const featuredArticle = featured ?? FEATURED_FALLBACK;
  const secondaryArticles =
    secondary.length >= 3
      ? secondary.slice(0, 3)
      : [
          ...secondary,
          ...SECONDARY_FALLBACK.slice(secondary.length),
        ].slice(0, 3);

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
              backgroundImage: `url('${featuredArticle.image_url ?? FEATURED_FALLBACK.image_url}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 space-y-md">
          <div className="flex items-center gap-sm">
            <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-3 py-1 rounded-full">
              {featured?.category ?? FEATURED_FALLBACK.category}
            </span>
            <div className="status-pulse" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-white leading-tight">
            {featuredArticle.title}
          </h1>
          <p className="text-on-surface-variant font-body-lg max-w-2xl">
            {featuredArticle.summary}
          </p>
        </div>
      </Link>

      <div className="lg:col-span-4 grid grid-cols-1 gap-gutter">
        {secondaryArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/news/${article.slug}`}
            className="glass-card rounded-xl p-md flex flex-col justify-between hover-glow transition-all group cursor-pointer"
          >
            <span className="font-label-sm text-label-sm text-primary mb-base">
              {"category" in article && article.category
                ? article.category
                : (article as (typeof SECONDARY_FALLBACK)[0]).category}
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
    </section>
  );
}
