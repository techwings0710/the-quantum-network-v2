import type { RawEvent, SourceAdapter } from "../../types";
import { filterRelevantEvents } from "./base";
import {
  apsAdapter,
  cambridgeEventsAdapter,
  dstEventsAdapter,
  ethEventsAdapter,
  googleQuantumEventsAdapter,
  harvardEventsAdapter,
  ibmQuantumEventsAdapter,
  ieeeAdapter,
  iiscEventsAdapter,
  iitEventsAdapter,
  mitEventsAdapter,
  natureEventsAdapter,
  nqmEventsAdapter,
  oxfordEventsAdapter,
  q2bAdapter,
  qcrEventsAdapter,
  quantumTechAdapter,
  quantumWorldCongressAdapter,
  tqiEventsAdapter,
} from "./rss-events";

type EventAdapter = SourceAdapter<unknown, RawEvent>;

function wrapEventAdapter(adapter: EventAdapter): EventAdapter {
  const originalFetch = adapter.fetch.bind(adapter);
  return {
    ...adapter,
    async fetch() {
      const items = await originalFetch();
      return filterRelevantEvents(items as { title: string; content?: string }[]);
    },
  };
}

export const eventSources: EventAdapter[] = [
  wrapEventAdapter(ieeeAdapter),
  wrapEventAdapter(apsAdapter),
  wrapEventAdapter(q2bAdapter),
  wrapEventAdapter(quantumTechAdapter),
  wrapEventAdapter(quantumWorldCongressAdapter),
  wrapEventAdapter(ibmQuantumEventsAdapter),
  wrapEventAdapter(googleQuantumEventsAdapter),
  wrapEventAdapter(tqiEventsAdapter),
  wrapEventAdapter(qcrEventsAdapter),
  wrapEventAdapter(iiscEventsAdapter),
  wrapEventAdapter(iitEventsAdapter),
  wrapEventAdapter(dstEventsAdapter),
  wrapEventAdapter(nqmEventsAdapter),
  wrapEventAdapter(natureEventsAdapter),
  wrapEventAdapter(mitEventsAdapter),
  wrapEventAdapter(harvardEventsAdapter),
  wrapEventAdapter(oxfordEventsAdapter),
  wrapEventAdapter(cambridgeEventsAdapter),
  wrapEventAdapter(ethEventsAdapter),
];

export function getEventSourceById(id: string): EventAdapter | undefined {
  return eventSources.find((source) => source.id === id);
}
