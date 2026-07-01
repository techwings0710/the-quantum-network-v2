import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEvents } from "@/lib/events/db";
import { formatEventDate } from "@/lib/utils";

export default async function EventsPage() {
  const events = await getEvents();

  const grouped = events.reduce<Record<string, typeof events>>(
    (acc, event) => {
      const type = event.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(event);
      return acc;
    },
    {},
  );

  return (
    <>
      <Header />
      <main className="mt-16 pt-xl px-md max-w-container-max mx-auto space-y-xl min-h-[70vh]">
        <section className="space-y-md border-b border-white/5 pb-sm">
          <h1 className="font-headline-lg text-headline-lg">Events Calendar</h1>
          <p className="text-on-surface-variant font-body-md">
            Conferences, workshops, hackathons, meetups, and key deadlines in
            the quantum technology calendar.
          </p>
        </section>

        {events.length === 0 ? (
          <div className="glass-card rounded-xl p-xl text-center space-y-md">
            <p className="text-on-surface-variant font-body-md">
              No upcoming events at this time.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([type, items]) => (
            <section key={type} className="space-y-md">
              <h2 className="font-headline-md text-headline-md border-b border-white/5 pb-sm">
                {type}
              </h2>
              <div className="glass-card rounded-2xl divide-y divide-white/5">
                {items.map((event) => {
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
                        {event.description && (
                          <p className="text-on-surface-variant text-sm mt-xs line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>
      <Footer />
    </>
  );
}
