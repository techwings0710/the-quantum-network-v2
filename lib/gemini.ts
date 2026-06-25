import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeminiRewriteResult } from "./types";

const apiKey = process.env.GEMINI_API_KEY ?? "";

const REWRITE_PROMPT = `You are a professional science and technology journalist for The Quantum Network, India's leading quantum technology news platform.

Rewrite the following RSS article into an original, professional news article. Requirements:
- Write professionally and clearly
- NEVER copy source wording — produce entirely original text
- Explain technical concepts in accessible language
- Mention the significance of the development
- Mention implications for India whenever appropriate
- Assign an appropriate category from: RESEARCH, HARDWARE, SOFTWARE, ENTERPRISE, ECOSYSTEM, VENTURE, INDIA, POLICY
- Generate 3-5 relevant tags (uppercase, single words or short phrases)
- Create a URL-friendly slug from the title (lowercase, hyphens, no special characters)
- Indicate whether the story is particularly relevant to India (india_relevant: true/false)

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "title": "string",
  "summary": "string (2-3 sentences)",
  "content": "string (full article, 3-5 paragraphs, use \\n\\n between paragraphs)",
  "category": "string",
  "tags": ["string"],
  "slug": "string",
  "india_relevant": boolean
}

Original article title: {{title}}
Original article content: {{content}}
Original source: {{source}}`;

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey);
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

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini did not return valid JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as GeminiRewriteResult;

  if (
    !parsed.title ||
    !parsed.summary ||
    !parsed.content ||
    !parsed.category ||
    !parsed.slug
  ) {
    throw new Error("Gemini response missing required fields");
  }

  return {
    ...parsed,
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    india_relevant: Boolean(parsed.india_relevant),
  };
}
