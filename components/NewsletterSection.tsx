"use client";

import { FormEvent, useState } from "react";

interface NewsletterSectionProps {
  subscriberCount?: number;
}

export function NewsletterSection({ subscriberCount = 0 }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const countLabel =
    subscriberCount > 0
      ? `${subscriberCount.toLocaleString()}+`
      : "24,000+";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
      setIsSuccess(data.success);
      if (data.success) setEmail("");
    } catch {
      setMessage("Failed to subscribe. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="py-xl">
      <div className="glass-card rounded-3xl p-xl flex flex-col md:flex-row items-center justify-between gap-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 shimmer opacity-20 pointer-events-none" />
        <div className="max-w-xl space-y-md relative z-10">
          <h2 className="font-display-lg text-headline-lg md:text-display-lg text-white">
            Stay Informed
          </h2>
          <p className="font-body-lg text-on-surface-variant">
            Join {countLabel} engineers, researchers, and policymakers receiving
            our weekly briefing on the quantum ecosystem.
          </p>
        </div>
        <div className="w-full md:w-auto relative z-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-sm bg-surface-container-low p-sm rounded-2xl border border-white/10"
          >
            <input
              className="bg-transparent border-none focus:ring-0 text-on-surface px-md py-3 flex-grow min-w-[280px]"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-on-primary font-label-md px-xl py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </button>
          </form>
          {message && (
            <p
              className={`text-xs mt-md ${isSuccess ? "text-primary" : "text-error"}`}
            >
              {message}
            </p>
          )}
          {!message && (
            <p className="text-xs text-on-surface-variant/60 mt-md">
              Weekly delivery. No spam. Unsubscribe anytime.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
