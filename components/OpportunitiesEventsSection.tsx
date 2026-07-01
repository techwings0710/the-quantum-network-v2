import Link from "next/link";
import type { Opportunity, Event } from "@/lib/types";
import { formatEventDate } from "@/lib/utils";

const LOGO_COLOR_MAP: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

interface OpportunitiesEventsSectionProps {
  opportunities: Opportunity[];
  events: Event[];
}

export function OpportunitiesEventsSection({
  opportunities,
  events,
}: OpportunitiesEventsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
      <div className="lg:col-span-7 space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm">
          <h2 className="font-headline-md text-headline-md">
            Opportunities Board
          </h2>
          <Link
            href="/opportunities"
            className="font-label-sm text-primary hover:underline"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="space-y-sm">
          {opportunities.length === 0 ? (
            <p className="text-on-surface-variant text-sm p-md">
              Opportunities will appear here once available.
            </p>
          ) : (
            opportunities.slice(0, 3).map((opportunity) => (
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
                  </div>
                </div>
                <span className="font-label-sm text-primary group-hover:underline">
                  APPLY NOW
                </span>
              </a>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-md">
        <div className="flex items-center justify-between border-b border-white/5 pb-sm">
          <h2 className="font-headline-md text-headline-md">
            Events Calendar
          </h2>
          <Link
            href="/events"
            className="font-label-sm text-primary hover:underline"
          >
            VIEW ALL
          </Link>
        </div>
        <div className="glass-card rounded-2xl divide-y divide-white/5">
          {events.length === 0 ? (
            <p className="text-on-surface-variant text-sm p-md">
              Events will appear here once available.
            </p>
          ) : (
            events.slice(0, 3).map((event) => {
              const { month, dayRange } = formatEventDate(
                event.start_date,
                event.end_date,
              );
              return (
                <a
                  key={event.id}
                  href={event.event_url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-md flex gap-md group cursor-pointer hover:bg-white/5 transition-colors block"
                >
                  <div className="text-center min-w-[60px]">
                    <p className="font-label-sm text-primary">{month}</p>
                    <p className="text-headline-md font-bold">{dayRange}</p>
                  </div>
                  <div>
                    <h5 className="font-headline-md text-base group-hover:text-primary transition-colors">
                      {event.title}
                    </h5>
                    <p className="text-on-surface-variant text-sm">
                      {event.location}
                    </p>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
