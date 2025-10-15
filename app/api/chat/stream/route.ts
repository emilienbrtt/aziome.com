import { NextRequest } from "next/server";

export const runtime = "edge";

type AgentKey = "max" | "lea" | "jules" | "mia" | "chris";

const PER_AGENT: Record<AgentKey, string> = {
  max:   "CRM & relances. Récupère paniers abandonnés, post-achat, winback (email/SMS/WhatsApp).",
  lea:   "SAV. Répond simplement, suit les commandes, escalade si besoin.",
  jules: "Reporting. Résume les chiffres, répond aux questions, alerte si anomalie.",
  mia:   "Premier contact. Pose 1–2 questions et oriente.",
  chris: "RH interne. Documents/absences, réponses rapides, escalade hors périmètre.",
};

const STYLE = `
Tu es un agent d’Aziome. Réponds en FR, ton simple et naturel.
- 2 à 4 phrases maximum.
- Pas de listes ni de numérotation, pas d'astérisques, pas de titres.
- Pas de "Diagnostic/Plan/Prochaine action".
- Donne une info utile et propose une petite prochaine étape.
- Si la demande sort du périmètre, dis-le brièvement et propose une démo.
`.trim();

export async function POST(req: NextRequest) {
  const { message, agent, history = [] } = (await req.json()) as {
    message: string;
    agent: AgentKey;
    history?: { role: "user" | "assistant"; content: string }[];
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response("Missing OPENAI_API_KEY", { status: 500 });
  if (!message || !agent || !(agent in PER_AGENT))
    return new Response("Invalid payload", { status: 400 });

  const system = `${STYLE}\n\nAgent: ${agent.toUpperCase()}\nRôle: ${PER_AGENT[agent]}`;

  const messages = [
    { role: "system", content: system },
    ...history.slice(-8).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 2000),
    })),
    { role: "user", content: String(message).slice(0, 2000) },
  ];

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      stream: true,
    }),
  });

  if (!openaiRes.ok || !openaiRes.body) {
    const txt = await openaiRes.text();
    return new Response(`OpenAI error: ${txt}`, { status: 500 });
  }

  // On convertit le flux SSE d’OpenAI en flux texte simple
  const stream = new ReadableStream({
    async start(controller) {
      const reader = openaiRes.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const data = t.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const chunk = json.choices?.[0]?.delta?.content ?? "";
            if (chunk) controller.enqueue(encoder.encode(chunk));
          } catch {}
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
