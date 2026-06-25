export function ResearchIndustrySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
      <section className="space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm">
          <h2 className="font-headline-md text-headline-md">Research Highlights</h2>
          <span className="font-label-sm text-on-surface-variant">
            PEER-REVIEWED
          </span>
        </div>
        <div className="space-y-gutter">
          <div className="group border-l-2 border-primary/20 hover:border-primary pl-md transition-all cursor-pointer">
            <p className="text-primary font-label-sm mb-xs">
              Nature Quantum Information
            </p>
            <h4 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">
              Universal Quantum Gates on Topological Qubits
            </h4>
            <p className="text-on-surface-variant text-sm mt-xs">
              Dr. A. Sharma, et al. | Published May 2024
            </p>
          </div>
          <div className="group border-l-2 border-primary/20 hover:border-primary pl-md transition-all cursor-pointer">
            <p className="text-primary font-label-sm mb-xs">arXiv:2405.0812</p>
            <h4 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">
              Optimizing Cryogenic Control Electronics for Scaling
            </h4>
            <p className="text-on-surface-variant text-sm mt-xs">
              Prof. L. Chen, et al. | 14-page Technical Paper
            </p>
          </div>
          <div className="group border-l-2 border-primary/20 hover:border-primary pl-md transition-all cursor-pointer">
            <p className="text-primary font-label-sm mb-xs">
              Physical Review Letters
            </p>
            <h4 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">
              Observation of Fractional Hall Effects in Synthetic Lattices
            </h4>
            <p className="text-on-surface-variant text-sm mt-xs">
              M. Weiss, et al. | Breakthrough Experimental Data
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm">
          <h2 className="font-headline-md text-headline-md">Industry Watch</h2>
          <span className="font-label-sm text-on-surface-variant">
            CAPITAL FLOW
          </span>
        </div>
        <div className="grid grid-cols-1 gap-md">
          <div className="glass-card p-md rounded-xl flex items-center justify-between group hover:border-primary/40 transition-colors">
            <div>
              <h4 className="font-headline-md text-on-surface">
                Algorithmiq Raises $15M
              </h4>
              <p className="text-on-surface-variant text-sm">
                Series A for drug discovery platform development.
              </p>
            </div>
            <div className="text-right">
              <span className="font-label-md text-primary">FUNDING</span>
              <p className="text-xs text-on-surface-variant mt-xs">2 days ago</p>
            </div>
          </div>
          <div className="glass-card p-md rounded-xl flex items-center justify-between group hover:border-primary/40 transition-colors">
            <div>
              <h4 className="font-headline-md text-on-surface">
                IQM &amp; NVIDIA Partnership
              </h4>
              <p className="text-on-surface-variant text-sm">
                Joint research on CUDA-Quantum integration.
              </p>
            </div>
            <div className="text-right">
              <span className="font-label-md text-secondary">PARTNER</span>
              <p className="text-xs text-on-surface-variant mt-xs">1 week ago</p>
            </div>
          </div>
          <div className="glass-card p-md rounded-xl flex items-center justify-between group hover:border-primary/40 transition-colors">
            <div>
              <h4 className="font-headline-md text-on-surface">
                Quantinuum 2.0 Roadmap
              </h4>
              <p className="text-on-surface-variant text-sm">
                Unveiling next-gen H-Series trapped-ion systems.
              </p>
            </div>
            <div className="text-right">
              <span className="font-label-md text-tertiary">STRATEGY</span>
              <p className="text-xs text-on-surface-variant mt-xs">3 days ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
