import { fetchFeedItems } from "../../rss/parser";
import type { RawEvent, RssFeedConfig, SourceAdapter } from "../../types";
import { inferEventType, isFutureDate, stripHtml, validateEvent } from "./base";

interface RssEventItem {
  title: string;
  link: string;
  content: string;
  pubDate: string | null;
}

export function createRssEventAdapter(
  config: RssFeedConfig,
  organiser: string,
  country?: string,
  city?: string,
): SourceAdapter<RssEventItem, RawEvent> {
  return {
    id: config.id,
    name: organiser,
    async fetch() {
      const items = await fetchFeedItems(config);
      return items.map((item) => ({
        title: item.title,
        link: item.link,
        content: item.content,
        pubDate: item.pubDate,
      }));
    },
    normalize(raw): RawEvent | null {
      const description = stripHtml(raw.content);
      const eventDate = raw.pubDate ?? new Date().toISOString();

      if (!isFutureDate(eventDate)) return null;

      return {
        title: raw.title,
        description: description.slice(0, 2000) || null,
        date: new Date(eventDate).toISOString(),
        venue: city ?? null,
        city: city ?? null,
        country: country ?? null,
        location: [city, country].filter(Boolean).join(", ") || "Online",
        type: inferEventType(raw.title, description),
        registration_url: raw.link,
        organiser,
        tags: ["QUANTUM", organiser.toUpperCase()],
        source_url: raw.link,
      };
    },
    validate: validateEvent,
  };
}

export const ieeeAdapter = createRssEventAdapter(
  {
    id: "ieee-quantum",
    name: "IEEE",
    url: "https://www.ieee.org/rss/news.xml",
    enabled: true,
  },
  "IEEE",
);

export const apsAdapter = createRssEventAdapter(
  {
    id: "aps-events",
    name: "APS",
    url: "https://www.aps.org/rss/news.xml",
    enabled: true,
  },
  "American Physical Society",
  "USA",
);

export const q2bAdapter = createRssEventAdapter(
  {
    id: "q2b-events",
    name: "Q2B",
    url: "https://q2b.qcware.com/feed/",
    enabled: true,
  },
  "Q2B Conference",
);

export const quantumTechAdapter = createRssEventAdapter(
  {
    id: "quantum-tech-events",
    name: "Quantum.Tech",
    url: "https://quantumtechcongress.com/feed/",
    enabled: true,
  },
  "Quantum.Tech",
);

export const quantumWorldCongressAdapter = createRssEventAdapter(
  {
    id: "qwc-events",
    name: "Quantum World Congress",
    url: "https://quantumworldcongress.com/feed/",
    enabled: true,
  },
  "Quantum World Congress",
);

export const ibmQuantumEventsAdapter = createRssEventAdapter(
  {
    id: "ibm-quantum-events",
    name: "IBM Quantum",
    url: "https://research.ibm.com/blog/rss/quantum",
    enabled: true,
  },
  "IBM Quantum",
);

export const googleQuantumEventsAdapter = createRssEventAdapter(
  {
    id: "google-quantum-events",
    name: "Google Quantum",
    url: "https://blog.google/technology/research/rss/",
    enabled: true,
  },
  "Google Quantum AI",
);

export const tqiEventsAdapter = createRssEventAdapter(
  {
    id: "tqi-events",
    name: "The Quantum Insider",
    url: "https://thequantuminsider.com/feed/",
    enabled: true,
  },
  "The Quantum Insider",
);

export const qcrEventsAdapter = createRssEventAdapter(
  {
    id: "qcr-events",
    name: "Quantum Computing Report",
    url: "https://quantumcomputingreport.com/feed/",
    enabled: true,
  },
  "Quantum Computing Report",
);

export const iiscEventsAdapter = createRssEventAdapter(
  {
    id: "iisc-events",
    name: "IISc Bangalore",
    url: "https://www.iisc.ac.in/about/announcements/feed/",
    enabled: true,
  },
  "IISc Bangalore",
  "India",
  "Bangalore",
);

export const iitEventsAdapter = createRssEventAdapter(
  {
    id: "iit-events",
    name: "IIT Bombay",
    url: "https://www.iitb.ac.in/en/news/rss.xml",
    enabled: true,
  },
  "IIT Bombay",
  "India",
  "Mumbai",
);

export const dstEventsAdapter = createRssEventAdapter(
  {
    id: "dst-events",
    name: "DST India",
    url: "https://dst.gov.in/rss.xml",
    enabled: true,
  },
  "DST",
  "India",
  "New Delhi",
);

export const nqmEventsAdapter = createRssEventAdapter(
  {
    id: "nqm-events",
    name: "National Quantum Mission",
    url: "https://dst.gov.in/national-quantum-mission/rss.xml",
    enabled: true,
  },
  "National Quantum Mission",
  "India",
);

export const natureEventsAdapter = createRssEventAdapter(
  {
    id: "nature-events",
    name: "Nature Conferences",
    url: "https://www.nature.com/nature/articles?type=event&format=rss",
    enabled: true,
  },
  "Nature",
);

export const mitEventsAdapter = createRssEventAdapter(
  {
    id: "mit-events",
    name: "MIT",
    url: "https://news.mit.edu/rss/topic/quantum-computing",
    enabled: true,
  },
  "MIT",
  "USA",
  "Cambridge",
);

export const harvardEventsAdapter = createRssEventAdapter(
  {
    id: "harvard-events",
    name: "Harvard",
    url: "https://news.harvard.edu/gazette/feed/",
    enabled: true,
  },
  "Harvard",
  "USA",
  "Cambridge",
);

export const oxfordEventsAdapter = createRssEventAdapter(
  {
    id: "oxford-events",
    name: "Oxford",
    url: "https://www.ox.ac.uk/news/rss",
    enabled: true,
  },
  "Oxford",
  "UK",
  "Oxford",
);

export const cambridgeEventsAdapter = createRssEventAdapter(
  {
    id: "cambridge-events",
    name: "Cambridge",
    url: "https://www.cam.ac.uk/news/rss",
    enabled: true,
  },
  "Cambridge",
  "UK",
  "Cambridge",
);

export const ethEventsAdapter = createRssEventAdapter(
  {
    id: "eth-events",
    name: "ETH Zurich",
    url: "https://ethz.ch/en/news-and-events/eth-news/news/_jcr_content.feed.html",
    enabled: true,
  },
  "ETH Zurich",
  "Switzerland",
  "Zurich",
);
