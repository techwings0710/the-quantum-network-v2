export function NewsletterSection() {
  return (
    <section className="py-xl">
      <div className="glass-card rounded-3xl p-xl flex flex-col md:flex-row items-center justify-between gap-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 shimmer opacity-20 pointer-events-none" />
        <div className="max-w-xl space-y-md relative z-10">
          <h2 className="font-display-lg text-headline-lg md:text-display-lg text-white">
            Stay Informed
          </h2>
          <p className="font-body-lg text-on-surface-variant">
            Join 24,000+ engineers, researchers, and policymakers receiving our
            weekly briefing on the quantum ecosystem.
          </p>
        </div>
        <div className="w-full md:w-auto relative z-10">
          <div className="flex flex-col sm:flex-row gap-sm bg-surface-container-low p-sm rounded-2xl border border-white/10">
            <input
              className="bg-transparent border-none focus:ring-0 text-on-surface px-md py-3 flex-grow min-w-[280px]"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-primary text-on-primary font-label-md px-xl py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all">
              SUBSCRIBE
            </button>
          </div>
          <p className="text-xs text-on-surface-variant/60 mt-md">
            Weekly delivery. No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
