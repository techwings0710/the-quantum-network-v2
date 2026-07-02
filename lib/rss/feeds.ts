import type { RssFeedConfig } from "../types";

export const RSS_FEEDS: RssFeedConfig[] = [
  {
    id: "google-ai",
    name: "Google AI & Technology",
    url: "https://blog.google/technology/ai/rss/",
    category: "RESEARCH",
    enabled: true,
  },
  {
    id: "quantum-computing-report",
    name: "Quantum Computing Report",
    url: "https://quantumcomputingreport.com/feed/",
    category: "RESEARCH",
    enabled: true,
  },
  {
    id: "quantum-insider",
    name: "The Quantum Insider",
    url: "https://thequantuminsider.com/feed/",
    category: "ECOSYSTEM",
    enabled: true,
  },
  {
    id: "quanta-magazine",
    name: "Quanta Magazine",
    url: "https://www.quantamagazine.org/feed/",
    category: "RESEARCH",
    enabled: true,
  },
  {
    id: "mit-news-quantum",
    name: "MIT News Quantum",
    url: "https://news.mit.edu/topic/mitquantum-computing-rss.xml",
    category: "RESEARCH",
    enabled: true,
  },
  {
    id: "phys-org-quantum",
    name: "Phys.org Quantum Physics",
    url: "https://phys.org/rss-feed/physics-news/quantum-physics/",
    category: "RESEARCH",
    enabled: true,
  },
  {
    id: "arxiv-quant-ph",
    name: "arXiv Quantum Physics",
    url: "https://rss.arxiv.org/rss/quant-ph",
    category: "RESEARCH",
    enabled: true,
  },
  {
    id: "sciencedaily-quantum",
    name: "ScienceDaily Quantum",
    url: "https://www.sciencedaily.com/rss/matter_energy/quantum_computing.xml",
    category: "RESEARCH",
    enabled: true,
  },
];

export function getEnabledFeeds(): RssFeedConfig[] {
  return RSS_FEEDS.filter((feed) => feed.enabled);
}
