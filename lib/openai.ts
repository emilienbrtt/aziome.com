import OpenAI from "openai";

// Essaye d'abord les bons noms, puis les anciens
const apiKey =
  process.env.OPENAI_API_KEY ??
  process.env.OPENAI_APIEY ?? // si tu as créé une var sans tiret
  process.env["OPENAI-APIEY"]; // si la var a un tiret

if (!apiKey) {
  throw new Error("Clé OpenAI introuvable. Vérifie les variables Vercel.");
}

export const openai = new OpenAI({ apiKey });
