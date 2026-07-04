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
    <section className="py-16">
      <div className="glass-card rounded-3xl px-8 py-10 md:px-12 md:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 shimmer opacity-20 pointer-events-none" />
  
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display-lg text-headline-lg md:text-display-lg text-white">
            Stay Informed
          </h2>
  
          <p className="font-body-lg text-on-surface-variant mt-4 max-w-2xl mx-auto">
            Join <span className="text-primary font-semibold">{countLabel}</span>{" "}
            engineers, researchers, founders and policymakers receiving our weekly
            briefing on quantum computing, research breakthroughs, events and
            career opportunities.
          </p>
  
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <input
              className="flex-1 bg-surface-container-low border border-white/10 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
  
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-on-primary font-semibold px-8 py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </button>
          </form>
  
          {message ? (
            <p
              className={`text-sm mt-5 ${
                isSuccess ? "text-primary" : "text-error"
              }`}
            >
              {message}
            </p>
          ) : (
            <p className="text-sm text-on-surface-variant/60 mt-5">
              Weekly delivery • No spam • Unsubscribe anytime
            </p>
          )}
        </div>
      </div>
    </section>
  );
}