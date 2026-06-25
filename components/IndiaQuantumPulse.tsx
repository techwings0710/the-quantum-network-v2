export function IndiaQuantumPulse() {
  return (
    <section className="bg-surface-container-low rounded-3xl p-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10" />
      <div className="relative z-10 space-y-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-md">
          <h2 className="font-headline-lg text-headline-lg">India Quantum Pulse</h2>
          <div className="h-px bg-white/10 flex-grow hidden md:block" />
          <span className="font-label-md text-on-surface-variant px-4 py-2 border border-white/5 rounded-full glass-card">
            Ecosystem Tracking
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="glass-card p-md rounded-2xl hover:bg-surface-container transition-colors cursor-pointer">
            <div className="text-primary mb-md">
              <span className="material-symbols-outlined text-3xl">
                account_balance
              </span>
            </div>
            <h4 className="font-headline-md text-on-surface mb-xs">
              National Mission
            </h4>
            <p className="text-on-surface-variant text-sm">
              ₹6,003 Crore allocated for research hubs and pilot projects across
              4 domains.
            </p>
          </div>
          <div className="glass-card p-md rounded-2xl hover:bg-surface-container transition-colors cursor-pointer">
            <div className="text-primary mb-md">
              <span className="material-symbols-outlined text-3xl">
                psychology
              </span>
            </div>
            <h4 className="font-headline-md text-on-surface mb-xs">
              IndiaAI Initative
            </h4>
            <p className="text-on-surface-variant text-sm">
              Strategic framework to integrate quantum computing with large-scale
              AI datasets.
            </p>
          </div>
          <div className="glass-card p-md rounded-2xl hover:bg-surface-container transition-colors cursor-pointer">
            <div className="text-primary mb-md">
              <span className="material-symbols-outlined text-3xl">security</span>
            </div>
            <h4 className="font-headline-md text-on-surface mb-xs">QNu Labs</h4>
            <p className="text-on-surface-variant text-sm">
              Bangalore-based firm leading the commercialization of QKD solutions
              for defense.
            </p>
          </div>
          <div className="glass-card p-md rounded-2xl hover:bg-surface-container transition-colors cursor-pointer">
            <div className="text-primary mb-md">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <h4 className="font-headline-md text-on-surface mb-xs">
              IISc Research
            </h4>
            <p className="text-on-surface-variant text-sm">
              Pioneering work in photonic quantum communication and topological
              insulators.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
