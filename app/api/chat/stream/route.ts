// app/api/chat/stream/route.ts
export const runtime = 'edge';

type AgentKey = 'max' | 'lea' | 'jules' | 'mia' | 'chris';

const PER_AGENT: Record<AgentKey, string> = {
  max:   "Rôle: CRM & relances. Abandons panier, post-achat, winback.",
  lea:   "Rôle: SAV. Répond clairement, demande n° commande si besoin, escalade si nécessaire.",
  jules: "Rôle: Reporting. Résume les chiffres en 2–3 phrases, explique la tendance, propose une action.",
  mia:   "Rôle: Premier contact. Pose 1–2 questions de qualification, puis oriente.",
  chris: "Rôle: Démarches RH internes. Étapes simples, documents/absences, escalade hors périmètre.",
};

const BASE_STYLE = `
Tu es un agent d’Aziome. Réponds en français, ton naturel et pro, 2 à 4 phrases maximum.
Pas de markdown, pas d’astérisques, pas de listes, pas de titres, pas de numérotation.
Va droit au but et propose la prochaine étape concrète.
Si la question est hors périmètre, propose d’escalader vers un humain.
`.trim();

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.CLE_API_OPENAI;
  if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 500 });

  const { message, agent } = (await req.json()) as {
    message: string;
    agent: AgentKey;
  };

  if (!message || !agent || !(agent in PER_AGENT)) {
    return new Response('Invalid payload', { status: 400 });
  }

  const system = `${BASE_STYLE}\n\nPersona: ${agent.toUpperCase()}\n${PER_AGENT[agent]}`;

  // Appel OpenAI en mode streaming (Chat Completions)
  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',     // ou gpt-4o / gpt-3.5-turbo selon ton plan
      temperature: 0.7,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: String(message).slice(0, 4000) },
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(await upstream.text(), { status: 500 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Transforme le flux SSE d’OpenAI en texte brut (morceaux successifs)
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buf = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';

        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const data = t.slice(5).trim();
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta: string | undefined = json?.choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // ignore
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
