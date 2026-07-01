import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function SavedArticlesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <div className="glass-card rounded-3xl p-xl max-w-lg mx-auto space-y-md text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">
            bookmark
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Saved Articles
          </h1>
          <p className="text-on-surface-variant font-body-md">
            You haven&apos;t saved any articles yet. Browse the latest quantum news
            and bookmark articles to read later.
          </p>
          <Link
            href="/news"
            className="bg-primary text-on-primary font-label-md px-xl py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all inline-block"
          >
            Browse News
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
