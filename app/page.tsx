import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { LatestNews } from "@/components/LatestNews";
import { IndiaQuantumPulse } from "@/components/IndiaQuantumPulse";
import { ResearchIndustrySection } from "@/components/ResearchIndustrySection";
import { OpportunitiesEventsSection } from "@/components/OpportunitiesEventsSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { getFeaturedNews, getLatestNews, getResearchArticles, getIndustryArticles } from "@/lib/news/db";
import { getOpportunities } from "@/lib/opportunities/db";
import { getEvents } from "@/lib/events/db";
import { getSubscriberCount } from "@/lib/newsletter/db";

export default async function HomePage() {
  const [
    featured,
    latestNews,
    researchArticles,
    industryArticles,
    opportunities,
    events,
    subscriberCount,
  ] = await Promise.all([
    getFeaturedNews(),
    getLatestNews(15),
    getResearchArticles(6),
    getIndustryArticles(6),
    getOpportunities(),
    getEvents(),
    getSubscriberCount(),
  ]);

  const nonFeatured = latestNews.filter((a) => a.id !== featured?.id);
  const secondaryStories = nonFeatured.slice(0, 3);
  const latestArticles = nonFeatured.slice(0, 12);

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl">
        <HeroSection featured={featured} secondary={secondaryStories} />
        <LatestNews articles={latestArticles} />
        <IndiaQuantumPulse />
        <ResearchIndustrySection
          researchArticles={researchArticles}
          industryArticles={industryArticles}
        />
        <OpportunitiesEventsSection
          opportunities={opportunities}
          events={events}
        />
        <NewsletterSection subscriberCount={subscriberCount} />
      </main>
      <Footer />
    </>
  );
}
