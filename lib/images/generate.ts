import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupabaseServiceClient, isSupabaseConfigured } from "../supabase";
import { getDefaultImageUrl } from "../news/db";
const POLLINATIONS_URL = "https://image.pollinations.ai/prompt/";

const apiKey = process.env.GEMINI_API_KEY ?? "";
const IMAGE_TIMEOUT_MS = 60000;
const IMAGE_MODEL = "gemini-3.1-flash-lite-image";

const IMAGE_STYLE =
  "Editorial, professional, scientific, dark blue, minimal, modern, technology magazine style";

export function isImageGenerationConfigured(): boolean {
  return Boolean(apiKey);
}

function buildImagePrompt(title: string, summary: string, category: string): string {
  return `Create a professional editorial illustration for a quantum technology news article.

Style: ${IMAGE_STYLE}
Category: ${category}
Article title: ${title}
Article summary: ${summary}

Requirements:
- Abstract scientific visualization related to the topic
- Dark blue color palette (#0e131e background tones)
- No text, no logos, no watermarks
- Suitable as a news article hero image
- Minimal and modern composition`;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Image generation timed out")), ms),
    ),
  ]);
}

async function uploadImageToStorage(
  articleId: string,
  imageBuffer: Buffer,
  mimeType: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const extension = mimeType.includes("png") ? "png" : "jpg";
  const filePath = `${articleId}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("news-images")
    .upload(filePath, imageBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (uploadError) {
    console.error("[image-gen] Upload failed:", uploadError.message);
    return null;
  }

  const { data } = supabase.storage.from("news-images").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function generateArticleImage(input: {
  articleId: string;
  title: string;
  summary: string;
  category: string;
}): Promise<string | null> {
  if (!apiKey) {
    console.warn("[image-gen] GEMINI_API_KEY not configured");
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: IMAGE_MODEL,
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      } as Record<string, unknown>,
    });

    const prompt = buildImagePrompt(input.title, input.summary, input.category);
    const result = await withTimeout(model.generateContent(prompt), IMAGE_TIMEOUT_MS);
    const response = result.response;

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      const inlineData = (part as { inlineData?: { data: string; mimeType: string } }).inlineData;
      if (inlineData?.data) {
        const buffer = Buffer.from(inlineData.data, "base64");
        const publicUrl = await uploadImageToStorage(
          input.articleId,
          buffer,
          inlineData.mimeType ?? "image/png",
        );
        return publicUrl;
      }
    }

    console.warn("[image-gen] No image data in Gemini response");
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[image-gen] Generation failed:", message);
    return null;
  }
}

export async function updateArticleImageUrl(
  articleId: string,
  imageUrl: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from("news")
    .update({
      image_url: imageUrl,
      image_generated: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId);

  if (error) {
    console.error("[image-gen] Failed to update article:", error.message);
    return false;
  }

  return true;
}

export function isDefaultImage(imageUrl: string | null): boolean {
  if (!imageUrl) return true;
  return imageUrl === getDefaultImageUrl();
}

export async function processArticleImageGeneration(input: {
  articleId: string;
  title: string;
  summary: string;
  category: string;
  currentImageUrl: string | null;
  imageGenerated: boolean;
}): Promise<void> {
  if (input.imageGenerated) return;
  if (!isDefaultImage(input.currentImageUrl) && input.currentImageUrl) return;

  const generatedUrl = await generateArticleImage({
    articleId: input.articleId,
    title: input.title,
    summary: input.summary,
    category: input.category,
  });

  if (generatedUrl) {
    await updateArticleImageUrl(input.articleId, generatedUrl);
    console.log(`[image-gen] Updated image for article ${input.articleId}`);
  }
}

export function scheduleArticleImageGeneration(input: {
  articleId: string;
  title: string;
  summary: string;
  category: string;
  currentImageUrl: string | null;
  imageGenerated: boolean;
}): void {
  void processArticleImageGeneration(input).catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[image-gen] Background generation failed:", message);
  });
}

export async function generateMissingNewsImages(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return;

  console.log("[image-gen] Scanning for articles missing images...");

  const { data: articles, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[image-gen] Failed to fetch articles:", error.message);
    return;
  }

  const missing = (articles ?? []).filter((article) => {
    return (
      !article.image_generated &&
      (
        !article.image_url ||
        article.image_url.trim() === "" ||
        article.image_url === getDefaultImageUrl()
      )
    );
  });

  console.log(
    `[image-gen] Found ${missing.length} articles requiring images.`,
  );

  for (const article of missing) {
    try {
      console.log(`[image-gen] Generating: ${article.title}`);

      await processArticleImageGeneration({
        articleId: article.id,
        title: article.title,
        summary: article.summary,
        category: article.category,
        currentImageUrl: article.image_url,
        imageGenerated: article.image_generated ?? false,
      });

    } catch (err) {
      console.error(
        `[image-gen] Failed for "${article.title}"`,
        err,
      );
    }
  }

  console.log("[image-gen] Missing image scan complete.");
}
