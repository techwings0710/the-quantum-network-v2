"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FormEvent, useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <nav className="max-w-container-max mx-auto px-md h-16 flex items-center justify-between">
        <div className="flex items-center gap-md">
          <Link
            href="/"
            className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface"
          >
            The Quantum Network
          </Link>
          <div className="hidden md:flex gap-md ml-lg">
            <Link
              className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1"
              href="/"
            >
              News
            </Link>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Research
            </a>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Opportunities
            </a>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Events
            </a>
            <a
              className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Community
            </a>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <form
            onSubmit={handleSearch}
            className="hidden lg:block relative"
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary w-48 transition-all duration-300 text-on-surface"
              placeholder="Search insights..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {session?.user ? (
            <div className="flex items-center gap-sm">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button
                onClick={() => signOut()}
                className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-md hover:opacity-80 transition-opacity active:scale-95 duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-primary text-on-primary px-5 py-2 rounded-full font-label-md hover:opacity-80 transition-opacity active:scale-95 duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
