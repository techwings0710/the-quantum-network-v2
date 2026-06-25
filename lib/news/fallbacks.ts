import type { NewsArticle } from "../types";

export const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: "fallback-1",
    slug: "indias-national-quantum-mission-reaches-major-milestone",
    title: "India's National Quantum Mission Reaches Major Milestone",
    summary:
      "The Department of Science and Technology reports a breakthrough in domestic qubit development, signaling a significant leap for the country's $750M quantum initiative.",
    content:
      "The Department of Science and Technology has announced a significant breakthrough in domestic qubit development, marking a pivotal moment for India's National Quantum Mission.\n\nResearchers at multiple institutions across the country have demonstrated improved coherence times in indigenously developed superconducting qubits, bringing India closer to building scalable quantum processors.\n\nThe ₹6,003 crore mission aims to establish India as a global leader in quantum technologies across four key domains: quantum computing, quantum communication, quantum sensing, and quantum materials.\n\nIndustry experts note that this milestone could accelerate partnerships between academic institutions and startups in Bangalore, Hyderabad, and Pune's growing quantum ecosystems.",
    category: "MISSION UPDATE",
    tags: ["INDIA", "NQM", "QUBITS"],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfwZXzB3EPp5v8w2NjzWL5tTNXByboq-LapFkyyw3_FvrFS69HrCKTwKo2CRV7Tqod1VK5TUCmFK0Y-Tx05RwfHGjr4NIAxBlvCfhjY0X342GJ5lT_JyReoN7Wha6ZKvjB4dVVogbyI7VgiVxi7efXnaPqZT7O7QPQgwx7vqS7nO6CRPCrjfDzwdHMadsGXs9oMgTuufCizo7HC8niFa1ubdFSZito-Z33symz2RRgmCCeQyzHDzyoHwHgVwj77uWJ5JUlu6qo_QA",
    source: "The Quantum Network",
    author: "Editorial Team",
    published_at: "2024-05-25T00:00:00Z",
    featured: true,
    created_at: "2024-05-25T00:00:00Z",
    updated_at: "2024-05-25T00:00:00Z",
  },
  {
    id: "fallback-2",
    slug: "qpiai-unveils-new-quantum-processor-unit",
    title: "QpiAI Unveils New Quantum Processor Unit",
    summary:
      "A new 25-qubit hybrid AI-quantum processor designed for enterprise logistics optimization.",
    content:
      "Bangalore-based QpiAI has unveiled its latest quantum processor unit, a 25-qubit hybrid system designed to tackle complex optimization problems in enterprise logistics.\n\nThe processor combines classical AI preprocessing with quantum annealing techniques, targeting supply chain and routing challenges faced by India's manufacturing sector.\n\nCompany executives highlighted the system's compatibility with existing cloud infrastructure, enabling gradual adoption by enterprise clients.",
    category: "HARDWARE",
    tags: ["QPIAI", "INDIA", "ENTERPRISE"],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAk5nQAEf4GclwdCIBHqymKr6km9oAak4h2hvuO0EVUi5e9OgRE-_LaG35xXpCJXsUbYxWrttcZ29TdENxEaitMNT_vVFxinHgwj-FUrRVPtKkrIb-TKvv4b3HdyuZEOuDag_uo97cAPUFBvOgH2x91YiXDkqE62LYoBW6Hh994aq0quq8p0U4MQHg796C-D-t7uy9xYs1A-Sk0lziyeHIJbKE0_EKIv1A-3aC0-YSkB_Xu7hUMwdm8YRhgf2iSgxRutgZp6RZ7ZY",
    source: "The Quantum Network",
    author: "Editorial Team",
    published_at: "2024-05-24T00:00:00Z",
    featured: false,
    created_at: "2024-05-24T00:00:00Z",
    updated_at: "2024-05-24T00:00:00Z",
  },
  {
    id: "fallback-3",
    slug: "breakthrough-in-qubit-coherence-times-reported",
    title: "Breakthrough in Qubit Coherence Times Reported",
    summary:
      "Researchers at ETH Zurich demonstrate a new error-correction method that extends coherence by 400%, pushing the boundaries of stable computation.",
    content:
      "Researchers at ETH Zurich have published findings demonstrating a novel error-correction approach that extends qubit coherence times by up to 400%.\n\nThe technique addresses one of the most persistent challenges in quantum computing: maintaining quantum states long enough to perform meaningful computations.\n\nFor India's National Quantum Mission, these advances offer potential collaboration pathways with European research institutions.",
    category: "RESEARCH",
    tags: ["COHERENCE", "ERROR-CORRECTION"],
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAk5nQAEf4GclwdCIBHqymKr6km9oAak4h2hvuO0EVUi5e9OgRE-_LaG35xXpCJXsUbYxWrttcZ29TdENxEaitMNT_vVFxinHgwj-FUrRVPtKkrIb-TKvv4b3HdyuZEOuDag_uo97cAPUFBvOgH2x91YiXDkqE62LYoBW6Hh994aq0quq8p0U4MQHg796C-D-t7uy9xYs1A-Sk0lziyeHIJbKE0_EKIv1A-3aC0-YSkB_Xu7hUMwdm8YRhgf2iSgxRutgZp6RZ7ZY",
    source: "The Quantum Network",
    author: "Editorial Team",
    published_at: "2024-05-24T00:00:00Z",
    featured: false,
    created_at: "2024-05-24T00:00:00Z",
    updated_at: "2024-05-24T00:00:00Z",
  },
];

export function getFallbackArticle(slug: string): NewsArticle | null {
  return FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export function getFallbackFeatured(): NewsArticle {
  return FALLBACK_ARTICLES.find((a) => a.featured) ?? FALLBACK_ARTICLES[0];
}
