// lib/openai.ts
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY manquante dans les variables d'environnement.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
