import type { RssFeedConfig } from "../types";

export const RSS_FEEDS: RssFeedConfig[] = [
  {
    id: "quantum-computing-report",
    name: "Quantum Computing Report",
    url: "https://quantumcomputingreport.com/feed/",
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
    id: "mit-quantum",
    name: "MIT News Quantum",
    url: "https://news.mit.edu/topic/quantum-computing/feed",
    category: "RESEARCH",
    enabled: true,
  },
  {
    id: "ieee-spectrum-quantum",
    name: "IEEE Spectrum Quantum",
    url: "https://spectrum.ieee.org/feeds/topic/quantum-computing.rss",
    category: "HARDWARE",
    enabled: true,
  },
];

export function getEnabledFeeds(): RssFeedConfig[] {
  return RSS_FEEDS.filter((feed) => feed.enabled);
}
