import type { RawOpportunity, SourceAdapter } from "../../types";
import {
  amazonAdapter,
  googleAdapter,
  ibmAdapter,
  microsoftAdapter,
  nvidiaAdapter,
} from "./careers-api";
import {
  ionqAdapter,
  psiquantumAdapter,
  rigettiAdapter,
  xanaduAdapter,
} from "./greenhouse";
import {
  bosonqPsiAdapter,
  drdoAdapter,
  dstAdapter,
  filterRelevantOpportunities,
  iiscAdapter,
  iitBombayAdapter,
  iitDelhiAdapter,
  iitMadrasAdapter,
  isroAdapter,
  nqmAdapter,
  qpiaiAdapter,
  qnuLabsAdapter,
  quantinuumAdapter,
  quantumComputingReportAdapter,
  quantumInsiderAdapter,
} from "./rss-opportunities";

type OpportunityAdapter = SourceAdapter<unknown, RawOpportunity>;

function wrapRssAdapter(adapter: OpportunityAdapter): OpportunityAdapter {
  const originalFetch = adapter.fetch.bind(adapter);
  return {
    ...adapter,
    async fetch() {
      const items = await originalFetch();
      return filterRelevantOpportunities(
        items as { title: string; content?: string }[],
      );
    },
  };
}

export const opportunitySources: OpportunityAdapter[] = [
  ibmAdapter,
  googleAdapter,
  microsoftAdapter,
  amazonAdapter,
  nvidiaAdapter,
  ionqAdapter,
  rigettiAdapter,
  xanaduAdapter,
  psiquantumAdapter,
  wrapRssAdapter(quantinuumAdapter),
  wrapRssAdapter(quantumComputingReportAdapter),
  wrapRssAdapter(quantumInsiderAdapter),
  wrapRssAdapter(iiscAdapter),
  wrapRssAdapter(iitBombayAdapter),
  wrapRssAdapter(iitMadrasAdapter),
  wrapRssAdapter(iitDelhiAdapter),
  wrapRssAdapter(drdoAdapter),
  wrapRssAdapter(isroAdapter),
  wrapRssAdapter(dstAdapter),
  wrapRssAdapter(nqmAdapter),
  wrapRssAdapter(qpiaiAdapter),
  wrapRssAdapter(qnuLabsAdapter),
  wrapRssAdapter(bosonqPsiAdapter),
];

export function getOpportunitySourceById(id: string): OpportunityAdapter | undefined {
  return opportunitySources.find((source) => source.id === id);
}
