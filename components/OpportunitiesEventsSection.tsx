export function OpportunitiesEventsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      <div className="lg:col-span-7 space-y-md">
        <h2 className="font-headline-md text-headline-md border-b border-white/5 pb-sm">
          Opportunities Board
        </h2>
        <div className="space-y-sm">
          <div className="p-md hover:bg-surface-container-low transition-colors rounded-xl flex justify-between items-center group cursor-pointer border border-transparent hover:border-white/10">
            <div className="flex gap-md items-center">
              <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center font-bold text-primary">
                TQN
              </div>
              <div>
                <h5 className="font-headline-md text-on-surface text-base">
                  Quantum Software Engineering Intern
                </h5>
                <p className="text-on-surface-variant text-sm">
                  Qubit Technologies • Remote / India
                </p>
              </div>
            </div>
            <span className="font-label-sm text-primary group-hover:underline">
              APPLY NOW
            </span>
          </div>
          <div className="p-md hover:bg-surface-container-low transition-colors rounded-xl flex justify-between items-center group cursor-pointer border border-transparent hover:border-white/10">
            <div className="flex gap-md items-center">
              <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center font-bold text-secondary">
                GNT
              </div>
              <div>
                <h5 className="font-headline-md text-on-surface text-base">
                  Post-Doctoral Fellowship: Photonics
                </h5>
                <p className="text-on-surface-variant text-sm">
                  Ministry of Science &amp; Tech • Delhi
                </p>
              </div>
            </div>
            <span className="font-label-sm text-primary group-hover:underline">
              APPLY NOW
            </span>
          </div>
          <div className="p-md hover:bg-surface-container-low transition-colors rounded-xl flex justify-between items-center group cursor-pointer border border-transparent hover:border-white/10">
            <div className="flex gap-md items-center">
              <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center font-bold text-tertiary">
                DST
              </div>
              <div>
                <h5 className="font-headline-md text-on-surface text-base">
                  Quantum Startup Launchpad Grant
                </h5>
                <p className="text-on-surface-variant text-sm">
                  NQM • Up to ₹50 Lakhs Equity-Free
                </p>
              </div>
            </div>
            <span className="font-label-sm text-primary group-hover:underline">
              APPLY NOW
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-md">
        <h2 className="font-headline-md text-headline-md border-b border-white/5 pb-sm">
          Events Calendar
        </h2>
        <div className="glass-card rounded-2xl divide-y divide-white/5">
          <div className="p-md flex gap-md group cursor-pointer hover:bg-white/5 transition-colors">
            <div className="text-center min-w-[60px]">
              <p className="font-label-sm text-primary">JUNE</p>
              <p className="text-headline-md font-bold">12-14</p>
            </div>
            <div>
              <h5 className="font-headline-md text-base group-hover:text-primary transition-colors">
                Q-Nexus India 2024
              </h5>
              <p className="text-on-surface-variant text-sm">
                International Exhibition Center, Bangalore
              </p>
            </div>
          </div>
          <div className="p-md flex gap-md group cursor-pointer hover:bg-white/5 transition-colors">
            <div className="text-center min-w-[60px]">
              <p className="font-label-sm text-primary">JULY</p>
              <p className="text-headline-md font-bold">05</p>
            </div>
            <div>
              <h5 className="font-headline-md text-base group-hover:text-primary transition-colors">
                Workshop: Quantum Algorithms for Finance
              </h5>
              <p className="text-on-surface-variant text-sm">
                Virtual Session • Free Registration
              </p>
            </div>
          </div>
          <div className="p-md flex gap-md group cursor-pointer hover:bg-white/5 transition-colors">
            <div className="text-center min-w-[60px]">
              <p className="font-label-sm text-primary">SEPT</p>
              <p className="text-headline-md font-bold">20</p>
            </div>
            <div>
              <h5 className="font-headline-md text-base group-hover:text-primary transition-colors">
                The Quantum Global Summit
              </h5>
              <p className="text-on-surface-variant text-sm">
                New Delhi • Ministerial Keynote
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
