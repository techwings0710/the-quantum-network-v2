import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { LatestNews } from "@/components/LatestNews";
import { IndiaQuantumPulse } from "@/components/IndiaQuantumPulse";
import { ResearchIndustrySection } from "@/components/ResearchIndustrySection";
import { OpportunitiesEventsSection } from "@/components/OpportunitiesEventsSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { getFeaturedNews, getLatestNews } from "@/lib/news/db";

export default async function HomePage() {
  const [featured, latestNews] = await Promise.all([
    getFeaturedNews(),
    getLatestNews(10),
  ]);

  const nonFeatured = latestNews.filter((a) => !a.featured);
  const secondaryStories = nonFeatured.slice(0, 3);
  const latestArticles = nonFeatured.slice(0, 6);

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl">
        <HeroSection featured={featured} secondary={secondaryStories} />
        <LatestNews articles={latestArticles} />
        <IndiaQuantumPulse />
        <ResearchIndustrySection />
        <OpportunitiesEventsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
