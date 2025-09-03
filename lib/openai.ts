// lib/openai.ts
import OpenAI from "openai";

function getApiKey() {
  // On accepte tes variantes "mal nommées" pour ne pas te bloquer
  return (
    process.env.OPENAI_API_KEY ||          // nom recommandé
    (process.env as any).OPENAI_APIEY ||   // ton screenshot montrait celui-ci
    (process.env as any)["OPENAI-APIKEY"] || 
    (process.env as any).OPENAI_API || 
    (process.env as any).OPENAI_KEY
  );
}

export function createOpenAI() {
  const key = getApiKey();
  if (!key) throw new Error("OPENAI_API_KEY manquant");
  return new OpenAI({ apiKey: key });
}
