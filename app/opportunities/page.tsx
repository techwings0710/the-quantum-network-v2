import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getOpportunities } from "@/lib/opportunities/db";

const LOGO_COLOR_MAP: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  const grouped = opportunities.reduce<Record<string, typeof opportunities>>(
    (acc, opp) => {
      const type = opp.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(opp);
      return acc;
    },
    {},
  );

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <section className="space-y-md border-b border-white/5 pb-sm">
          <h1 className="font-headline-lg text-headline-lg">Opportunities Board</h1>
          <p className="text-on-surface-variant font-body-md">
            Internships, fellowships, jobs, and startup openings across India&apos;s
            quantum ecosystem.
          </p>
        </section>

        {opportunities.length === 0 ? (
          <div className="glass-card rounded-xl p-xl text-center space-y-md">
            <p className="text-on-surface-variant font-body-md">
              No opportunities available at this time.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([type, items]) => (
            <section key={type} className="space-y-md">
              <h2 className="font-headline-md text-headline-md border-b border-white/5 pb-sm">
                {type}
              </h2>
              <div className="space-y-sm">
                {items.map((opportunity) => (
                  <a
                    key={opportunity.id}
                    href={opportunity.apply_url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-md hover:bg-surface-container-low transition-colors rounded-xl flex justify-between items-center group cursor-pointer border border-transparent hover:border-white/10"
                  >
                    <div className="flex gap-md items-center">
                      <div
                        className={`w-12 h-12 rounded bg-surface-container flex items-center justify-center font-bold ${LOGO_COLOR_MAP[opportunity.logo_color ?? "primary"] ?? "text-primary"}`}
                      >
                        {opportunity.logo_initials ?? "TQN"}
                      </div>
                      <div>
                        <h5 className="font-headline-md text-on-surface text-base">
                          {opportunity.title}
                        </h5>
                        <p className="text-on-surface-variant text-sm">
                          {opportunity.organization} • {opportunity.location}
                        </p>
                        {opportunity.description && (
                          <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                            {opportunity.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-label-sm text-primary group-hover:underline shrink-0 ml-md">
                      APPLY NOW
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
      <Footer />
    </>
  );
}
