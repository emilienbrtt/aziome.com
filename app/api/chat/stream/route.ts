// /app/api/chat/stream/route.ts
import { NextRequest } from "next/server";

export const runtime = "edge"; // streaming + latence basse

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";

const BASE_INSTRUCTIONS = `
Tu es un agent d’Aziome.
Style:
- Réponds en FR, 2–4 phrases, ton simple et naturel.
- Pas de markdown, pas d’astérisques, pas de listes (sauf si demandé).
- Va droit au but et propose une petite prochaine étape.
- Si la question sort de ton périmètre, dis-le et propose une démo.
`;

const PER_AGENT: Record<AgentKey, string> = {
  max:  `Rôle: CRM & relances. Paniers abandonnés, post-achat, winback (email/SMS/WhatsApp).`,
  lea:  `Rôle: SAV. Répond clairement, demande n° commande si besoin, escalade si nécessaire.`,
  jules:`Rôle: Reporting. Résume les chiffres, explique en 2–3 phrases, propose une action.`,
  mia:  `Rôle: Premier contact. Pose 1–2 questions de qualification puis oriente.`,
  chris:`Rôle: Démarches RH internes. Etapes simples, documents/absences, escalade si hors périmètre.`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = process.env.CLE_API_OPENAI || process.env.OPENAI_API_KEY;
    if (!apiKey) return new Response("Missing OPENAI key", { status: 500 });

    const agent = (body.agent ?? "max").toLowerCase() as AgentKey;
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    const system = `${BASE_INSTRUCTIONS}\n\nPersona: ${agent.toUpperCase()}\n${PER_AGENT[agent]}`;

    const messages = [
      { role: "system", content: system },
      ...history.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 2000),
      })),
      { role: "user", content: String(body.message || "").slice(0, 2000) },
    ];

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.5,
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return new Response(text, { status: 500 });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e: any) {
    return new Response(e?.message ?? "Server error", { status: 500 });
  }
}
