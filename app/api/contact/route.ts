// app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? ""; // optionnel

const PERSONAS: Record<AgentKey, string> = {
  max: `Tu es Max, agent CRM & relances. Tu aides à récupérer des ventes perdues, paniers abandonnés, relances multi-canal.`,
  lea: `Tu es Léa, agent Service Client. Tu réponds vite, suis les commandes, escalades si besoin.`,
  jules: `Tu es Jules, agent Reporting. Tu synthétises les chiffres, alertes anomalies, expliques simplement.`,
  mia: `Tu es Mia, premier contact. Tu qualifies la demande et orientes.`,
  chris:`Tu es Chris, support interne/RH. Tu aides sur documents, absences, demandes internes.`,
};

export async function POST(req: Request) {
  try {
    const { message = "", agent = null } = (await req.json()) as {
      message?: string;
      agent?: AgentKey | null;
      threadId?: string | null;
    };

    const key = (agent ?? "max") as AgentKey;
    const system = PERSONAS[key];

    if (!OPENAI_API_KEY) {
      // —— MODE DÉMO (pas d’IA) —— 
      const demo = [
        `👉 Mode démo sans IA active.`,
        `Tu parles avec **${system.split(",")[0]}**.`,
        `Ta question: "${message}"`,
        `Exemple de réponse:`,
        `Je peux t’expliquer comment je travaille, mes intégrations et les résultats typiques. Dis-moi ton contexte (shop, volume, outils) et ton objectif, je te propose un plan simple en 3 étapes.`,
      ].join("\n");
      return NextResponse.json({ reply: demo, threadId: null });
    }

    // —— VRAI APPEL OPENAI (si clé fournie) ——
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.5,
        max_tokens: 400,
        messages: [
          { role: "system", content: system + " Réponds en français, clair et concis." },
          { role: "user", content: message || "Présente-toi en 2 phrases." },
        ],
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      return NextResponse.json({ error: txt }, { status: r.status });
    }
    const data = await r.json();
    const reply: string =
      data?.choices?.[0]?.message?.content ??
      "Désolé, pas de réponse disponible pour le moment.";

    return NextResponse.json({ reply, threadId: null });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur serveur." }, { status: 500 });
  }
}
