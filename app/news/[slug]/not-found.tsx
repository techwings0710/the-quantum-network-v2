import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto min-h-[70vh] flex items-center justify-center">
        <div className="glass-card rounded-3xl p-xl text-center space-y-md max-w-md">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Article Not Found
          </h1>
          <p className="text-on-surface-variant font-body-md">
            The article you are looking for does not exist or may have been
            removed.
          </p>
          <Link
            href="/"
            className="bg-primary text-on-primary font-label-md px-xl py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all inline-block"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
