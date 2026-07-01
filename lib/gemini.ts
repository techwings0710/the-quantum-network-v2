import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiRewriteResult } from "./types";

const apiKey = process.env.GEMINI_API_KEY ?? "";
const GEMINI_TIMEOUT_MS = 45000;

const REWRITE_PROMPT = `You are a professional editorial journalist for The Quantum Network, India's leading quantum technology news platform.

Rewrite the following RSS article into an original, professional news article for publication.

STRICT RULES:
- Write like a professional editorial publication (Nature News, MIT Technology Review style)
- NEVER copy source wording — produce entirely original prose
- NEVER fabricate facts, statistics, quotes, or data not present in the source
- NEVER invent people, organizations, dates, or research findings
- Preserve factual accuracy from the source material at all times
- Explain technical concepts clearly for a sophisticated audience
- Mention the significance of the development
- Mention implications for India whenever relevant and supported by facts
- Assign category from: RESEARCH, HARDWARE, SOFTWARE, ENTERPRISE, ECOSYSTEM, VENTURE, INDIA, POLICY
- Generate 3-6 relevant tags (uppercase). Include RESEARCH, ACADEMIC, or PAPER tags when appropriate
- Create a URL-friendly slug (lowercase, hyphens, no special characters)
- Write seo_description as a compelling 150-160 character meta description

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "title": "string",
  "summary": "string (2-3 sentences)",
  "rewritten_article": "string (full article, 4-6 paragraphs, use \\n\\n between paragraphs)",
  "category": "string",
  "tags": ["string"],
  "india_relevance": boolean,
  "seo_description": "string",
  "slug": "string"
}

Original article title: {{title}}
Original article content: {{content}}
Original source: {{source}}`;

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timed out")), ms),
    ),
  ]);
}

export async function rewriteArticleWithGemini(input: {
  title: string;
  content: string;
  source: string;
}): Promise<GeminiRewriteResult> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = REWRITE_PROMPT.replace("{{title}}", input.title)
    .replace("{{content}}", input.content.slice(0, 8000))
    .replace("{{source}}", input.source);

  const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS);
  const text = result.response.text().trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini did not return valid JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as GeminiRewriteResult;

  if (
    !parsed.title ||
    !parsed.summary ||
    !parsed.rewritten_article ||
    !parsed.category ||
    !parsed.slug
  ) {
    throw new Error("Gemini response missing required fields");
  }

  return {
    ...parsed,
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    india_relevance: Boolean(parsed.india_relevance),
    seo_description: parsed.seo_description ?? parsed.summary.slice(0, 160),
  };
}
