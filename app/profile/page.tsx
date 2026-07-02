import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileEditor } from "@/components/ProfileEditor";
import { getSavedArticles } from "@/lib/news/db";
import {
  getReadingHistory,
  getRecentlyViewedArticles,
  getUserById,
  syncGoogleProfile,
} from "@/lib/users/db";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    redirect("/auth/signin");
  }

  await syncGoogleProfile({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  });

  const profile = await getUserById(session.user.id);
  if (!profile) {
    redirect("/auth/signin");
  }

  const [savedArticles, readingHistory, recentlyViewed] = await Promise.all([
    getSavedArticles(session.user.email),
    getReadingHistory(session.user.id, 10),
    getRecentlyViewedArticles(session.user.id, 5),
  ]);

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <div className="glass-card rounded-3xl p-xl max-w-2xl mx-auto space-y-lg">
          <ProfileEditor
            profile={profile}
            sessionEmail={session.user.email}
            sessionImage={session.user.image ?? null}
            savedArticlesCount={savedArticles.length}
          />
        </div>

        {recentlyViewed.length > 0 && (
          <section className="max-w-2xl mx-auto space-y-md">
            <h2 className="font-headline-md text-headline-md border-b border-white/5 pb-sm">
              Recently Viewed
            </h2>
            <div className="space-y-sm">
              {recentlyViewed.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="glass-card rounded-xl p-md block hover:border-white/10 border border-transparent transition-colors"
                >
                  <h5 className="font-headline-md text-on-surface text-base">
                    {article.title}
                  </h5>
                  <p className="text-on-surface-variant text-sm line-clamp-1">
                    {article.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {readingHistory.length > 0 && (
          <section className="max-w-2xl mx-auto space-y-md">
            <h2 className="font-headline-md text-headline-md border-b border-white/5 pb-sm">
              Reading History
            </h2>
            <div className="space-y-sm">
              {readingHistory.map((entry) =>
                entry.article ? (
                  <Link
                    key={entry.id}
                    href={`/news/${entry.article.slug}`}
                    className="glass-card rounded-xl p-md block hover:border-white/10 border border-transparent transition-colors"
                  >
                    <h5 className="font-headline-md text-on-surface text-base">
                      {entry.article.title}
                    </h5>
                    <p className="text-on-surface-variant text-xs">
                      Viewed {new Date(entry.viewed_at).toLocaleDateString()}
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        )}

        {savedArticles.length > 0 && (
          <section className="max-w-2xl mx-auto space-y-md">
            <div className="flex justify-between items-center border-b border-white/5 pb-sm">
              <h2 className="font-headline-md text-headline-md">Saved Articles</h2>
              <Link href="/profile/saved" className="text-primary font-label-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-sm">
              {savedArticles.slice(0, 5).map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="glass-card rounded-xl p-md block hover:border-white/10 border border-transparent transition-colors"
                >
                  <h5 className="font-headline-md text-on-surface text-base">
                    {article.title}
                  </h5>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
