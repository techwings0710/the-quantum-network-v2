import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { GoogleGenAI } from "@google/genai";

console.log(process.env.GEMINI_API_KEY?.substring(0, 6));
console.log(process.env.GEMINI_API_KEY?.length);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  const response = await ai.interactions.create({
    model: "gemini-3.1-flash-image",
    input:
      "A futuristic blue quantum computer with glowing qubits. No text. Editorial illustration.",
    response_format: {
      type: "image",
      aspect_ratio: "1:1",
      image_size: "1K",
    },
  });

  console.log(response);
}

main().catch(console.error);