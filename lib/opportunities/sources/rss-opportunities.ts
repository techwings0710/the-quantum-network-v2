import { fetchFeedItems } from "../../rss/parser";
import type { RawOpportunity, RssFeedConfig, SourceAdapter } from "../../types";
import { inferOpportunityType, validateOpportunity } from "./base";

interface RssOpportunityItem {
  title: string;
  link: string;
  content: string;
  pubDate: string | null;
}

export function createRssOpportunityAdapter(
  config: RssFeedConfig,
  organization: string,
  country?: string,
): SourceAdapter<RssOpportunityItem, RawOpportunity> {
  return {
    id: config.id,
    name: organization,
    async fetch() {
      const items = await fetchFeedItems(config);
      return items.map((item) => ({
        title: item.title,
        link: item.link,
        content: item.content,
        pubDate: item.pubDate,
      }));
    },
    normalize(raw): RawOpportunity | null {
      return {
        title: raw.title,
        organization,
        location: country ?? "Remote",
        country: country ?? null,
        type: inferOpportunityType(raw.title, raw.content),
        description: raw.content.slice(0, 2000) || null,
        deadline: raw.pubDate ? new Date(raw.pubDate).toISOString() : null,
        apply_url: raw.link,
        source_url: raw.link,
        tags: ["QUANTUM", organization.toUpperCase()],
      };
    },
    validate: validateOpportunity,
  };
}

export const quantumComputingReportAdapter = createRssOpportunityAdapter(
  {
    id: "qcr-jobs",
    name: "Quantum Computing Report",
    url: "https://quantumcomputingreport.com/feed/",
    enabled: true,
  },
  "Quantum Computing Report",
);

export const quantumInsiderAdapter = createRssOpportunityAdapter(
  {
    id: "tqi-jobs",
    name: "The Quantum Insider",
    url: "https://thequantuminsider.com/feed/",
    enabled: true,
  },
  "The Quantum Insider",
);

export const iiscAdapter = createRssOpportunityAdapter(
  {
    id: "iisc-careers",
    name: "IISc Bangalore",
    url: "https://www.iisc.ac.in/about/announcements/feed/",
    enabled: true,
  },
  "IISc Bangalore",
  "India",
);

export const iitBombayAdapter = createRssOpportunityAdapter(
  {
    id: "iitb-careers",
    name: "IIT Bombay",
    url: "https://www.iitb.ac.in/en/news/rss.xml",
    enabled: true,
  },
  "IIT Bombay",
  "India",
);

export const iitMadrasAdapter = createRssOpportunityAdapter(
  {
    id: "iitm-careers",
    name: "IIT Madras",
    url: "https://www.iitm.ac.in/happenings/press-releases/press-releases.xml",
    enabled: true,
  },
  "IIT Madras",
  "India",
);

export const iitDelhiAdapter = createRssOpportunityAdapter(
  {
    id: "iitd-careers",
    name: "IIT Delhi",
    url: "https://home.iitd.ac.in/news.php?format=feed&type=rss",
    enabled: true,
  },
  "IIT Delhi",
  "India",
);

export const isroAdapter = createRssOpportunityAdapter(
  {
    id: "isro-careers",
    name: "ISRO",
    url: "https://www.isro.gov.in/rss.xml",
    enabled: true,
  },
  "ISRO",
  "India",
);

export const dstAdapter = createRssOpportunityAdapter(
  {
    id: "dst-careers",
    name: "DST India",
    url: "https://dst.gov.in/rss.xml",
    enabled: true,
  },
  "DST",
  "India",
);

export const nqmAdapter = createRssOpportunityAdapter(
  {
    id: "nqm-careers",
    name: "National Quantum Mission",
    url: "https://dst.gov.in/national-quantum-mission/rss.xml",
    enabled: true,
  },
  "National Quantum Mission",
  "India",
);

export const drdoAdapter = createRssOpportunityAdapter(
  {
    id: "drdo-careers",
    name: "DRDO",
    url: "https://www.drdo.gov.in/rss.xml",
    enabled: true,
  },
  "DRDO",
  "India",
);

export const quantinuumAdapter = createRssOpportunityAdapter(
  {
    id: "quantinuum-careers",
    name: "Quantinuum",
    url: "https://www.quantinuum.com/news/rss",
    enabled: true,
  },
  "Quantinuum",
);

export const qpiaiAdapter = createRssOpportunityAdapter(
  {
    id: "qpiai-careers",
    name: "QpiAI",
    url: "https://qpiai.tech/feed/",
    enabled: true,
  },
  "QpiAI",
  "India",
);

export const qnuLabsAdapter = createRssOpportunityAdapter(
  {
    id: "qnulabs-careers",
    name: "QNu Labs",
    url: "https://qnulabs.com/feed/",
    enabled: true,
  },
  "QNu Labs",
  "India",
);

export const bosonqPsiAdapter = createRssOpportunityAdapter(
  {
    id: "bosonqpsi-careers",
    name: "BosonQ Psi",
    url: "https://bosonqpsi.com/feed/",
    enabled: true,
  },
  "BosonQ Psi",
  "India",
);

function isOpportunityRelevant(title: string, content: string): boolean {
  const text = `${title} ${content}`.toLowerCase();
  const keywords = [
    "quantum",
    "qubit",
    "phd",
    "postdoc",
    "intern",
    "research",
    "fellowship",
    "career",
    "job",
    "opening",
    "position",
    "vacancy",
    "recruitment",
    "hiring",
  ];
  return keywords.some((kw) => text.includes(kw));
}

export function filterRelevantOpportunities<T extends { title: string; content?: string }>(
  items: T[],
): T[] {
  return items.filter((item) =>
    isOpportunityRelevant(item.title, item.content ?? ""),
  );
}
